<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Profile extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'age_range',
        'interests',
        'avatar',
        'settings',
        'streak_days',
        'last_activity_date',
        'total_stars',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'interests' => 'array',
            'settings' => 'array',
            'last_activity_date' => 'date',
        ];
    }

    /**
     * Get the user that owns the profile.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the progress records for the profile.
     */
    public function progress()
    {
        return $this->hasMany(Progress::class);
    }

    /**
     * Update streak based on last activity.
     */
    public function updateStreak(): void
    {
        $today = now()->toDateString();
        $lastActivity = $this->last_activity_date?->toDateString();

        if ($lastActivity === $today) {
            // Already logged activity today
            return;
        }

        if ($lastActivity === now()->subDay()->toDateString()) {
            // Consecutive day
            $this->increment('streak_days');
        } else {
            // Streak broken
            $this->streak_days = 1;
        }

        $this->last_activity_date = $today;
        $this->save();
    }

    /**
     * Get recommended difficulty level based on recent performance.
     */
    public function getRecommendedDifficulty(): int
    {
        $recentProgress = $this->progress()
            ->where('date', '>=', now()->subDays(7))
            ->get();

        if ($recentProgress->isEmpty()) {
            return 1; // Default to easiest
        }

        $avgAccuracy = $recentProgress->avg('accuracy');
        $avgErrors = $recentProgress->avg('errors_count');

        if ($avgAccuracy > 90 && $avgErrors < 2) {
            return 3; // Hard
        } elseif ($avgAccuracy > 70 && $avgErrors < 5) {
            return 2; // Medium
        }

        return 1; // Easy
    }
}
