<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Services\XpService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class XpController extends Controller
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
     * Display the user's XP dashboard.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $user = Auth::user();
        $xpSummary = $this->xpService->getUserXpSummary($user->id);

        return Inertia::render('Student/XpDashboard', [
            'xpSummary' => $xpSummary,
            'levelThresholds' => XpService::LEVEL_THRESHOLDS,
        ]);
    }

    /**
     * Show XP level progress.
     *
     * @return \Inertia\Response
     */
    public function showLevelProgress()
    {
        $user = Auth::user();
        $totalXp = $this->xpService->getTotalXp($user->id);
        $currentLevel = $this->xpService->getCurrentLevel($user->id);
        $nextLevelInfo = $this->xpService->getNextLevelInfo($user->id);

        // Prepare level progress data
        $levelProgressData = [];
        $previousThreshold = 0;

        foreach (XpService::LEVEL_THRESHOLDS as $level => $threshold) {
            $levelProgressData[] = [
                'level' => $level,
                'threshold' => $threshold,
                'xp_required' => $threshold - $previousThreshold,
                'is_current' => $level == $currentLevel,
                'is_completed' => $level < $currentLevel,
                'progress_percentage' => $this->calculateLevelProgressPercentage($totalXp, $previousThreshold, $threshold),
            ];

            $previousThreshold = $threshold;
        }

        return Inertia::render('Student/XpLevelProgress', [
            'totalXp' => $totalXp,
            'currentLevel' => $currentLevel,
            'nextLevelInfo' => $nextLevelInfo,
            'levelProgressData' => $levelProgressData,
        ]);
    }

    /**
     * Calculate the percentage progress within a level
     *
     * @param int $totalXp
     * @param int $lowerThreshold
     * @param int $upperThreshold
     * @return float
     */
    private function calculateLevelProgressPercentage($totalXp, $lowerThreshold, $upperThreshold)
    {
        if ($totalXp >= $upperThreshold) {
            return 100;
        }

        if ($totalXp <= $lowerThreshold) {
            return 0;
        }

        $levelXp = $upperThreshold - $lowerThreshold;
        $userLevelXp = $totalXp - $lowerThreshold;

        return round(($userLevelXp / $levelXp) * 100, 1);
    }
}
