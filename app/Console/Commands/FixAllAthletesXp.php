<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\TrainingResult;
use App\Models\TestResult;
use App\Models\XpTransaction;
use App\Models\UserStat;
use App\Models\TrainingSession;
use App\Services\UserStatService;
use Carbon\Carbon;

class FixAllAthletesXp extends Command
{
    protected $signature = 'fix:all-athletes-xp {--force : Force reset without confirmation}';
    protected $description = 'Recalculate XP for all athletes based on correct dynamic system';

    public function handle()
    {
        $this->info("🏃‍♂️ Starting CORRECTED XP recalculation for all athletes...");

        if (!$this->option('force')) {
            if (!$this->confirm('This will reset ALL XP calculations with the corrected system. Are you sure?')) {
                $this->info('Operation cancelled.');
                return 0;
            }
        }

        // Get all student users
        $athletes = User::where('user_role', 'student')->get();

        if ($athletes->isEmpty()) {
            $this->error('No athletes found!');
            return 1;
        }

        $this->info("Found {$athletes->count()} athletes to process");

        // Clear ALL existing XP transactions
        $this->info("🧹 Clearing all existing XP transactions...");
        $deletedTransactions = XpTransaction::count();
        XpTransaction::truncate();
        $this->info("Deleted $deletedTransactions existing XP transactions");

        $userStatService = app(UserStatService::class);
        $totalProcessed = 0;
        $totalXpAwarded = 0;

        // Process each athlete
        foreach ($athletes as $athlete) {
            $this->info("📊 Processing: {$athlete->username} (ID: {$athlete->id})");

            // Get all completed sessions ordered by completion date
            $completedSessions = collect();

            // Get training sessions
            $trainingResults = TrainingResult::where('user_id', $athlete->id)
                ->whereNotNull('completed_at')
                ->with('session')
                ->get();

            foreach ($trainingResults as $result) {
                $completedSessions->push([
                    'type' => 'training',
                    'session_id' => $result->session_id,
                    'completed_at' => $result->completed_at,
                    'session' => $result->session,
                    'result' => $result
                ]);
            }

            // Get testing sessions
            $testingResults = TestResult::where('user_id', $athlete->id)
                ->whereNotNull('completed_at')
                ->with('session')
                ->get();

            foreach ($testingResults as $result) {
                $completedSessions->push([
                    'type' => 'testing',
                    'session_id' => $result->session_id,
                    'completed_at' => $result->completed_at,
                    'session' => $result->session,
                    'result' => $result
                ]);
            }

            // Sort by completion date to process chronologically
            $completedSessions = $completedSessions->sortBy('completed_at');

            $this->line("  - Total sessions completed: {$completedSessions->count()}");

            $currentTotalXp = 0;
            $currentLevel = 1;

            // Process each session chronologically
            foreach ($completedSessions as $sessionData) {
                // Get XP for this session based on CURRENT level
                $sessionXp = $this->getXpForCurrentLevel($currentLevel);

                if ($sessionData['type'] === 'training') {
                    // Award base XP for training session
                    $this->createXpTransaction($athlete->id, $sessionXp, 'session_complete');
                    $currentTotalXp += $sessionXp;

                    $this->line("    ✅ Training Session {$sessionData['session_id']}: +{$sessionXp} XP (Level {$currentLevel})");
                } else if ($sessionData['type'] === 'testing') {
                    // Award 8 XP for testing session
                    $this->createXpTransaction($athlete->id, 8, 'testing_complete');
                    $currentTotalXp += 8;

                    $this->line("    ✅ Testing Session {$sessionData['session_id']}: +8 XP (Testing)");
                }

                // Update current level after each session
                $currentLevel = $this->calculateLevel($currentTotalXp);
            }

            // Now check for bonuses
            $this->processWeeklyBonuses($athlete->id, $trainingResults, $testingResults);
            $this->processTrainingTestingBonuses($athlete->id, $trainingResults, $testingResults);
            $this->processMonthlyBonuses($athlete->id, $completedSessions);

            // Update user stats
            $userStat = $userStatService->updateUserStats($athlete->id);

            // Get final totals
            $finalTotalXp = XpTransaction::where('user_id', $athlete->id)->sum('xp_amount');
            $finalLevel = $this->calculateLevel($finalTotalXp);

            $this->info("  📈 Final Results:");
            $this->info("    - Total XP: {$finalTotalXp}");
            $this->info("    - Strength Level: {$finalLevel}");
            $this->info("    - Consistency Score: {$userStat->consistency_score}%");

            // Show XP breakdown
            $transactions = XpTransaction::where('user_id', $athlete->id)
                ->selectRaw('xp_source, SUM(xp_amount) as total')
                ->groupBy('xp_source')
                ->get();

            if ($transactions->isNotEmpty()) {
                $this->info("  💰 XP Breakdown:");
                foreach ($transactions as $transaction) {
                    $this->line("    - {$transaction->xp_source}: {$transaction->total} XP");
                }
            }

            $totalProcessed++;
            $totalXpAwarded += $finalTotalXp;
            $this->line("");
        }

        // Summary
        $this->info("🎉 CORRECTED XP Recalculation Complete!");
        $this->info("📊 Summary:");
        $this->info("  - Athletes processed: {$totalProcessed}");
        $this->info("  - Total XP awarded: {$totalXpAwarded}");
        $this->info("  - Average XP per athlete: " . round($totalXpAwarded / $totalProcessed, 2));

        // Show leaderboard
        $this->info("🏆 Current Leaderboard:");
        $leaderboard = User::join('user_stats', 'users.id', '=', 'user_stats.user_id')
            ->where('users.user_role', 'student')
            ->orderBy('user_stats.strength_level', 'desc')
            ->orderBy('user_stats.total_xp', 'desc')
            ->select('users.username', 'user_stats.strength_level', 'user_stats.total_xp')
            ->get();

        $rank = 1;
        foreach ($leaderboard as $entry) {
            $this->line("  {$rank}. {$entry->username} - Level {$entry->strength_level} ({$entry->total_xp} XP)");
            $rank++;
        }

        $this->info("✨ All athletes now have CORRECT XP calculations!");

        return 0;
    }

    /**
     * Get XP earned per session based on current level
     */
    private function getXpForCurrentLevel(int $level): int
    {
        // Fixed XP per training session regardless of level
        return 1;
    }

    /**
     * Calculate level based on total XP
     */
    private function calculateLevel(int $totalXp): int
    {
        // Use triangular number formula: Level n requires sum(1 to n) XP
        $levelThresholds = [
            1 => 0,   // Level 1: 0 XP (starting level)
            2 => 3,   // Level 2: 3 XP (1+2 = 3)
            3 => 6,   // Level 3: 6 XP (1+2+3 = 6)
            4 => 10,  // Level 4: 10 XP (1+2+3+4 = 10)
            5 => 15,  // Level 5: 15 XP (1+2+3+4+5 = 15)
            6 => 21,  // Level 6: 21 XP (1+2+3+4+5+6 = 21)
            7 => 28,  // Level 7: 28 XP (1+2+3+4+5+6+7 = 28)
            8 => 36,  // Level 8: 36 XP (1+2+3+4+5+6+7+8 = 36)
            9 => 45,  // Level 9: 45 XP (1+2+3+4+5+6+7+8+9 = 45)
            10 => 55, // Level 10: 55 XP (1+2+3+4+5+6+7+8+9+10 = 55)
        ];

        $level = 1;
        foreach ($levelThresholds as $lvl => $threshold) {
            if ($totalXp >= $threshold) {
                $level = $lvl;
            } else {
                break;
            }
        }

        // For levels beyond 10, continue the triangular pattern
        if ($level === 10 && $totalXp > $levelThresholds[10]) {
            $remainingXp = $totalXp - $levelThresholds[10];
            $nextLevel = 11;

            while (true) {
                $xpForNextLevel = ($nextLevel * ($nextLevel + 1)) / 2; // Triangular number
                $xpForCurrentLevel = (($nextLevel - 1) * $nextLevel) / 2;
                $xpGap = $xpForNextLevel - $xpForCurrentLevel;

                if ($remainingXp < $xpGap) {
                    break;
                }

                $remainingXp -= $xpGap;
                $level = $nextLevel;
                $nextLevel++;
            }
        }

        return $level;
    }

    /**
     * Create XP transaction
     */
    private function createXpTransaction(int $userId, int $xpAmount, string $source): void
    {
        XpTransaction::create([
            'user_id' => $userId,
            'xp_amount' => $xpAmount,
            'xp_source' => $source,
            'transaction_date' => now(),
        ]);
    }

    /**
     * Process weekly bonuses
     */
    private function processWeeklyBonuses(int $userId, $trainingResults, $testingResults): void
    {
        // Group training sessions by week and block
        $weeklyGroups = $trainingResults->groupBy(function ($result) {
            return $result->session->block_id . '-' . $result->session->week_number;
        });

        foreach ($weeklyGroups as $groupKey => $weekResults) {
            $parts = explode('-', $groupKey);
            $blockId = $parts[0];
            $weekNumber = $parts[1];

            // Get all training sessions for this week
            $totalTrainingInWeek = TrainingSession::where('block_id', $blockId)
                ->where('week_number', $weekNumber)
                ->where('session_type', 'training')
                ->count();

            // Check if all sessions completed within 7 days
            if ($weekResults->count() >= $totalTrainingInWeek && $totalTrainingInWeek > 0) {
                $firstCompletion = $weekResults->min('completed_at');
                $lastCompletion = $weekResults->max('completed_at');

                $daysDiff = Carbon::parse($firstCompletion)->diffInDays(Carbon::parse($lastCompletion));

                if ($daysDiff <= 7) {
                    $this->createXpTransaction($userId, 3, 'week_complete');
                    $this->line("    🎁 Weekly bonus: +3 XP (Week {$weekNumber})");
                }
            }
        }
    }

    /**
     * Process training + testing bonuses
     */
    private function processTrainingTestingBonuses(int $userId, $trainingResults, $testingResults): void
    {
        // Check weeks 5 and 11 for training + testing completion
        foreach ([5, 11] as $weekNumber) {
            $trainingInWeek = $trainingResults->filter(function ($result) use ($weekNumber) {
                return $result->session && $result->session->week_number == $weekNumber;
            });

            $testingInWeek = $testingResults->filter(function ($result) use ($weekNumber) {
                return $result->session && $result->session->week_number == $weekNumber;
            });

            if ($trainingInWeek->count() > 0 && $testingInWeek->count() > 0) {
                // Check if completed within same week
                $allCompletions = $trainingInWeek->pluck('completed_at')
                    ->merge($testingInWeek->pluck('completed_at'));

                $firstCompletion = $allCompletions->min();
                $lastCompletion = $allCompletions->max();

                $daysDiff = Carbon::parse($firstCompletion)->diffInDays(Carbon::parse($lastCompletion));

                if ($daysDiff <= 7) {
                    $this->createXpTransaction($userId, 5, 'training_and_testing');
                    $this->line("    🏆 Training + Testing bonus: +5 XP (Week {$weekNumber})");
                }
            }
        }
    }

    /**
     * Process monthly bonuses (simplified - could be enhanced)
     */
    private function processMonthlyBonuses(int $userId, $completedSessions): void
    {
        // Group by month and check if all sessions completed within 4-week periods
        // This is a simplified version - you might want to implement more complex logic

        $monthlyGroups = $completedSessions->groupBy(function ($session) {
            return Carbon::parse($session['completed_at'])->format('Y-m');
        });

        foreach ($monthlyGroups as $month => $sessions) {
            if ($sessions->count() >= 8) { // Assuming 8+ sessions in a month qualifies
                $firstCompletion = $sessions->min('completed_at');
                $lastCompletion = $sessions->max('completed_at');

                $daysDiff = Carbon::parse($firstCompletion)->diffInDays(Carbon::parse($lastCompletion));

                if ($daysDiff <= 28) { // Within 4 weeks
                    $this->createXpTransaction($userId, 12, 'month_complete');
                    $this->line("    🎖️ Monthly bonus: +12 XP ({$month})");
                }
            }
        }
    }
}
