<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserStat extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'total_xp',
        'strength_level',
        'sessions_completed',
        'sessions_available',
        'consistency_score',
        'last_updated',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'total_xp' => 'integer',
        'strength_level' => 'integer',
        'sessions_completed' => 'integer',
        'sessions_available' => 'integer',
        'consistency_score' => 'decimal:2',
        'last_updated' => 'datetime',
    ];

    /**
     * Relationship: UserStat belongs to a User.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Calculate consistency score as a percentage.
     *
     * @return float
     */
    public function calculateConsistencyScore(): float
    {
        if ($this->sessions_available <= 0) {
            return 0.00;
        }

        return round(($this->sessions_completed / $this->sessions_available) * 100, 2);
    }

    /**
     * Update the consistency score.
     *
     * @return bool
     */
    public function updateConsistencyScore(): bool
    {
        $this->consistency_score = $this->calculateConsistencyScore();
        return $this->save();
    }

    /**
     * Scope a query to order by strength level.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $direction
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOrderByStrengthLevel($query, $direction = 'desc')
    {
        return $query->orderBy('strength_level', $direction)
            ->orderBy('total_xp', $direction);
    }

    /**
     * Scope a query to order by consistency score.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $direction
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOrderByConsistency($query, $direction = 'desc')
    {
        return $query->orderBy('consistency_score', $direction);
    }
}
