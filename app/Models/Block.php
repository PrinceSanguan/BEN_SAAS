<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Block extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'block_number',
        'start_date',
        'end_date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'block_number' => 'integer',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    /**
     * Relationship: Block has many Sessions.
     */
    public function sessions(): HasMany
    {
        return $this->hasMany(TrainingSession::class);
    }

    /**
     * Get the formatted name of the block (e.g., "Block 1").
     * 
     * @return string
     */
    public function getBlockName(): string
    {
        return "Block {$this->block_number}";
    }

    /**
     * Get the duration of the block in weeks.
     * 
     * @return int
     */
    public function getDurationInWeeks(): int
    {
        return ceil($this->start_date->diffInDays($this->end_date) / 7);
    }

    /**
     * Check if a date falls within this block's date range.
     * 
     * @param string|null $date
     * @return bool
     */
    public function containsDate($date = null): bool
    {
        $date = $date ? now()->parse($date) : now();
        return $date->between($this->start_date, $this->end_date);
    }

    /**
     * Get the current active block.
     * 
     * @return Block|null
     */
    public static function getCurrentBlock()
    {
        return self::where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->first();
    }
}
