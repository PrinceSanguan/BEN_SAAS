<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\TrainingResult;
use App\Models\XpTransaction;
use App\Models\UserStat;

class QuickXpFix extends Command
{
    protected $signature = 'quick:fix-mcdtie';
    protected $description = 'Quick fix for McdTie XP';

    public function handle()
    {
        $userId = 7; // McdTie's ID

        $this->info("Quick fix for McdTie (User ID: $userId)");

        // Get completed sessions count
        $completedCount = TrainingResult::where('user_id', $userId)
            ->whereNotNull('completed_at')
            ->count();

        $this->info("Found $completedCount completed sessions");

        if ($completedCount === 0) {
            $this->error("No completed sessions found!");
            return 1;
        }

        // Clear existing XP transactions
        XpTransaction::where('user_id', $userId)->delete();
        $this->info("Cleared existing XP transactions");

        // Create XP transactions manually
        // 4 XP per session + potential weekly bonus
        for ($i = 1; $i <= $completedCount; $i++) {
            XpTransaction::create([
                'user_id' => $userId,
                'xp_amount' => 4,
                'xp_source' => 'session_complete',
                'transaction_date' => now(),
            ]);
            $this->info("Added 4 XP for session $i");
        }

        // Add weekly bonus if 2 sessions completed
        if ($completedCount >= 2) {
            XpTransaction::create([
                'user_id' => $userId,
                'xp_amount' => 3,
                'xp_source' => 'week_complete',
                'transaction_date' => now(),
            ]);
            $this->info("Added 3 XP weekly bonus");
        }

        // Calculate total XP
        $totalXp = XpTransaction::where('user_id', $userId)->sum('xp_amount');

        // Determine level
        $level = 1;
        if ($totalXp >= 15) $level = 5;
        elseif ($totalXp >= 10) $level = 4;
        elseif ($totalXp >= 6) $level = 3;
        elseif ($totalXp >= 3) $level = 2;

        // Update user stats
        UserStat::updateOrCreate(
            ['user_id' => $userId],
            [
                'total_xp' => $totalXp,
                'strength_level' => $level,
                'last_updated' => now()
            ]
        );

        $this->info("=== RESULTS ===");
        $this->info("Total XP: $totalXp");
        $this->info("Level: $level");
        $this->info("Fix completed!");

        return 0;
    }
}
