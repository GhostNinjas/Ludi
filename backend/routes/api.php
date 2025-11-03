<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ModuleController;
use App\Http\Controllers\Api\WorksheetController;
use App\Http\Controllers\Api\ProgressController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\RecommendationController;
use App\Http\Controllers\Api\FlagController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Health check
Route::get('/health', function () {
    return response()->json([
        'success' => true,
        'data' => [
            'status' => 'healthy',
            'timestamp' => now()->toIso8601String(),
        ],
    ]);
});

// Public routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::put('/update-profile', [AuthController::class, 'updateProfile']);
    });

    // Profiles (child profiles)
    Route::apiResource('profiles', ProfileController::class);

    // Modules (educational games/activities)
    Route::prefix('catalog')->group(function () {
        Route::get('/modules', [ModuleController::class, 'index']);
        Route::get('/modules/{slug}', [ModuleController::class, 'show']);
        Route::get('/worksheets', [WorksheetController::class, 'index']);
        Route::get('/worksheets/{id}', [WorksheetController::class, 'show']);
        Route::get('/worksheets/{id}/download', [WorksheetController::class, 'download']);
    });

    // Progress tracking
    Route::prefix('progress')->group(function () {
        Route::post('/', [ProgressController::class, 'store']);
        Route::get('/profile/{profileId}', [ProgressController::class, 'getByProfile']);
        Route::get('/profile/{profileId}/summary', [ProgressController::class, 'getSummary']);
    });

    // Recommendations
    Route::get('/recommendations/next', [RecommendationController::class, 'getNext']);

    // Subscriptions
    Route::prefix('subscriptions')->group(function () {
        Route::get('/status', [SubscriptionController::class, 'status']);
        Route::post('/verify-receipt', [SubscriptionController::class, 'verifyReceipt']);
        Route::post('/restore', [SubscriptionController::class, 'restore']);
    });

    // Feature flags
    Route::get('/flags', [FlagController::class, 'index']);
});

// Webhooks (no auth required, validated by signature)
Route::prefix('webhooks')->group(function () {
    Route::post('/apple', [SubscriptionController::class, 'appleWebhook']);
    Route::post('/google', [SubscriptionController::class, 'googleWebhook']);
    Route::post('/stripe', [SubscriptionController::class, 'stripeWebhook']);
});
