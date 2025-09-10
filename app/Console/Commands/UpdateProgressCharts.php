<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\TestResult;
use App\Services\ProgressTrackingService;

class UpdateProgressCharts extends Command
{
  protected $signature = 'progress:update {username?} {--all : Update all athletes}';
  protected $description = 'Update progress charts for athletes with existing test data';

  private $progressService;

  public function __construct(ProgressTrackingService $progressService)
  {
    parent::__construct();
    $this->progressService = $progressService;
  }

  public function handle()
  {
    $this->info('🔄 UPDATING PROGRESS CHARTS');
    $this->info('=' . str_repeat('=', 50));
    $this->newLine();

    $username = $this->argument('username');
    $updateAll = $this->option('all');

    if (!$username && !$updateAll) {
      $this->error('Please specify a username or use --all flag');
      return 1;
    }

    if ($username) {
      // Update specific athlete
      $user = User::where('username', $username)->first();

      if (!$user) {
        $this->error("User '{$username}' not found");
        return 1;
      }

      $this->updateUserProgress($user);
    } else {
      // Update all athletes
      $users = User::where('user_role', 'student')->get();
      $this->info("Found {$users->count()} athletes to update");
      $this->newLine();

      $bar = $this->output->createProgressBar($users->count());
      $bar->start();

      foreach ($users as $user) {
        $this->updateUserProgress($user, false);
        $bar->advance();
      }

      $bar->finish();
      $this->newLine();
      $this->newLine();
    }

    $this->info('✅ Progress charts updated successfully!');
    return 0;
  }

  private function updateUserProgress($user, $verbose = true)
  {
    if ($verbose) {
      $this->info("Updating progress for: {$user->username}");
    }

    // Get all test results for this user
    $testResults = TestResult::where('user_id', $user->id)
      ->with('session')
      ->orderBy('created_at')
      ->get();

    if ($testResults->isEmpty()) {
      if ($verbose) {
        $this->warn("  No test results found");
      }
      return;
    }

    $updatedCount = 0;
    foreach ($testResults as $testResult) {
      // Get the test data as array
      $testData = [
        'standing_long_jump' => $testResult->standing_long_jump,
        'single_leg_jump_left' => $testResult->single_leg_jump_left,
        'single_leg_jump_right' => $testResult->single_leg_jump_right,
        'single_leg_wall_sit_left' => $testResult->single_leg_wall_sit_left,
        'single_leg_wall_sit_right' => $testResult->single_leg_wall_sit_right,
        'core_endurance_left' => $testResult->core_endurance_left,
        'core_endurance_right' => $testResult->core_endurance_right,
        'bent_arm_hang_assessment' => $testResult->bent_arm_hang_assessment,
      ];

      // Update progress tracking
      $this->progressService->updateProgressFromTestResult(
        $user->id,
        $testResult->session_id,
        $testData
      );
      $updatedCount++;
    }

    if ($verbose) {
      $this->info("  ✓ Updated {$updatedCount} test sessions");

      // Show specific bent arm hang data if present
      $bentArmData = $testResults->where('bent_arm_hang_assessment', '!=', null)
        ->pluck('bent_arm_hang_assessment')
        ->filter()
        ->values();

      if ($bentArmData->count() > 0) {
        $this->info("  ✓ Bent Arm Hang values found: " . $bentArmData->implode(', ') . " seconds");
      }
    }
  }
}
