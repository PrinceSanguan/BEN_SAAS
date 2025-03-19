<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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

        // Ensure blocks exist before seeding sessions
        if ($blocks->isEmpty()) {
            $this->command->info('No blocks found. Please run the BlockSeeder first.');
            return;
        }

        // Seed Training Sessions for each block
        foreach ($blocks as $block) {
            for ($week = 1; $week <= 4; $week++) {
                for ($session = 1; $session <= 3; $session++) {
                    TrainingSession::create([
                        'block_id' => $block->id,
                        'week_number' => $week,
                        'session_number' => $session,
                        'session_type' => $this->getRandomSessionType(),
                        'release_date' => Carbon::parse($block->start_date)->addWeeks($week)->addDays($session),
                    ]);
                }
            }
        }
    }

    /**
     * Get a random session type.
     *
     * @return string
     */
    private function getRandomSessionType(): string
    {
        $types = ['training', 'testing', 'rest'];
        return $types[array_rand($types)];
    }
}
