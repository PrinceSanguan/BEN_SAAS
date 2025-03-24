<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'username',
        'parent_email',
        'password',
        'user_role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Relationship: User has one TrainingResult
     */
    public function trainingResults(): HasOne
    {
        return $this->hasOne(TrainingResult::class);
    }

    /**
     * Relationship: User has one PreTrainingTest (most recent)
     */
    public function preTrainingTest(): HasOne
    {
        return $this->hasOne(PreTrainingTest::class)->latest('tested_at');
    }

    /**
     * Relationship: User has many PreTrainingTests (history)
     */
    public function preTrainingTests(): HasMany
    {
        return $this->hasMany(PreTrainingTest::class)->orderBy('tested_at', 'desc');
    }

    /**
     * Check if user is a student
     */
    public function isStudent(): bool
    {
        return $this->user_role === 'student';
    }

    /**
     * Check if user is an admin
     */
    public function isAdmin(): bool
    {
        return $this->user_role === 'admin';
    }
}
