<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\TrainingResult;
use App\Models\TestResult;
use App\Models\XpTransaction;
use App\Models\UserStat;
use App\Services\XpService;
use App\Services\UserStatService;

class FixAllAthletesXp extends Command
{
    protected $signature = 'fix:all-athletes-xp {--force : Force reset without confirmation}';
    protected $description = 'Recalculate XP for all athletes based on current system';

    public function handle()
    {
        $this->info("🏃‍♂️ Starting XP recalculation for all athletes...");

        if (!$this->option('force')) {
            if (!$this->confirm('This will reset ALL XP calculations. Are you sure?')) {
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

        $xpService = app(XpService::class);
        $userStatService = app(UserStatService::class);

        $totalProcessed = 0;
        $totalXpAwarded = 0;

        // Process each athlete
        foreach ($athletes as $athlete) {
            $this->info("📊 Processing: {$athlete->username} (ID: {$athlete->id})");

            $userXpEarned = 0;

            // Get completed training sessions
            $completedTraining = TrainingResult::where('user_id', $athlete->id)
                ->whereNotNull('completed_at')
                ->get();

            // Get completed testing sessions
            $completedTesting = TestResult::where('user_id', $athlete->id)
                ->whereNotNull('completed_at')
                ->get();

            $this->line("  - Training sessions completed: {$completedTraining->count()}");
            $this->line("  - Testing sessions completed: {$completedTesting->count()}");

            // Process training sessions
            foreach ($completedTraining as $result) {
                try {
                    $xp = $xpService->calculateSessionXp($athlete->id, $result->session_id);
                    $userXpEarned += $xp;
                    if ($xp > 0) {
                        $this->line("    ✅ Training Session {$result->session_id}: +{$xp} XP");
                    }
                } catch (\Exception $e) {
                    $this->error("    ❌ Error processing training session {$result->session_id}: " . $e->getMessage());
                }
            }

            // Process testing sessions
            foreach ($completedTesting as $result) {
                try {
                    $xp = $xpService->calculateSessionXp($athlete->id, $result->session_id);
                    $userXpEarned += $xp;
                    if ($xp > 0) {
                        $this->line("    ✅ Testing Session {$result->session_id}: +{$xp} XP");
                    }
                } catch (\Exception $e) {
                    $this->error("    ❌ Error processing testing session {$result->session_id}: " . $e->getMessage());
                }
            }

            // Update user stats
            $userStat = $userStatService->updateUserStats($athlete->id);

            // Get final XP totals
            $finalTotalXp = $xpService->getTotalXp($athlete->id);
            $currentLevel = $xpService->getCurrentLevel($athlete->id);

            $this->info("  📈 Final Results:");
            $this->info("    - Total XP: {$finalTotalXp}");
            $this->info("    - Strength Level: {$currentLevel}");
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
        $this->info("🎉 XP Recalculation Complete!");
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

        $this->info("✨ All athletes now have consistent XP calculations!");

        return 0;
    }
}
