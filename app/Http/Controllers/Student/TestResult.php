<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\ProgressTracking;

class TestResult extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'session_id',
        'standing_long_jump',
        'single_leg_jump_left',
        'single_leg_jump_right',
        'wall_sit_assessment',
        'high_plank_assessment',
        'bent_arm_hang_assessment',
        'completed_at'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'completed_at' => 'datetime',
        'standing_long_jump' => 'float',
        'single_leg_jump_left' => 'float',
        'single_leg_jump_right' => 'float',
        'wall_sit_assessment' => 'float',
        'high_plank_assessment' => 'float',
        'bent_arm_hang_assessment' => 'float',
    ];

    /**
     * The "booted" method of the model.
     */
    protected static function booted()
    {
        static::saved(function ($testResult) {
            // Update progress tracking after test result is saved
            static::updateProgressTracking($testResult);
        });
    }

    /**
     * User relationship
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Session relationship
     */
    public function session(): BelongsTo
    {
        return $this->belongsTo(TrainingSession::class, 'session_id');
    }

    /**
     * Update progress tracking when test result is saved
     */
    protected static function updateProgressTracking(TestResult $testResult): void
    {
        // Get first test result (baseline) for this user
        $baselineResult = static::where('user_id', $testResult->user_id)
            ->join('training_sessions', 'test_results.session_id', '=', 'training_sessions.id')
            ->orderBy('training_sessions.week_number')
            ->select('test_results.*')
            ->first();

        if (!$baselineResult) {
            return;
        }

        // Fields to track
        $testFields = [
            'standing_long_jump',
            'single_leg_jump_left',
            'single_leg_jump_right',
            'wall_sit_assessment',
            'high_plank_assessment',
            'bent_arm_hang_assessment'
        ];

        foreach ($testFields as $field) {
            // Skip if current test doesn't have this field
            if (!isset($testResult->$field) || $testResult->$field === null) {
                continue;
            }

            // Get baseline value
            $baselineValue = $baselineResult->$field ?? 0;

            // Skip if baseline is zero to avoid division by zero
            if ($baselineValue <= 0) {
                continue;
            }

            // Calculate percentage
            $percentageIncrease = round((($testResult->$field - $baselineValue) / $baselineValue) * 100, 2);

            // Update or create progress tracking record
            ProgressTracking::updateOrCreate(
                [
                    'user_id' => $testResult->user_id,
                    'test_type' => $field,
                ],
                [
                    'baseline_value' => $baselineValue,
                    'current_value' => $testResult->$field,
                    'percentage_increase' => $percentageIncrease,
                    'last_updated' => now(),
                ]
            );
        }
    }

    /**
     * Get the latest test results for a user
     *
     * @param int $userId
     * @return self|null
     */
    public static function getLatestForUser(int $userId): ?self
    {
        return static::where('user_id', $userId)
            ->join('training_sessions', 'test_results.session_id', '=', 'training_sessions.id')
            ->orderByDesc('training_sessions.week_number')
            ->select('test_results.*')
            ->first();
    }

    /**
     * Get the baseline test results for a user
     *
     * @param int $userId
     * @return self|null
     */
    public static function getBaselineForUser(int $userId): ?self
    {
        return static::where('user_id', $userId)
            ->join('training_sessions', 'test_results.session_id', '=', 'training_sessions.id')
            ->orderBy('training_sessions.week_number')
            ->select('test_results.*')
            ->first();
    }
}
