<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PreTrainingTest extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'pre_training_tests';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'standing_long_jump',
        'single_leg_jump_left',
        'single_leg_jump_right',
        'single_leg_wall_sit_left',
        'single_leg_wall_sit_right',
        'core_endurance_left',
        'core_endurance_right',
        'bent_arm_hang',
        'tested_at',
        'notes'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'standing_long_jump' => 'float',
        'single_leg_jump_left' => 'float',
        'single_leg_jump_right' => 'float',
        'wall_sit' => 'float',
        'core_endurance_left' => 'float',
        'core_endurance_right' => 'float',
        'bent_arm_hang' => 'float',
        'tested_at' => 'datetime',
    ];

    /**
     * Relationship: PreTrainingTest belongs to a User with the role 'student'.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class)->where('user_role', 'student');
    }

    /**
     * Calculate jump asymmetry percentage between left and right leg
     *
     * @return float|null
     */
    public function calculateJumpAsymmetry(): ?float
    {
        if ($this->single_leg_jump_left && $this->single_leg_jump_right) {
            $higher = max($this->single_leg_jump_left, $this->single_leg_jump_right);
            $lower = min($this->single_leg_jump_left, $this->single_leg_jump_right);

            if ($higher > 0) {
                return round((($higher - $lower) / $higher) * 100, 1);
            }
        }

        return null;
    }

    /**
     * Get all data as a formatted array
     *
     * @return array
     */
    public function getResults(): array
    {
        return [
            'standing_long_jump' => $this->standing_long_jump,
            'single_leg_jump_left' => $this->single_leg_jump_left,
            'single_leg_jump_right' => $this->single_leg_jump_right,
            'wall_sit' => $this->wall_sit,
            'core_endurance' => $this->core_endurance,
            'bent_arm_hang' => $this->bent_arm_hang,
            'asymmetry' => $this->calculateJumpAsymmetry(),
            'tested_at' => $this->tested_at?->format('Y-m-d H:i:s'),
        ];
    }
}
