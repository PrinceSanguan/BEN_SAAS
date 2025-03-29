<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TestResult extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'user_id',
        'session_id',
        'standing_long_jump',
        'single_leg_jump_left',
        'single_leg_jump_right',
        'single_leg_wall_sit_left',
        'single_leg_wall_sit_right',
        'high_plank_assessment',
        'bent_arm_hang_assessment',
        'completed_at',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'standing_long_jump' => 'decimal:1',
        'single_leg_jump_left' => 'decimal:1',
        'single_leg_jump_right' => 'decimal:1',
        'single_leg_wall_sit_left' => 'decimal:1',
        'single_leg_wall_sit_right' => 'decimal:1',
        'high_plank_assessment' => 'decimal:1',
        'bent_arm_hang_assessment' => 'decimal:1',
        'completed_at' => 'datetime',
    ];

    /**
     * Get the user that owns the test result.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the training session associated with this test result.
     */
    public function session()
    {
        return $this->belongsTo(TrainingSession::class, 'session_id');
    }

    /**
     * Calculate percentage improvement from baseline for a specific metric.
     *
     * @param string $metric
     * @param float $baselineValue
     * @return float|null
     */
    public function calculateImprovement($metric, $baselineValue)
    {
        if (!$this->$metric || !$baselineValue) {
            return null;
        }

        return round((($this->$metric - $baselineValue) / $baselineValue) * 100, 2);
    }
}
