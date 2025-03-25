<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\PreTrainingTest;
use App\Models\TrainingSession;
use App\Models\TrainingResult;
use App\Models\TestResult;
use App\Models\XpTransaction;
use App\Services\XpService;
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

        // Create XP Service
        $xpService = new XpService();

        // Clear existing XP transactions for this user to avoid duplicates
        XpTransaction::where('user_id', $user->id)->delete();
        $this->command->info("Cleared existing XP transactions for student");

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

        // Get all training sessions sorted by block and week
        $trainingSessions = TrainingSession::with('block')
            ->orderBy('block_id')
            ->orderBy('week_number')
            ->orderBy('session_number')
            ->get();

        if ($trainingSessions->isEmpty()) {
            $this->command->error("No training sessions found! Make sure you've seeded the blocks and training sessions first.");
            return;
        }

        // Clear existing training results for this user to avoid duplicates
        TrainingResult::where('user_id', $user->id)->delete();
        TestResult::where('user_id', $user->id)->delete();
        $this->command->info("Cleared existing training and test results for student");

        // Group sessions by week and block for easier processing
        $sessionsByBlockAndWeek = [];
        foreach ($trainingSessions as $session) {
            if (!$session->block) {
                continue;
            }

            $blockId = $session->block->id;
            $weekNumber = $session->week_number;

            if (!isset($sessionsByBlockAndWeek[$blockId])) {
                $sessionsByBlockAndWeek[$blockId] = [];
            }

            if (!isset($sessionsByBlockAndWeek[$blockId][$weekNumber])) {
                $sessionsByBlockAndWeek[$blockId][$weekNumber] = [
                    'training' => [],
                    'testing' => []
                ];
            }

            if (strtolower($session->session_type) === 'training') {
                $sessionsByBlockAndWeek[$blockId][$weekNumber]['training'][] = $session;
            } else {
                $sessionsByBlockAndWeek[$blockId][$weekNumber]['testing'][] = $session;
            }
        }

        // Base values for testing sessions
        $initialValues = [
            'standing_long_jump' => 110.0,
            'single_leg_jump_left' => 80.0,
            'single_leg_jump_right' => 85.0,
            'wall_sit_assessment' => 50.0,
            'high_plank_assessment' => 45.0,
            'bent_arm_hang_assessment' => 25.0,
        ];

        // Define improvement factors for each session across blocks
        $sessionImprovements = [
            // Block 1 testing (Week 5)
            1 => [
                5 => [
                    'standing_long_jump' => 1.05,
                    'single_leg_jump_left' => 1.04,
                    'single_leg_jump_right' => 1.05,
                    'wall_sit_assessment' => 1.08,
                    'high_plank_assessment' => 1.06,
                    'bent_arm_hang_assessment' => 1.04,
                ]
            ],
            // Block 2 testing (Week 10)
            2 => [
                10 => [
                    'standing_long_jump' => 1.12,
                    'single_leg_jump_left' => 1.10,
                    'single_leg_jump_right' => 1.11,
                    'wall_sit_assessment' => 1.15,
                    'high_plank_assessment' => 1.14,
                    'bent_arm_hang_assessment' => 1.10,
                ]
            ],
            // Block 3 testing (Week 11 and 14)
            3 => [
                11 => [
                    'standing_long_jump' => 1.13,
                    'single_leg_jump_left' => 1.11,
                    'single_leg_jump_right' => 1.12,
                    'wall_sit_assessment' => 1.16,
                    'high_plank_assessment' => 1.15,
                    'bent_arm_hang_assessment' => 1.11,
                ],
                14 => [
                    'standing_long_jump' => 1.22,
                    'single_leg_jump_left' => 1.18,
                    'single_leg_jump_right' => 1.20,
                    'wall_sit_assessment' => 1.30,
                    'high_plank_assessment' => 1.25,
                    'bent_arm_hang_assessment' => 1.20,
                ]
            ]
        ];

        // Training result options
        $scoreOptions = ['GOOD', 'EXCELLENT', 'AVERAGE', 'NEEDS IMPROVEMENT'];

        // Process each block and week
        $totalXpEarned = 0;

        foreach ($sessionsByBlockAndWeek as $blockId => $weeks) {
            $block = \App\Models\Block::find($blockId);

            foreach ($weeks as $weekNumber => $sessions) {
                $trainingCompleted = 0;
                $testingCompleted = 0;

                // Process training sessions
                foreach ($sessions['training'] as $session) {
                    // Occasionally skip a session to create realistic data
                    if (rand(1, 10) <= 8) { // 80% chance of completing a session
                        $result = new TrainingResult([
                            'user_id' => $user->id,
                            'session_id' => $session->id,
                            'warmup_completed' => rand(1, 10) <= 9 ? 'YES' : 'NO', // 90% YES
                            'plyometrics_score' => $scoreOptions[array_rand($scoreOptions)],
                            'power_score' => $scoreOptions[array_rand($scoreOptions)],
                            'lower_body_strength_score' => $scoreOptions[array_rand($scoreOptions)],
                            'upper_body_core_strength_score' => $scoreOptions[array_rand($scoreOptions)],
                            'completed_at' => Carbon::now()->subDays(90 - (($block->block_number - 1) * 30 + $weekNumber * 7))
                        ]);
                        $result->save();

                        // Calculate and add XP
                        $xpEarned = $xpService->calculateSessionXp($user->id, $session->id);
                        $totalXpEarned += $xpEarned;
                        $trainingCompleted++;

                        $this->command->info("Added training result for Block {$block->block_number}, Week {$weekNumber}, Session {$session->session_number}. +{$xpEarned} XP");
                    }
                }

                // Process testing sessions with improvement factors
                foreach ($sessions['testing'] as $session) {
                    if (isset($sessionImprovements[$block->block_number][$weekNumber])) {
                        $improvements = $sessionImprovements[$block->block_number][$weekNumber];

                        $testResult = new TestResult([
                            'user_id' => $user->id,
                            'session_id' => $session->id,
                            'standing_long_jump' => $initialValues['standing_long_jump'] * $improvements['standing_long_jump'],
                            'single_leg_jump_left' => $initialValues['single_leg_jump_left'] * $improvements['single_leg_jump_left'],
                            'single_leg_jump_right' => $initialValues['single_leg_jump_right'] * $improvements['single_leg_jump_right'],
                            'wall_sit_assessment' => $initialValues['wall_sit_assessment'] * $improvements['wall_sit_assessment'],
                            'high_plank_assessment' => $initialValues['high_plank_assessment'] * $improvements['high_plank_assessment'],
                            'bent_arm_hang_assessment' => rand(1, 10) <= 7 ? $initialValues['bent_arm_hang_assessment'] * $improvements['bent_arm_hang_assessment'] : null, // 70% chance of completing this bonus field
                            'completed_at' => Carbon::now()->subDays(90 - (($block->block_number - 1) * 30 + $weekNumber * 7))
                        ]);
                        $testResult->save();

                        // Calculate and add XP
                        $xpEarned = $xpService->calculateSessionXp($user->id, $session->id);
                        $totalXpEarned += $xpEarned;
                        $testingCompleted++;

                        $standingJumpImprovement = ($improvements['standing_long_jump'] - 1) * 100;
                        $this->command->info("Added test result for Block {$block->block_number}, Week {$weekNumber}. Standing Jump improved by {$standingJumpImprovement}%. +{$xpEarned} XP");
                    }
                }

                // Summary for this week
                if ($trainingCompleted > 0 || $testingCompleted > 0) {
                    $this->command->info("Week {$weekNumber} Summary: {$trainingCompleted} training and {$testingCompleted} testing sessions completed.");
                }
            }
        }

        // Final XP summary
        $currentLevel = $xpService->getCurrentLevel($user->id);
        $nextLevelInfo = $xpService->getNextLevelInfo($user->id);

        $this->command->info("=== XP SUMMARY ===");
        $this->command->info("Total XP Earned: {$totalXpEarned}");
        $this->command->info("Current Level: {$currentLevel}");

        if ($nextLevelInfo['next_level']) {
            $this->command->info("XP needed for Level {$nextLevelInfo['next_level']}: {$nextLevelInfo['xp_needed']}");
        } else {
            $this->command->info("Maximum level reached!");
        }

        $this->command->info("Data population complete for student user ID: {$user->id}!");
        $this->command->info("You can now login with the student account to view the progress and XP.");
    }
}
