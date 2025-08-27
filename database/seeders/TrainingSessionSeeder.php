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

        foreach ($blocks as $block) {
            // Ensure block_id is available
            if (!$block->id) {
                $this->command->warn("Block #{$block->block_number} has no ID. Skipping this block.");
                continue;
            }

            // For each block, start with session 1
            $sessionCount = 1;

            // Generate training sessions for this block
            $this->createSessionsForBlock($block, $sessionCount);
        }

        $this->command->info('Training sessions seeded successfully!');
        $this->command->info('Total training sessions created: ' . TrainingSession::count());
    }

    /**
     * Create all sessions for a single block
     * 
     * @param Block $block
     * @param int &$sessionCount Session counter (passed by reference to maintain count across blocks)
     */
    private function createSessionsForBlock(Block $block, &$sessionCount): void
    {
        // Reset session counter for each block
        $sessionCount = 1;

        // Iterate through all 12 weeks
        for ($week = 1; $week <= 12; $week++) {
            $weekStartDate = Carbon::parse($block->start_date ?: now())->addWeeks($week - 1);

            // Week 7 is a REST week
            if ($week == 7) {
                // Create a special REST session with a special session number (0)
                TrainingSession::create([
                    'block_id'       => $block->id,
                    'week_number'    => $week,
                    'session_number' => 0, // Use 0 for rest sessions instead of null
                    'session_type'   => 'rest',
                    'release_date'   => $weekStartDate,
                ]);

                // Do not increment session count for rest week
            }
            // Special weeks with testing (5, 10, 14)
            elseif (in_array($week, [5, 10, 14])) {
                // First create the testing session with a special session number (-1)
                TrainingSession::create([
                    'block_id'       => $block->id,
                    'week_number'    => $week,
                    'session_number' => -1, // Use -1 for testing sessions instead of null
                    'session_type'   => 'testing',
                    'release_date'   => $weekStartDate,
                ]);

                // For weeks 5 and 10, also create 2 training sessions
                if ($week != 14) {
                    for ($i = 1; $i <= 2; $i++) {
                        TrainingSession::create([
                            'block_id'       => $block->id,
                            'week_number'    => $week,
                            'session_number' => $sessionCount,
                            'session_type'   => 'training',
                            'release_date'   => $weekStartDate->copy()->addDays($i),
                        ]);
                        $sessionCount++;
                    }
                }
            }
            // Regular weeks with 2 training sessions each
            else {
                for ($i = 0; $i <= 1; $i++) {
                    TrainingSession::create([
                        'block_id'       => $block->id,
                        'week_number'    => $week,
                        'session_number' => $sessionCount,
                        'session_type'   => 'training',
                        'release_date'   => $weekStartDate->copy()->addDays($i),
                    ]);
                    $sessionCount++;
                }
            }
        }
    }
}
