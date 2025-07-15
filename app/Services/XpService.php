<?php

namespace App\Services;

use App\Models\XpTransaction;
use App\Models\User;
use App\Models\TrainingResult;
use App\Models\TestResult;
use App\Models\TrainingSession;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class XpService
{
    /**
     * XP constants
     */
    const XP_SESSION_COMPLETE = 4;
    const XP_WEEK_COMPLETE = 3;
    const XP_TESTING_COMPLETE = 8;
    const XP_TRAINING_AND_TESTING_WEEK = 5;
    const XP_MONTH_COMPLETE = 12;

    /**
     * Level thresholds
     * These represent the minimum XP required to reach each level
     */
    const LEVEL_THRESHOLDS = [
        1 => 1,    // Level 1: 1 XP
        2 => 3,    // Level 2: 3 XP (2 XP more than Level 1)
        3 => 6,    // Level 3: 6 XP (3 XP more than Level 2)
        4 => 10,   // Level 4: 10 XP (4 XP more than Level 3)
        5 => 15,   // Level 5: 15 XP (5 XP more than Level 4)
        // If more levels are needed, add them here following the pattern
    ];

    /**
     * Calculate XP for a user based on session completion
     *
     * @param int $userId
     * @param int $sessionId
     * @return int Amount of XP earned
     */
    public function calculateSessionXp(int $userId, int $sessionId): int
    {
        // Get the session
        $session = TrainingSession::findOrFail($sessionId);

        // Initialize XP amount
        $xpAmount = 0;
        $xpSource = '';

        // Check if this is a training or testing session
        if (strtolower($session->session_type) === 'training') {
            // Check if training result exists and all fields are filled
            $trainingResult = TrainingResult::where('user_id', $userId)
                ->where('session_id', $sessionId)
                ->first();

            if ($this->isTrainingComplete($trainingResult)) {
                $xpAmount += self::XP_SESSION_COMPLETE;
                $xpSource = 'session_complete';

                // Check for weekly bonus
                $weeklyBonus = $this->checkWeeklyBonus($userId, $session->week_number, $session->block->id);
                if ($weeklyBonus > 0) {
                    $this->addXpTransaction($userId, $weeklyBonus, 'week_complete');
                }

                // Check for monthly bonus (4-week period)
                $monthlyBonus = $this->checkMonthlyBonus($userId);
                if ($monthlyBonus > 0) {
                    $this->addXpTransaction($userId, $monthlyBonus, 'month_complete');
                }
            }
        } else if (strtolower($session->session_type) === 'testing') {
            // Check if test result exists and all required fields are filled
            $testResult = TestResult::where('user_id', $userId)
                ->where('session_id', $sessionId)
                ->first();

            if ($this->isTestingComplete($testResult)) {
                $xpAmount += self::XP_TESTING_COMPLETE;
                $xpSource = 'testing_complete';

                // Check for testing + training bonus in the same week
                $trainingAndTestingBonus = $this->checkTrainingAndTestingBonus($userId, $session->week_number, $session->block->id);
                if ($trainingAndTestingBonus > 0) {
                    $this->addXpTransaction($userId, $trainingAndTestingBonus, 'training_and_testing');
                }
            }
        }

        // Add XP transaction if XP was earned
        if ($xpAmount > 0) {
            $this->addXpTransaction($userId, $xpAmount, $xpSource);
        }

        return $xpAmount;
    }

    /**
     * Create an XP transaction
     *
     * @param int $userId
     * @param int $xpAmount
     * @param string $xpSource
     * @return XpTransaction
     */
    public function addXpTransaction(int $userId, int $xpAmount, string $xpSource): XpTransaction
    {
        return XpTransaction::create([
            'user_id' => $userId,
            'xp_amount' => $xpAmount,
            'xp_source' => $xpSource,
            'transaction_date' => now(),
        ]);
    }

    /**
     * Calculate user's total XP
     *
     * @param int $userId
     * @return int
     */
    public function getTotalXp(int $userId): int
    {
        return XpTransaction::where('user_id', $userId)
            ->sum('xp_amount');
    }

    /**
     * Get total XP required to reach a specific level
     *
     * @param int $level
     * @return int
     */
    public function getTotalXpForLevel(int $level): int
    {
        // If level exists in thresholds, return it
        if (isset(self::LEVEL_THRESHOLDS[$level])) {
            return self::LEVEL_THRESHOLDS[$level];
        }

        // For levels beyond our defined thresholds, follow the pattern
        // Each level requires N more XP than the previous level
        // (where N is the level number)
        $lastDefinedLevel = max(array_keys(self::LEVEL_THRESHOLDS));
        $lastLevelXp = self::LEVEL_THRESHOLDS[$lastDefinedLevel];

        $additionalXp = 0;
        for ($i = $lastDefinedLevel + 1; $i <= $level; $i++) {
            $additionalXp += $i;
        }

        return $lastLevelXp + $additionalXp;
    }

    /**
     * Calculate XP needed to go from one level to the next
     *
     * @param int $currentLevel
     * @return int
     */
    public function getXpGapBetweenLevels(int $currentLevel): int
    {
        $nextLevel = $currentLevel + 1;
        $currentLevelXp = $this->getTotalXpForLevel($currentLevel);
        $nextLevelXp = $this->getTotalXpForLevel($nextLevel);

        return $nextLevelXp - $currentLevelXp;
    }

    /**
     * Get user's current strength level based on XP
     *
     * @param int $userId
     * @return int
     */
    public function getCurrentLevel(int $userId): int
    {
        $totalXp = $this->getTotalXp($userId);

        // If no XP, return level 1
        if ($totalXp < self::LEVEL_THRESHOLDS[1]) {
            return 1;
        }

        // Find the highest level that the user's XP meets or exceeds
        $level = 1;
        foreach (self::LEVEL_THRESHOLDS as $lvl => $threshold) {
            if ($totalXp >= $threshold) {
                $level = $lvl;
            } else {
                break; // Stop once we find a threshold higher than user's XP
            }
        }

        // If user's XP exceeds our defined thresholds, calculate level based on the pattern
        if (
            $level === max(array_keys(self::LEVEL_THRESHOLDS)) &&
            $totalXp > self::LEVEL_THRESHOLDS[$level]
        ) {

            $remainingXp = $totalXp - self::LEVEL_THRESHOLDS[$level];
            $nextLevel = $level + 1;

            while (true) {
                $xpForNextLevel = $nextLevel; // Each level requires N more XP
                if ($remainingXp < $xpForNextLevel) {
                    break;
                }

                $remainingXp -= $xpForNextLevel;
                $level = $nextLevel;
                $nextLevel++;
            }
        }

        return $level;
    }

    /**
     * Get XP required for next level
     *
     * @param int $userId
     * @return array
     */
    public function getNextLevelInfo(int $userId): array
    {
        $totalXp = $this->getTotalXp($userId);
        $currentLevel = $this->getCurrentLevel($userId);
        $nextLevel = $currentLevel + 1;

        // Calculate XP needed for next level
        $xpForCurrentLevel = $this->getTotalXpForLevel($currentLevel);
        $xpForNextLevel = $this->getTotalXpForLevel($nextLevel);
        $xpNeeded = $xpForNextLevel - $totalXp;

        // Get XP gap between levels for progress calculation
        $xpGap = $this->getXpGapBetweenLevels($currentLevel);

        // Calculate progress percentage in current level
        $xpInCurrentLevel = $totalXp - $xpForCurrentLevel;
        $progressPercentage = min(100, round(($xpInCurrentLevel / $xpGap) * 100));

        return [
            'current_level' => $currentLevel,
            'next_level' => $nextLevel,
            'xp_needed' => $xpNeeded,
            'total_xp' => $totalXp,
            'progress_percentage' => $progressPercentage,
            'xp_for_current_level' => $xpForCurrentLevel,
            'xp_for_next_level' => $xpForNextLevel,
            'xp_gap' => $xpGap
        ];
    }

    /**
     * Check if a training result is complete (all fields filled)
     *
     * @param TrainingResult|null $result
     * @return bool
     */
    private function isTrainingComplete(?TrainingResult $result): bool
    {
        if (!$result) {
            return false;
        }

        return !empty($result->warmup_completed) &&
            !empty($result->plyometrics_score) &&
            !empty($result->power_score) &&
            !empty($result->lower_body_strength_score) &&
            !empty($result->upper_body_core_strength_score);
    }

    /**
     * Check if a testing result is complete (all fields filled except bent_arm_hang_assessment)
     *
     * @param TestResult|null $result
     * @return bool
     */
    private function isTestingComplete(?TestResult $result): bool
    {
        if (!$result) {
            return false;
        }

        // Bent Arm Hang Assessment is a bonus assessment and doesn't affect XP calculations
        // as specified in requirements, so we exclude it from the completeness check
        return !empty($result->standing_long_jump) &&
            !empty($result->single_leg_jump_left) &&
            !empty($result->single_leg_jump_right) &&
            !empty($result->wall_sit_assessment) &&
            !empty($result->high_plank_assessment);
    }

    /**
     * Check if user completed two training sessions in a week
     *
     * @param int $userId
     * @param int $weekNumber
     * @param int $blockId
     * @return int XP earned
     */
    private function checkWeeklyBonus(int $userId, int $weekNumber, int $blockId): int
    {
        // Get training sessions for this week
        $trainingSessions = TrainingSession::where('week_number', $weekNumber)
            ->where('block_id', $blockId)
            ->where('session_type', 'training')
            ->pluck('id');

        // Updated logic for new schedule:
        // Weeks 5 and 11 have only 1 training session, others have 2 (except rest weeks 6 and 12)
        if (in_array($weekNumber, [6, 12])) {
            // Rest weeks have no training sessions
            return 0;
        }

        $requiredTrainingSessions = in_array($weekNumber, [5, 11]) ? 1 : 2;

        if ($trainingSessions->count() < $requiredTrainingSessions) {
            return 0;
        }

        // Check if all completed sessions have all fields filled
        $allFieldsFilled = true;
        $results = TrainingResult::where('user_id', $userId)
            ->whereIn('session_id', $trainingSessions)
            ->get();

        foreach ($results as $result) {
            if (!$this->isTrainingComplete($result)) {
                $allFieldsFilled = false;
                break;
            }
        }

        // If user completed required training sessions with all fields filled
        if ($results->count() >= $requiredTrainingSessions && $allFieldsFilled) {
            // Calculate the calendar week boundaries based on session release dates
            $firstSessionReleaseDate = TrainingSession::whereIn('id', $trainingSessions)
                ->orderBy('release_date')
                ->first()
                ->release_date;

            $weekStart = Carbon::parse($firstSessionReleaseDate)->startOfWeek();
            $weekEnd = Carbon::parse($firstSessionReleaseDate)->endOfWeek();

            // Check if this bonus was already awarded for this calendar week
            $existingBonus = XpTransaction::where('user_id', $userId)
                ->where('xp_source', 'week_complete')
                ->where('transaction_date', '>=', $weekStart)
                ->where('transaction_date', '<=', $weekEnd)
                ->first();

            if (!$existingBonus) {
                return self::XP_WEEK_COMPLETE;
            }
        }

        return 0;
    }

    /**
     * Check if user completed both training and testing in the same week
     *
     * @param int $userId
     * @param int $weekNumber
     * @param int $blockId
     * @return int XP earned
     */
    private function checkTrainingAndTestingBonus(int $userId, int $weekNumber, int $blockId): int
    {
        // Only weeks 5 and 11 have both training and testing
        if (!in_array($weekNumber, [5, 11])) {
            return 0;
        }

        // Get all sessions for this week
        $trainingSessions = TrainingSession::where('week_number', $weekNumber)
            ->where('block_id', $blockId)
            ->where('session_type', 'training')
            ->pluck('id');

        $testingSessions = TrainingSession::where('week_number', $weekNumber)
            ->where('block_id', $blockId)
            ->where('session_type', 'testing')
            ->pluck('id');

        // Weeks 5 and 11 should have exactly 1 training + 1 testing
        if ($trainingSessions->count() < 1 || $testingSessions->count() < 1) {
            return 0;
        }

        // Check if user has completed the training session
        $completedTrainingCount = TrainingResult::where('user_id', $userId)
            ->whereIn('session_id', $trainingSessions)
            ->count();

        // Check if user has completed the testing session
        $completedTestingCount = TestResult::where('user_id', $userId)
            ->whereIn('session_id', $testingSessions)
            ->count();

        // Check if all completed sessions have all fields filled
        $allTrainingFieldsFilled = true;
        $trainingResults = TrainingResult::where('user_id', $userId)
            ->whereIn('session_id', $trainingSessions)
            ->get();

        foreach ($trainingResults as $result) {
            if (!$this->isTrainingComplete($result)) {
                $allTrainingFieldsFilled = false;
                break;
            }
        }

        $allTestingFieldsFilled = true;
        $testingResults = TestResult::where('user_id', $userId)
            ->whereIn('session_id', $testingSessions)
            ->get();

        foreach ($testingResults as $result) {
            if (!$this->isTestingComplete($result)) {
                $allTestingFieldsFilled = false;
                break;
            }
        }

        // If user completed both training and testing with all fields filled
        if (
            $completedTrainingCount >= 1 && $completedTestingCount >= 1 &&
            $allTrainingFieldsFilled && $allTestingFieldsFilled
        ) {
            // Calculate the calendar week boundaries based on session release dates
            $firstSessionReleaseDate = TrainingSession::where('week_number', $weekNumber)
                ->where('block_id', $blockId)
                ->orderBy('release_date')
                ->first()
                ->release_date;

            $weekStart = Carbon::parse($firstSessionReleaseDate)->startOfWeek();
            $weekEnd = Carbon::parse($firstSessionReleaseDate)->endOfWeek();

            // Check if this bonus was already awarded for this calendar week
            $existingBonus = XpTransaction::where('user_id', $userId)
                ->where('xp_source', 'training_and_testing')
                ->where('transaction_date', '>=', $weekStart)
                ->where('transaction_date', '<=', $weekEnd)
                ->first();

            if (!$existingBonus) {
                return self::XP_TRAINING_AND_TESTING_WEEK;
            }
        }

        return 0;
    }

    /**
     * Check if user completed all sessions in a 4-week period
     *
     * @param int $userId
     * @return int XP earned
     */
    private function checkMonthlyBonus(int $userId): int
    {
        // Get current date and calculate the start date (4 weeks ago)
        $endDate = Carbon::now();
        $startDate = Carbon::now()->subWeeks(4);

        // Get all sessions in the 4-week period
        $sessions = TrainingSession::whereBetween('created_at', [$startDate, $endDate])
            ->pluck('id');

        if ($sessions->count() == 0) {
            return 0;
        }

        // Get all training results for this user in the period
        $trainingResults = TrainingResult::where('user_id', $userId)
            ->whereIn('session_id', $sessions)
            ->where('session_id', function ($query) {
                $query->select('id')
                    ->from('training_sessions')
                    ->where('session_type', 'training')
                    ->whereRaw('training_sessions.id = training_results.session_id');
            })
            ->get();

        // Get all testing results for this user in the period
        $testingResults = TestResult::where('user_id', $userId)
            ->whereIn('session_id', $sessions)
            ->where('session_id', function ($query) {
                $query->select('id')
                    ->from('training_sessions')
                    ->where('session_type', 'testing')
                    ->whereRaw('training_sessions.id = test_results.session_id');
            })
            ->get();

        // Count total training and testing sessions in the period
        $totalTrainingSessions = TrainingSession::whereBetween('created_at', [$startDate, $endDate])
            ->where('session_type', 'training')
            ->count();

        $totalTestingSessions = TrainingSession::whereBetween('created_at', [$startDate, $endDate])
            ->where('session_type', 'testing')
            ->count();

        // If user completed all available sessions with all fields filled
        if (
            count($trainingResults) == $totalTrainingSessions &&
            count($testingResults) == $totalTestingSessions
        ) {

            // Check if all training sessions have all fields filled
            $allTrainingFieldsFilled = true;
            foreach ($trainingResults as $result) {
                if (!$this->isTrainingComplete($result)) {
                    $allTrainingFieldsFilled = false;
                    break;
                }
            }

            // Check if all testing sessions have all fields filled
            $allTestingFieldsFilled = true;
            foreach ($testingResults as $result) {
                if (!$this->isTestingComplete($result)) {
                    $allTestingFieldsFilled = false;
                    break;
                }
            }

            if ($allTrainingFieldsFilled && $allTestingFieldsFilled) {
                // Check if this bonus was already awarded in this 4-week period
                $existingBonus = XpTransaction::where('user_id', $userId)
                    ->where('xp_source', 'month_complete')
                    ->whereBetween('transaction_date', [$startDate, $endDate])
                    ->first();

                if (!$existingBonus) {
                    return self::XP_MONTH_COMPLETE;
                }
            }
        }

        return 0;
    }

    /**
     * Get summary of user's XP activity
     *
     * @param int $userId
     * @return array
     */
    public function getUserXpSummary(int $userId): array
    {
        $totalXp = $this->getTotalXp($userId);
        $currentLevel = $this->getCurrentLevel($userId);
        $nextLevelInfo = $this->getNextLevelInfo($userId);

        // Get recent XP transactions
        $recentTransactions = XpTransaction::where('user_id', $userId)
            ->orderBy('transaction_date', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($transaction) {
                return [
                    'amount' => $transaction->xp_amount,
                    'source' => $this->formatXpSource($transaction->xp_source),
                    'date' => $transaction->transaction_date->format('Y-m-d H:i:s'),
                ];
            });

        // Get XP breakdown by source
        $breakdownBySource = XpTransaction::where('user_id', $userId)
            ->select('xp_source', DB::raw('SUM(xp_amount) as total'))
            ->groupBy('xp_source')
            ->get()
            ->map(function ($item) {
                return [
                    'source' => $this->formatXpSource($item->xp_source),
                    'total' => $item->total,
                ];
            });

        return [
            'total_xp' => $totalXp,
            'current_level' => $currentLevel,
            'next_level' => $nextLevelInfo['next_level'],
            'xp_needed_for_next_level' => $nextLevelInfo['xp_needed'],
            'progress_percentage' => $nextLevelInfo['progress_percentage'],
            'xp_for_current_level' => $nextLevelInfo['xp_for_current_level'],
            'xp_for_next_level' => $nextLevelInfo['xp_for_next_level'],
            'xp_gap' => $nextLevelInfo['xp_gap'],
            'recent_transactions' => $recentTransactions,
            'breakdown_by_source' => $breakdownBySource,
        ];
    }

    /**
     * Format XP source for display
     *
     * @param string $source
     * @return string
     */
    private function formatXpSource(string $source): string
    {
        $formats = [
            'session_complete' => 'Training Session Completed',
            'testing_complete' => 'Testing Session Completed',
            'week_complete' => 'Weekly Training Bonus',
            'training_and_testing' => 'Training and Testing Bonus',
            'month_complete' => 'Monthly Training Bonus',
        ];

        return $formats[$source] ?? ucfirst(str_replace('_', ' ', $source));
    }
}
