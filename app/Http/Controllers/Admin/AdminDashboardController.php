<?php

namespace App\Http\Controllers\Admin;

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
                'wall_sit' => ['nullable', 'numeric'],
                'core_endurance' => ['nullable', 'numeric'],
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

            DB::beginTransaction();

            // Create the user
            $user = User::create([
                'username' => $validated['username'],
                'parent_email' => $validated['parent_email'],
                'password' => Hash::make($validated['password']),
                'user_role' => 'student',
            ]);

            // Create the pre-training test instead of the training result
            $preTrainingTest = PreTrainingTest::create([
                'user_id' => $user->id,
                'standing_long_jump' => $trainingResults['standing_long_jump'] ?? null,
                'single_leg_jump_left' => $trainingResults['single_leg_jump_left'] ?? null,
                'single_leg_jump_right' => $trainingResults['single_leg_jump_right'] ?? null,
                'wall_sit' => $trainingResults['wall_sit'] ?? null,
                'core_endurance' => $trainingResults['core_endurance'] ?? null,
                'bent_arm_hang' => $trainingResults['bent_arm_hang'] ?? null,
                'tested_at' => now()
            ]);

            Log::info('User created successfully:', ['user_id' => $user->id]);
            Log::info('Pre-training test created successfully:', ['test_id' => $preTrainingTest->id]);

            DB::commit();

            // Prepare response data
            $athleteData = [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->parent_email,
                'training_results' => [
                    'standing_long_jump' => $preTrainingTest->standing_long_jump,
                    'single_leg_jump_left' => $preTrainingTest->single_leg_jump_left,
                    'single_leg_jump_right' => $preTrainingTest->single_leg_jump_right,
                    'wall_sit' => $preTrainingTest->wall_sit,
                    'core_endurance' => $preTrainingTest->core_endurance,
                    'bent_arm_hang' => $preTrainingTest->bent_arm_hang,
                ]
            ];

            return redirect()->back()->with('success', 'Athlete created successfully!')->with('newAthlete', $athleteData);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error:', $e->errors());
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating athlete: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return redirect()->back()->with('error', 'Failed to create athlete: ' . $e->getMessage())->withInput();
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
            ->with('preTrainingTest')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->parent_email,
                    'training_results' => $user->preTrainingTest ? [
                        'standing_long_jump' => $user->preTrainingTest->standing_long_jump,
                        'single_leg_jump_left' => $user->preTrainingTest->single_leg_jump_left,
                        'single_leg_jump_right' => $user->preTrainingTest->single_leg_jump_right,
                        'wall_sit' => $user->preTrainingTest->wall_sit,
                        'core_endurance' => $user->preTrainingTest->core_endurance,
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
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->parent_email,
                ];
            });
    }
}
