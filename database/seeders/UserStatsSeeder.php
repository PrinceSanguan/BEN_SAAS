<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\UserStat;
use App\Models\TrainingSession;
use App\Models\TrainingResult;

class UserStatsSeeder extends Seeder
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
            $this->command->info('No student users found. Creating sample student users...');

            // Create sample student users if none exist
            $students = $this->createSampleUsers();
        }

        // Get the total number of available training sessions
        $availableSessions = TrainingSession::where('session_type', '!=', 'rest')->count();

        if ($availableSessions === 0) {
            $this->command->error('No training sessions found. Please run the TrainingSessionsSeeder first.');
            return;
        }

        // Process each student
        foreach ($students as $student) {
            // Count completed sessions for this student
            $completedSessions = TrainingResult::where('user_id', $student->id)->count();

            // Calculate XP based on completed sessions
            // Base XP: 1 XP per completed session
            $baseXp = $completedSessions;

            // Bonus XP: Random additional XP (0-10)
            $bonusXp = rand(0, 10);

            $totalXp = $baseXp + $bonusXp;

            // Calculate strength level based on XP
            $strengthLevel = $this->calculateStrengthLevel($totalXp);

            // Calculate consistency score
            $consistencyScore = $availableSessions > 0
                ? round(($completedSessions / $availableSessions) * 100, 2)
                : 0;

            // Create or update user stats
            UserStat::updateOrCreate(
                ['user_id' => $student->id],
                [
                    'total_xp' => $totalXp,
                    'strength_level' => $strengthLevel,
                    'sessions_completed' => $completedSessions,
                    'sessions_available' => $availableSessions,
                    'consistency_score' => $consistencyScore,
                    'last_updated' => now(),
                ]
            );
        }

        $this->command->info('User stats seeded successfully!');
    }

    /**
     * Create sample student users.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    private function createSampleUsers()
    {
        $usernames = [
            'ThunderBolt',
            'IronPulse',
            'SpeedForce',
            'PowerMatrix',
            'EliteAthlete',
            'RapidRunner',
            'StrengthWizard',
            'MuscleKing',
            'FlexMaster',
            'AgileAce'
        ];

        $users = collect();

        foreach ($usernames as $index => $username) {
            $user = User::create([
                'username' => $username,
                'parent_email' => "parent{$index}@example.com",
                'password' => bcrypt('password'),
                'user_role' => 'student'
            ]);

            $users->push($user);
        }

        return $users;
    }

    /**
     * Calculate strength level based on XP.
     *
     * @param int $xp
     * @return int
     */
    private function calculateStrengthLevel($xp)
    {
        if ($xp >= 15) return 5;
        if ($xp >= 10) return 4;
        if ($xp >= 6) return 3;
        if ($xp >= 3) return 2;
        return 1;
    }
}
