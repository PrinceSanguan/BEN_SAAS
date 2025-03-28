<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Block;
use Carbon\Carbon;

class BlockSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Block 1: All 14 weeks (Training, Testing, Rest period)
        Block::create([
            'block_number' => 1,
            'start_date' => Carbon::now(), // Start date is today
            'end_date' => Carbon::now()->addWeeks(14),
        ]);

        // Block 2: Complete reset, starting after Block 1
        Block::create([
            'block_number' => 2,
            'start_date' => Carbon::now()->addWeeks(14)->addDay(),
            'end_date' => Carbon::now()->addWeeks(28), // 14 more weeks
        ]);

        // Block 3: Third block
        Block::create([
            'block_number' => 3,
            'start_date' => Carbon::now()->addWeeks(28)->addDay(),
            'end_date' => Carbon::now()->addWeeks(42), // 14 more weeks
        ]);
    }
}
