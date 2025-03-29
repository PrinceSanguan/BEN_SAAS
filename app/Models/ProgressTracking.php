<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProgressTracking extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'progress_tracking';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'test_type',
        'baseline_value',
        'current_value',
        'percentage_increase',
        'last_updated',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'baseline_value' => 'decimal:1',
        'current_value' => 'decimal:1',
        'percentage_increase' => 'decimal:2',
        'last_updated' => 'datetime',
    ];

    /**
     * Relationship: ProgressTracking belongs to a User.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Calculate percentage increase from baseline to current value.
     *
     * @return float|null
     */
    public function calculatePercentageIncrease(): ?float
    {
        if ($this->baseline_value <= 0) {
            return null;
        }

        return round((($this->current_value - $this->baseline_value) / $this->baseline_value) * 100, 2);
    }

    /**
     * Update the progress with a new value and recalculate percentage.
     *
     * @param float $newValue
     * @return bool
     */
    public function updateProgress(float $newValue): bool
    {
        $this->current_value = $newValue;
        $this->percentage_increase = $this->calculatePercentageIncrease();
        $this->last_updated = now();

        return $this->save();
    }

    /**
     * Get all available test types.
     * 
     * @return array
     */
    public static function getTestTypes(): array
    {
        return [
            'standing_long_jump',
            'single_leg_jump_left',
            'single_leg_jump_right',
            'single_leg_wall_sit_left',
            'single_leg_wall_sit_right',
            'high_plank_assessment',
            'bent_arm_hang_assessment'
        ];
    }

    /**
     * Scope a query to filter by test type.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $testType
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOfTestType($query, string $testType)
    {
        return $query->where('test_type', $testType);
    }
}
