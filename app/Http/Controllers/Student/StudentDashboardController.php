<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Block;
use App\Models\TrainingResult;
use App\Models\UserStat;
use Illuminate\Support\Facades\Auth;

class StudentDashboardController extends Controller
{
    /**
     * Display the Student dashboard.
     */
    public function index()
    {
        $user = Auth::user();
        $username = $user->username;

        // Get user stats if available, or create default values
        $userStats = UserStat::where('user_id', $user->id)->first();
        $strengthLevel = $userStats ? $userStats->strength_level : 1;
        $consistencyScore = $userStats ? $userStats->consistency_score : 0;

        // Get all blocks
        $blocks = Block::orderBy('block_number')->get()->map(function ($block) {
            return [
                'id' => $block->id,
                'block_number' => $block->block_number,
                'start_date' => $block->start_date->format('M d, Y'),
                'end_date' => $block->end_date->format('M d, Y'),
                'duration_weeks' => $block->getDurationInWeeks(),
                'is_current' => $block->containsDate(),
            ];
        });

        return Inertia::render('Student/StudentDashboard', [
            'username' => $username,
            'strengthLevel' => $strengthLevel,
            'consistencyScore' => $consistencyScore,
            'blocks' => $blocks
        ]);
    }
}
