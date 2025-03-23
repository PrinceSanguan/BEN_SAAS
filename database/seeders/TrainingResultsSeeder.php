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

        // Get all training sessions that are not rest sessions
        $trainingSessions = TrainingSession::where('session_type', '!=', 'rest')->get();

        if ($trainingSessions->isEmpty()) {
            $this->command->info('No training sessions found. Please run the TrainingSessionsSeeder first.');
            return;
        }

        // Create a variety of completion patterns for different students
        foreach ($students as $index => $student) {
            // Different completion patterns based on student index
            // This creates a varied leaderboard with different consistency scores
            switch ($index % 5) {
                case 0: // Super consistent - completes almost everything
                    $sessionsToComplete = $trainingSessions->random(intval($trainingSessions->count() * 0.95));
                    break;

                case 1: // Very good - completes about 85% of sessions
                    $sessionsToComplete = $trainingSessions->random(intval($trainingSessions->count() * 0.85));
                    break;

                case 2: // Average - completes about 65% of sessions
                    $sessionsToComplete = $trainingSessions->random(intval($trainingSessions->count() * 0.65));
                    break;

                case 3: // Below average - completes about 45% of sessions
                    $sessionsToComplete = $trainingSessions->random(intval($trainingSessions->count() * 0.45));
                    break;

                case 4: // Sporadic - completes about 25% of sessions
                    $sessionsToComplete = $trainingSessions->random(intval($trainingSessions->count() * 0.25));
                    break;

                default:
                    $sessionsToComplete = $trainingSessions->random(intval($trainingSessions->count() * 0.5));
            }

            foreach ($sessionsToComplete as $session) {
                // Check if a result already exists
                $exists = TrainingResult::where('user_id', $student->id)
                    ->where('session_id', $session->id)
                    ->exists();

                if (!$exists) {
                    // Create a training result with varied performance data
                    TrainingResult::create([
                        'user_id' => $student->id,
                        'session_id' => $session->id,
                        'warmup_completed' => rand(0, 10) > 1 ? 'YES' : 'NO', // 90% yes, 10% no
                        'plyometrics_score' => rand(5, 20),
                        'power_score' => 'Level ' . rand(1, 5),
                        'lower_body_strength_score' => rand(10, 30),
                        'upper_body_core_strength_score' => rand(10, 30),
                        'completed_at' => Carbon::now()->subDays(rand(1, 30))
                    ]);
                }
            }
        }

        $this->command->info('Training results seeded successfully!');
    }
}
