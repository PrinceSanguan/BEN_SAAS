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
            'start_date' => Carbon::now(), // Start date is today
            'end_date' => Carbon::now()->addWeeks(4),
        ]);

        Block::create([
            'block_number' => 2,
            'start_date' => Carbon::now()->addWeeks(4)->addDay(),
            'end_date' => Carbon::now()->addWeeks(7),
        ]);

        Block::create([
            'block_number' => 3,
            'start_date' => Carbon::now()->addWeeks(7)->addDay(),
            'end_date' => Carbon::now()->addWeeks(10),
        ]);
    }
}
