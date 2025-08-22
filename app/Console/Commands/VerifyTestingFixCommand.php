<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Block;
use App\Models\TrainingSession;
use App\Models\TestResult;
use App\Models\UserStat;
use App\Services\XpService;
use Carbon\Carbon;

class VerifyTestingFixCommand extends Command
{
  protected $signature = 'test:verify-testing-fix {--cleanup : Clean up test data after verification}';
  protected $description = 'Verify that the testing session save bug has been fixed';

  protected $xpService;

  public function __construct(XpService $xpService)
  {
    parent::__construct();
    $this->xpService = $xpService;
  }

  public function handle()
  {
    $this->info('🧪 VERIFYING TESTING SESSION SAVE FIX');
    $this->info('=' . str_repeat('=', 50));
    $this->newLine();

    // Step 1: Create test data
    $this->info('📝 Creating test data...');
    $testData = $this->createTestData();

    if (!$testData) {
      $this->error('❌ Failed to create test data');
      return 1;
    }

    $this->info('✅ Test data created successfully');
    $this->newLine();

    // Step 2: Test the save functionality
    $result = $this->testSaveFunctionality($testData);

    // Step 3: Clean up if requested
    if ($this->option('cleanup')) {
      $this->cleanupTestData($testData);
      $this->info('🧹 Test data cleaned up');
    } else {
      $this->warn('⚠️  Test data left in database. Run with --cleanup to remove it.');
    }

    $this->newLine();

    if ($result) {
      $this->info('🎉 VERIFICATION SUCCESSFUL: The bug has been fixed!');
      return 0;
    } else {
      $this->error('❌ VERIFICATION FAILED: The bug still exists!');
      $this->error('🔧 Please apply the fix to app/Services/XpService.php first.');
      return 1;
    }
  }

  private function createTestData()
  {
    try {
      // Create test user with unique identifier
      $timestamp = now()->format('YmdHis');
      $user = User::create([
        'username' => "test_verify_fix_{$timestamp}",
        'parent_email' => "test_verify_{$timestamp}@example.com",
        'password' => bcrypt('test_password'),
        'email_verified_at' => now(),
      ]);

      // Create user stats
      UserStat::create([
        'user_id' => $user->id,
        'total_xp' => 0,
        'strength_level' => 1,
        'consistency_score' => 0,
      ]);

      // Find or create Block 1
      $block = Block::where('block_number', 1)->first();
      if (!$block) {
        $block = Block::create([
          'block_number' => 1,
          'start_date' => Carbon::now()->subWeeks(5),
          'end_date' => Carbon::now()->addWeeks(7),
        ]);
      }

      // Create test session (Block 1, Week 5, Session 2 - the problematic one)
      $session = TrainingSession::create([
        'block_id' => $block->id,
        'week_number' => 5,
        'session_number' => 2,
        'session_type' => 'testing',
        'release_date' => Carbon::now()->subDay(),
      ]);

      return [
        'user' => $user,
        'block' => $block,
        'session' => $session,
      ];
    } catch (\Exception $e) {
      $this->error("Failed to create test data: " . $e->getMessage());
      return null;
    }
  }

  private function testSaveFunctionality($testData)
  {
    $user = $testData['user'];
    $session = $testData['session'];

    $this->info("🎯 Testing Block {$testData['block']->block_number}, Week {$session->week_number}, Session {$session->session_number}");
    $this->newLine();

    // Record initial state
    $initialXp = $user->userStat->total_xp;
    $this->info("📊 Initial XP: {$initialXp}");

    // Create test result with NEW field names (as frontend sends)
    $testResult = TestResult::create([
      'user_id' => $user->id,
      'session_id' => $session->id,
      'standing_long_jump' => 125.5,
      'single_leg_jump_left' => 85.0,
      'single_leg_jump_right' => 87.5,
      'single_leg_wall_sit_left' => 45.0,      // NEW field name
      'single_leg_wall_sit_right' => 47.0,     // NEW field name
      'core_endurance_left' => 52.0,           // NEW field name
      'core_endurance_right' => 54.0,          // NEW field name
      'bent_arm_hang_assessment' => 28.5,
      'completed_at' => now(),
    ]);

    $this->info('💾 Test result saved with NEW field names:');
    $this->line("   - single_leg_wall_sit_left: {$testResult->single_leg_wall_sit_left}");
    $this->line("   - single_leg_wall_sit_right: {$testResult->single_leg_wall_sit_right}");
    $this->line("   - core_endurance_left: {$testResult->core_endurance_left}");
    $this->line("   - core_endurance_right: {$testResult->core_endurance_right}");
    $this->newLine();

    // Test XP service completeness check
    $this->info('🔍 Testing XP service completeness check...');

    try {
      $reflection = new \ReflectionClass($this->xpService);
      $method = $reflection->getMethod('isTestingComplete');
      $method->setAccessible(true);
      $isComplete = $method->invoke($this->xpService, $testResult);

      if ($isComplete) {
        $this->info('✅ XpService correctly identifies session as COMPLETE');
      } else {
        $this->error('❌ XpService incorrectly identifies session as INCOMPLETE');
        $this->error('   This means the field name mismatch bug still exists!');
        return false;
      }
    } catch (\Exception $e) {
      $this->error('❌ Error testing XP service: ' . $e->getMessage());
      return false;
    }

    // Test XP calculation
    $this->info('🏆 Testing XP calculation...');
    try {
      $calculatedXp = $this->xpService->calculateSessionXp($user->id, $session->id);
      $this->info("   Calculated XP: {$calculatedXp}");

      if ($calculatedXp > 0) {
        $this->info('✅ XP calculation working correctly');
      } else {
        $this->error('❌ No XP calculated - session not recognized as complete');
        return false;
      }
    } catch (\Exception $e) {
      $this->error('❌ Error calculating XP: ' . $e->getMessage());
      return false;
    }

    $this->newLine();
    $this->info('🎉 ALL TESTS PASSED!');
    $this->info('The field name mismatch bug has been successfully fixed.');

    return true;
  }

  private function cleanupTestData($testData)
  {
    try {
      // Delete in reverse order of creation to avoid foreign key issues
      TestResult::where('user_id', $testData['user']->id)->delete();
      TrainingSession::where('id', $testData['session']->id)->delete();
      UserStat::where('user_id', $testData['user']->id)->delete();
      $testData['user']->delete();

      $this->info('✅ Test data cleaned up successfully');
    } catch (\Exception $e) {
      $this->warn('⚠️ Warning: Could not clean up all test data: ' . $e->getMessage());
    }
  }
}
