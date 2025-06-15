<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Support\Facades\Mail;
use App\Mail\PasswordResetMail;
use Inertia\Inertia;
use App\Models\User;
use App\Models\PreTrainingTest;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules\Password;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Models\Block;
use App\Models\TrainingSession;
use Carbon\Carbon;
use App\Models\UserStat;
use App\Services\XpService;
use Illuminate\Support\Str;
use App\Models\EmailTemplate;


class AdminDashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index()
    {
        try {
            $athletes = $this->getAthletesWithTrainingResults();
        } catch (\Exception $e) {
            $athletes = $this->getBasicAthleteData();
        }

        return Inertia::render('Admin/AdminDashboard', [
            'athletes' => $athletes,
            'activePage' => 'dashboard'
        ]);
    }

    /**
     * Create a new athlete user with pre-training test results.
     */
    public function createAthlete(Request $request)
    {
        try {
            // Debug incoming request data
            Log::info('Athlete creation request data:', $request->all());

            $existingUser = User::where('parent_email', $request->input('parent_email'))->first();
            if ($existingUser) {
                return redirect()->back()->withErrors([
                    'parent_email' => 'This email is already associated with another user.'
                ])->withInput();
            }

            // Validate the request with custom error messages
            $validated = $request->validate([
                'username' => ['required', 'string', 'max:255', 'unique:users'],
                'parent_email' => ['required', 'string', 'email', 'max:255'],
                'password' => ['required', Password::defaults()],
                'standing_long_jump' => ['nullable', 'numeric'],
                'single_leg_jump_left' => ['nullable', 'numeric'],
                'single_leg_jump_right' => ['nullable', 'numeric'],
                'single_leg_wall_sit_left' => ['nullable', 'numeric'],
                'single_leg_wall_sit_right' => ['nullable', 'numeric'],
                'core_endurance_left' => ['nullable', 'numeric'],
                'core_endurance_right' => ['nullable', 'numeric'],
                'bent_arm_hang' => ['nullable', 'numeric'],
            ], [
                'parent_email.required' => 'The parent email field is required.',
                'parent_email.email' => 'The parent email must be a valid email address.',
                'username.required' => 'The athlete username field is required.',
                'username.unique' => 'This username is already taken.',
                'password.required' => 'The password field is required.',
            ]);

            $trainingResults = $request->input('training_results', []);

            Log::info('Training results data:', $trainingResults);

            // Use a database transaction with proper isolation level
            $result = DB::transaction(function () use ($validated, $trainingResults) {
                // Create the user
                $user = User::create([
                    'username' => $validated['username'],
                    'parent_email' => $validated['parent_email'],
                    'password' => Hash::make($validated['password']),
                    'user_role' => 'student',
                ]);

                // Create the pre-training test
                $preTrainingTest = PreTrainingTest::create([
                    'user_id' => $user->id,
                    'standing_long_jump' => $trainingResults['standing_long_jump'] ?? null,
                    'single_leg_jump_left' => $trainingResults['single_leg_jump_left'] ?? null,
                    'single_leg_jump_right' => $trainingResults['single_leg_jump_right'] ?? null,
                    'single_leg_wall_sit_left' => $trainingResults['single_leg_wall_sit_left'] ?? null,
                    'single_leg_wall_sit_right' => $trainingResults['single_leg_wall_sit_right'] ?? null,
                    'core_endurance_left' => $trainingResults['core_endurance_left'] ?? null,
                    'core_endurance_right' => $trainingResults['core_endurance_right'] ?? null,
                    'bent_arm_hang' => $trainingResults['bent_arm_hang'] ?? null,
                    'tested_at' => now()
                ]);

                // Create blocks with user_id to associate them with this specific user
                $now = Carbon::now();

                // Check if blocks already exist for this user (defensive programming)
                $existingBlocks = Block::where('user_id', $user->id)->count();

                if ($existingBlocks === 0) {
                    // Block 1: All 12 weeks (Training, Testing, Rest period)
                    $block1 = Block::create([
                        'block_number' => 1,
                        'start_date' => $now,
                        'end_date' => $now->copy()->addWeeks(12),
                        'user_id' => $user->id
                    ]);

                    // Block 2: Complete reset, starting after Block 1
                    $block2 = Block::create([
                        'block_number' => 2,
                        'start_date' => $now->copy()->addWeeks(12)->addDay(),
                        'end_date' => $now->copy()->addWeeks(24),
                        'user_id' => $user->id
                    ]);

                    // Block 3: Third block
                    $block3 = Block::create([
                        'block_number' => 3,
                        'start_date' => $now->copy()->addWeeks(24)->addDay(),
                        'end_date' => $now->copy()->addWeeks(36),
                        'user_id' => $user->id
                    ]);

                    Log::info('Created blocks for user_id: ' . $user->id);

                    // Create sessions for each block
                    $this->createSessionsForBlock($block1);
                    $this->createSessionsForBlock($block2);
                    $this->createSessionsForBlock($block3);

                    Log::info('Created sessions for all blocks');
                } else {
                    Log::warning('Blocks already exist for user_id: ' . $user->id);
                }

                return [
                    'user' => $user,
                    'preTrainingTest' => $preTrainingTest
                ];
            }, 5); // Set isolation level to prevent concurrent issues

            try {
                // Delete any existing tokens for this user
                DB::table('password_resets')->where('email', $result['user']->parent_email)->delete();

                // Create new token for initial password setup
                $token = Str::random(64);

                DB::table('password_resets')->insert([
                    'email' => $result['user']->parent_email,
                    'token' => Hash::make($token),
                    'created_at' => Carbon::now()
                ]);

                // Send welcome email (create this mail class next)
                Mail::to($result['user']->parent_email)->send(new \App\Mail\WelcomeMail(
                    $token,
                    $result['user']->parent_email,
                    $result['user']->username
                ));
            } catch (\Exception $e) {
                Log::warning('Failed to send welcome email: ' . $e->getMessage());
                // Don't fail the athlete creation if email fails
            }


            // Prepare response data
            $athleteData = [
                'id' => $result['user']->id,
                'username' => $result['user']->username,
                'email' => $result['user']->parent_email,
                'training_results' => [
                    'standing_long_jump' => $result['preTrainingTest']->standing_long_jump,
                    'single_leg_jump_left' => $result['preTrainingTest']->single_leg_jump_left,
                    'single_leg_jump_right' => $result['preTrainingTest']->single_leg_jump_right,
                    'single_leg_wall_sit_left' => $result['preTrainingTest']->single_leg_wall_sit_left,
                    'single_leg_wall_sit_right' => $result['preTrainingTest']->single_leg_wall_sit_right,
                    'core_endurance_left' => $result['preTrainingTest']->core_endurance_left,
                    'core_endurance_right' => $result['preTrainingTest']->core_endurance_right,
                    'bent_arm_hang' => $result['preTrainingTest']->bent_arm_hang,
                ]
            ];

            return redirect()->back()->with('success', 'Athlete created successfully! Welcome email sent to ' . $result['user']->parent_email)->with('newAthlete', $athleteData);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error:', $e->errors());
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Error creating athlete: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return redirect()->back()->with('error', 'Failed to create athlete: ' . $e->getMessage())->withInput();
        }
    }

    /**
     * Create all sessions for a single block
     * 
     * @param Block $block
     */
    private function createSessionsForBlock(Block $block): void
    {
        // Iterate through all 12 weeks
        for ($week = 1; $week <= 12; $week++) {
            $weekStartDate = Carbon::parse($block->start_date ?: now())->addWeeks($week - 1);

            // Weeks 6 and 12 are REST weeks
            if (in_array($week, [6, 12])) {
                TrainingSession::create([
                    'block_id'       => $block->id,
                    'week_number'    => $week,
                    'session_number' => 0,
                    'session_type'   => 'rest',
                    'release_date'   => $weekStartDate,
                ]);
            }
            // Week 5: Session 1 (training) + Session 2 (testing)
            elseif ($week == 5) {
                // Session 1: Training
                TrainingSession::create([
                    'block_id'       => $block->id,
                    'week_number'    => $week,
                    'session_number' => 1,
                    'session_type'   => 'training',
                    'release_date'   => $weekStartDate,
                ]);

                // Session 2: Testing
                TrainingSession::create([
                    'block_id'       => $block->id,
                    'week_number'    => $week,
                    'session_number' => 2,
                    'session_type'   => 'testing',
                    'release_date'   => $weekStartDate->copy()->addDays(1),
                ]);
            }
            // Week 11: Session 1 (training) + Session 2 (testing)
            elseif ($week == 11) {
                // Session 1: Training
                TrainingSession::create([
                    'block_id'       => $block->id,
                    'week_number'    => $week,
                    'session_number' => 1,
                    'session_type'   => 'training',
                    'release_date'   => $weekStartDate,
                ]);

                // Session 2: Testing
                TrainingSession::create([
                    'block_id'       => $block->id,
                    'week_number'    => $week,
                    'session_number' => 2,
                    'session_type'   => 'testing',
                    'release_date'   => $weekStartDate->copy()->addDays(1),
                ]);
            }
            // Regular weeks (1-4, 7-10): Session 1 and Session 2 (both training)
            else {
                // Session 1: Training
                TrainingSession::create([
                    'block_id'       => $block->id,
                    'week_number'    => $week,
                    'session_number' => 1,
                    'session_type'   => 'training',
                    'release_date'   => $weekStartDate,
                ]);

                // Session 2: Training
                TrainingSession::create([
                    'block_id'       => $block->id,
                    'week_number'    => $week,
                    'session_number' => 2,
                    'session_type'   => 'training',
                    'release_date'   => $weekStartDate->copy()->addDays(1),
                ]);
            }
        }
    }

    /**
     * Display the athletes page
     */
    public function athletes()
    {
        try {
            $athletes = $this->getAthletesWithTrainingResults();
        } catch (\Exception $e) {
            $athletes = $this->getBasicAthleteData();
        }

        return Inertia::render('Admin/AdminDashboard', [
            'athletes' => $athletes,
            'activePage' => 'athletes'
        ]);
    }

    /**
     * Display the analytics page
     */
    public function analytics()
    {
        return Inertia::render('Admin/AdminDashboard', [
            'activePage' => 'analytics'
        ]);
    }

    /**
     * Display the settings page
     */
    public function settings()
    {
        return Inertia::render('Admin/AdminDashboard', [
            'activePage' => 'settings'
        ]);
    }

    /**
     * Get athletes with their pre-training test results
     */
    private function getAthletesWithTrainingResults()
    {
        return User::where('user_role', 'student')
            ->with(['preTrainingTest', 'userStat'])
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->parent_email,
                    'strength_level' => $user->userStat ? $user->userStat->strength_level : 1,
                    'consistency_score' => $user->userStat ? round($user->userStat->consistency_score) : 0,
                    'training_results' => $user->preTrainingTest ? [
                        'standing_long_jump' => $user->preTrainingTest->standing_long_jump,
                        'single_leg_jump_left' => $user->preTrainingTest->single_leg_jump_left,
                        'single_leg_jump_right' => $user->preTrainingTest->single_leg_jump_right,
                        'single_leg_wall_sit_left' => $user->preTrainingTest->single_leg_wall_sit_left,
                        'single_leg_wall_sit_right' => $user->preTrainingTest->single_leg_wall_sit_right,
                        'core_endurance_left' => $user->preTrainingTest->core_endurance_left,
                        'core_endurance_right' => $user->preTrainingTest->core_endurance_right,
                        'bent_arm_hang' => $user->preTrainingTest->bent_arm_hang,
                    ] : null,
                ];
            });
    }



    /**
     * Get basic athlete data without training results
     */
    private function getBasicAthleteData()
    {
        return User::where('user_role', 'student')
            ->select('id', 'username', 'parent_email') // Select only needed fields
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->parent_email,
                ];
            });
    }

    /**
     * Delete an athlete
     */
    public function deleteAthlete(Request $request, $id)
    {
        try {
            DB::beginTransaction();

            // Find the user
            $user = User::findOrFail($id);

            // Delete associated pre-training test first to avoid foreign key constraint issues
            if ($user->preTrainingTest) {
                $user->preTrainingTest->delete();
            }

            // Delete the user
            $user->delete();

            DB::commit();

            return redirect()->back()->with('success', 'Athlete deleted successfully!');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Athlete not found.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting athlete: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to delete athlete.');
        }
    }

    /**
     * Get a specific athlete's data
     */
    public function getAthlete($id)
    {
        try {
            $athlete = User::with(['preTrainingTest', 'userStat'])->findOrFail($id);

            if ($athlete->user_role !== 'student') {
                return redirect()->back()->with('error', 'User is not an athlete.');
            }

            // Get progress data
            $xpService = app(XpService::class);
            $xpSummary = $xpService->getUserXpSummary($athlete->id);

            // Get test results and progress data
            $blocks = Block::where('user_id', $athlete->id)->orderBy('block_number')->get();
            $testResults = \App\Models\TestResult::where('user_id', $athlete->id)->get();
            $preTrainingTest = \App\Models\PreTrainingTest::where('user_id', $athlete->id)->first();
            $testSessions = \App\Models\TrainingSession::where('session_type', 'testing')
                ->whereIn('block_id', $blocks->pluck('id'))
                ->with('block')
                ->get();

            // Define test types
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
                'single_leg_wall_sit_left' => [
                    'name' => 'Single Leg Wall Sit (LEFT)',
                    'pre_training_field' => 'single_leg_wall_sit_left'
                ],
                'single_leg_wall_sit_right' => [
                    'name' => 'Single Leg Wall Sit (RIGHT)',
                    'pre_training_field' => 'single_leg_wall_sit_right'
                ],
                'core_endurance_left' => [
                    'name' => 'Core Endurance (LEFT)',
                    'pre_training_field' => 'core_endurance_left'
                ],
                'core_endurance_right' => [
                    'name' => 'Core Endurance (RIGHT)',
                    'pre_training_field' => 'core_endurance_right'
                ],
                'bent_arm_hang_assessment' => [
                    'name' => 'Bent Arm Hold',
                    'pre_training_field' => 'bent_arm_hang'
                ]
            ];

            $progressData = [];
            foreach ($testTypes as $testKey => $testInfo) {
                $sessionData = [];
                $values = [];
                $hasAnyData = false;

                // Add pre-training test data as the first point if available
                if ($preTrainingTest && isset($preTrainingTest->{$testInfo['pre_training_field']})) {
                    $preTrainingValue = (float) $preTrainingTest->{$testInfo['pre_training_field']};

                    if ($preTrainingValue > 0) {
                        $sessionData[] = [
                            'label' => 'PRE-TRAINING',
                            'date' => $preTrainingTest->tested_at ? Carbon::parse($preTrainingTest->tested_at)->format('Y-m-d') : Carbon::now()->subMonths(3)->format('Y-m-d'),
                            'value' => $preTrainingValue
                        ];
                        $values[] = $preTrainingValue;
                        $hasAnyData = true;
                    }
                }

                // Add test session results
                foreach ($testSessions as $session) {
                    $result = $testResults->where('session_id', $session->id)->first();

                    if ($result && isset($result->$testKey) && $result->$testKey > 0) {
                        $blockNumber = $session->block ? $session->block->block_number : '?';
                        $label = "Block {$blockNumber} - Week {$session->week_number}";

                        $sessionDate = $result->completed_at
                            ? Carbon::parse($result->completed_at)->format('Y-m-d')
                            : ($session->release_date
                                ? Carbon::parse($session->release_date)->format('Y-m-d')
                                : Carbon::now()->format('Y-m-d'));

                        $sessionData[] = [
                            'label' => $label,
                            'date' => $sessionDate,
                            'value' => (float) $result->$testKey
                        ];

                        $values[] = (float) $result->$testKey;
                        $hasAnyData = true;
                    }
                }

                // Calculate percentage increase
                $percentageIncrease = null;
                if (count($values) >= 2) {
                    $first = $values[0];
                    $last = end($values);

                    if ($first > 0) {
                        $percentageIncrease = round((($last - $first) / $first) * 100, 1);
                    }
                }

                // Only add tests with data
                if ($hasAnyData) {
                    $progressData[$testKey] = [
                        'name' => $testInfo['name'],
                        'sessions' => $sessionData,
                        'percentageIncrease' => $percentageIncrease
                    ];
                }
            }

            $athleteData = [
                'id' => $athlete->id,
                'username' => $athlete->username,
                'email' => $athlete->parent_email,
                'created_at' => $athlete->created_at,
                'strength_level' => $athlete->userStat ? $athlete->userStat->strength_level : 1,
                'consistency_score' => $athlete->userStat ? round($athlete->userStat->consistency_score) : 0,
                'training_results' => $athlete->preTrainingTest ? [
                    'standing_long_jump' => $athlete->preTrainingTest->standing_long_jump,
                    'single_leg_jump_left' => $athlete->preTrainingTest->single_leg_jump_left,
                    'single_leg_jump_right' => $athlete->preTrainingTest->single_leg_jump_right,
                    'single_leg_wall_sit_left' => $athlete->preTrainingTest->single_leg_wall_sit_left,
                    'single_leg_wall_sit_right' => $athlete->preTrainingTest->single_leg_wall_sit_right,
                    'core_endurance_left' => $athlete->preTrainingTest->core_endurance_left,
                    'core_endurance_right' => $athlete->preTrainingTest->core_endurance_right,
                    'bent_arm_hang' => $athlete->preTrainingTest->bent_arm_hang,
                ] : null,
            ];

            return Inertia::render('Admin/AthleteDetail', [
                'athlete' => $athleteData,
                'activePage' => 'dashboard',
                'progressData' => $progressData,
                'xpInfo' => [
                    'total_xp' => $xpSummary['total_xp'],
                    'current_level' => $xpSummary['current_level'],
                    'next_level' => $xpSummary['next_level']
                ]
            ]);
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->with('error', 'Athlete not found.');
        }
    }


    /**
     * Update an athlete's information
     */
    public function updateAthlete(Request $request, $id)
    {
        try {
            // Validate the request
            $validated = $request->validate([
                'username' => ['required', 'string', 'max:255'],
                'parent_email' => ['required', 'string', 'email', 'max:255'],
                'password' => ['nullable', Password::defaults()],
                'training_results.standing_long_jump' => ['nullable', 'numeric'],
                'training_results.single_leg_jump_left' => ['nullable', 'numeric'],
                'training_results.single_leg_jump_right' => ['nullable', 'numeric'],
                'training_results.single_leg_wall_sit_left' => ['nullable', 'numeric'],
                'training_results.single_leg_wall_sit_right' => ['nullable', 'numeric'],
                'training_results.core_endurance_left' => ['nullable', 'numeric'],
                'training_results.core_endurance_right' => ['nullable', 'numeric'],
                'training_results.bent_arm_hang' => ['nullable', 'numeric'],
            ]);

            DB::beginTransaction();

            // Find the user
            $user = User::findOrFail($id);

            // Check if another user already has this username (excluding the current user)
            $existingUsername = User::where('username', $validated['username'])
                ->where('id', '!=', $id)
                ->first();
            if ($existingUsername) {
                return redirect()->back()->withErrors(['username' => 'This username is already taken.']);
            }

            // Check if another user already has this parent email (excluding the current user)
            $existingEmail = User::where('parent_email', $validated['parent_email'])
                ->where('id', '!=', $id)
                ->first();
            if ($existingEmail) {
                return redirect()->back()->withErrors(['parent_email' => 'This email is already associated with another user.']);
            }

            // Update the user
            $user->username = $validated['username'];
            $user->parent_email = $validated['parent_email'];

            // Update password if provided
            if (!empty($validated['password'])) {
                $user->password = Hash::make($validated['password']);
            }

            $user->save();

            // Update or create pre-training test results
            $preTrainingTest = PreTrainingTest::firstOrNew(['user_id' => $user->id]);
            $preTrainingTest->standing_long_jump = $request->input('training_results.standing_long_jump');
            $preTrainingTest->single_leg_jump_left = $request->input('training_results.single_leg_jump_left');
            $preTrainingTest->single_leg_jump_right = $request->input('training_results.single_leg_jump_right');
            $preTrainingTest->single_leg_wall_sit_left = $request->input('training_results.single_leg_wall_sit_left');
            $preTrainingTest->single_leg_wall_sit_right = $request->input('training_results.single_leg_wall_sit_right');
            $preTrainingTest->core_endurance_left = $request->input('training_results.core_endurance_left');
            $preTrainingTest->core_endurance_right = $request->input('training_results.core_endurance_right');
            $preTrainingTest->bent_arm_hang = $request->input('training_results.bent_arm_hang');

            // If test is new, set tested_at
            if (!$preTrainingTest->exists) {
                $preTrainingTest->tested_at = now();
            }

            $preTrainingTest->save();

            DB::commit();

            return redirect()->back()->with('success', 'Athlete updated successfully!');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Athlete not found.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating athlete: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to update athlete: ' . $e->getMessage());
        }
    }

    /**
     * View athlete dashboard as admin by redirecting to student dashboard
     */
    public function viewAthleteDashboard($id)
    {
        try {
            // Use eager loading to get the athlete with a single query
            $athlete = User::with('preTrainingTest')->findOrFail($id);

            if ($athlete->user_role !== 'student') {
                return redirect()->back()->with('error', 'User is not an athlete.');
            }

            // Load ONLY blocks for this specific athlete
            $blocks = Block::where('user_id', $athlete->id)->orderBy('block_number')->get();

            // Get XP information
            $xpService = app(XpService::class);
            $xpSummary = $xpService->getUserXpSummary($athlete->id);

            // Get user stats - use eloquent with to avoid multiple queries
            $userStat = UserStat::where('user_id', $athlete->id)->first();
            $strengthLevel = $userStat ? $userStat->strength_level : 1;
            $consistencyScore = $userStat ? round($userStat->consistency_score) : 0;

            // Store admin ID in session
            session(['admin_viewing_as_student' => Auth::id()]);
            session(['viewing_student_id' => $athlete->id]);

            $testResults = \App\Models\TestResult::where('user_id', $athlete->id)->get();
            $preTrainingTest = \App\Models\PreTrainingTest::where('user_id', $athlete->id)->first();
            $testSessions = \App\Models\TrainingSession::where('session_type', 'testing')
                ->whereIn('block_id', $blocks->pluck('id')) // Also filter test sessions to only those belonging to this athlete's blocks
                ->with('block')
                ->get();

            // Define all test types
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
                'single_leg_wall_sit_left' => [
                    'name' => 'Single Leg Wall Sit (LEFT)',
                    'pre_training_field' => 'single_leg_wall_sit_left'
                ],
                'single_leg_wall_sit_right' => [
                    'name' => 'Single Leg Wall Sit (RIGHT)',
                    'pre_training_field' => 'single_leg_wall_sit_right'
                ],
                'core_endurance_left' => [
                    'name' => 'Core Endurance (LEFT)',
                    'pre_training_field' => 'core_endurance_left'
                ],
                'core_endurance_right' => [
                    'name' => 'Core Endurance (RIGHT)',
                    'pre_training_field' => 'core_endurance_right'
                ],
                'bent_arm_hang_assessment' => [
                    'name' => 'Bent Arm Hold',
                    'pre_training_field' => 'bent_arm_hang'
                ]
            ];

            $progressData = [];
            foreach ($testTypes as $testKey => $testInfo) {
                $sessionData = [];
                $values = [];
                $hasAnyData = false;

                // Add pre-training test data as the first point if available
                if ($preTrainingTest && isset($preTrainingTest->{$testInfo['pre_training_field']})) {
                    $preTrainingValue = (float) $preTrainingTest->{$testInfo['pre_training_field']};

                    if ($preTrainingValue > 0) {
                        $sessionData[] = [
                            'label' => 'PRE-TRAINING',
                            'date' => $preTrainingTest->tested_at ? Carbon::parse($preTrainingTest->tested_at)->format('Y-m-d') : Carbon::now()->subMonths(3)->format('Y-m-d'),
                            'value' => $preTrainingValue
                        ];
                        $values[] = $preTrainingValue;
                        $hasAnyData = true;
                    }
                }

                // Add test session results
                foreach ($testSessions as $session) {
                    $result = $testResults->where('session_id', $session->id)->first();

                    if ($result && isset($result->$testKey) && $result->$testKey > 0) {
                        $blockNumber = $session->block ? $session->block->block_number : '?';
                        $label = "Block {$blockNumber} - Week {$session->week_number}";

                        $sessionDate = $result->completed_at
                            ? Carbon::parse($result->completed_at)->format('Y-m-d')
                            : ($session->release_date
                                ? Carbon::parse($session->release_date)->format('Y-m-d')
                                : Carbon::now()->format('Y-m-d'));

                        $sessionData[] = [
                            'label' => $label,
                            'date' => $sessionDate,
                            'value' => (float) $result->$testKey
                        ];

                        $values[] = (float) $result->$testKey;
                        $hasAnyData = true;
                    }
                }

                // Calculate percentage increase
                $percentageIncrease = null;
                if (count($values) >= 2) {
                    $first = $values[0];
                    $last = end($values);

                    if ($first > 0) {
                        $percentageIncrease = round((($last - $first) / $first) * 100, 1);
                    }
                }

                // Only add tests with data
                if ($hasAnyData) {
                    $progressData[$testKey] = [
                        'name' => $testInfo['name'],
                        'sessions' => $sessionData,
                        'percentageIncrease' => $percentageIncrease
                    ];
                }
            }

            // Render the admin view of student dashboard
            return Inertia::render('Admin/ViewAthleteDashboard', [
                'athlete' => [
                    'id' => $athlete->id,
                    'username' => $athlete->username,
                    'email' => $athlete->parent_email,
                ],
                'blocks' => $blocks->map(function ($block) {
                    return [
                        'id' => $block->id,
                        'block_number' => $block->block_number,
                        'start_date' => $block->start_date ? Carbon::parse($block->start_date)->format('Y-m-d') : null,
                        'end_date' => $block->end_date ? Carbon::parse($block->end_date)->format('Y-m-d') : null,
                        'duration_weeks' => 12,
                    ];
                }),
                'strengthLevel' => $strengthLevel,
                'consistencyScore' => $consistencyScore,
                'xpInfo' => [
                    'total_xp' => $xpSummary['total_xp'],
                    'current_level' => $xpSummary['current_level'],
                    'next_level' => $xpSummary['next_level']
                ],
                'progressData' => $progressData, // Add the progress data here
                'routes' => [
                    'admin.update.block.dates' => route('admin.update.block.dates')
                ]
            ]);
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->with('error', 'Athlete not found.');
        }
    }

    public function updateBlockDates(Request $request)
    {
        try {
            $validated = $request->validate([
                'athlete_id' => 'required|exists:users,id',
                'blocks' => 'required|array',
                'blocks.*.id' => 'required|exists:blocks,id',
                'blocks.*.start_date' => 'required|date',
                'blocks.*.end_date' => 'required|date|after:blocks.*.start_date',
            ]);

            $athleteId = $validated['athlete_id'];
            $athlete = User::select('id', 'username')->findOrFail($athleteId);

            DB::beginTransaction();

            // Log received data for debugging
            \Log::info('Updating block dates', [
                'athlete_id' => $athleteId,
                'blocks' => $validated['blocks']
            ]);

            // Group blocks by ID for faster lookup
            $blockUpdates = collect($validated['blocks'])->keyBy('id');

            // Get all block IDs that need to be updated
            $blockIds = $blockUpdates->keys()->toArray();

            // Fetch all blocks that need to be updated in a single query
            $blocks = Block::whereIn('id', $blockIds)->get();

            // Update each block
            foreach ($blocks as $block) {
                $blockData = $blockUpdates[$block->id];
                $block->start_date = $blockData['start_date'];
                $block->end_date = $blockData['end_date'];
                $block->save();

                \Log::info('Updated block', [
                    'block_id' => $block->id,
                    'start_date' => $block->start_date,
                    'end_date' => $block->end_date
                ]);

                // Recalculate all session release dates based on new block start date
                $this->recalculateSessionDates($block);
            }

            DB::commit();

            return redirect()->back()->with('success', 'Block dates updated successfully for ' . $athlete->username);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Failed to update block dates: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()->with('error', 'Failed to update block dates: ' . $e->getMessage());
        }
    }

    private function recalculateSessionDates(Block $block)
    {
        $startDate = Carbon::parse($block->start_date);

        // Group sessions by week and retrieve them all at once
        $sessions = TrainingSession::where('block_id', $block->id)
            ->orderBy('week_number')
            ->orderBy('session_number')
            ->get()
            ->groupBy('week_number');

        // Prepare bulk update data
        $sessionUpdates = [];

        foreach ($sessions as $weekNumber => $weekSessions) {
            // Calculate new week start date: block start date + (week_number - 1) weeks
            $weekStartDate = $startDate->copy()->addWeeks($weekNumber - 1);

            // Update each session in the week
            foreach ($weekSessions as $index => $session) {
                // Space sessions within the week (every 2 days)
                $sessionDate = $weekStartDate->copy()->addDays($index * 2);

                // Instead of saving one by one, collect updates for bulk operation
                $sessionUpdates[] = [
                    'id' => $session->id,
                    'release_date' => $sessionDate->format('Y-m-d')
                ];
            }
        }

        // Perform bulk updates in a single transaction
        if (!empty($sessionUpdates)) {
            DB::beginTransaction();

            try {
                foreach ($sessionUpdates as $update) {
                    TrainingSession::where('id', $update['id'])
                        ->update(['release_date' => $update['release_date']]);
                }

                DB::commit();
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        }
    }

    public function sendPasswordReset($id)
    {
        try {
            $athlete = User::findOrFail($id);

            if ($athlete->user_role !== 'student') {
                return redirect()->back()->with('error', 'User is not an athlete.');
            }

            // Delete any existing tokens for this user
            DB::table('password_resets')->where('email', $athlete->parent_email)->delete();

            // Create new token
            $token = Str::random(64);

            DB::table('password_resets')->insert([
                'email' => $athlete->parent_email,
                'token' => Hash::make($token),
                'created_at' => Carbon::now()
            ]);

            // Send the password reset email
            Mail::to($athlete->parent_email)->send(new PasswordResetMail($token, $athlete->parent_email));

            return redirect()->back()->with('success', 'Password reset link sent successfully to ' . $athlete->parent_email);
        } catch (\Exception $e) {
            Log::error('Error sending password reset: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to send password reset email.');
        }
    }

    public function emailTemplates()
    {
        $templates = EmailTemplate::all();

        return Inertia::render('Admin/EmailTemplates', [
            'templates' => $templates,
            'activePage' => 'email-templates'
        ]);
    }

    public function updateEmailTemplate(Request $request, $name)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $template = EmailTemplate::where('name', $name)->firstOrFail();
        $template->update($validated);

        return redirect()->back()->with('success', 'Email template updated successfully!');
    }

    /**
     * Show athlete summary for PDF generation
     */
    public function showAthleteSummary($id)
    {
        try {
            $athlete = User::with(['preTrainingTest', 'userStat'])->findOrFail($id);

            if ($athlete->user_role !== 'student') {
                return redirect()->back()->with('error', 'User is not an athlete.');
            }

            // Get XP information
            $xpService = app(XpService::class);
            $xpSummary = $xpService->getUserXpSummary($athlete->id);

            // Get user stats
            $userStat = UserStat::where('user_id', $athlete->id)->first();
            $strengthLevel = $userStat ? $userStat->strength_level : 1;
            $consistencyScore = $userStat ? round($userStat->consistency_score) : 0;

            // Get progress data (same logic as getAthlete method)
            $blocks = Block::where('user_id', $athlete->id)->orderBy('block_number')->get();
            $testResults = \App\Models\TestResult::where('user_id', $athlete->id)->get();
            $preTrainingTest = \App\Models\PreTrainingTest::where('user_id', $athlete->id)->first();
            $testSessions = \App\Models\TrainingSession::where('session_type', 'testing')
                ->whereIn('block_id', $blocks->pluck('id'))
                ->with('block')
                ->get();

            // Define test types
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
                'single_leg_wall_sit_left' => [
                    'name' => 'Single Leg Wall Sit (LEFT)',
                    'pre_training_field' => 'single_leg_wall_sit_left'
                ],
                'single_leg_wall_sit_right' => [
                    'name' => 'Single Leg Wall Sit (RIGHT)',
                    'pre_training_field' => 'single_leg_wall_sit_right'
                ],
                'core_endurance_left' => [
                    'name' => 'Core Endurance (LEFT)',
                    'pre_training_field' => 'core_endurance_left'
                ],
                'core_endurance_right' => [
                    'name' => 'Core Endurance (RIGHT)',
                    'pre_training_field' => 'core_endurance_right'
                ],
                'bent_arm_hang_assessment' => [
                    'name' => 'Bent Arm Hold',
                    'pre_training_field' => 'bent_arm_hang'
                ]
            ];

            $progressData = [];
            foreach ($testTypes as $testKey => $testInfo) {
                $sessionData = [];
                $values = [];
                $hasAnyData = false;

                // Add pre-training test data
                if ($preTrainingTest && isset($preTrainingTest->{$testInfo['pre_training_field']})) {
                    $preTrainingValue = (float) $preTrainingTest->{$testInfo['pre_training_field']};

                    if ($preTrainingValue > 0) {
                        $sessionData[] = [
                            'label' => 'PRE-TRAINING',
                            'date' => $preTrainingTest->tested_at ? Carbon::parse($preTrainingTest->tested_at)->format('Y-m-d') : Carbon::now()->subMonths(3)->format('Y-m-d'),
                            'value' => $preTrainingValue
                        ];
                        $values[] = $preTrainingValue;
                        $hasAnyData = true;
                    }
                }

                // Add test session results
                foreach ($testSessions as $session) {
                    $result = $testResults->where('session_id', $session->id)->first();

                    if ($result && isset($result->$testKey) && $result->$testKey > 0) {
                        $blockNumber = $session->block ? $session->block->block_number : '?';
                        $label = "Block {$blockNumber} - Week {$session->week_number}";

                        $sessionDate = $result->completed_at
                            ? Carbon::parse($result->completed_at)->format('Y-m-d')
                            : ($session->release_date
                                ? Carbon::parse($session->release_date)->format('Y-m-d')
                                : Carbon::now()->format('Y-m-d'));

                        $sessionData[] = [
                            'label' => $label,
                            'date' => $sessionDate,
                            'value' => (float) $result->$testKey
                        ];

                        $values[] = (float) $result->$testKey;
                        $hasAnyData = true;
                    }
                }

                // Calculate percentage increase
                $percentageIncrease = null;
                if (count($values) >= 2) {
                    $first = $values[0];
                    $last = end($values);

                    if ($first > 0) {
                        $percentageIncrease = round((($last - $first) / $first) * 100, 1);
                    }
                }

                // Only add tests with data
                if ($hasAnyData) {
                    $progressData[$testKey] = [
                        'name' => $testInfo['name'],
                        'sessions' => $sessionData,
                        'percentageIncrease' => $percentageIncrease
                    ];
                }
            }

            $athleteData = [
                'id' => $athlete->id,
                'username' => $athlete->username,
                'email' => $athlete->parent_email,
                'created_at' => $athlete->created_at,
                'strength_level' => $strengthLevel,
                'consistency_score' => $consistencyScore,
                'training_results' => $athlete->preTrainingTest ? [
                    'standing_long_jump' => $athlete->preTrainingTest->standing_long_jump,
                    'single_leg_jump_left' => $athlete->preTrainingTest->single_leg_jump_left,
                    'single_leg_jump_right' => $athlete->preTrainingTest->single_leg_jump_right,
                    'single_leg_wall_sit_left' => $athlete->preTrainingTest->single_leg_wall_sit_left,
                    'single_leg_wall_sit_right' => $athlete->preTrainingTest->single_leg_wall_sit_right,
                    'core_endurance_left' => $athlete->preTrainingTest->core_endurance_left,
                    'core_endurance_right' => $athlete->preTrainingTest->core_endurance_right,
                    'bent_arm_hang' => $athlete->preTrainingTest->bent_arm_hang,
                ] : null,
            ];

            return Inertia::render('Admin/AthleteSummary', [
                'athlete' => $athleteData,
                'progressData' => $progressData,
                'xpInfo' => [
                    'total_xp' => $xpSummary['total_xp'],
                    'current_level' => $xpSummary['current_level'],
                    'next_level' => $xpSummary['next_level']
                ]
            ]);
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->with('error', 'Athlete not found.');
        }
    }
}
