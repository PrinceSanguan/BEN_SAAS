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
use Illuminate\Support\Facades\DB;

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
    // In app/Http/Controllers/Student/StudentTrainingController.php
    // Update the index method with proper eager loading

    public function index()
    {
        $user = Auth::user();
        $currentDate = Carbon::now();

        $blocks = Block::with(['sessions' => function ($query) {
            $query->orderBy('week_number')->orderBy('session_number');
        }, 'sessions.block'])
            ->where('user_id', $user->id)
            ->orderBy('block_number')
            ->get();

        $completedTrainingResults = TrainingResult::where('user_id', $user->id)
            ->pluck('session_id')
            ->toArray();

        $completedTestResults = TestResult::where('user_id', $user->id)
            ->pluck('session_id')
            ->toArray();

        $completedSessions = array_merge($completedTrainingResults, $completedTestResults);

        $formattedBlocks = $blocks->map(function ($block) use ($completedSessions, $user, $currentDate) {
            $sessionsByWeek = collect($block->sessions)->groupBy('week_number');

            $weeks = $sessionsByWeek->map(function ($sessions, $weekNumber) use ($completedSessions, $currentDate) {
                // Check if this is a rest week (weeks 6 and 12)
                $isRestWeek = in_array($weekNumber, [6, 12]);

                if ($isRestWeek) {
                    $restSessions = $sessions->where('session_type', 'rest');
                    $weekLabel = "Week {$weekNumber}: ✅ REST WEEK";

                    $mappedSessions = $sessions->map(function ($session) use ($completedSessions, $currentDate) {
                        $displayLabel = '';
                        if ($session->session_type === 'testing') {
                            $displayLabel = 'TESTING';
                        } elseif ($session->session_type === 'rest') {
                            $displayLabel = 'REST WEEK';
                        } else {
                            $displayLabel = "Session {$session->session_number}";
                        }

                        $releaseDate = $session->release_date ? Carbon::parse($session->release_date) : null;
                        $isCompleted = in_array($session->id, $completedSessions);
                        $isLocked = $releaseDate ? $currentDate->lt($releaseDate) : true;
                        $formattedReleaseDate = $releaseDate ? $releaseDate->format('F j, Y') : 'Not scheduled';

                        return [
                            'id' => $session->id,
                            'session_number' => $session->session_number,
                            'session_type' => $session->session_type,
                            'is_completed' => $isCompleted,
                            'is_locked' => $isLocked,
                            'label' => $displayLabel,
                            'release_date' => $formattedReleaseDate,
                            'raw_release_date' => $session->release_date,
                        ];
                    })->values();
                } else {
                    $training = $sessions->where('session_type', 'training');
                    $testing = $sessions->where('session_type', 'testing');

                    $weekLabel = "Week {$weekNumber}";

                    $mappedSessions = $sessions->map(function ($session) use ($completedSessions, $currentDate) {
                        // Same mapping logic as above
                        $displayLabel = '';
                        if ($session->session_type === 'testing') {
                            $displayLabel = 'TESTING';
                        } elseif ($session->session_type === 'rest') {
                            $displayLabel = 'REST WEEK';
                        } else {
                            $displayLabel = "Session {$session->session_number}";
                        }

                        $releaseDate = $session->release_date ? Carbon::parse($session->release_date) : null;
                        $isCompleted = in_array($session->id, $completedSessions);
                        $isLocked = $releaseDate ? $currentDate->lt($releaseDate) : true;
                        $formattedReleaseDate = $releaseDate ? $releaseDate->format('F j, Y') : 'Not scheduled';

                        return [
                            'id' => $session->id,
                            'session_number' => $session->session_number,
                            'session_type' => $session->session_type,
                            'is_completed' => $isCompleted,
                            'is_locked' => $isLocked,
                            'label' => $displayLabel,
                            'release_date' => $formattedReleaseDate,
                            'raw_release_date' => $session->release_date,
                        ];
                    })->values();
                }

                return [
                    'week_number' => $weekNumber,
                    'label' => $weekLabel,
                    'sessions' => $mappedSessions,
                ];
            })->sortBy('week_number')->values();

            return [
                'id' => $block->id,
                'block_number' => $block->block_number,
                'block_label' => "Block {$block->block_number}",
                'weeks' => $weeks,
            ];
        });

        $xpSummary = $this->xpService->getUserXpSummary($user->id);

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
                'single_leg_wall_sit_left' => $testResult->single_leg_wall_sit_left,
                'single_leg_wall_sit_right' => $testResult->single_leg_wall_sit_right,
                'core_endurance_left'      => $testResult->core_endurance_left,
                'core_endurance_right'     => $testResult->core_endurance_right,
                'bent_arm_hang_assessment' => $testResult->bent_arm_hang_assessment,
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

        DB::beginTransaction();

        try {

            // Check if session is available based on release date
            $releaseDate = $session->release_date ? Carbon::parse($session->release_date) : null;
            if ($releaseDate && $currentDate->lt($releaseDate)) {
                return redirect()->route('student.training')
                    ->with('error', 'This session is not available yet. It will be released on ' . $releaseDate->format('F j, Y') . '.');
            }

            if (strtolower($session->session_type) === 'testing') {
                $validated = $request->validate([
                    'standing_long_jump'       => 'required|numeric|min:0',
                    'single_leg_jump_left'     => 'required|numeric|min:0',
                    'single_leg_jump_right'    => 'required|numeric|min:0',
                    'single_leg_wall_sit_left' => 'required|numeric|min:0',
                    'single_leg_wall_sit_right' => 'required|numeric|min:0',
                    'core_endurance_left'      => 'required|numeric|min:0',
                    'core_endurance_right'     => 'required|numeric|min:0',
                    'bent_arm_hang_assessment' => 'nullable|numeric|min:0',
                ], [
                    '*.numeric' => 'Please enter numbers only. For time, use seconds (e.g., 96 instead of 1m36s)',
                    '*.required' => 'This field is required. Enter 0 if you couldn\'t complete the test',
                    '*.min' => 'Please enter a positive number or 0',
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
                        'single_leg_wall_sit_left' => $validated['single_leg_wall_sit_left'], // Changed
                        'single_leg_wall_sit_right' => $validated['single_leg_wall_sit_right'], // Changed
                        'core_endurance_left'      => $validated['core_endurance_left'],
                        'core_endurance_right'     => $validated['core_endurance_right'],
                        'bent_arm_hang_assessment' => $validated['bent_arm_hang_assessment'] ?? null,
                        'completed_at'             => now(),
                    ]
                );

                // Commit the transaction for both training and testing
                DB::commit();

                // Calculate XP after successful save
                $xpEarned = $this->xpService->calculateSessionXp($user->id, $sessionId);
                $this->userStatService->updateUserStats($user->id);

                // Log successful test submission
                \App\Services\DatabaseLoggerService::logTrainingSubmission('info', 'Test results saved successfully', [
                    'user_id' => $user->id,
                    'username' => $user->username,
                    'session_id' => $sessionId,
                    'block_number' => $session->block ? $session->block->block_number : 'unknown',
                    'week_number' => $session->week_number,
                    'xp_earned' => $xpEarned,
                    'timestamp' => now()->toISOString()
                ]);

                // Update progress tracking for charts
                $progressService = app(\App\Services\ProgressTrackingService::class);
                $progressService->updateProgressFromTestResult($user->id, $sessionId, $validated);

                // Return without additional commit since we already committed for test results
                return redirect()->back()
                    ->with('success', "Test results saved successfully! You earned {$xpEarned} XP.");
            } else {
                $validated = $request->validate([
                    'warmup_completed'               => 'required|in:YES,NO',
                    'plyometrics_score'              => 'required|string',
                    'power_score'                    => 'required|string',
                    'lower_body_strength_score'      => 'required|string',
                    'upper_body_core_strength_score' => 'required|string',
                ]);

                // Log the submission attempt
                \App\Services\DatabaseLoggerService::logTrainingSubmission('info', 'Training score submission', [
                    'user_id' => $user->id,
                    'username' => $user->username,
                    'session_id' => $sessionId,
                    'session_type' => $session->session_type,
                    'block_number' => $session->block ? $session->block->block_number : 'unknown',
                    'week_number' => $session->week_number,
                    'submitted_data' => $validated,
                    'timestamp' => now()->toISOString()
                ]);

                $result = TrainingResult::updateOrCreate(
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

                // Verify the data was saved correctly with enhanced checks
                $savedResult = TrainingResult::where('user_id', $user->id)
                    ->where('session_id', $sessionId)
                    ->first();

                \App\Services\DatabaseLoggerService::logTrainingSubmission('info', 'Training score save result', [
                    'user_id' => $user->id,
                    'username' => $user->username,
                    'session_id' => $sessionId,
                    'operation' => $result->wasRecentlyCreated ? 'created' : 'updated',
                    'raw_input' => $request->all(),
                    'validated_data' => $validated,
                    'saved_data' => $savedResult ? $savedResult->only([
                        'plyometrics_score',
                        'power_score',
                        'lower_body_strength_score',
                        'upper_body_core_strength_score',
                        'warmup_completed'
                    ]) : null,
                    'database_id' => $savedResult ? $savedResult->id : null,
                    'timestamp' => now()->toISOString(),
                ]);

                // Enhanced verification with more specific checks
                $verificationFailed = false;
                $verificationErrors = [];

                if (!$savedResult) {
                    $verificationFailed = true;
                    $verificationErrors[] = 'No result found after save';
                } else {
                    // Check each field individually for better debugging
                    foreach (['plyometrics_score', 'lower_body_strength_score', 'upper_body_core_strength_score', 'power_score'] as $field) {
                        if ($savedResult->$field !== $validated[$field]) {
                            $verificationFailed = true;
                            $verificationErrors[] = "Field {$field}: expected '{$validated[$field]}', got '{$savedResult->$field}'";
                        }
                    }
                }

                if ($verificationFailed) {
                    \App\Services\DatabaseLoggerService::logTrainingSubmission('error', 'Data persistence verification failed', [
                        'user_id' => $user->id,
                        'username' => $user->username,
                        'session_id' => $sessionId,
                        'errors' => $verificationErrors,
                        'expected' => $validated,
                        'actual' => $savedResult ? $savedResult->only([
                            'plyometrics_score',
                            'power_score',
                            'lower_body_strength_score',
                            'upper_body_core_strength_score'
                        ]) : null,
                        'db_connection' => DB::connection()->getName(),
                        'timestamp' => now()->toISOString()
                    ]);

                    throw new \Exception('Data verification failed: ' . implode(', ', $verificationErrors));
                }
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

            DB::commit();

            return redirect()->back()
                ->with('success', $successMessage);
        } catch (\Exception $e) {
            DB::rollBack();

            \App\Services\DatabaseLoggerService::logTrainingSubmission('error', 'Training score save transaction failed', [
                'user_id' => $user->id,
                'username' => $user->username,
                'session_id' => $sessionId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'timestamp' => now()->toISOString()
            ]);

            return redirect()->back()
                ->with('error', 'Failed to save training results. Please try again.')
                ->withInput();
        }
    }
}
