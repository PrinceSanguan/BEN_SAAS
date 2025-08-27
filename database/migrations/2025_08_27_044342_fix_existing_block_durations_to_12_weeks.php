<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Block;
use App\Models\TrainingSession;
use Carbon\Carbon;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        echo "Starting migration to fix block durations from 14 weeks to 12 weeks...\n";

        DB::beginTransaction();

        try {
            // Get all users who have blocks
            $usersWithBlocks = DB::table('blocks')
                ->select('user_id')
                ->distinct()
                ->get();

            foreach ($usersWithBlocks as $userRecord) {
                $this->fixBlocksForUser($userRecord->user_id);
            }

            DB::commit();
            echo "Successfully migrated all blocks to 12-week duration!\n";
        } catch (\Exception $e) {
            DB::rollBack();
            echo "Migration failed: " . $e->getMessage() . "\n";
            throw $e;
        }
    }

    /**
     * Fix blocks for a specific user
     */
    private function fixBlocksForUser($userId): void
    {
        echo "Fixing blocks for user ID: $userId\n";

        // Get all blocks for this user, ordered by block number
        $blocks = Block::where('user_id', $userId)
            ->orderBy('block_number')
            ->get();

        if ($blocks->isEmpty()) {
            return;
        }

        // Start with the first block's original start date
        $firstBlock = $blocks->first();
        $currentStartDate = Carbon::parse($firstBlock->start_date);

        foreach ($blocks as $block) {
            // Calculate correct end date: Start Date + (12 weeks × 7 days) - 1 day
            $newEndDate = $currentStartDate->copy()->addWeeks(12)->subDay();

            echo "Block {$block->block_number}: {$currentStartDate->format('Y-m-d')} to {$newEndDate->format('Y-m-d')}\n";

            // Update the block
            $block->update([
                'start_date' => $currentStartDate->format('Y-m-d'),
                'end_date' => $newEndDate->format('Y-m-d')
            ]);

            // Update training session release dates for this block
            $this->updateTrainingSessionDatesForBlock($block, $currentStartDate);

            // Calculate next block start date: Start Date + (12 weeks × 7 days)
            // This ensures next block starts on same weekday
            $currentStartDate = $currentStartDate->copy()->addWeeks(12);
        }
    }

    /**
     * Update training session release dates based on new block start date
     */
    private function updateTrainingSessionDatesForBlock(Block $block, Carbon $blockStartDate): void
    {
        $sessions = TrainingSession::where('block_id', $block->id)->get();

        foreach ($sessions as $session) {
            // Calculate new release date based on week number
            $weekOffset = $session->week_number - 1; // Week 1 = 0 weeks offset
            $newReleaseDate = $blockStartDate->copy()->addWeeks($weekOffset);

            // For sessions with multiple sessions per week, add days
            if ($session->session_type === 'training' && $session->session_number > 1) {
                // Add a day for second session of the week
                $newReleaseDate->addDay();
            }

            $session->update([
                'release_date' => $newReleaseDate->format('Y-m-d')
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        echo "Rolling back block duration changes...\n";

        DB::beginTransaction();

        try {
            // Get all users who have blocks
            $usersWithBlocks = DB::table('blocks')
                ->select('user_id')
                ->distinct()
                ->get();

            foreach ($usersWithBlocks as $userRecord) {
                $this->rollbackBlocksForUser($userRecord->user_id);
            }

            DB::commit();
            echo "Successfully rolled back all blocks to 14-week duration!\n";
        } catch (\Exception $e) {
            DB::rollBack();
            echo "Rollback failed: " . $e->getMessage() . "\n";
            throw $e;
        }
    }

    /**
     * Rollback blocks for a specific user (restore 14-week duration)
     */
    private function rollbackBlocksForUser($userId): void
    {
        echo "Rolling back blocks for user ID: $userId\n";

        // Get all blocks for this user, ordered by block number
        $blocks = Block::where('user_id', $userId)
            ->orderBy('block_number')
            ->get();

        if ($blocks->isEmpty()) {
            return;
        }

        // Start with the first block's current start date
        $firstBlock = $blocks->first();
        $currentStartDate = Carbon::parse($firstBlock->start_date);

        foreach ($blocks as $block) {
            // Calculate 14-week end date: Start Date + (14 weeks × 7 days) - 1 day
            $newEndDate = $currentStartDate->copy()->addWeeks(14)->subDay();

            // Update the block
            $block->update([
                'start_date' => $currentStartDate->format('Y-m-d'),
                'end_date' => $newEndDate->format('Y-m-d')
            ]);

            // Update training session release dates
            $this->updateTrainingSessionDatesForBlock($block, $currentStartDate);

            // Calculate next block start date for 14 weeks
            $currentStartDate = $currentStartDate->copy()->addWeeks(14);
        }
    }
};
