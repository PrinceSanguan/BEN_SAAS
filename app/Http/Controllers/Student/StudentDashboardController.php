<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Block;
use App\Models\UserStat;
use App\Services\XpService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Models\TrainingResult;
use App\Models\TrainingSession;

class StudentDashboardController extends Controller
{
    protected $xpService;

    /**
     * Create a new controller instance.
     *
     * @param XpService $xpService
     */
    public function __construct(XpService $xpService)
    {
        $this->xpService = $xpService;
    }

    /**
     * Display the student dashboard.
     */
    public function index()
    {
        $user = Auth::user();

        // Get XP information with new formula data
        $xpSummary = $this->xpService->getUserXpSummary($user->id);

        // Calculate user's consistency score (0-100)
        $consistencyScore = $this->calculateConsistencyScore($user->id);

        // Calculate user's rank based on strength level
        $userRank = $this->calculateUserRank($user->id, $xpSummary['current_level'], $xpSummary['total_xp']);

        // Get all blocks
        $blocks = Block::orderBy('block_number')
            ->get()
            ->map(function ($block) {
                $now = Carbon::now();
                $startDate = Carbon::parse($block->start_date);
                $endDate = Carbon::parse($block->end_date);

                return [
                    'id' => $block->id,
                    'block_number' => $block->block_number,
                    'start_date' => $startDate->format('Y-m-d'),
                    'end_date' => $endDate->format('Y-m-d'),
                    'duration_weeks' => 14, // Set fixed value of 14 weeks
                    'is_current' => $now->between($startDate, $endDate)
                ];
            });

        return Inertia::render('Student/StudentDashboard', [
            'username' => $user->username,
            'strengthLevel' => $xpSummary['current_level'],
            'consistencyScore' => $consistencyScore,
            'currentRank' => $userRank, // Pass rank to the frontend
            'blocks' => $blocks,
            'xpInfo' => [
                'total_xp' => $xpSummary['total_xp'],
                'current_level' => $xpSummary['current_level'],
                'next_level' => $xpSummary['next_level'],
                'xp_needed' => $xpSummary['xp_needed_for_next_level'],
                'progress_percentage' => $xpSummary['progress_percentage'],
                'xp_for_current_level' => $xpSummary['xp_for_current_level'],
                'xp_for_next_level' => $xpSummary['xp_for_next_level'],
                'xp_gap' => $xpSummary['xp_gap'],
            ],
        ]);
    }

    /**
     * Calculate user's consistency score (0-100)
     * 
     * @param int $userId
     * @return int
     */
    private function calculateConsistencyScore(int $userId): int
    {
        // Get the last 4 weeks of sessions
        $fourWeeksAgo = Carbon::now()->subWeeks(4);

        // Get all training sessions in the last 4 weeks
        $sessions = TrainingSession::where('release_date', '>=', $fourWeeksAgo)
            ->where('session_type', 'training')
            ->pluck('id');

        if ($sessions->isEmpty()) {
            return 0;
        }

        // Count how many of these sessions the user has completed
        $completedSessions = TrainingResult::where('user_id', $userId)
            ->whereIn('session_id', $sessions)
            ->count();

        // Calculate percentage (0-100)
        $totalSessions = $sessions->count();
        $consistencyScore = $totalSessions > 0
            ? round(($completedSessions / $totalSessions) * 100)
            : 0;

        return $consistencyScore;
    }

    /**
     * Calculate user's rank based on strength level
     * 
     * @param int $userId
     * @param int $currentLevel
     * @param int $totalXp
     * @return int
     */
    private function calculateUserRank(int $userId, int $currentLevel, int $totalXp): int
    {
        // If user has no XP, they are unranked
        if ($totalXp <= 0) {
            return 0;
        }

        // Make sure we have a UserStat entry for this user
        $userStat = UserStat::firstOrCreate(
            ['user_id' => $userId],
            [
                'strength_level' => $currentLevel,
                'total_xp' => $totalXp,
                'consistency_score' => 0,
                'sessions_completed' => 0,
                'sessions_available' => 0,
                'last_updated' => now()
            ]
        );

        // Since you're the only student, your rank should be 1
        // We'll add this direct check
        $studentCount = UserStat::join('users', 'user_stats.user_id', '=', 'users.id')
            ->where('users.user_role', 'student')
            ->count();

        if ($studentCount <= 1) {
            return 1;
        }

        // Count how many users have higher strength level
        // Or the same level but higher XP
        $higherRankedUsers = UserStat::join('users', 'user_stats.user_id', '=', 'users.id')
            ->where('users.user_role', 'student')
            ->where(function ($query) use ($currentLevel, $totalXp) {
                $query->where('user_stats.strength_level', '>', $currentLevel)
                    ->orWhere(function ($query) use ($currentLevel, $totalXp) {
                        $query->where('user_stats.strength_level', '=', $currentLevel)
                            ->where('user_stats.total_xp', '>', $totalXp);
                    });
            })
            ->count();

        // Rank is position (1-based index)
        return $higherRankedUsers + 1;
    }
}
