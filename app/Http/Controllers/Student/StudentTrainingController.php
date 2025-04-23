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
use Carbon\Carbon;

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
        $currentDate = Carbon::now();

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

        // 3) Format blocks with date-based unlocking logic
        $formattedBlocks = $blocks->map(function ($block) use ($completedSessions, $user, $currentDate) {
            // Group sessions by week
            $sessionsByWeek = collect($block->sessions)->groupBy('week_number');

            // For each week, figure out how many training vs. testing sessions exist, then build a label
            $weeks = $sessionsByWeek->map(function ($sessions, $weekNumber) use ($completedSessions, $currentDate) {
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
                $mappedSessions = $sessions->map(function ($session) use ($completedSessions, $currentDate) {
                    // For display label in frontend: don't include session number for testing sessions
                    $displayLabel = '';
                    if ($session->session_type === 'testing') {
                        $displayLabel = 'TESTING';
                    } elseif ($session->session_type === 'rest') {
                        $displayLabel = 'REST WEEK';
                    } else {
                        $displayLabel = "Session {$session->session_number}";
                    }

                    // Determine if this session is locked based on release date
                    $releaseDate = $session->release_date ? Carbon::parse($session->release_date) : null;
                    $isCompleted = in_array($session->id, $completedSessions);

                    // Session is locked if the release date is in the future or null (not yet set)
                    $isLocked = $releaseDate ? $currentDate->lt($releaseDate) : true;

                    // Format release date for frontend display
                    $formattedReleaseDate = $releaseDate ? $releaseDate->format('F j, Y') : 'Not scheduled';

                    return [
                        'id'             => $session->id,
                        'session_number' => $session->session_number,
                        'session_type'   => $session->session_type,
                        'is_completed'   => $isCompleted,
                        'is_locked'      => $isLocked,
                        'label'          => $displayLabel,
                        'release_date'   => $formattedReleaseDate,
                        'raw_release_date' => $session->release_date,
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
            'currentDate' => $currentDate->format('F j, Y'),
        ]);
    }

    public function showSession($sessionId)
    {
        $user = Auth::user();
        $session = TrainingSession::with('block')->findOrFail($sessionId);
        $currentDate = Carbon::now();

        // Check if this session should be accessible based on release date
        $releaseDate = $session->release_date ? Carbon::parse($session->release_date) : null;

        // If release date is in the future, redirect back with error
        if ($releaseDate && $currentDate->lt($releaseDate)) {
            return redirect()->route('student.training')
                ->with('error', 'This session is not available yet. It will be released on ' . $releaseDate->format('F j, Y') . '.');
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

        // Format release date
        $formattedReleaseDate = $releaseDate ? $releaseDate->format('F j, Y') : 'Not scheduled';

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
                'release_date'   => $formattedReleaseDate,
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
            'currentDate' => $currentDate->format('F j, Y'),
        ]);
    }

    public function saveTrainingResult(Request $request, $sessionId)
    {
        $user = Auth::user();
        $session = TrainingSession::findOrFail($sessionId);
        $currentDate = Carbon::now();

        // Check if session is available based on release date
        $releaseDate = $session->release_date ? Carbon::parse($session->release_date) : null;
        if ($releaseDate && $currentDate->lt($releaseDate)) {
            return redirect()->route('student.training')
                ->with('error', 'This session is not available yet. It will be released on ' . $releaseDate->format('F j, Y') . '.');
        }

        if (strtolower($session->session_type) === 'testing') {
            $validated = $request->validate([
                'standing_long_jump'       => 'required|numeric',
                'single_leg_jump_left'     => 'required|numeric',
                'single_leg_jump_right'    => 'required|numeric',
                'wall_sit_assessment'      => 'required|numeric',  // Make sure this matches form field
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
}
