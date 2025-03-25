<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TrainingSession;
use App\Models\Block;
use Carbon\Carbon;

class TrainingSessionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Fetch all blocks
        $blocks = Block::all();

        if ($blocks->isEmpty()) {
            $this->command->info('No blocks found. Please run the BlockSeeder first.');
            return;
        }

        // A single counter for session_number (only increments for training)
        $globalSessionCount = 1;

        foreach ($blocks as $block) {
            // Ensure block_id is available
            if (!$block->id) {
                $this->command->warn("Block #{$block->block_number} has no ID. Skipping this block.");
                continue;
            }

            // -------------------------
            // BLOCK 1
            // Weeks 1–4 => 2 training each
            // Week 5 => 2 training + 1 testing
            // -------------------------
            if ($block->block_number == 1) {
                for ($week = 1; $week <= 5; $week++) {
                    if ($week <= 4) {
                        // Weeks 1–4 => 2 training
                        for ($i = 1; $i <= 2; $i++) {
                            TrainingSession::create([
                                'block_id'       => $block->id,
                                'week_number'    => $week,
                                // training => increment the counter
                                'session_number' => $globalSessionCount++,
                                'session_type'   => 'training',
                                'release_date'   => Carbon::parse($block->start_date ?: now())
                                    ->addWeeks($week - 1)
                                    ->addDays($i),
                            ]);
                        }
                    } else {
                        // Week 5 => 2 training + 1 testing
                        // 2 training
                        for ($i = 1; $i <= 2; $i++) {
                            TrainingSession::create([
                                'block_id'       => $block->id,
                                'week_number'    => 5,
                                // training => increment
                                'session_number' => $globalSessionCount++,
                                'session_type'   => 'training',
                                'release_date'   => Carbon::parse($block->start_date ?: now())
                                    ->addWeeks(4)
                                    ->addDays($i),
                            ]);
                        }

                        // Save the last session number for the testing session
                        $lastSessionNumber = $globalSessionCount - 1;

                        // 1 testing => use the last training session number (do NOT increment)
                        TrainingSession::create([
                            'block_id'       => $block->id,
                            'week_number'    => 5,
                            'session_number' => $lastSessionNumber, // Use the LAST training number, NOT current
                            'session_type'   => 'testing',
                            'release_date'   => Carbon::parse($block->start_date ?: now())
                                ->addWeeks(4)
                                ->addDays(3),
                        ]);
                    }
                }
            }

            // -------------------------
            // BLOCK 2
            // Weeks 6–9 => 2 training each
            // Week 10 => 2 training + 1 testing
            // -------------------------
            elseif ($block->block_number == 2) {
                for ($week = 6; $week <= 10; $week++) {
                    $offset = $week - 6;
                    if ($week <= 9) {
                        // Weeks 6–9 => 2 training
                        for ($i = 1; $i <= 2; $i++) {
                            TrainingSession::create([
                                'block_id'       => $block->id,
                                'week_number'    => $week,
                                'session_number' => $globalSessionCount++, // training => increment
                                'session_type'   => 'training',
                                'release_date'   => Carbon::parse($block->start_date ?: now())
                                    ->addWeeks($offset)
                                    ->addDays($i),
                            ]);
                        }
                    } else {
                        // Week 10 => 2 training + 1 testing
                        // 2 training
                        for ($i = 1; $i <= 2; $i++) {
                            TrainingSession::create([
                                'block_id'       => $block->id,
                                'week_number'    => 10,
                                'session_number' => $globalSessionCount++, // training => increment
                                'session_type'   => 'training',
                                'release_date'   => Carbon::parse($block->start_date ?: now())
                                    ->addWeeks(4) // (10 - 6) => 4
                                    ->addDays($i),
                            ]);
                        }

                        // Save the last session number for the testing session
                        $lastSessionNumber = $globalSessionCount - 1;

                        // 1 testing => use the last training session number (do NOT increment)
                        TrainingSession::create([
                            'block_id'       => $block->id,
                            'week_number'    => 10,
                            'session_number' => $lastSessionNumber, // Use the LAST training number, NOT current
                            'session_type'   => 'testing',
                            'release_date'   => Carbon::parse($block->start_date ?: now())
                                ->addWeeks(4)
                                ->addDays(3),
                        ]);
                    }
                }
            }

            // -------------------------
            // BLOCK 3
            // Weeks 11–13 => 2 testing each
            // Week 14 => 1 testing only
            // -------------------------
            elseif ($block->block_number == 3) {
                // For Block 3, all testing sessions use the last session number from Block 2
                $lastTrainingSessionNumber = $globalSessionCount - 1;

                for ($week = 11; $week <= 14; $week++) {
                    $offset = $week - 11;
                    if ($week < 14) {
                        // Weeks 11–13 => 2 testing each, use last training session number
                        for ($i = 1; $i <= 2; $i++) {
                            TrainingSession::create([
                                'block_id'       => $block->id,
                                'week_number'    => $week,
                                'session_number' => $lastTrainingSessionNumber, // Use the last training number from Block 2
                                'session_type'   => 'testing',
                                'release_date'   => Carbon::parse($block->start_date ?: now())
                                    ->addWeeks($offset)
                                    ->addDays($i),
                            ]);
                        }
                    } else {
                        // Week 14 => 1 testing only, use last training session number
                        TrainingSession::create([
                            'block_id'       => $block->id,
                            'week_number'    => 14,
                            'session_number' => $lastTrainingSessionNumber, // Use the last training number from Block 2
                            'session_type'   => 'testing',
                            'release_date'   => Carbon::parse($block->start_date ?: now())
                                ->addWeeks($offset),
                        ]);
                    }
                }
            }
        }

        $this->command->info('Training sessions seeded successfully!');
        $this->command->info('Total training sessions created: ' . TrainingSession::count());
    }
}
