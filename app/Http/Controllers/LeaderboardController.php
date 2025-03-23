<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\UserStat;
use Inertia\Inertia;

class LeaderboardController extends Controller
{
    public function consistency()
    {
        $user = Auth::user();

        // Get users ranked by consistency score
        $leaderboardData = UserStat::join('users', 'user_stats.user_id', '=', 'users.id')
            ->where('users.user_role', 'student')
            ->select('users.id', 'users.username', 'user_stats.consistency_score', 'user_stats.sessions_completed')
            ->orderBy('user_stats.consistency_score', 'desc')
            ->orderBy('user_stats.sessions_completed', 'desc')
            ->get();

        // Add ranking and check if the user is the current user
        $rank = 1;
        $lastScore = null;
        $lastRank = 1;

        $formattedLeaderboard = $leaderboardData->map(function ($item) use ($user, &$rank, &$lastScore, &$lastRank) {
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
                'consistency_score' => $item->consistency_score,
                'completed_sessions' => $item->sessions_completed,
                'isYou' => $item->id === $user->id
            ];
        });

        return Inertia::render('Student/ConsistencyLeaderboard', [
            'leaderboardData' => $formattedLeaderboard
        ]);
    }

    public function strength()
    {
        $user = Auth::user();

        // Get users ranked by strength level
        $leaderboardData = UserStat::join('users', 'user_stats.user_id', '=', 'users.id')
            ->where('users.user_role', 'student')
            ->select('users.id', 'users.username', 'user_stats.strength_level', 'user_stats.total_xp')
            ->orderBy('user_stats.strength_level', 'desc')
            ->orderBy('user_stats.total_xp', 'desc')
            ->get();

        // Add ranking and check if the user is the current user
        $rank = 1;
        $lastLevel = null;
        $lastRank = 1;

        $formattedLeaderboard = $leaderboardData->map(function ($item) use ($user, &$rank, &$lastLevel, &$lastRank) {
            // If the level is the same as the previous user, keep the same rank (tied)
            if ($lastLevel !== null && $lastLevel === $item->strength_level) {
                $userRank = $lastRank;
            } else {
                $userRank = $rank;
                $lastRank = $rank;
            }

            $lastLevel = $item->strength_level;
            $rank++;

            return [
                'id' => $item->id,
                'rank' => $userRank,
                'username' => $item->username,
                'strength_level' => $item->strength_level,
                'total_xp' => $item->total_xp,
                'isYou' => $item->id === $user->id
            ];
        });

        return Inertia::render('Student/StrengthLeaderboard', [
            'leaderboardData' => $formattedLeaderboard
        ]);
    }
}
