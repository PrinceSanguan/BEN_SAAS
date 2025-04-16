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
use Illuminate\Support\Facades\Auth;

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
                'single_leg_wall_sit_left' => $trainingResults['single_leg_wall_sit_left'] ?? null,
                'single_leg_wall_sit_right' => $trainingResults['single_leg_wall_sit_right'] ?? null,
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
                    'single_leg_wall_sit_left' => $preTrainingTest->single_leg_wall_sit_left,
                    'single_leg_wall_sit_right' => $preTrainingTest->single_leg_wall_sit_right,
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
                        'single_leg_wall_sit_left' => $user->preTrainingTest->single_leg_wall_sit_left,
                        'single_leg_wall_sit_right' => $user->preTrainingTest->single_leg_wall_sit_right,
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
            $athlete = User::with('preTrainingTest')->findOrFail($id);

            if ($athlete->user_role !== 'student') {
                return redirect()->back()->with('error', 'User is not an athlete.');
            }

            $athleteData = [
                'id' => $athlete->id,
                'username' => $athlete->username,
                'email' => $athlete->parent_email,
                'created_at' => $athlete->created_at,
                'training_results' => $athlete->preTrainingTest ? [
                    'standing_long_jump' => $athlete->preTrainingTest->standing_long_jump,
                    'single_leg_jump_left' => $athlete->preTrainingTest->single_leg_jump_left,
                    'single_leg_jump_right' => $athlete->preTrainingTest->single_leg_jump_right,
                    'single_leg_wall_sit_left' => $athlete->preTrainingTest->single_leg_wall_sit_left,
                    'single_leg_wall_sit_right' => $athlete->preTrainingTest->single_leg_wall_sit_right,
                    'core_endurance' => $athlete->preTrainingTest->core_endurance,
                    'bent_arm_hang' => $athlete->preTrainingTest->bent_arm_hang,
                ] : null,
            ];

            return Inertia::render('Admin/AthleteDetail', [
                'athlete' => $athleteData,
                'activePage' => 'dashboard'
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
                'standing_long_jump' => ['nullable', 'numeric'],
                'single_leg_jump_left' => ['nullable', 'numeric'],
                'single_leg_jump_right' => ['nullable', 'numeric'],
                'single_leg_wall_sit_left' => ['nullable', 'numeric'],
                'single_leg_wall_sit_right' => ['nullable', 'numeric'],
                'core_endurance' => ['nullable', 'numeric'],
                'bent_arm_hang' => ['nullable', 'numeric'],
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
            $preTrainingTest->core_endurance = $request->input('training_results.core_endurance');
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
            $athlete = User::findOrFail($id);

            if ($athlete->user_role !== 'student') {
                return redirect()->back()->with('error', 'User is not an athlete.');
            }

            // Store admin ID in session to allow navigation back
            session(['admin_viewing_as_student' => auth()->id()]);

            // Store the student ID being viewed
            session(['viewing_student_id' => $athlete->id]);
            // Log in as the student temporarily
            Auth::login($athlete);
            auth()->login($athlete);

            // Redirect to student dashboard
            return redirect()->route('student.dashboard');
        } catch (ModelNotFoundException $e) {
            return redirect()->back()->with('error', 'Athlete not found.');
        }
    }

    /**
     * Switch back to admin after viewing student dashboard
     */
    public function switchBackToAdmin()
    {
        if (session()->has('admin_viewing_as_student')) {
            $adminId = session('admin_viewing_as_student');
            $admin = User::findOrFail($adminId);

            // Clear the session variables
            session()->forget(['admin_viewing_as_student', 'viewing_student_id']);

            // Log back in as admin
            auth()->login($admin);

            return redirect()->route('admin.dashboard')->with('success', 'Switched back to admin account.');
        }

        return redirect()->route('login');
    }
}
