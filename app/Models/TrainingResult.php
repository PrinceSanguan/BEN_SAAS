<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrainingResult extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'test_results';

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
     * Relationship: TrainingResult belongs to a User with the role 'student'.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class)->where('user_role', 'student');
    }

    /**
     * Relationship: TrainingResult belongs to a TrainingSession.
     */
    public function session(): BelongsTo
    {
        return $this->belongsTo(TrainingSession::class, 'session_id');
    }

    /**
     * Check if the warmup was completed.
     *
     * @return bool
     */
    public function isWarmupCompleted(): bool
    {
        return $this->warmup_completed === 'YES';
    }

    /**
     * Get all scores as an array.
     *
     * @return array
     */
    public function getAllScores(): array
    {
        return [
            'standing_long_jump' => $this->standing_long_jump,
            'single_leg_jump_left' => $this->single_leg_jump_left,
            'single_leg_jump_right' => $this->single_leg_jump_right,
            'wall_sit' => $this->wall_sit_assessment,
            'high_plank' => $this->high_plank_assessment,
            'bent_arm_hang' => $this->bent_arm_hang_assessment
        ];
    }

    /**
     * Scope a query to only include completed sessions.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeCompleted($query)
    {
        return $query->whereNotNull('completed_at');
    }
}
