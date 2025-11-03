<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'slug',
        'title',
        'description',
        'age_min',
        'age_max',
        'tags',
        'premium',
        'icon',
        'category',
        'order',
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
            'description' => 'array',
            'tags' => 'array',
            'premium' => 'boolean',
            'active' => 'boolean',
        ];
    }

    /**
     * Get the progress records for the module.
     */
    public function progress()
    {
        return $this->hasMany(Progress::class);
    }

    /**
     * Get localized title.
     */
    public function getLocalizedTitle(string $locale = 'pt-BR'): string
    {
        return $this->title[$locale] ?? $this->title['pt-BR'] ?? 'Untitled';
    }

    /**
     * Get localized description.
     */
    public function getLocalizedDescription(string $locale = 'pt-BR'): string
    {
        return $this->description[$locale] ?? $this->description['pt-BR'] ?? '';
    }

    /**
     * Check if module is suitable for age range.
     */
    public function isSuitableForAge(string $ageRange): bool
    {
        [$minAge, $maxAge] = explode('-', $ageRange);
        $minAge = (int) $minAge;
        $maxAge = (int) $maxAge;

        return $minAge <= $this->age_max && $maxAge >= $this->age_min;
    }

    /**
     * Scope query to active modules.
     */
    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    /**
     * Scope query to modules by category.
     */
    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }
}
