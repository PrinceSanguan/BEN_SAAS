<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserStat;
use App\Models\TrainingResult;
use App\Models\TestResult;
use App\Models\TrainingSession;
use App\Services\XpService;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class UserStatService
{
    protected $xpService;

    /**
     * Create a new service instance.
     *
     * @param XpService $xpService
     */
    public function __construct(XpService $xpService)
    {
        $this->xpService = $xpService;
    }

    /**
     * Update stats for all users or a specific user
     *
     * @param int|null $userId
     * @return void
     */
    public function updateStats(?int $userId = null)
    {
        // If a specific user ID is provided, only update that user
        $query = User::where('user_role', 'student');
        if ($userId) {
            $query->where('id', $userId);
        }

        $users = $query->get();

        foreach ($users as $user) {
            $this->updateUserStats($user->id);
        }
    }

    /**
     * Update stats for a specific user
     *
     * @param int $userId
     * @return UserStat
     */
    public function updateUserStats(int $userId): UserStat
    {
        // Get the user's stats record or create a new one
        $userStat = UserStat::firstOrNew(['user_id' => $userId]);

        // Count completed training sessions (excluding test and rest sessions)
        $completedTrainingSessions = TrainingResult::join('training_sessions', 'training_results.session_id', '=', 'training_sessions.id')
            ->where('training_results.user_id', $userId)
            ->where('training_sessions.session_type', 'training')
            ->count();


        // Get user's blocks first, then count only sessions in those blocks
        $userBlockIds = \App\Models\Block::where('user_id', $userId)->pluck('id');

        // Get only available training sessions for this specific user (those with release_date in the past)
        $availableTrainingSessions = TrainingSession::where('session_type', 'training')
            ->where('release_date', '<=', now())
            ->whereIn('block_id', $userBlockIds)
            ->count();

        // Get XP data from XP service
        $totalXp = $this->xpService->getTotalXp($userId);
        $strengthLevel = $this->xpService->getCurrentLevel($userId);

        // Update the user stats
        $userStat->user_id = $userId;
        $userStat->total_xp = $totalXp;
        $userStat->strength_level = $strengthLevel;
        $userStat->sessions_completed = $completedTrainingSessions; // Only count training sessions for consistency
        $userStat->sessions_available = $availableTrainingSessions; // Only count available training sessions
        $userStat->last_updated = now();

        // Calculate consistency score based on available training sessions
        if ($availableTrainingSessions > 0) {
            $userStat->consistency_score = ($completedTrainingSessions / $availableTrainingSessions) * 100;
        } else {
            $userStat->consistency_score = 0;
        }

        // Save the stats
        $userStat->save();

        return $userStat;
    }

    /**
     * Update stats after a session is completed
     *
     * @param int $userId
     * @param int $sessionId
     * @return UserStat
     */
    public function updateStatsAfterSession(int $userId, int $sessionId): UserStat
    {
        // First calculate and award XP for the session
        $this->xpService->calculateSessionXp($userId, $sessionId);

        // Then update the user stats
        return $this->updateUserStats($userId);
    }
}
