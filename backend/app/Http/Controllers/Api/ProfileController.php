<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\Request;

/**
 * @OA\Tag(
 *     name="Profiles",
 *     description="Child profile management"
 * )
 */
class ProfileController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/profiles",
     *     summary="Get all profiles for authenticated user",
     *     tags={"Profiles"},
     *     security={{"sanctum":{}}},
     *     @OA\Response(response=200, description="Profiles retrieved")
     * )
     */
    public function index(Request $request)
    {
        $profiles = $request->user()->profiles()->get();

        return response()->json([
            'success' => true,
            'data' => $profiles,
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/profiles",
     *     summary="Create a new child profile",
     *     tags={"Profiles"},
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name", "age_range"},
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="age_range", type="string", enum={"1-2", "3-4", "5-6"}),
     *             @OA\Property(property="interests", type="array", @OA\Items(type="string")),
     *             @OA\Property(property="avatar", type="string"),
     *             @OA\Property(property="settings", type="object")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Profile created")
     * )
     */
    public function store(Request $request)
    {
        // Check profile limit for free users
        if (!$request->user()->isPremium()) {
            $profileCount = $request->user()->profiles()->count();
            if ($profileCount >= 1) {
                return response()->json([
                    'success' => false,
                    'error' => [
                        'code' => 'PROFILE_LIMIT_REACHED',
                        'message' => 'Free users can only create 1 profile. Upgrade to Premium for unlimited profiles.',
                    ],
                ], 403);
            }
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'age_range' => 'required|in:1-2,3-4,5-6',
            'interests' => 'sometimes|array',
            'avatar' => 'sometimes|string',
            'settings' => 'sometimes|array',
        ]);

        $profile = $request->user()->profiles()->create($validated);

        return response()->json([
            'success' => true,
            'data' => $profile,
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/profiles/{id}",
     *     summary="Get a specific profile",
     *     tags={"Profiles"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Profile retrieved"),
     *     @OA\Response(response=404, description="Profile not found")
     * )
     */
    public function show(Request $request, $id)
    {
        $profile = $request->user()->profiles()->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $profile,
        ]);
    }

    /**
     * @OA\Put(
     *     path="/api/profiles/{id}",
     *     summary="Update a profile",
     *     tags={"Profiles"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="age_range", type="string", enum={"1-2", "3-4", "5-6"}),
     *             @OA\Property(property="interests", type="array", @OA\Items(type="string")),
     *             @OA\Property(property="avatar", type="string"),
     *             @OA\Property(property="settings", type="object")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Profile updated")
     * )
     */
    public function update(Request $request, $id)
    {
        $profile = $request->user()->profiles()->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'age_range' => 'sometimes|in:1-2,3-4,5-6',
            'interests' => 'sometimes|array',
            'avatar' => 'sometimes|string',
            'settings' => 'sometimes|array',
        ]);

        $profile->update($validated);

        return response()->json([
            'success' => true,
            'data' => $profile,
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/profiles/{id}",
     *     summary="Delete a profile",
     *     tags={"Profiles"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Profile deleted")
     * )
     */
    public function destroy(Request $request, $id)
    {
        $profile = $request->user()->profiles()->findOrFail($id);
        $profile->delete();

        return response()->json([
            'success' => true,
            'data' => [
                'message' => 'Profile deleted successfully',
            ],
        ]);
    }
}
