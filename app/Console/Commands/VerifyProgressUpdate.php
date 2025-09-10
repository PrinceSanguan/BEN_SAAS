<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\TestResult;
use App\Models\TrainingSession;
use App\Services\ProgressTrackingService;
use Carbon\Carbon;

class VerifyProgressUpdate extends Command
{
  protected $signature = 'progress:verify {username}';
  protected $description = 'Verify that progress updates are working correctly for a specific athlete';

  private $progressService;

  public function __construct(ProgressTrackingService $progressService)
  {
    parent::__construct();
    $this->progressService = $progressService;
  }

  public function handle()
  {
    $username = $this->argument('username');

    $this->info('🔍 VERIFYING PROGRESS UPDATE FOR: ' . $username);
    $this->info('=' . str_repeat('=', 50));
    $this->newLine();

    // Find the user
    $user = User::where('username', $username)->first();

    if (!$user) {
      $this->error("User '{$username}' not found");
      return 1;
    }

    // Get all test results
    $testResults = TestResult::where('user_id', $user->id)
      ->with('session.block')
      ->orderBy('created_at')
      ->get();

    if ($testResults->isEmpty()) {
      $this->warn('No test results found for this athlete');
      return 1;
    }

    $this->info('📊 Test Results Summary:');
    $this->info('Total test sessions: ' . $testResults->count());
    $this->newLine();

    // Display each test session
    foreach ($testResults as $result) {
      $session = $result->session;
      $block = $session->block ?? null;

      $this->info('Block ' . ($block ? $block->block_number : '?') .
        ' - Week ' . $session->week_number .
        ' (Session #' . $session->id . ')');

      $this->table(
        ['Test', 'Value'],
        [
          ['Standing Long Jump', $result->standing_long_jump . ' cm'],
          ['Single Leg Jump (L)', $result->single_leg_jump_left . ' cm'],
          ['Single Leg Jump (R)', $result->single_leg_jump_right . ' cm'],
          ['Wall Sit (L)', $result->single_leg_wall_sit_left . ' sec'],
          ['Wall Sit (R)', $result->single_leg_wall_sit_right . ' sec'],
          ['Core Endurance (L)', $result->core_endurance_left . ' sec'],
          ['Core Endurance (R)', $result->core_endurance_right . ' sec'],
          ['Bent Arm Hang', $result->bent_arm_hang_assessment ? $result->bent_arm_hang_assessment . ' sec' : 'Not recorded'],
        ]
      );

      $this->info('Completed at: ' . Carbon::parse($result->completed_at)->format('Y-m-d H:i:s'));
      $this->newLine();
    }

    // Check for bent arm hang specifically
    $bentArmResults = $testResults->filter(function ($result) {
      return $result->bent_arm_hang_assessment !== null;
    });

    if ($bentArmResults->count() > 0) {
      $this->info('✅ Bent Arm Hang Results Found:');
      foreach ($bentArmResults as $result) {
        $this->info('  - ' . $result->bent_arm_hang_assessment . ' seconds (Block ' .
          ($result->session->block->block_number ?? '?') . ', Week ' .
          $result->session->week_number . ')');
      }
    } else {
      $this->warn('⚠️  No Bent Arm Hang results recorded');
    }

    $this->newLine();
    $this->info('💡 To update progress charts for this athlete, run:');
    $this->info('   php artisan progress:update ' . $username);

    return 0;
  }
}
