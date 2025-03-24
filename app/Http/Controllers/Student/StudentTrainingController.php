<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Block;
use App\Models\TrainingResult;
use App\Models\TestResult;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\TrainingSession;
use Illuminate\Http\Request;

class StudentTrainingController extends Controller
{
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

        // 2) Find which sessions this user has completed (from training_results).
        $completedSessions = TrainingResult::where('user_id', $user->id)
            ->pluck('session_id')
            ->toArray();

        // 3) Format blocks
        $formattedBlocks = $blocks->map(function ($block) use ($completedSessions) {
            // Group sessions by week
            $sessionsByWeek = collect($block->sessions)->groupBy('week_number');

            // For each week, figure out how many training vs. testing sessions exist, then build a label
            $weeks = $sessionsByWeek->map(function ($sessions, $weekNumber) use ($block, $completedSessions) {

                // We'll separate training vs. testing sessions
                $training = $sessions->where('session_type', 'training');
                $testing  = $sessions->where('session_type', 'testing');

                // Convert each session into appropriate label format
                // For training: "TRAINING #X"
                // For testing: "TESTING" (without session number)
                $trainLabels = $training->map(fn($s) => "TRAINING #{$s->session_number}")->toArray();
                $testLabels  = $testing->map(fn($s) => "TESTING")->toArray();

                // Then we combine them into a single label string
                // e.g. "✅ TRAINING #1 & TRAINING #2, ✅ TESTING"
                $labelTrain = $trainLabels ? "✅ " . implode(" & ", $trainLabels) : '';
                $labelTest  = $testLabels  ? "✅ " . implode(" & ", $testLabels) : '';

                // If both exist in same week, separate them with comma
                $weekLabelParts = array_filter([$labelTrain, $labelTest]);
                $weekLabel      = implode(", ", $weekLabelParts);

                // If the final label is empty, set a fallback
                if (!$weekLabel) {
                    $weekLabel = "No sessions for this week (unexpected)";
                }

                // Map each session's details so the front-end can see them.
                $mappedSessions = $sessions->map(function ($session) use ($completedSessions) {
                    // For display label in frontend: don't include session number for testing sessions
                    $displayLabel = strtoupper($session->session_type) === 'TESTING'
                        ? 'TESTING'
                        : "Session {$session->session_number}";

                    return [
                        'id'             => $session->id,
                        'session_number' => $session->session_number,
                        'session_type'   => $session->session_type,
                        'is_completed'   => in_array($session->id, $completedSessions),
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
                'weeks'        => $weeks,
            ];
        });

        // Render with Inertia to your Student/StudentTraining page
        return Inertia::render('Student/StudentTraining', [
            'blocks' => $formattedBlocks,
        ]);
    }

    public function showSession($sessionId)
    {
        $user = Auth::user();
        $session = TrainingSession::with('block')->findOrFail($sessionId);

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

        return Inertia::render('Student/TrainingSession', [
            'session' => [
                'id'             => $session->id,
                'week_number'    => $session->week_number,
                'session_number' => $session->session_number,
                'session_type'   => $session->session_type,
                'block_number'   => $session->block ? $session->block->block_number : null,
                'display_label'  => strtolower($session->session_type) === 'testing'
                    ? 'TESTING'
                    : "Session {$session->session_number}",
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
                'bent_arm_hang_assessment' => $testResult->bent_arm_hang_assessment,
                'completed_at'             => $testResult->completed_at,
            ] : null,
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
                'bent_arm_hang_assessment' => 'required|numeric',
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
                    'bent_arm_hang_assessment' => $validated['bent_arm_hang_assessment'],
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

        return redirect()->route('student.training')
            ->with('success', 'Training results saved successfully!');
    }
}
