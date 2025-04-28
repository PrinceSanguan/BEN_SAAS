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
        $currentDate = Carbon::now();

        // Get XP information with new formula data
        $xpSummary = $this->xpService->getUserXpSummary($user->id);

        // Calculate user's consistency score (0-100)
        $consistencyScore = $this->calculateConsistencyScore($user->id);

        // Calculate user's rank based on strength level
        $userRank = $this->calculateUserRank($user->id, $xpSummary['current_level'], $xpSummary['total_xp']);

        // Get all blocks
        $blocks = Block::where('user_id', $user->id)
            ->orderBy('block_number')
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
                    'duration_weeks' => $startDate->diffInWeeks($endDate) + 1,
                    'is_current' => $now->between($startDate, $endDate),
                    'is_associated_with_user' => true // Always true since we're filtering by user_id
                ];
            });

        // Calculate remaining sessions in the current block
        $remainingSessions = 0;
        $currentBlock = $blocks->firstWhere('is_current', true);

        if ($currentBlock) {
            // Use a single query with a join to get completed sessions for performance
            $sessionsInfo = TrainingSession::where('block_id', $currentBlock['id'])
                ->where('session_type', 'training')
                ->where('release_date', '<=', $currentDate)
                ->leftJoin('training_results', function ($join) use ($user) {
                    $join->on('training_sessions.id', '=', 'training_results.session_id')
                        ->where('training_results.user_id', '=', $user->id);
                })
                ->selectRaw('COUNT(training_sessions.id) as available_sessions, COUNT(training_results.id) as completed_sessions')
                ->first();

            if ($sessionsInfo) {
                $availableSessions = $sessionsInfo->available_sessions;
                $completedSessions = $sessionsInfo->completed_sessions;

                // Calculate remaining sessions
                $remainingSessions = $availableSessions - $completedSessions;
                if ($remainingSessions < 0) $remainingSessions = 0;
            }
        }

        return Inertia::render('Student/StudentDashboard', [
            'username' => $user->username,
            'strengthLevel' => $xpSummary['current_level'],
            'consistencyScore' => $consistencyScore,
            'currentRank' => $userRank, // Pass rank to the frontend
            'blocks' => $blocks,
            'remainingSessions' => $remainingSessions, // Pass remaining sessions to frontend
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
        $today = Carbon::now();

        // Use a join to get both sessions and completed results in a single query
        // But only count sessions that are available TODAY or earlier (not future sessions)
        $sessionsInfo = TrainingSession::where('release_date', '>=', $fourWeeksAgo)
            ->where('release_date', '<=', $today) // Only include sessions up to today
            ->where('session_type', 'training')
            ->leftJoin('training_results', function ($join) use ($userId) {
                $join->on('training_sessions.id', '=', 'training_results.session_id')
                    ->where('training_results.user_id', '=', $userId);
            })
            ->selectRaw('COUNT(training_sessions.id) as total_sessions, COUNT(training_results.id) as completed_sessions')
            ->first();

        if (!$sessionsInfo || $sessionsInfo->total_sessions == 0) {
            return 0;
        }

        // Calculate percentage (0-100)
        return round(($sessionsInfo->completed_sessions / $sessionsInfo->total_sessions) * 100);
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
        // Use a single count query 
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
