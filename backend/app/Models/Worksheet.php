<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Worksheet extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'age_range',
        'tags',
        'premium',
        'file_path',
        'thumbnail',
        'category',
        'downloads_count',
        'active',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'title' => 'array',
            'tags' => 'array',
            'premium' => 'boolean',
            'active' => 'boolean',
        ];
    }

    /**
     * Get localized title.
     */
    public function getLocalizedTitle(string $locale = 'pt-BR'): string
    {
        return $this->title[$locale] ?? $this->title['pt-BR'] ?? 'Untitled';
    }

    /**
     * Increment downloads count.
     */
    public function incrementDownloads(): void
    {
        $this->increment('downloads_count');
    }

    /**
     * Scope query to active worksheets.
     */
    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    /**
     * Scope query to worksheets by age range.
     */
    public function scopeForAgeRange($query, string $ageRange)
    {
        return $query->where('age_range', $ageRange);
    }
}
