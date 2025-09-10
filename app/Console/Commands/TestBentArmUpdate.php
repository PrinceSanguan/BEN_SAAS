<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\TestResult;
use App\Services\ProgressTrackingService;

class TestBentArmUpdate extends Command
{
  protected $signature = 'test:bent-arm {username} {value}';
  protected $description = 'Test updating only bent arm hang value for an athlete';

  private $progressService;

  public function __construct(ProgressTrackingService $progressService)
  {
    parent::__construct();
    $this->progressService = $progressService;
  }

  public function handle()
  {
    $username = $this->argument('username');
    $value = $this->argument('value');

    $this->info('🔧 TESTING BENT ARM HANG UPDATE');
    $this->info('=' . str_repeat('=', 50));

    // Find user
    $user = User::where('username', $username)->first();
    if (!$user) {
      $this->error("User '{$username}' not found");
      return 1;
    }

    // Find their most recent test result
    $testResult = TestResult::where('user_id', $user->id)
      ->orderBy('created_at', 'desc')
      ->first();

    if (!$testResult) {
      $this->error("No test results found for {$username}");
      return 1;
    }

    $this->info("Found test result for Session ID: {$testResult->session_id}");
    $this->info("Current bent arm hang value: " . ($testResult->bent_arm_hang_assessment ?? 'Not recorded'));

    // Update the bent arm hang value
    $testResult->bent_arm_hang_assessment = $value;
    $testResult->save();

    $this->info("✅ Updated bent arm hang to: {$value} seconds");

    // Update progress tracking
    $testData = $testResult->toArray();
    $this->progressService->updateProgressFromTestResult(
      $user->id,
      $testResult->session_id,
      $testData
    );

    $this->info("✅ Progress charts updated");

    // Verify the update
    $updatedResult = TestResult::find($testResult->id);
    if ($updatedResult->bent_arm_hang_assessment == $value) {
      $this->info("✅ VERIFICATION: Value successfully saved in database");
    } else {
      $this->error("❌ VERIFICATION FAILED: Value not saved correctly");
    }

    return 0;
  }
}
