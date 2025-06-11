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
     * Determine if this session is a rest session.
     * 
     * @return bool
     */
    public function isRestSession(): bool
    {
        return $this->session_type === 'rest';
    }

    /**
     * Check if this week is a rest week (weeks 7 and 14).
     * 
     * @return bool
     */
    public function isRestWeek(): bool
    {
        return in_array($this->week_number, [6, 12]);
    }

    /**
     * Check if this week has testing sessions (weeks 6 and 13).
     * 
     * @return bool
     */
    public function isTestingWeek(): bool
    {
        return in_array($this->week_number, [5, 11]);
    }

    /**
     * Get the session name (e.g., "Week 3 - Session 5").
     * 
     * @return string
     */
    public function getSessionName(): string
    {
        if ($this->session_type === 'rest') {
            return "Week {$this->week_number} - Rest Week";
        }

        return "Week {$this->week_number} - Session {$this->session_number}";
    }

    /**
     * Get the display label for this session.
     * 
     * @return string
     */
    public function getDisplayLabel(): string
    {
        switch ($this->session_type) {
            case 'testing':
                return 'TESTING';
            case 'rest':
                return 'REST WEEK';
            default:
                return "Session {$this->session_number}";
        }
    }

    /**
     * Scope to get sessions for new schedule structure.
     * 
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeNewSchedule($query)
    {
        return $query->where(function ($q) {
            // Weeks 6 and 13 have testing
            $q->whereIn('week_number', [6, 13])->where('session_type', 'testing')
                // Weeks 7 and 14 are rest weeks
                ->orWhereIn('week_number', [7, 14])->where('session_type', 'rest')
                // All other weeks have training only
                ->orWhereNotIn('week_number', [6, 7, 13, 14])->where('session_type', 'training');
        });
    }
}
