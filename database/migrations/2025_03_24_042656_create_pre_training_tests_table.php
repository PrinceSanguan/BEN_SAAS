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
        Schema::create('pre_training_tests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->float('standing_long_jump')->nullable()->comment('Measured in centimeters');
            $table->float('single_leg_jump_left')->nullable()->comment('Measured in centimeters');
            $table->float('single_leg_jump_right')->nullable()->comment('Measured in centimeters');
            $table->float('single_leg_wall_sit_left')->nullable()->comment('Measured in seconds');
            $table->float('single_leg_wall_sit_right')->nullable()->comment('Measured in seconds');
            $table->float('core_endurance_left')->nullable()->comment('Measured in seconds');
            $table->float('core_endurance_right')->nullable()->comment('Measured in seconds');
            $table->float('bent_arm_hang')->nullable()->comment('Measured in seconds');
            $table->timestamp('tested_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            // Add index for faster queries
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pre_training_tests');
    }
};
