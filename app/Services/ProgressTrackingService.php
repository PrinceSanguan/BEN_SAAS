<?php

namespace App\Services;

use App\Models\ProgressTracking;
use App\Models\TestResult;
use App\Models\TrainingSession;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProgressTrackingService
{
    /**
     * Update progress tracking after a new test result is submitted.
     *
     * @param int $userId
     * @param int $sessionId
     * @param array $testData
     * @return bool
     */
    public function updateProgressFromTestResult(int $userId, int $sessionId, array $testData): bool
    {
        try {
            // Verify this is a testing session
            $session = TrainingSession::findOrFail($sessionId);
            if (strtolower($session->session_type) !== 'testing') {
                return false;
            }

            // Get all test sessions for this user, ordered by week
            $testSessions = TrainingSession::where('session_type', 'testing')
                ->orderBy('week_number')
                ->pluck('id');

            // Find the earliest test result (baseline) for this user
            $baselineResults = TestResult::where('user_id', $userId)
                ->whereIn('session_id', $testSessions->toArray())
                ->orderBy('created_at')
                ->first();

            if (!$baselineResults) {
                // This is the first test result, so it becomes the baseline
                $baselineResults = TestResult::where('user_id', $userId)
                    ->where('session_id', $sessionId)
                    ->first();

                if (!$baselineResults) {
                    return false;
                }
            }

            // Get the most recent test result
            $currentResult = TestResult::where('user_id', $userId)
                ->where('session_id', $sessionId)
                ->first();

            if (!$currentResult) {
                return false;
            }

            // Update progress for each test type
            $testTypes = [
                'standing_long_jump',
                'single_leg_jump_left',
                'single_leg_jump_right',
                'wall_sit_assessment',
                'high_plank_assessment',
                'core_endurance_left',
                'core_endurance_right',
                'bent_arm_hang_assessment'
            ];

            foreach ($testTypes as $testType) {
                // Skip if the current test data doesn't have this field
                if (!isset($currentResult->$testType) || is_null($currentResult->$testType)) {
                    continue;
                }

                // Update or create progress tracking record
                ProgressTracking::updateOrCreate(
                    [
                        'user_id' => $userId,
                        'test_type' => $testType,
                    ],
                    [
                        'baseline_value' => $baselineResults->$testType ?? 0,
                        'current_value' => $currentResult->$testType,
                        'percentage_increase' => $this->calculatePercentage(
                            $baselineResults->$testType ?? 0,
                            $currentResult->$testType
                        ),
                        'last_updated' => now(),
                    ]
                );
            }

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to update progress tracking: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Calculate percentage increase between two values.
     *
     * @param float $baseline
     * @param float $current
     * @return float|null
     */
    private function calculatePercentage(float $baseline, float $current): ?float
    {
        if ($baseline <= 0) {
            return null;
        }

        return round((($current - $baseline) / $baseline) * 100, 2);
    }

    /**
     * Recalculate all progress tracking for a user.
     *
     * @param int $userId
     * @return bool
     */
    public function recalculateUserProgress(int $userId): bool
    {
        try {
            // Get all test sessions
            $testSessions = TrainingSession::where('session_type', 'testing')
                ->orderBy('week_number')
                ->pluck('id');

            // Get all test results for this user
            $testResults = TestResult::where('user_id', $userId)
                ->whereIn('session_id', $testSessions->toArray())
                ->get();

            if ($testResults->isEmpty()) {
                return false;
            }

            // Get baseline (earliest) test
            $baselineResults = $testResults->sortBy('created_at')->first();

            // Get latest test results
            $latestResults = $testResults->sortByDesc('created_at')->first();

            // Test types
            $testTypes = [
                'standing_long_jump',
                'single_leg_jump_left',
                'single_leg_jump_right',
                'wall_sit_assessment',
                'high_plank_assessment',
                'bent_arm_hang_assessment'
            ];

            // Update progress for each test type
            foreach ($testTypes as $testType) {
                if (!isset($baselineResults->$testType) || !isset($latestResults->$testType)) {
                    continue;
                }

                ProgressTracking::updateOrCreate(
                    [
                        'user_id' => $userId,
                        'test_type' => $testType,
                    ],
                    [
                        'baseline_value' => $baselineResults->$testType,
                        'current_value' => $latestResults->$testType,
                        'percentage_increase' => $this->calculatePercentage(
                            $baselineResults->$testType,
                            $latestResults->$testType
                        ),
                        'last_updated' => now(),
                    ]
                );
            }

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to recalculate user progress: ' . $e->getMessage());
            return false;
        }
    }
}
