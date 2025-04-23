<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\TestResult;
use App\Models\TrainingSession;
use App\Models\Block;
use App\Models\PreTrainingTest;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class ProgressController extends Controller
{
    /**
     * Display the user's progress page.
     */
    public function index()
    {
        $user = Auth::user();

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
                    'duration_weeks' => $startDate->diffInWeeks($endDate) + 1,
                    'is_current' => $now->between($startDate, $endDate)
                ];
            });

        // Get pre-training test data for this user
        $preTrainingTest = PreTrainingTest::where('user_id', $user->id)->first();
        $preTrainingDate = $preTrainingTest ? Carbon::parse($preTrainingTest->created_at) : null;

        // Get all test sessions in order (for all blocks 1-3)
        $testSessions = TrainingSession::where('session_type', 'testing')
            ->with('block')
            ->orderBy('week_number')
            ->get();

        // Get all test results for this user
        $testResults = TestResult::where('user_id', $user->id)
            ->get()
            ->keyBy('session_id');

        // Define all test types and mapping between pre_training_tests and test_results columns
        $testTypes = [
            'standing_long_jump' => [
                'name' => 'Standing Long Jump',
                'pre_training_field' => 'standing_long_jump'
            ],
            'single_leg_jump_left' => [
                'name' => 'Single Leg Jump (LEFT)',
                'pre_training_field' => 'single_leg_jump_left'
            ],
            'single_leg_jump_right' => [
                'name' => 'Single Leg Jump (RIGHT)',
                'pre_training_field' => 'single_leg_jump_right'
            ],
            'wall_sit_assessment' => [  // This name should match your database field
                'name' => 'Wall Sit Assessment',
                'pre_training_field' => 'single_leg_wall_sit_left'  // Keep this unchanged if it matches pre-training test field
            ],
            'high_plank_assessment' => [
                'name' => 'High Plank Assessment',
                'pre_training_field' => 'core_endurance'
            ],
            'bent_arm_hang_assessment' => [
                'name' => 'Bent Arm Hold',
                'pre_training_field' => 'bent_arm_hang'
            ]
        ];

        // Process data for each test type
        $progressData = [];
        foreach ($testTypes as $testKey => $testInfo) {
            $sessionData = [];
            $values = [];
            $hasAnyData = false;

            // Add pre-training test data as the first point if available
            if ($preTrainingTest && isset($preTrainingTest->{$testInfo['pre_training_field']})) {
                $preTrainingValue = (float) $preTrainingTest->{$testInfo['pre_training_field']};

                // Only add if the value is not zero/null
                if ($preTrainingValue > 0) {
                    $sessionData[] = [
                        'label' => 'PRE-TRAINING',
                        'date' => $preTrainingDate ? $preTrainingDate->format('Y-m-d') : Carbon::now()->subMonths(3)->format('Y-m-d'), // Use a default date if not available
                        'value' => $preTrainingValue
                    ];
                    $values[] = $preTrainingValue;
                    $hasAnyData = true;
                }
            }

            // Add all test sessions from blocks 1-3
            foreach ($testSessions as $session) {
                $label = $this->getSessionLabel($session);

                // Get session release date for chart display
                $sessionDate = $session->release_date;

                // If release_date is not available, try to calculate based on block start date
                if (!$sessionDate && $session->block && $session->block->start_date) {
                    $sessionDate = Carbon::parse($session->block->start_date)
                        ->addWeeks($session->week_number - 1)
                        ->format('Y-m-d');
                } else if ($sessionDate) {
                    $sessionDate = Carbon::parse($sessionDate)->format('Y-m-d');
                } else {
                    // Fallback if no dates are available
                    $sessionDate = Carbon::now()->format('Y-m-d');
                }

                // Check if we have a result for this session
                $value = null;
                if (
                    isset($testResults[$session->id]) &&
                    !is_null($testResults[$session->id]->$testKey)
                ) {
                    $value = (float) $testResults[$session->id]->$testKey;
                    $values[] = $value;
                    $hasAnyData = true;

                    // Use the completed_at date if available (more accurate)
                    if ($testResults[$session->id]->completed_at) {
                        $sessionDate = Carbon::parse($testResults[$session->id]->completed_at)->format('Y-m-d');
                    }
                }

                // Only add session data point if it has a value
                if ($value !== null) {
                    $sessionData[] = [
                        'label' => $label,
                        'date' => $sessionDate,
                        'value' => $value
                    ];
                }
            }

            // Calculate percentage increase if we have at least 2 data points
            $percentageIncrease = null;
            if (count($values) >= 2) {
                $first = $values[0];
                $last = end($values);

                if ($first > 0) {
                    $percentageIncrease = round((($last - $first) / $first) * 100, 1);
                }
            }

            // Only add this test type to the progress data if it has any data points
            if ($hasAnyData) {
                $progressData[$testKey] = [
                    'name' => $testInfo['name'],
                    'sessions' => $sessionData,
                    'percentageIncrease' => $percentageIncrease
                ];
            }
        }

        return Inertia::render('Student/Progress', [
            'progressData' => $progressData,
            'blocks' => $blocks,
            'username' => $user->name,
        ]);
    }

    /**
     * Generate a user-friendly label for a test session.
     */
    private function getSessionLabel($session)
    {
        if ($session->week_number == 1) {
            return 'BASELINE TESTING';
        }

        $blockNumber = $session->block->block_number ?? 'Unknown';
        $weekNumber = $session->week_number ?? 'Unknown';

        return "BLOCK {$blockNumber} - WEEK {$weekNumber}";
    }
}
