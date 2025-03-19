<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrainingResult extends Model
{
    // Define the fillable attributes for mass assignment
    protected $fillable = [
        'user_id',
        'standing_long_jump',
        'single_leg_jump_left',
        'single_leg_jump_right',
        'wall_sit',
        'core_endurance',
        'bent_arm_hang'
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'standing_long_jump' => 'float',
            'single_leg_jump_left' => 'float',
            'single_leg_jump_right' => 'float',
            'wall_sit' => 'float',
            'core_endurance' => 'float',
            'bent_arm_hang' => 'float',
        ];
    }

    /**
     * Relationship: TrainingResult belongs to a User with the role 'student'.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class)->where('user_role', 'student');
    }
}
