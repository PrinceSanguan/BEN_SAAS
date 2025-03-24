<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\PreTrainingTest;
use App\Models\TrainingSession;
use App\Models\TestResult;
use Carbon\Carbon;

class StudentTestDataSeeder extends Seeder
{
    public function run()
    {
        // Use existing student user (ID: 2)
        $user = User::find(2);

        if (!$user) {
            $this->command->error("Student user with ID 2 not found!");
            return;
        }

        $this->command->info("Using existing student user: {$user->username} (ID: {$user->id})");

        // Add Pre-Training Test data
        if (!PreTrainingTest::where('user_id', $user->id)->exists()) {
            $preTest = new PreTrainingTest([
                'user_id' => $user->id,
                'standing_long_jump' => 110.0,
                'single_leg_jump_left' => 80.0,
                'single_leg_jump_right' => 85.0,
                'wall_sit' => 50.0,
                'core_endurance' => 45.0,
                'bent_arm_hang' => 25.0,
                'tested_at' => Carbon::now()->subDays(90),
                'notes' => 'Initial assessment for student'
            ]);
            $preTest->save();
            $this->command->info("Pre-training test data added for student");
        } else {
            $this->command->info("Pre-training test data already exists for student");
        }

        // Get testing sessions for all blocks
        $testingSessions = TrainingSession::where('session_type', 'testing')
            ->with('block')
            ->orderBy('week_number')
            ->get();

        if ($testingSessions->isEmpty()) {
            $this->command->error("No testing sessions found! Make sure you've seeded the blocks and training sessions first.");
            return;
        }

        // Base values for each test (starting from pre-training values)
        $initialValues = [
            'standing_long_jump' => 110.0,
            'single_leg_jump_left' => 80.0,
            'single_leg_jump_right' => 85.0,
            'wall_sit_assessment' => 50.0,
            'high_plank_assessment' => 45.0,
            'bent_arm_hang_assessment' => 25.0,
        ];

        // Define improvement factors for each session across blocks
        // This will create a realistic pattern of improvement
        $sessionImprovements = [];

        // Block 1 testing (Week 5)
        $sessionImprovements[] = [
            'standing_long_jump' => 1.05,      // 5% improvement
            'single_leg_jump_left' => 1.04,    // 4% improvement
            'single_leg_jump_right' => 1.05,   // 5% improvement
            'wall_sit_assessment' => 1.08,     // 8% improvement
            'high_plank_assessment' => 1.06,   // 6% improvement
            'bent_arm_hang_assessment' => 1.04, // 4% improvement
        ];

        // Block 2 testing (Week 10)
        $sessionImprovements[] = [
            'standing_long_jump' => 1.12,      // 12% improvement from baseline
            'single_leg_jump_left' => 1.10,    // 10% improvement from baseline
            'single_leg_jump_right' => 1.11,   // 11% improvement from baseline
            'wall_sit_assessment' => 1.15,     // 15% improvement from baseline
            'high_plank_assessment' => 1.14,   // 14% improvement from baseline
            'bent_arm_hang_assessment' => 1.10, // 10% improvement from baseline
        ];

        // Block 3 first testing (Week 11)
        $sessionImprovements[] = [
            'standing_long_jump' => 1.13,      // Small improvement from Block 2
            'single_leg_jump_left' => 1.11,
            'single_leg_jump_right' => 1.12,
            'wall_sit_assessment' => 1.16,
            'high_plank_assessment' => 1.15,
            'bent_arm_hang_assessment' => 1.11,
        ];

        // Block 3 second testing (Week 14) - Final assessment
        $sessionImprovements[] = [
            'standing_long_jump' => 1.22,      // 22% total improvement
            'single_leg_jump_left' => 1.18,    // 18% total improvement
            'single_leg_jump_right' => 1.20,   // 20% total improvement
            'wall_sit_assessment' => 1.30,     // 30% total improvement
            'high_plank_assessment' => 1.25,   // 25% total improvement
            'bent_arm_hang_assessment' => 1.20, // 20% total improvement
        ];

        // Clear existing test results for this user to avoid duplicates
        TestResult::where('user_id', $user->id)->delete();
        $this->command->info("Cleared existing test results for student");

        // Add test results for each testing session
        foreach ($testingSessions as $index => $session) {
            if (!$session->block) {
                $this->command->warn("Session #{$session->id} has no block association. Skipping...");
                continue;
            }

            $blockNumber = $session->block->block_number;

            // Get improvement factors for this session (if available)
            $improvements = $sessionImprovements[$index] ?? null;

            // Skip if no improvement data or we've run out of test sessions
            if (!$improvements || $index >= count($sessionImprovements)) {
                $this->command->warn("No improvement data for session #{$session->id} or exceeded defined sessions. Skipping...");
                continue;
            }

            // Create test result with specified improvements
            $testResult = new TestResult([
                'user_id' => $user->id,
                'session_id' => $session->id,
                'standing_long_jump' => $initialValues['standing_long_jump'] * $improvements['standing_long_jump'],
                'single_leg_jump_left' => $initialValues['single_leg_jump_left'] * $improvements['single_leg_jump_left'],
                'single_leg_jump_right' => $initialValues['single_leg_jump_right'] * $improvements['single_leg_jump_right'],
                'wall_sit_assessment' => $initialValues['wall_sit_assessment'] * $improvements['wall_sit_assessment'],
                'high_plank_assessment' => $initialValues['high_plank_assessment'] * $improvements['high_plank_assessment'],
                'bent_arm_hang_assessment' => $initialValues['bent_arm_hang_assessment'] * $improvements['bent_arm_hang_assessment'],
                'completed_at' => Carbon::now()->subDays(90 - ($index * 20)) // Spread out over time
            ]);

            $testResult->save();

            $standingJumpImprovement = ($improvements['standing_long_jump'] - 1) * 100;
            $this->command->info("Added test result for Block {$blockNumber}, Week {$session->week_number} - Standing Jump improved by {$standingJumpImprovement}%");
        }

        $this->command->info("Data population complete for student user ID: {$user->id}!");
        $this->command->info("You can now login with the student account to view the progress.");
    }
}
