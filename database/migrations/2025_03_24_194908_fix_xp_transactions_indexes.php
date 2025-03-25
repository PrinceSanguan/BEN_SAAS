<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First check if the table exists
        if (Schema::hasTable('xp_transactions')) {
            // Add any missing indexes without trying to remove existing ones
            if (!Schema::hasIndex('xp_transactions', 'xp_transactions_xp_source_index')) {
                Schema::table('xp_transactions', function (Blueprint $table) {
                    $table->index('xp_source');
                });
            }

            if (!Schema::hasIndex('xp_transactions', 'xp_transactions_transaction_date_index')) {
                Schema::table('xp_transactions', function (Blueprint $table) {
                    $table->index('transaction_date');
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Do nothing in down migration since we're not removing anything
    }
};
