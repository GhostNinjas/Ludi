<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Module;
use Illuminate\Http\Request;

/**
 * @OA\Tag(
 *     name="Modules",
 *     description="Educational game modules"
 * )
 */
class ModuleController extends Controller
{
    /**
     * Get all modules filtered by age, category, and premium status.
     */
    public function index(Request $request)
    {
        $query = Module::active();

        // Filter by age range
        if ($request->has('age_range')) {
            $query->where(function ($q) use ($request) {
                [$minAge, $maxAge] = explode('-', $request->age_range);
                $q->where('age_min', '<=', $maxAge)
                  ->where('age_max', '>=', $minAge);
            });
        }

        // Filter by category
        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        // Filter by premium status
        $isPremium = $request->user()->isPremium();
        if (!$isPremium && !$request->has('include_premium')) {
            $query->where('premium', false);
        }

        $modules = $query->orderBy('order')->get();

        // Localize for user's locale
        $locale = $request->user()->locale ?? 'pt-BR';
        $modules = $modules->map(function ($module) use ($locale, $isPremium) {
            return [
                'id' => $module->id,
                'slug' => $module->slug,
                'title' => $module->getLocalizedTitle($locale),
                'description' => $module->getLocalizedDescription($locale),
                'category' => $module->category,
                'icon' => $module->icon,
                'premium' => $module->premium,
                'locked' => $module->premium && !$isPremium,
                'age_range' => "{$module->age_min}-{$module->age_max}",
                'tags' => $module->tags,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $modules,
        ]);
    }

    /**
     * Get a specific module by slug.
     */
    public function show(Request $request, string $slug)
    {
        $module = Module::active()->where('slug', $slug)->firstOrFail();

        // Check if user has access
        if ($module->premium && !$request->user()->isPremium()) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'PREMIUM_REQUIRED',
                    'message' => 'This module requires a Premium subscription',
                ],
            ], 403);
        }

        $locale = $request->user()->locale ?? 'pt-BR';

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $module->id,
                'slug' => $module->slug,
                'title' => $module->getLocalizedTitle($locale),
                'description' => $module->getLocalizedDescription($locale),
                'category' => $module->category,
                'icon' => $module->icon,
                'premium' => $module->premium,
                'age_range' => "{$module->age_min}-{$module->age_max}",
                'tags' => $module->tags,
            ],
        ]);
    }
}
