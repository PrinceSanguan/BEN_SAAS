<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;
use App\Models\TrainingResult;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules\Password;

class AdminDashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */

    public function index()
    {
        return Inertia::render('Admin/AdminDashboard');
    }

    /**
     * Create a new athlete user with training results.
     */
    public function createAthlete(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'username' => ['required', 'string', 'max:255', 'unique:users'],
            'parentEmail' => ['required', 'string', 'email', 'max:255'],
            'password' => ['required', Password::defaults()],
            'standingLongJump' => ['nullable', 'numeric'],
            'singleLegJumpLeft' => ['nullable', 'numeric'],
            'singleLegJumpRight' => ['nullable', 'numeric'],
            'wallSit' => ['nullable', 'numeric'],
            'coreEndurance' => ['nullable', 'numeric'],
            'bentArmHang' => ['nullable', 'numeric'],
        ]);

        try {
            // Use a database transaction to ensure both user and training results are created
            DB::beginTransaction();

            // Create the user
            $user = User::create([
                'username' => $validated['username'],
                'email' => $validated['parentEmail'],
                'password' => Hash::make($validated['password']),
                'user_role' => 'student', // Set the role to student/athlete
            ]);

            // Create the training results
            TrainingResult::create([
                'user_id' => $user->id,
                'standing_long_jump' => $validated['standingLongJump'] ?? null,
                'single_leg_jump_left' => $validated['singleLegJumpLeft'] ?? null,
                'single_leg_jump_right' => $validated['singleLegJumpRight'] ?? null,
                'wall_sit' => $validated['wallSit'] ?? null,
                'core_endurance' => $validated['coreEndurance'] ?? null,
                'bent_arm_hang' => $validated['bentArmHang'] ?? null,
            ]);

            DB::commit();

            // Return success response
            return redirect()->back()->with('success', 'Athlete created successfully!');
        } catch (\Exception $e) {
            DB::rollBack();

            // Return error response
            return redirect()->back()->with('error', 'Failed to create athlete: ' . $e->getMessage());
        }
    }
}
