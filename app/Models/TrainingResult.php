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
     * Relationship: TrainingResult belongs to a User with the role 'student'.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class)->where('user_role', 'student');
    }
}
