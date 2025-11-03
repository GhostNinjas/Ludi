<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Models\Progress;
use Illuminate\Http\Request;

/**
 * @OA\Tag(
 *     name="Progress",
 *     description="Progress tracking"
 * )
 */
class ProgressController extends Controller
{
    /**
     * Store progress for a game session.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'profile_id' => 'required|exists:profiles,id',
            'module_id' => 'required|exists:modules,id',
            'stars' => 'required|integer|min:0|max:3',
            'time_spent_sec' => 'required|integer|min:0',
            'accuracy' => 'required|numeric|min:0|max:100',
            'level' => 'sometimes|integer|min:1',
            'errors_count' => 'sometimes|integer|min:0',
            'meta' => 'sometimes|array',
        ]);

        // Verify profile belongs to user
        $profile = Profile::where('id', $validated['profile_id'])
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        // Create progress record
        $progress = Progress::create([
            'profile_id' => $profile->id,
            'module_id' => $validated['module_id'],
            'date' => now()->toDateString(),
            'stars' => $validated['stars'],
            'time_spent_sec' => $validated['time_spent_sec'],
            'accuracy' => $validated['accuracy'],
            'level' => $validated['level'] ?? 1,
            'errors_count' => $validated['errors_count'] ?? 0,
            'meta' => $validated['meta'] ?? null,
        ]);

        // Update profile stats
        $profile->increment('total_stars', $validated['stars']);
        $profile->updateStreak();

        return response()->json([
            'success' => true,
            'data' => $progress,
        ], 201);
    }

    /**
     * Get progress for a specific profile.
     */
    public function getByProfile(Request $request, int $profileId)
    {
        $profile = Profile::where('id', $profileId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $progress = $profile->progress()
            ->with('module')
            ->orderBy('date', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $progress,
        ]);
    }

    /**
     * Get progress summary for a profile.
     */
    public function getSummary(Request $request, int $profileId)
    {
        $profile = Profile::where('id', $profileId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $days = $request->input('days', 7);

        $progress = $profile->progress()
            ->where('date', '>=', now()->subDays($days))
            ->get();

        $summary = [
            'profile' => [
                'id' => $profile->id,
                'name' => $profile->name,
                'avatar' => $profile->avatar,
                'streak_days' => $profile->streak_days,
                'total_stars' => $profile->total_stars,
            ],
            'period' => [
                'days' => $days,
                'total_sessions' => $progress->count(),
                'total_time_minutes' => round($progress->sum('time_spent_sec') / 60),
                'average_accuracy' => round($progress->avg('accuracy'), 1),
                'total_stars_earned' => $progress->sum('stars'),
            ],
            'by_category' => $progress->groupBy('module.category')->map(function ($items) {
                return [
                    'sessions' => $items->count(),
                    'avg_accuracy' => round($items->avg('accuracy'), 1),
                    'avg_stars' => round($items->avg('stars'), 1),
                ];
            }),
            'recent_activity' => $progress->take(10)->map(function ($item) {
                return [
                    'date' => $item->date,
                    'module' => $item->module->slug,
                    'stars' => $item->stars,
                    'accuracy' => $item->accuracy,
                ];
            }),
        ];

        return response()->json([
            'success' => true,
            'data' => $summary,
        ]);
    }
}
