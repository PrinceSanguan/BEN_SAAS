<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TrainingSession extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'training_sessions';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'block_id',
        'week_number',
        'session_number',
        'session_type',
        'release_date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'week_number' => 'integer',
        'session_number' => 'integer',
        'release_date' => 'date',
    ];

    /**
     * Relationship: Session belongs to a Block.
     */
    public function block(): BelongsTo
    {
        return $this->belongsTo(Block::class);
    }

    /**
     * Relationship: Session has many TrainingResults.
     */
    public function trainingResults(): HasMany
    {
        return $this->hasMany(TrainingResult::class, 'session_id');
    }

    /**
     * Relationship: Session has many TestResults.
     */
    public function testResults(): HasMany
    {
        return $this->hasMany(TestResult::class, 'session_id');
    }

    /**
     * Scope a query to only include sessions of a specific type.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $type
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('session_type', $type);
    }

    /**
     * Scope a query to only include sessions released before a given date.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string|null $date
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeReleasedBefore($query, $date = null)
    {
        $date = $date ?? now();
        return $query->where('release_date', '<=', $date);
    }

    /**
     * Determine if this session is a training session.
     * 
     * @return bool
     */
    public function isTrainingSession(): bool
    {
        return $this->session_type === 'training';
    }

    /**
     * Determine if this session is a testing session.
     * 
     * @return bool
     */
    public function isTestingSession(): bool
    {
        return $this->session_type === 'testing';
    }

    /**
     * Get the session name (e.g., "Week 3 - Session 5").
     * 
     * @return string
     */
    public function getSessionName(): string
    {
        return "Week {$this->week_number} - Session {$this->session_number}";
    }
}
