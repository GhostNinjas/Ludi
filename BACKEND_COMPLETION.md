# Backend Completion Guide

This document lists the remaining backend files to complete the Laravel API.

## Controllers (app/Http/Controllers/Api/)

### ✅ Completed
- `AuthController.php` - Authentication endpoints
- `ProfileController.php` - Child profile management
- `ModuleController.php` - Game modules catalog
- `ProgressController.php` - Progress tracking

### ⏳ To Create

**WorksheetController.php**
```php
- index() - List worksheets (filtered by age, category, premium)
- show() - Get worksheet details
- download() - Generate signed URL for download
```

**SubscriptionController.php**
```php
- status() - Get current subscription status
- verifyReceipt() - Verify App Store/Play Store receipt
- restore() - Restore previous purchases
- appleWebhook() - Handle Apple subscription notifications
- googleWebhook() - Handle Google Play notifications
- stripeWebhook() - Handle Stripe webhooks (optional)
```

**RecommendationController.php**
```php
- getNext() - Get next recommended activity based on profile progress
- Algorithm: Analyze recent progress, return suitable difficulty
```

**FlagController.php**
```php
- index() - Get all active feature flags/experiments
- Cached response for performance
```

## Services (app/Services/)

Create service classes for business logic:

**RecommendationService.php**
```php
- getNextActivity(Profile $profile): Module
- Heuristic algorithm:
  1. Get last 7 days progress
  2. Calculate avg accuracy & errors
  3. If errors > 50%, suggest easier
  4. If accuracy > 90%, suggest harder
  5. Prioritize interests array
  6. Return suitable module
```

**SubscriptionService.php**
```php
- verifyAppleReceipt(string $receipt): bool
- verifyGoogleReceipt(string $receipt): bool
- updateSubscriptionStatus(User $user, array $data): void
- handleAppleWebhook(array $payload): void
- handleGoogleWebhook(array $payload): void
```

**AnalyticsService.php**
```php
- trackEvent(string $event, array $data): void
- Store in database or forward to external service
```

## Middleware (app/Http/Middleware/)

**CheckPremiumAccess.php**
```php
// Middleware to check if user has premium access
public function handle($request, Closure $next)
{
    if (!$request->user()->isPremium()) {
        return response()->json(['error' => 'Premium required'], 403);
    }
    return $next($request);
}
```

**ThrottleRequests.php** (use Laravel's built-in, configure in routes)

## Configuration Files

**config/sanctum.php**
```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost')),
'expiration' => 525600, // 1 year for mobile apps
'middleware' => [
    'verify_csrf_token' => false, // Disable CSRF for API
],
```

**config/cors.php**
```php
'paths' => ['api/*'],
'allowed_methods' => ['*'],
'allowed_origins' => ['*'],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => false,
```

**config/l5-swagger.php** (for OpenAPI/Swagger)
```php
'api' => [
    'title' => 'Ludi API',
],
'routes' => [
    'api' => 'api/docs',
],
```

## Database Seeders

**database/seeders/DatabaseSeeder.php**
```php
public function run()
{
    $this->call([
        ModuleSeeder::class,
        WorksheetSeeder::class,
        ExperimentSeeder::class,
    ]);
}
```

**database/seeders/ModuleSeeder.php**
```php
// Seed all game modules with localized content
Module::create([
    'slug' => 'abc-tracing',
    'title' => [
        'pt-BR' => 'ABC - Traçando Letras',
        'en' => 'ABC - Letter Tracing',
        'es' => 'ABC - Trazando Letras',
    ],
    'description' => [
        'pt-BR' => 'Aprenda a traçar as letras do alfabeto',
        'en' => 'Learn to trace alphabet letters',
        'es' => 'Aprende a trazar las letras del alfabeto',
    ],
    'age_min' => 3,
    'age_max' => 6,
    'category' => 'abc',
    'tags' => ['letters', 'tracing', 'writing'],
    'premium' => false,
    'order' => 1,
]);

// Repeat for all 10+ modules
// - number-counting, color-matching, shape-matching, puzzles
// - guided-drawing, interactive-stories, memory-game
// - pattern-recognition, sorting-game, music-rhythm
```

**database/seeders/WorksheetSeeder.php**
```php
// Seed 20+ worksheet placeholders
Worksheet::create([
    'title' => [
        'pt-BR' => 'Traçando o Alfabeto A-Z',
        'en' => 'Tracing Alphabet A-Z',
        'es' => 'Trazando el Alfabeto A-Z',
    ],
    'age_range' => '3-4',
    'category' => 'tracing',
    'tags' => ['alphabet', 'writing', 'practice'],
    'file_path' => 'worksheets/tracing-alphabet-az.pdf',
    'premium' => false,
]);
```

## Factories (database/factories/)

**ProfileFactory.php**
```php
public function definition()
{
    return [
        'user_id' => User::factory(),
        'name' => $this->faker->firstName(),
        'age_range' => $this->faker->randomElement(['1-2', '3-4', '5-6']),
        'interests' => ['colors', 'numbers'],
        'avatar' => 'default',
        'settings' => [],
        'streak_days' => 0,
        'total_stars' => 0,
    ];
}
```

## Tests (tests/Feature/)

**AuthTest.php**
```php
test('user can register', function () {
    $response = $this->postJson('/api/auth/register', [
        'email' => 'test@example.com',
        'password' => 'password123',
    ]);

    $response->assertStatus(201)
        ->assertJsonStructure(['success', 'data' => ['user', 'token']]);
});
```

**ProfileTest.php**, **ModuleTest.php**, **ProgressTest.php**, etc.

## OpenAPI Documentation

Add annotations to all controllers using L5-Swagger:
```php
/**
 * @OA\Info(
 *     title="Ludi API",
 *     version="1.0.0",
 *     description="Educational app API for children"
 * )
 * @OA\Server(url="http://localhost:8000")
 * @OA\SecurityScheme(
 *     securityScheme="sanctum",
 *     type="http",
 *     scheme="bearer"
 * )
 */
```

Generate docs: `php artisan l5-swagger:generate`

## Environment Setup

1. Copy `.env.example` to `.env`
2. Generate app key: `php artisan key:generate`
3. Configure database credentials
4. Run migrations: `php artisan migrate`
5. Seed database: `php artisan db:seed`
6. Start services: `docker-compose up -d`

## API Testing

Use Postman, Insomnia, or HTTPie:

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get modules (with token)
curl -X GET http://localhost:8000/api/catalog/modules \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Next Steps

1. Create remaining controllers (Worksheet, Subscription, Recommendation, Flag)
2. Implement service classes for business logic
3. Create database seeders with all modules/worksheets
4. Add middleware and configure Sanctum
5. Write feature tests for all endpoints
6. Generate OpenAPI documentation
7. Test all endpoints manually or with Postman

## Performance Optimization

- Cache module/worksheet catalogs in Redis (TTL: 1 hour)
- Cache feature flags (TTL: 5 minutes)
- Add database indexes on frequently queried columns
- Use eager loading for relationships
- Implement API response caching for GET requests

## Security Checklist

- ✅ Laravel Sanctum for authentication
- ✅ Rate limiting on all routes (60 req/min)
- ✅ Input validation on all endpoints
- ✅ CORS configuration
- ✅ SQL injection prevention (Eloquent ORM)
- ✅ XSS prevention (Laravel auto-escaping)
- ⏳ Webhook signature verification
- ⏳ File upload validation (worksheets)
- ⏳ Environment variable security (.env not in git)
