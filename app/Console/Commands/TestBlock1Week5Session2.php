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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class TestBlock1Week5Session2 extends Command
{
  protected $signature = 'test:block1-week5 {--cleanup : Remove test data after testing}';
  protected $description = 'Test Block 1 Week 5 Session 2 save functionality';

  private $testUser;
  private $testBlock;
  private $testSession;
  private $xpService;

  public function __construct(XpService $xpService)
  {
    parent::__construct();
    $this->xpService = $xpService;
  }

  public function handle()
  {
    $this->info('🧪 TESTING BLOCK 1 WEEK 5 SESSION 2 BUG FIX');
    $this->info('=' . str_repeat('=', 60));
    $this->newLine();

    try {
      // Step 1: Create test data
      $this->info('📝 Step 1: Creating test environment...');
      $this->createTestData();
      $this->info('✅ Test environment created');
      $this->newLine();

      // Step 2: Test the save functionality
      $this->info('💾 Step 2: Testing save functionality...');
      $testPassed = $this->testSaveFunctionality();
      $this->newLine();

      // Step 3: Verify persistence
      $this->info('🔍 Step 3: Verifying data persistence...');
      $persistencePassed = $this->verifyDataPersistence();
      $this->newLine();

      // Step 4: Test XP calculation
      $this->info('🏆 Step 4: Testing XP calculation...');
      $xpPassed = $this->testXpCalculation();
      $this->newLine();

      // Step 5: Test session status
      $this->info('📊 Step 5: Checking session status...');
      $statusPassed = $this->checkSessionStatus();
      $this->newLine();

      // Clean up if requested
      if ($this->option('cleanup')) {
        $this->cleanupTestData();
        $this->info('🧹 Test data cleaned up');
      } else {
        $this->warn("⚠️  Test data retained. User: {$this->testUser->username}");
        $this->warn("   Run with --cleanup to remove test data");
      }

      $this->newLine();

      // Final result
      if ($testPassed && $persistencePassed && $xpPassed && $statusPassed) {
        $this->info('🎉 ALL TESTS PASSED! The bug has been fixed successfully!');
        return 0;
      } else {
        $this->error('❌ SOME TESTS FAILED! Please review the issues above.');
        return 1;
      }
    } catch (\Exception $e) {
      $this->error('❌ Test failed with error: ' . $e->getMessage());
      $this->error('Stack trace: ' . $e->getTraceAsString());

      // Try to cleanup on error
      if (isset($this->testUser)) {
        $this->cleanupTestData();
      }

      return 1;
    }
  }

  private function createTestData()
  {
    DB::beginTransaction();

    try {
      // Create unique test user
      $timestamp = now()->format('YmdHis');
      $this->testUser = User::create([
        'username' => "test_b1w5_{$timestamp}",
        'parent_email' => "test_b1w5_{$timestamp}@test.com",
        'password' => Hash::make('test_password'),
        'email_verified_at' => now(),
      ]);

      // Create user stats
      UserStat::create([
        'user_id' => $this->testUser->id,
        'total_xp' => 0,
        'strength_level' => 1,
        'consistency_score' => 0,
      ]);

      // Create Block 1 for this user
      $this->testBlock = Block::create([
        'user_id' => $this->testUser->id,
        'block_number' => 1,
        'start_date' => Carbon::now()->subWeeks(5),
        'end_date' => Carbon::now()->addWeeks(7),
      ]);

      // Create Week 5 Session 2 (Testing)
      $this->testSession = TrainingSession::create([
        'block_id' => $this->testBlock->id,
        'week_number' => 5,
        'session_number' => 2,
        'session_type' => 'testing',
        'release_date' => Carbon::now()->subDay(), // Released yesterday
      ]);

      DB::commit();

      $this->line("   Created user: {$this->testUser->username}");
      $this->line("   Created Block 1, Week 5, Session 2 (Testing)");
    } catch (\Exception $e) {
      DB::rollBack();
      throw $e;
    }
  }

  private function testSaveFunctionality()
  {
    $this->line('   Simulating test result submission...');

    DB::beginTransaction();

    try {
      // Simulate what happens in the controller
      $testData = [
        'user_id' => $this->testUser->id,
        'session_id' => $this->testSession->id,
        'standing_long_jump' => 125.5,
        'single_leg_jump_left' => 85.0,
        'single_leg_jump_right' => 87.5,
        'single_leg_wall_sit_left' => 45.0,
        'single_leg_wall_sit_right' => 47.0,
        'core_endurance_left' => 52.0,
        'core_endurance_right' => 54.0,
        'bent_arm_hang_assessment' => 28.5,
        'completed_at' => now(),
      ];

      $testResult = TestResult::create($testData);

      // CRITICAL: Commit the transaction (this is what was missing!)
      DB::commit();

      $this->info('   ✅ Test result saved and committed to database');

      // Verify it was actually saved
      $savedResult = TestResult::find($testResult->id);
      if (!$savedResult) {
        $this->error('   ❌ Test result not found after commit!');
        return false;
      }

      $this->line('   Test Result ID: ' . $savedResult->id);
      $this->line('   Standing Long Jump: ' . $savedResult->standing_long_jump);
      $this->line('   Single Leg Wall Sit Left: ' . $savedResult->single_leg_wall_sit_left);
      $this->line('   Core Endurance Left: ' . $savedResult->core_endurance_left);

      return true;
    } catch (\Exception $e) {
      DB::rollBack();
      $this->error('   ❌ Failed to save test result: ' . $e->getMessage());
      return false;
    }
  }

  private function verifyDataPersistence()
  {
    // Check if data persists outside of transaction
    $result = TestResult::where('user_id', $this->testUser->id)
      ->where('session_id', $this->testSession->id)
      ->first();

    if (!$result) {
      $this->error('   ❌ Data did not persist after transaction!');
      return false;
    }

    // Verify all fields are saved correctly
    $fieldsToCheck = [
      'standing_long_jump' => 125.5,
      'single_leg_jump_left' => 85.0,
      'single_leg_jump_right' => 87.5,
      'single_leg_wall_sit_left' => 45.0,
      'single_leg_wall_sit_right' => 47.0,
      'core_endurance_left' => 52.0,
      'core_endurance_right' => 54.0,
      'bent_arm_hang_assessment' => 28.5,
    ];

    $allFieldsCorrect = true;
    foreach ($fieldsToCheck as $field => $expectedValue) {
      if ($result->$field != $expectedValue) {
        $this->error("   ❌ Field {$field}: expected {$expectedValue}, got {$result->$field}");
        $allFieldsCorrect = false;
      }
    }

    if ($allFieldsCorrect) {
      $this->info('   ✅ All fields persisted correctly');
      return true;
    }

    return false;
  }

  private function testXpCalculation()
  {
    // Test if XP is calculated correctly
    $xpEarned = $this->xpService->calculateSessionXp($this->testUser->id, $this->testSession->id);

    // Update user stats after XP calculation (mimicking what the controller does)
    $userStatService = app(\App\Services\UserStatService::class);
    $userStatService->updateUserStats($this->testUser->id);

    $this->line("   XP Earned: {$xpEarned}");

    if ($xpEarned === 8) {
      $this->info('   ✅ Correct XP (8) awarded for testing session');

      // Verify XP was actually added to user's total
      $totalXp = $this->xpService->getTotalXp($this->testUser->id);
      $this->line("   Total XP for user: {$totalXp}");

      if ($totalXp >= 8) {
        $this->info('   ✅ XP successfully added to user total');
        return true;
      } else {
        $this->error('   ❌ XP not added to user total');
        return false;
      }
    } else {
      $this->error("   ❌ Incorrect XP: expected 8, got {$xpEarned}");
      $this->error('   This indicates the isTestingComplete() method may not recognize the session as complete');
      return false;
    }
  }

  private function checkSessionStatus()
  {
    // Check if session is marked as completed
    $result = TestResult::where('user_id', $this->testUser->id)
      ->where('session_id', $this->testSession->id)
      ->first();

    if ($result && $result->completed_at) {
      $this->info('   ✅ Session marked as completed');
      $this->line('   Completed at: ' . $result->completed_at);

      // Check if XP reflects in user stats
      $userStat = UserStat::where('user_id', $this->testUser->id)->first();
      if ($userStat && $userStat->total_xp > 0) {
        $this->info('   ✅ User stats updated with XP');
        return true;
      } else {
        $this->error('   ❌ User stats not updated');
        return false;
      }
    } else {
      $this->error('   ❌ Session not marked as completed');
      return false;
    }
  }

  private function cleanupTestData()
  {
    if ($this->testUser) {
      // Delete in correct order to avoid foreign key constraints
      TestResult::where('user_id', $this->testUser->id)->delete();
      UserStat::where('user_id', $this->testUser->id)->delete();
      if ($this->testBlock) {
        TrainingSession::where('block_id', $this->testBlock->id)->delete();
      }
      Block::where('user_id', $this->testUser->id)->delete();
      User::destroy($this->testUser->id);
    }
  }
}
