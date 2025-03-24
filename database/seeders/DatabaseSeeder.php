<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([

            // First create users
            UserSeeder::class,

            // Then create training blocks
            BlockSeeder::class,

            // Then populate training sessions
            TrainingSessionSeeder::class,

            // Then create student users and their training results
            TrainingResultsSeeder::class,

            // Finally calculate and update user stats
            UserStatsSeeder::class,
        ]);
    }
}
