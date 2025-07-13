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
    protected $table = 'training_results';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'session_id',
        'warmup_completed',
        'plyometrics_score',
        'power_score',
        'lower_body_strength_score',
        'upper_body_core_strength_score',
        'completed_at'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */

    protected $casts = [
        'completed_at' => 'datetime',
        // Keep scores as strings to match validation rules
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
            'plyometrics_score' => $this->plyometrics_score,
            'power_score' => $this->power_score,
            'lower_body_strength_score' => $this->lower_body_strength_score,
            'upper_body_core_strength_score' => $this->upper_body_core_strength_score,
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
