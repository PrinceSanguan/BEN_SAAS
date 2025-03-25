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
        // Check if the table already exists before trying to create it
        if (!Schema::hasTable('xp_transactions')) {
            Schema::create('xp_transactions', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->integer('xp_amount')->default(0);
                $table->string('xp_source', 255);
                $table->timestamp('transaction_date')->useCurrent();
                $table->timestamps();
            });
        }

        // Add any missing indexes to the existing table
        Schema::table('xp_transactions', function (Blueprint $table) {
            // Only add indexes if they don't already exist
            if (!Schema::hasIndex('xp_transactions', 'xp_transactions_user_id_index')) {
                $table->index('user_id');
            }

            if (!Schema::hasIndex('xp_transactions', 'xp_transactions_xp_source_index')) {
                $table->index('xp_source');
            }

            if (!Schema::hasIndex('xp_transactions', 'xp_transactions_transaction_date_index')) {
                $table->index('transaction_date');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Be careful with the user_id index as it's used in a foreign key constraint
        Schema::table('xp_transactions', function (Blueprint $table) {
            if (Schema::hasIndex('xp_transactions', 'xp_transactions_xp_source_index')) {
                $table->dropIndex('xp_transactions_xp_source_index');
            }

            if (Schema::hasIndex('xp_transactions', 'xp_transactions_transaction_date_index')) {
                $table->dropIndex('xp_transactions_transaction_date_index');
            }

            // Don't try to drop the user_id index as it's needed for foreign key
            // if (Schema::hasIndex('xp_transactions', 'xp_transactions_user_id_index')) {
            //     $table->dropIndex('xp_transactions_user_id_index');
            // }
        });
    }
};
