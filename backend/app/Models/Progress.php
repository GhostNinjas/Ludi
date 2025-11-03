<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Progress extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'profile_id',
        'module_id',
        'date',
        'stars',
        'time_spent_sec',
        'accuracy',
        'level',
        'errors_count',
        'meta',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date' => 'date',
            'meta' => 'array',
        ];
    }

    /**
     * Get the profile that owns the progress.
     */
    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }

    /**
     * Get the module that owns the progress.
     */
    public function module()
    {
        return $this->belongsTo(Module::class);
    }
}
