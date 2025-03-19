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
        Schema::create('test_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('session_id')->constrained('training_sessions')->onDelete('cascade');
            $table->decimal('standing_long_jump', 5, 1)->nullable();
            $table->decimal('single_leg_jump_left', 5, 1)->nullable();
            $table->decimal('single_leg_jump_right', 5, 1)->nullable();
            $table->decimal('wall_sit_assessment', 5, 1)->nullable();
            $table->decimal('high_plank_assessment', 5, 1)->nullable();
            $table->decimal('bent_arm_hang_assessment', 5, 1)->nullable();
            $table->timestamp('completed_at')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('test_results');
    }
};
