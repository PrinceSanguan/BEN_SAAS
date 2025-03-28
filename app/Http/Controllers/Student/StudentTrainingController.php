<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Block;
use App\Models\TrainingResult;
use App\Models\TestResult;
use App\Services\XpService;
use App\Services\UserStatService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\TrainingSession;
use Illuminate\Http\Request;

class StudentTrainingController extends Controller
{
    protected $xpService;
    protected $userStatService;

    /**
     * Create a new controller instance.
     *
     * @param XpService $xpService
     * @param UserStatService $userStatService
     */
    public function __construct(XpService $xpService, UserStatService $userStatService)
    {
        $this->xpService = $xpService;
        $this->userStatService = $userStatService;
    }

    /**
     * Display the Student training.
     */
    public function index()
    {
        $user = Auth::user();

        // 1) Get all blocks + sessions, sorted by week_number, session_number.
        $blocks = Block::with(['sessions' => function ($query) {
            $query->orderBy('week_number')->orderBy('session_number');
        }])->orderBy('block_number')->get();

        // 2) Find which sessions this user has completed (from training_results and test_results).
        $completedSessions = TrainingResult::where('user_id', $user->id)
            ->pluck('session_id')
            ->toArray();

        // Add test results to completed sessions
        $completedTestSessions = TestResult::where('user_id', $user->id)
            ->pluck('session_id')
            ->toArray();

        $completedSessions = array_merge($completedSessions, $completedTestSessions);

        // Find the current active block
        $currentBlockIndex = -1;
        for ($i = 0; $i < count($blocks); $i++) {
            $block = $blocks[$i];
            $isBlockCompleted = $this->isBlockCompleted($block->id, $user->id);

            if (!$isBlockCompleted) {
                $currentBlockIndex = $i;
                break;
            }
        }

        // 3) Format blocks with modified week-based unlocking logic
        $formattedBlocks = $blocks->map(function ($block, $index) use ($completedSessions, $user, $currentBlockIndex) {
            // Check if this block should be locked (it comes after the current incomplete block)
            $isBlockLocked = $currentBlockIndex !== -1 && $index > $currentBlockIndex;

            // Group sessions by week
            $sessionsByWeek = collect($block->sessions)->groupBy('week_number');

            // Determine the highest completed week
            $highestCompletedWeek = $this->getHighestCompletedWeek($block->id, $user->id);

            // Current unlocked week is either week 1 or one week after the highest completed week
            $currentUnlockedWeek = $highestCompletedWeek + 1;

            // If no weeks are completed yet, start with week 1
            if ($highestCompletedWeek == 0) {
                $currentUnlockedWeek = 1;
            }

            // For each week, figure out how many training vs. testing sessions exist, then build a label
            $weeks = $sessionsByWeek->map(function ($sessions, $weekNumber) use ($block, $completedSessions, $currentUnlockedWeek, $isBlockLocked) {
                // We'll separate training vs. testing sessions
                $training = $sessions->where('session_type', 'training');
                $testing  = $sessions->where('session_type', 'testing');
                $rest = $sessions->where('session_type', 'rest');

                // Convert each session into appropriate label format
                // For training: "TRAINING #X"
                // For testing: "TESTING" (without session number)
                $trainLabels = $training->map(fn($s) => "TRAINING #{$s->session_number}")->toArray();
                $testLabels  = $testing->map(fn($s) => "TESTING")->toArray();
                $restLabels  = $rest->map(fn($s) => "REST WEEK")->toArray();

                // Then we combine them into a single label string
                // e.g. "✅ TRAINING #1 & TRAINING #2, ✅ TESTING"
                $labelTrain = $trainLabels ? "✅ " . implode(" & ", $trainLabels) : '';
                $labelTest  = $testLabels  ? "✅ " . implode(" & ", $testLabels) : '';
                $labelRest  = $restLabels  ? "✅ " . implode(" & ", $restLabels) : '';

                // If both exist in same week, separate them with comma
                $weekLabelParts = array_filter([$labelTrain, $labelTest, $labelRest]);
                $weekLabel      = implode(", ", $weekLabelParts);

                // If the final label is empty, set a fallback
                if (!$weekLabel) {
                    $weekLabel = "No sessions for this week (unexpected)";
                }

                // Map each session's details so the front-end can see them.
                $mappedSessions = $sessions->map(function ($session) use ($completedSessions, $currentUnlockedWeek, $isBlockLocked) {
                    // For display label in frontend: don't include session number for testing sessions
                    $displayLabel = '';
                    if ($session->session_type === 'testing') {
                        $displayLabel = 'TESTING';
                    } elseif ($session->session_type === 'rest') {
                        $displayLabel = 'REST WEEK';
                    } else {
                        $displayLabel = "Session {$session->session_number}";
                    }

                    // Determine if this session is locked based on week or block
                    // It's unlocked if:
                    // 1. It's already completed
                    // 2. The block is not locked AND it's in the current unlocked week or earlier
                    // 3. It's a rest session (always accessible)
                    $isCompleted = in_array($session->id, $completedSessions);
                    $isLocked = $isBlockLocked || (!$isCompleted && $session->week_number > $currentUnlockedWeek && $session->session_type !== 'rest');

                    return [
                        'id'             => $session->id,
                        'session_number' => $session->session_number,
                        'session_type'   => $session->session_type,
                        'is_completed'   => $isCompleted,
                        'is_locked'      => $isLocked, // Updated to consider block locking
                        'label'          => $displayLabel, // Add custom display label
                    ];
                })->values();

                return [
                    'week_number' => $weekNumber,
                    'label'       => "Week {$weekNumber}: {$weekLabel}",
                    'sessions'    => $mappedSessions,
                ];
            })->sortBy('week_number')->values(); // sort weeks ascending

            return [
                'id'           => $block->id,
                'block_number' => $block->block_number,
                'block_label'  => "Block {$block->block_number}",
                'is_locked'    => $isBlockLocked, // Add this to indicate if the entire block is locked
                'weeks'        => $weeks,
            ];
        });

        // Get XP information
        $xpSummary = $this->xpService->getUserXpSummary($user->id);

        // Render with Inertia to your Student/StudentTraining page
        return Inertia::render('Student/StudentTraining', [
            'blocks' => $formattedBlocks,
            'xp' => [
                'total' => $xpSummary['total_xp'],
                'level' => $xpSummary['current_level'],
                'nextLevel' => $xpSummary['next_level'],
                'xpNeeded' => $xpSummary['xp_needed_for_next_level'],
            ],
        ]);
    }


    /**
     * Get the highest week number that the user has fully completed
     *
     * @param int $blockId
     * @param int $userId
     * @return int
     */
    protected function getHighestCompletedWeek(int $blockId, int $userId): int
    {
        // Get all sessions for this block, grouped by week
        $sessionsByWeek = TrainingSession::where('block_id', $blockId)
            ->where('session_type', 'training') // Only consider training sessions
            ->get()
            ->groupBy('week_number');

        // Get all completed session IDs for this user
        $completedSessions = TrainingResult::where('user_id', $userId)
            ->pluck('session_id')
            ->toArray();

        $highestCompletedWeek = 0;

        // Check each week to see if all training sessions are completed
        foreach ($sessionsByWeek as $weekNumber => $sessions) {
            $allCompleted = true;
            foreach ($sessions as $session) {
                if (!in_array($session->id, $completedSessions)) {
                    $allCompleted = false;
                    break;
                }
            }

            // If all sessions in this week are completed, update the highest completed week
            if ($allCompleted && $weekNumber > $highestCompletedWeek) {
                $highestCompletedWeek = $weekNumber;
            } else if (!$allCompleted && $weekNumber <= $highestCompletedWeek) {
                // If we find an incomplete week that's earlier than our current highest,
                // we need to stop as we only want consecutive completed weeks
                break;
            }
        }

        return $highestCompletedWeek;
    }

    public function showSession($sessionId)
    {
        $user = Auth::user();
        $session = TrainingSession::with('block')->findOrFail($sessionId);

        // Check if this session should be accessible
        // First get all completed sessions
        $completedSessions = TrainingResult::where('user_id', $user->id)
            ->pluck('session_id')
            ->toArray();

        $completedTestSessions = TestResult::where('user_id', $user->id)
            ->pluck('session_id')
            ->toArray();

        $completedSessions = array_merge($completedSessions, $completedTestSessions);

        // If this session is already completed, allow access
        if (in_array($sessionId, $completedSessions)) {
            // Continue with normal flow
        } else {
            // Get the highest completed week for this block
            $highestCompletedWeek = $this->getHighestCompletedWeek($session->block_id, $user->id);

            // Current unlocked week is the one after highest completed
            $currentUnlockedWeek = $highestCompletedWeek + 1;

            // If no weeks completed yet, start with week 1
            if ($highestCompletedWeek == 0) {
                $currentUnlockedWeek = 1;
            }

            // Check if this session's week is unlocked
            $isWeekUnlocked = $session->week_number <= $currentUnlockedWeek || $session->session_type === 'rest';

            // If this session's week isn't unlocked, redirect back
            if (!$isWeekUnlocked) {
                return redirect()->route('student.training')
                    ->with('error', 'You need to complete previous weeks first.');
            }
        }

        // existing training result if any
        $trainingResult = TrainingResult::where('user_id', $user->id)
            ->where('session_id', $sessionId)
            ->first();

        // existing test result if any
        $testResult = null;
        if (strtolower($session->session_type) === 'testing') {
            $testResult = TestResult::where('user_id', $user->id)
                ->where('session_id', $sessionId)
                ->first();
        }

        // Get XP information
        $xpSummary = $this->xpService->getUserXpSummary($user->id);

        return Inertia::render('Student/TrainingSession', [
            'session' => [
                'id'             => $session->id,
                'week_number'    => $session->week_number,
                'session_number' => $session->session_number,
                'session_type'   => $session->session_type,
                'block_number'   => $session->block ? $session->block->block_number : null,
                'display_label'  => strtolower($session->session_type) === 'testing'
                    ? 'TESTING'
                    : (strtolower($session->session_type) === 'rest'
                        ? 'REST WEEK'
                        : "Session {$session->session_number}"),
            ],
            'existingResult' => $trainingResult ? [
                'warmup_completed'               => $trainingResult->warmup_completed,
                'plyometrics_score'              => $trainingResult->plyometrics_score,
                'power_score'                    => $trainingResult->power_score,
                'lower_body_strength_score'      => $trainingResult->lower_body_strength_score,
                'upper_body_core_strength_score' => $trainingResult->upper_body_core_strength_score,
                'completed_at'                   => $trainingResult->completed_at,
            ] : null,
            'existingTestResult' => $testResult ? [
                'standing_long_jump'       => $testResult->standing_long_jump,
                'single_leg_jump_left'     => $testResult->single_leg_jump_left,
                'single_leg_jump_right'    => $testResult->single_leg_jump_right,
                'wall_sit_assessment'      => $testResult->wall_sit_assessment,
                'high_plank_assessment'    => $testResult->high_plank_assessment,
                'bent_arm_hang_assessment' => $testResult->bent_arm_hang_assessment, // Bonus assessment
                'completed_at'             => $testResult->completed_at,
            ] : null,
            'xp' => [
                'total' => $xpSummary['total_xp'],
                'level' => $xpSummary['current_level'],
                'nextLevel' => $xpSummary['next_level'],
                'xpNeeded' => $xpSummary['xp_needed_for_next_level'],
                'bonusFields' => ['bent_arm_hang_assessment'], // Indicate which fields are bonus
            ],
        ]);
    }

    public function saveTrainingResult(Request $request, $sessionId)
    {
        $user = Auth::user();
        $session = TrainingSession::findOrFail($sessionId);

        if (strtolower($session->session_type) === 'testing') {
            $validated = $request->validate([
                'standing_long_jump'       => 'required|numeric',
                'single_leg_jump_left'     => 'required|numeric',
                'single_leg_jump_right'    => 'required|numeric',
                'wall_sit_assessment'      => 'required|numeric',
                'high_plank_assessment'    => 'required|numeric',
                'bent_arm_hang_assessment' => 'nullable|numeric', // Optional field
            ]);

            TestResult::updateOrCreate(
                [
                    'user_id'    => $user->id,
                    'session_id' => $sessionId,
                ],
                [
                    'standing_long_jump'       => $validated['standing_long_jump'],
                    'single_leg_jump_left'     => $validated['single_leg_jump_left'],
                    'single_leg_jump_right'    => $validated['single_leg_jump_right'],
                    'wall_sit_assessment'      => $validated['wall_sit_assessment'],
                    'high_plank_assessment'    => $validated['high_plank_assessment'],
                    'bent_arm_hang_assessment' => $validated['bent_arm_hang_assessment'] ?? null,
                    'completed_at'             => now(),
                ]
            );
        } else {
            $validated = $request->validate([
                'warmup_completed'               => 'required|in:YES,NO',
                'plyometrics_score'              => 'required|string',
                'power_score'                    => 'required|string',
                'lower_body_strength_score'      => 'required|string',
                'upper_body_core_strength_score' => 'required|string',
            ]);

            TrainingResult::updateOrCreate(
                [
                    'user_id'    => $user->id,
                    'session_id' => $sessionId,
                ],
                [
                    'warmup_completed'               => $validated['warmup_completed'],
                    'plyometrics_score'              => $validated['plyometrics_score'],
                    'power_score'                    => $validated['power_score'],
                    'lower_body_strength_score'      => $validated['lower_body_strength_score'],
                    'upper_body_core_strength_score' => $validated['upper_body_core_strength_score'],
                    'completed_at'                   => now(),
                ]
            );
        }

        // Calculate and award XP for this session and update user stats
        $this->userStatService->updateStatsAfterSession($user->id, $sessionId);

        // Get the updated XP data for the success message
        $xpSummary = $this->xpService->getUserXpSummary($user->id);
        $successMessage = 'Training results saved successfully!';

        // Add XP information to the success message
        if ($xpSummary['current_level'] > 1) {
            $successMessage .= ' Your current strength level is ' . $xpSummary['current_level'] . '.';
        }

        return redirect()->route('student.training')
            ->with('success', $successMessage);
    }

    /**
     * Check if a block is fully completed by the user
     *
     * @param int $blockId
     * @param int $userId
     * @return bool
     */
    protected function isBlockCompleted(int $blockId, int $userId): bool
    {
        // Get all required sessions for this block
        $allSessions = TrainingSession::where('block_id', $blockId)
            ->where(function ($query) {
                $query->where('session_type', 'training')
                    ->orWhere('session_type', 'testing');
            }) // Get all training and testing sessions, but not rest sessions
            ->pluck('id')
            ->toArray();

        // Get completed training sessions
        $completedTrainingSessions = TrainingResult::where('user_id', $userId)
            ->whereIn('session_id', $allSessions)
            ->pluck('session_id')
            ->toArray();

        // Get completed test sessions
        $completedTestSessions = TestResult::where('user_id', $userId)
            ->whereIn('session_id', $allSessions)
            ->pluck('session_id')
            ->toArray();

        // Combine all completed sessions
        $completedSessions = array_merge($completedTrainingSessions, $completedTestSessions);

        // Block is completed if all required sessions are completed
        return count(array_intersect($allSessions, $completedSessions)) === count($allSessions);
    }
}
