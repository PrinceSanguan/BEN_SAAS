<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Block;
use App\Models\User;
use Carbon\Carbon;

class PreviewBlockChanges extends Command
{
    protected $signature = 'blocks:preview-fix';
    protected $description = 'Preview what changes will be made to blocks when fixing 14-week to 12-week duration';

    public function handle()
    {
        $this->info('🔍 PREVIEWING BLOCK CHANGES (14 weeks → 12 weeks)');
        $this->info('=' . str_repeat('=', 60));

        $usersWithBlocks = Block::select('user_id')->distinct()->get();
        $totalUsers = $usersWithBlocks->count();
        $totalBlocks = Block::count();

        $this->info("📊 Summary:");
        $this->info("   • Users with blocks: {$totalUsers}");
        $this->info("   • Total blocks: {$totalBlocks}");
        $this->newLine();

        foreach ($usersWithBlocks as $userRecord) {
            $user = User::find($userRecord->user_id);
            $blocks = Block::where('user_id', $userRecord->user_id)
                ->orderBy('block_number')
                ->get();

            $this->info("👤 User: {$user->username} (ID: {$user->id})");

            if ($blocks->isEmpty()) {
                $this->warn("   ⚠️  No blocks found");
                continue;
            }

            $firstBlock = $blocks->first();
            $currentStartDate = Carbon::parse($firstBlock->start_date);

            foreach ($blocks as $block) {
                $currentEndDate = Carbon::parse($block->end_date);
                $currentWeeks = $currentStartDate->diffInWeeks($currentEndDate) + 1;

                // Calculate new end date (12 weeks)
                $newEndDate = $currentStartDate->copy()->addWeeks(12)->subDay();

                $this->line("   📅 Block {$block->block_number}:");
                $this->line("      Current: {$currentStartDate->format('Y-m-d')} to {$currentEndDate->format('Y-m-d')} ({$currentWeeks} weeks)");
                $this->line("      New:     {$currentStartDate->format('Y-m-d')} to {$newEndDate->format('Y-m-d')} (12 weeks)");

                if ($currentWeeks > 12) {
                    $daysSaved = $currentEndDate->diffInDays($newEndDate);
                    $this->comment("      💡 Will save {$daysSaved} days");
                }

                // Calculate next block start
                $currentStartDate = $currentStartDate->copy()->addWeeks(12);
            }
            $this->newLine();
        }

        $this->info('✅ Preview complete! Run "php artisan migrate" to apply these changes.');
        $this->warn('⚠️  Always backup your database before running migrations in production!');

        return 0;
    }
}
