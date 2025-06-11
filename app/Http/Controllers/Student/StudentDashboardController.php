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
        $allBlocks = Block::where('user_id', $user->id)
            ->orderBy('block_number')
            ->get();

        // Check if Block 1 is completed (all sessions completed)
        $block1 = $allBlocks->firstWhere('block_number', 1);
        $isBlock1Completed = false;

        if ($block1) {
            // Get all training sessions for Block 1
            $block1Sessions = TrainingSession::where('block_id', $block1->id)
                ->where('session_type', 'training')
                ->get();

            // Get all completed training sessions for Block 1
            $completedBlock1Sessions = TrainingResult::where('user_id', $user->id)
                ->whereIn('session_id', $block1Sessions->pluck('id'))
                ->pluck('session_id')
                ->toArray();

            // Block 1 is completed if all sessions are completed
            $isBlock1Completed = count($completedBlock1Sessions) >= count($block1Sessions) && count($block1Sessions) > 0;
        }

        // Check if Block 2 is completed (all sessions completed)
        $block2 = $allBlocks->firstWhere('block_number', 2);
        $isBlock2Completed = false;

        if ($block2 && $isBlock1Completed) {
            // Get all training sessions for Block 2
            $block2Sessions = TrainingSession::where('block_id', $block2->id)
                ->where('session_type', 'training')
                ->get();

            // Get all completed training sessions for Block 2
            $completedBlock2Sessions = TrainingResult::where('user_id', $user->id)
                ->whereIn('session_id', $block2Sessions->pluck('id'))
                ->pluck('session_id')
                ->toArray();

            // Block 2 is completed if all sessions are completed
            $isBlock2Completed = count($completedBlock2Sessions) >= count($block2Sessions) && count($block2Sessions) > 0;
        }

        // Filter blocks based on completion status
        $blocks = $allBlocks->map(function ($block) use ($currentDate) {
            // Check if this block has any released sessions
            $hasReleasedSessions = TrainingSession::where('block_id', $block->id)
                ->where('release_date', '<=', $currentDate)
                ->exists();

            $now = Carbon::now();
            $startDate = Carbon::parse($block->start_date);
            $endDate = Carbon::parse($block->end_date);

            return [
                'id' => $block->id,
                'block_number' => $block->block_number,
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
                'duration_weeks' => 12,
                'is_current' => $now->between($startDate, $endDate),
                'is_locked' => false, // Blocks are not locked if they have released sessions
                'is_associated_with_user' => true,
                'has_released_sessions' => $hasReleasedSessions
            ];
        })->filter(function ($block) {
            // Only show blocks that have released sessions
            return $block['has_released_sessions'];
        })->values();

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
