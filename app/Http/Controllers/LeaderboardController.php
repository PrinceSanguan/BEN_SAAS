<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\UserStat;
use App\Models\Session;
use App\Services\UserStatService;
use App\Services\XpService;
use Inertia\Inertia;

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

        // Update all user statistics to ensure they're current
        $this->userStatService->updateStats();

        // Get users ranked by consistency score
        $leaderboardData = UserStat::join('users', 'user_stats.user_id', '=', 'users.id')
            ->where('users.user_role', 'student')
            ->select(
                'users.id',
                'users.username',
                'user_stats.consistency_score',
                'user_stats.sessions_completed',
                'user_stats.sessions_available'
            )
            ->orderBy('user_stats.consistency_score', 'desc')
            ->orderBy('user_stats.sessions_completed', 'desc')
            ->get();

        // Add ranking and check if the user is the current user
        $rank = 1;
        $lastScore = null;
        $lastRank = 1;

        $formattedLeaderboard = $leaderboardData->map(function ($item) use ($user, &$rank, &$lastScore, &$lastRank) {
            // Calculate consistency percentage based on training sessions completed out of available training sessions
            // Excluding testing and rest sessions
            $consistencyPercentage = $item->sessions_available > 0
                ? round(($item->sessions_completed / $item->sessions_available) * 100)
                : 0;

            // If the score is the same as the previous user, keep the same rank (tied)
            if ($lastScore !== null && $lastScore === $item->consistency_score) {
                $userRank = $lastRank;
            } else {
                $userRank = $rank;
                $lastRank = $rank;
            }

            $lastScore = $item->consistency_score;
            $rank++;

            return [
                'id' => $item->id,
                'rank' => $userRank,
                'username' => $item->username,
                'consistency_score' => $consistencyPercentage, // Use the calculated percentage
                'completed_sessions' => $item->sessions_completed,
                'available_sessions' => $item->sessions_available,
                'isYou' => $item->id === $user->id
            ];
        });

        return Inertia::render('Student/ConsistencyLeaderboard', [
            'leaderboardData' => $formattedLeaderboard,
            'username' => $user->username,
            'routes' => [
                'student.dashboard' => route('student.dashboard'),
                'student.training' => route('student.training'),
                'student.progress' => route('student.progress'),
                'student.xp' => route('student.xp'),
                'leaderboard.consistency' => route('leaderboard.consistency'),
                'leaderboard.strength' => route('leaderboard.strength'),
            ]
        ]);
    }

    public function strength()
    {
        $user = Auth::user();

        // Update all user statistics to ensure they're current
        $this->userStatService->updateStats();

        // Get users ranked by strength level and total XP
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

        $formattedLeaderboard = $leaderboardData->map(function ($item) use ($user, &$rank, &$lastLevel, &$lastXp, &$lastRank) {
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
                $xpInfo = $this->xpService->getNextLevelInfo($user->id);
                $nextLevelInfo = [
                    'xp_needed' => $xpInfo['xp_needed'],
                    'progress_percentage' => $xpInfo['progress_percentage'],
                    'next_level' => $xpInfo['next_level']
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

                // Get XP info for this user
                $xpInfo = $this->xpService->getNextLevelInfo($user->id);

                // Add the current user to the end of the list
                $formattedLeaderboard->push([
                    'id' => $user->id,
                    'rank' => $userRank + 1, // +1 because ranks start from 1
                    'username' => $user->username,
                    'strength_level' => $userStat->strength_level,
                    'total_xp' => $userStat->total_xp,
                    'isYou' => true,
                    'next_level_info' => [
                        'xp_needed' => $xpInfo['xp_needed'],
                        'progress_percentage' => $xpInfo['progress_percentage'],
                        'next_level' => $xpInfo['next_level']
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
