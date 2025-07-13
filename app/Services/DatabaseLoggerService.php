<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class DatabaseLoggerService
{
  /**
   * Log training score submission to database
   */
  public static function logTrainingSubmission($level, $message, $context = [])
  {
    try {
      DB::table('application_logs')->insert([
        'level' => $level,
        'message' => $message,
        'context' => json_encode($context),
        'logged_at' => Carbon::now(),
        'created_at' => Carbon::now(),
        'updated_at' => Carbon::now(),
      ]);
    } catch (\Exception $e) {
      // Fallback to regular log if database fails
      Log::error('Database logging failed: ' . $e->getMessage());
    }
  }

  /**
   * Get recent training logs from database
   */
  public static function getRecentLogs($limit = 200)
  {
    try {
      return DB::table('application_logs')
        ->where('message', 'like', '%Training score%')
        ->orWhere('message', 'like', '%Data persistence verification%')
        ->orWhere('message', 'like', '%Manual data correction%')
        ->orderBy('logged_at', 'desc')
        ->limit($limit)
        ->get()
        ->map(function ($log) {
          $context = json_decode($log->context, true) ?? [];

          // Format as log string for compatibility with existing frontend
          $timestamp = Carbon::parse($log->logged_at)->format('Y-m-d H:i:s');

          $contextString = '';
          if (!empty($context)) {
            $contextItems = [];

            if (isset($context['user_id'])) {
              $contextItems[] = "user_id: {$context['user_id']}";
            }
            if (isset($context['username'])) {
              $contextItems[] = "username: \"{$context['username']}\"";
            }
            if (isset($context['session_id'])) {
              $contextItems[] = "session_id: {$context['session_id']}";
            }
            if (isset($context['block_number'])) {
              $contextItems[] = "block_number: \"{$context['block_number']}\"";
            }
            if (isset($context['week_number'])) {
              $contextItems[] = "week_number: {$context['week_number']}";
            }

            $contextString = ' {' . implode(', ', $contextItems) . '}';
          }

          return "[{$timestamp}] {$log->level}: {$log->message}{$contextString}";
        })
        ->toArray();
    } catch (\Exception $e) {
      return [
        '[' . now()->format('Y-m-d H:i:s') . '] ERROR: Failed to retrieve database logs: ' . $e->getMessage()
      ];
    }
  }
}
