<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\UserStatService;
use App\Models\User;

class RefreshConsistencyCommand extends Command
{
  protected $signature = 'stats:refresh-consistency {--user-id= : Refresh stats for a specific user ID}';
  protected $description = 'Refresh consistency scores for all users or a specific user';

  protected $userStatService;

  public function __construct(UserStatService $userStatService)
  {
    parent::__construct();
    $this->userStatService = $userStatService;
  }

  public function handle()
  {
    $userId = $this->option('user-id');

    if ($userId) {
      // Refresh specific user
      $user = User::find($userId);
      if (!$user) {
        $this->error("User with ID {$userId} not found.");
        return 1;
      }

      $this->info("Refreshing consistency score for user: {$user->username}");
      $this->userStatService->updateUserStats($userId);
      $this->info("✅ Consistency score updated successfully!");
    } else {
      // Refresh all users
      $this->info("Refreshing consistency scores for all users...");

      $users = User::where('user_role', 'student')->get();
      $total = $users->count();

      if ($total === 0) {
        $this->info("No student users found.");
        return 0;
      }

      $progressBar = $this->output->createProgressBar($total);
      $progressBar->start();

      foreach ($users as $user) {
        $this->userStatService->updateUserStats($user->id);
        $progressBar->advance();
      }

      $progressBar->finish();
      $this->newLine();
      $this->info("✅ Successfully updated consistency scores for {$total} users!");
    }

    return 0;
  }
}
