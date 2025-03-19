<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class XpTransaction extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'xp_amount',
        'xp_source',
        'transaction_date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'xp_amount' => 'integer',
        'transaction_date' => 'datetime',
    ];

    /**
     * Get the user that owns the XP transaction.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope a query to only include positive XP transactions.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeGains($query)
    {
        return $query->where('xp_amount', '>', 0);
    }

    /**
     * Scope a query to only include transactions for a specific source.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $source
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeFromSource($query, string $source)
    {
        return $query->where('xp_source', $source);
    }
}
