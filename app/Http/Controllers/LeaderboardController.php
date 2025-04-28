<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\UserStat;
use App\Models\Session;
use App\Services\UserStatService;
use App\Services\XpService;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class LeaderboardController extends Controller
{
    protected $userStatService;
    protected $xpService;

    /**
     * Create a new controller instance.
     *
     * @param UserStatService $userStatService
     */
    public function __construct(UserStatService $userStatService, XpService $xpService)
    {
        $this->userStatService = $userStatService;
        $this->xpService = $xpService;
    }

    public function consistency()
    {
        $user = Auth::user();
        $today = Carbon::now();

        Log::info('Starting consistency calculation', [
            'user_id' => $user->id,
            'current_time' => $today->toDateTimeString()
        ]);

        // Get all users with student role
        $students = DB::table('users')
            ->where('user_role', 'student')
            ->get();

        $leaderboardData = collect();

        // Process each student separately to get their individual stats
        foreach ($students as $student) {
            // Get blocks associated with this user
            $userBlocks = DB::table('blocks')
                ->where('user_id', $student->id)
                ->pluck('id');

            // Get available training sessions in blocks for this user
            $availableSessions = DB::table('training_sessions')
                ->where('session_type', 'training')
                ->where('release_date', '<=', $today)
                ->whereIn('block_id', $userBlocks)
                ->count();

            // Get completed sessions for this user
            $completedSessions = DB::table('training_results')
                ->where('user_id', $student->id)
                ->whereNotNull('completed_at')
                ->count();

            // Calculate consistency percentage
            $consistencyPercentage = $availableSessions > 0
                ? round(($completedSessions / $availableSessions) * 100)
                : 0;

            $leaderboardData->push([
                'id' => $student->id,
                'username' => $student->username,
                'consistency_score' => $consistencyPercentage,
                'completed_sessions' => $completedSessions,
                'available_sessions' => $availableSessions,
                'isYou' => $student->id === $user->id
            ]);
        }

        // Sort by consistency score
        $leaderboardData = $leaderboardData->sortByDesc('consistency_score')->values();

        // Apply ranking
        $rank = 1;
        $lastScore = null;
        $lastRank = 1;

        $leaderboardData = $leaderboardData->map(function ($item) use (&$rank, &$lastScore, &$lastRank) {
            if ($lastScore !== null && $lastScore === $item['consistency_score']) {
                $item['rank'] = $lastRank;
            } else {
                $item['rank'] = $rank;
                $lastRank = $rank;
            }

            $lastScore = $item['consistency_score'];
            $rank++;

            return $item;
        });

        Log::info('Final formatted leaderboard:', $leaderboardData->toArray());

        return Inertia::render('Student/ConsistencyLeaderboard', [
            'leaderboardData' => $leaderboardData,
            'username' => $user->username,
            'routes' => [
                'student.dashboard' => route('student.dashboard'),
                'student.training' => route('student.training'),
                'student.progress' => route('student.progress'),
                'student.xp' => route('student.xp'),
                'leaderboard.consistency' => route('leaderboard.consistency'),
                'leaderboard.strength' => route('leaderboard.strength'),
                'admin.logout' => route('admin.logout'),
            ]
        ]);
    }

    public function strength()
    {
        $user = Auth::user();

        // Update all user statistics to ensure they're current
        $this->userStatService->updateStats();

        // Get users ranked by strength level and total XP with eager loading
        $leaderboardData = UserStat::join('users', 'user_stats.user_id', '=', 'users.id')
            ->where('users.user_role', 'student')
            ->select('users.id', 'users.username', 'user_stats.strength_level', 'user_stats.total_xp')
            ->orderBy('user_stats.strength_level', 'desc')
            ->orderBy('user_stats.total_xp', 'desc')
            ->limit(50) // Limit to top 50 for performance
            ->get();

        // Add ranking and additional information
        $rank = 1;
        $lastLevel = null;
        $lastXp = null;
        $lastRank = 1;

        // Prefetch the XP information for the current user
        $currentUserXpInfo = $this->xpService->getNextLevelInfo($user->id);

        $formattedLeaderboard = $leaderboardData->map(function ($item) use ($user, &$rank, &$lastLevel, &$lastXp, &$lastRank, $currentUserXpInfo) {
            // If both the level and XP are the same as the previous user, keep the same rank (tied)
            if ($lastLevel !== null && $lastXp !== null && $lastLevel === $item->strength_level && $lastXp === $item->total_xp) {
                $userRank = $lastRank;
            } else {
                $userRank = $rank;
                $lastRank = $rank;
            }

            $lastLevel = $item->strength_level;
            $lastXp = $item->total_xp;
            $rank++;

            // Get XP info for this user to show progress to next level
            $nextLevelInfo = [];
            if ($item->id === $user->id) {
                $nextLevelInfo = [
                    'xp_needed' => $currentUserXpInfo['xp_needed'],
                    'progress_percentage' => $currentUserXpInfo['progress_percentage'],
                    'next_level' => $currentUserXpInfo['next_level']
                ];
            }

            return [
                'id' => $item->id,
                'rank' => $userRank,
                'username' => $item->username,
                'strength_level' => $item->strength_level,
                'total_xp' => $item->total_xp,
                'isYou' => $item->id === $user->id,
                'next_level_info' => $item->id === $user->id ? $nextLevelInfo : null
            ];
        });

        // Find current user's rank if they're not in the top 50
        $currentUserInList = $formattedLeaderboard->firstWhere('id', $user->id);

        if (!$currentUserInList) {
            // Get the current user's stats
            $userStat = UserStat::where('user_id', $user->id)->first();

            if ($userStat) {
                // Count how many users have higher strength level or same level but higher XP
                // Use a single query to avoid N+1
                $userRank = UserStat::join('users', 'user_stats.user_id', '=', 'users.id')
                    ->where('users.user_role', 'student')
                    ->where(function ($query) use ($userStat) {
                        $query->where('user_stats.strength_level', '>', $userStat->strength_level)
                            ->orWhere(function ($query) use ($userStat) {
                                $query->where('user_stats.strength_level', '=', $userStat->strength_level)
                                    ->where('user_stats.total_xp', '>=', $userStat->total_xp);
                            });
                    })
                    ->count();

                // Add the current user to the end of the list
                $formattedLeaderboard->push([
                    'id' => $user->id,
                    'rank' => $userRank + 1, // +1 because ranks start from 1
                    'username' => $user->username,
                    'strength_level' => $userStat->strength_level,
                    'total_xp' => $userStat->total_xp,
                    'isYou' => true,
                    'next_level_info' => [
                        'xp_needed' => $currentUserXpInfo['xp_needed'],
                        'progress_percentage' => $currentUserXpInfo['progress_percentage'],
                        'next_level' => $currentUserXpInfo['next_level']
                    ]
                ]);
            }
        }

        return Inertia::render('Student/StrengthLeaderboard', [
            'leaderboardData' => $formattedLeaderboard,
            'username' => $user->username,
            'routes' => [
                'student.dashboard' => route('student.dashboard'),
                'student.training' => route('student.training'),
                'student.progress' => route('student.progress'),
                'student.xp' => route('student.xp'),
                'leaderboard.consistency' => route('leaderboard.consistency'),
                'leaderboard.strength' => route('leaderboard.strength'),
                'admin.logout' => route('admin.logout'),
            ]
        ]);
    }
}
