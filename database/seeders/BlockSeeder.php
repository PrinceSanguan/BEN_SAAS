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
        Block::create([
            'block_number' => 1,
            'start_date' => Carbon::now()->subWeeks(10),
            'end_date' => Carbon::now()->subWeeks(6),
        ]);

        Block::create([
            'block_number' => 2,
            'start_date' => Carbon::now()->subWeeks(5),
            'end_date' => Carbon::now()->subWeeks(2),
        ]);

        Block::create([
            'block_number' => 3,
            'start_date' => Carbon::now()->subDays(10),
            'end_date' => Carbon::now()->addWeeks(3),
        ]);
    }
}
