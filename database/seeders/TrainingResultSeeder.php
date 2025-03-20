<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\TrainingSession;
use App\Models\TrainingResult;
use Carbon\Carbon;

class TrainingResultsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Get all student users
        $students = User::where('user_role', 'student')->get();

        if ($students->isEmpty()) {
            // Create a test student if none exist
            $students = [
                User::create([
                    'username' => 'test_student',
                    'parent_email' => 'parent@example.com',
                    'password' => bcrypt('password'),
                    'user_role' => 'student'
                ])
            ];
        }

        // Get all training sessions
        $trainingSessions = TrainingSession::where('session_type', 'training')->get();

        if ($trainingSessions->isEmpty()) {
            $this->command->info('No training sessions found. Please run the TrainingSessionsSeeder first.');
            return;
        }

        // For each student, create some training results
        foreach ($students as $student) {
            // Create results for some sessions (not all, to show both completed and incomplete sessions)
            $sessionsToComplete = $trainingSessions->random(min(5, $trainingSessions->count()));

            foreach ($sessionsToComplete as $session) {
                TrainingResult::create([
                    'user_id' => $student->id,
                    'session_id' => $session->id,
                    'warmup_completed' => rand(0, 1) ? 'YES' : 'NO',
                    'plyometrics_score' => rand(5, 20),
                    'power_score' => 'Level ' . rand(1, 5),
                    'lower_body_strength_score' => rand(10, 30),
                    'upper_body_core_strength_score' => rand(10, 30),
                    'completed_at' => Carbon::now()->subDays(rand(1, 30))
                ]);
            }
        }

        $this->command->info('Training results seeded successfully!');
    }
}
