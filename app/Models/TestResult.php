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
        'single_leg_wall_sit_left', // Changed from wall_sit_assessment
        'single_leg_wall_sit_right',
        'core_endurance_left',
        'core_endurance_right',
        'bent_arm_hang_assessment',
        'completed_at'
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'completed_at' => 'datetime',
        'standing_long_jump' => 'float',
        'single_leg_jump_left' => 'float',
        'single_leg_jump_right' => 'float',
        'single_leg_wall_sit_left' => 'float', // Changed from wall_sit_assessment
        'single_leg_wall_sit_right' => 'float',
        'core_endurance_left' => 'float',
        'core_endurance_right' => 'float',
        'bent_arm_hang_assessment' => 'float',
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
