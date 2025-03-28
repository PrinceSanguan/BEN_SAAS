<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Block;
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
}
