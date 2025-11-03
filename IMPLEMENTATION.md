# Ludi - Complete Implementation Guide

This document provides the complete implementation structure for the Ludi educational mobile app.

## Project Overview

A comprehensive educational mobile application for children aged 1-6 with:
- 10+ educational game modules
- Printable worksheets system
- Parent dashboard with progress tracking
- Subscription/paywall system
- Multi-profile support
- Offline mode
- i18n (pt-BR, en, es)

## Architecture

### Backend (Laravel 11 + PHP 8.3)
- **API**: RESTful JSON API with Laravel Sanctum authentication
- **Database**: MySQL 8 with Redis caching
- **Queue**: Laravel Horizon for background jobs
- **Documentation**: OpenAPI/Swagger via L5-Swagger
- **Deployment**: Docker containers (nginx + php-fpm + workers)

### Mobile (React Native + Expo + TypeScript)
- **Navigation**: expo-router (file-based routing)
- **State**: Zustand for global state management
- **API**: Axios with auth interceptors
- **Animations**: Lottie + React Native Reanimated
- **Audio**: Expo AV for TTS and sound effects
- **Storage**: Expo SecureStore + AsyncStorage
- **Forms**: React Hook Form + Zod validation
- **i18n**: i18next with language detection

## Database Schema

### Users
- id, email, password, locale, plan (free/premium), premium_until
- Relations: hasMany profiles, subscriptions

### Profiles (Child Profiles)
- id, user_id, name, age_range, interests[], avatar, settings{}
- streak_days, last_activity_date, total_stars
- Relations: belongsTo user, hasMany progress

### Modules (Game/Activity Definitions)
- id, slug, title{}, description{}, age_min, age_max, tags[]
- premium (bool), icon, category, order, active
- Relations: hasMany progress

### Worksheets
- id, title{}, age_range, tags[], premium, file_path, thumbnail
- category, downloads_count, active
- Relations: none

### Progress
- id, profile_id, module_id, date, stars (0-3)
- time_spent_sec, accuracy, level, errors_count, meta{}
- Relations: belongsTo profile, module

### Subscriptions
- id, user_id, provider (apple/google/stripe), provider_id
- status, trial_ends_at, renewal_at, receipt{}
- Relations: belongsTo user

### Experiments (Feature Flags)
- id, key, variant, active, payload{}

## API Endpoints

### Authentication
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
PUT  /api/auth/update-profile
```

### Profiles
```
GET    /api/profiles
POST   /api/profiles
GET    /api/profiles/{id}
PUT    /api/profiles/{id}
DELETE /api/profiles/{id}
```

### Catalog
```
GET /api/catalog/modules
GET /api/catalog/modules/{slug}
GET /api/catalog/worksheets
GET /api/catalog/worksheets/{id}
GET /api/catalog/worksheets/{id}/download
```

### Progress
```
POST /api/progress
GET  /api/progress/profile/{profileId}
GET  /api/progress/profile/{profileId}/summary
```

### Recommendations
```
GET /api/recommendations/next?profile_id={id}
```

### Subscriptions
```
GET  /api/subscriptions/status
POST /api/subscriptions/verify-receipt
POST /api/subscriptions/restore
```

### Feature Flags
```
GET /api/flags
```

### Webhooks
```
POST /api/webhooks/apple
POST /api/webhooks/google
POST /api/webhooks/stripe
```

## Mobile App Structure

```
/mobile
  /app                    # expo-router screens
    /(auth)
      login.tsx
      register.tsx
    /(tabs)              # Main app tabs
      /(home)
        index.tsx        # Kids home
        game/[slug].tsx  # Game screen
      /(worksheets)
        index.tsx
        [id].tsx
      /(parents)
        index.tsx        # Parental gate
        dashboard.tsx
        settings.tsx
    _layout.tsx
  /components
    /games               # Game components
      ABCTracing.tsx
      NumberCounting.tsx
      ColorMatching.tsx
      ShapeMatching.tsx
      Puzzles.tsx
      GuidedDrawing.tsx
      InteractiveStory.tsx
    /common
      Button.tsx
      Card.tsx
      ProgressBar.tsx
      ParentalGate.tsx
    /worksheets
      WorksheetCard.tsx
      WorksheetViewer.tsx
  /lib
    /api                 # API client
      client.ts
      auth.ts
      profiles.ts
      modules.ts
      worksheets.ts
      progress.ts
      subscriptions.ts
    /store               # Zustand stores
      authStore.ts
      profileStore.ts
      progressStore.ts
      settingsStore.ts
    /hooks
      useAuth.ts
      useProfile.ts
      useProgress.ts
      useSubscription.ts
    /utils
      analytics.ts
      storage.ts
      tts.ts
      sound.ts
  /locales
    /pt-BR
      common.json
      games.json
      parents.json
    /en
    /es
  /assets
    /images
    /sounds
    /lottie
  /constants
    Colors.ts
    Fonts.ts
    Config.ts
```

## Game Modules Implementation

### 1. ABC Tracing
- Letter display with tracing guide
- Touch tracking with checkpoints validation
- Phonics audio (TTS)
- 3-star rating based on accuracy
- Progression: uppercase → lowercase → words

### 2. Number Counting (1-10)
- Visual objects to count
- Drag-and-drop number matching
- Audio reinforcement
- Progressive difficulty (1-3, 1-5, 1-10)

### 3. Colors & Shapes
- Color identification game
- Shape matching puzzles
- Sorting activities
- Real-world object association

### 4. Puzzles
- 4-12 piece jigsaw puzzles
- Snap-to-grid mechanics
- Visual hints available
- Themes by age group

### 5. Guided Drawing
- Step-by-step drawing tutorials
- Simple shapes → characters
- Save artwork to gallery
- Share with parents

### 6. Interactive Stories/Cartoons
- Short animated stories (30-60s)
- Simple choice points
- Educational themes
- Replay option

### 7. Memory Game
- Card matching
- Increasing difficulty (6-20 cards)
- Themed sets (animals, objects, etc.)

### 8. Pattern Recognition
- Complete the pattern
- Visual and audio patterns
- Progressive complexity

### 9. Sorting Game
- Sort by color, size, shape, category
- Drag-and-drop interface
- Timed and untimed modes

### 10. Music & Rhythm
- Simple instrument playing
- Rhythm matching
- Song learning (nursery rhymes)
- Sound recognition

## Subscription System

### Free Tier
- 3 game modules (ABC, Numbers, Colors)
- 3 worksheets per month
- 1 child profile
- Basic progress tracking

### Premium Tier ($9.99/month or $79.99/year)
- All game modules unlocked
- Unlimited worksheets
- Up to 5 child profiles
- Detailed progress reports
- Offline mode (unlimited downloads)
- No limits on gameplay

### Implementation
1. **In-App Purchases**: Use expo-in-app-purchases
2. **Receipt Verification**: Backend validates with Apple/Google
3. **Webhooks**: Handle subscription lifecycle events
4. **Paywall**: Show after 3 free games or worksheet limit
5. **Restore**: Allow users to restore purchases on new devices

## Parental Gate

Security to prevent children from accessing parent areas:
1. **Math Challenge**: "What is 7 + 5?" with number buttons
2. **Long Press**: Hold button for 3 seconds
3. **Pattern**: Trace specific shape

Implementation in `components/common/ParentalGate.tsx`

## Progress Tracking & Analytics

### Tracked Events
- `app_opened`
- `profile_created`
- `game_started` (module, difficulty)
- `game_completed` (stars, time, accuracy, errors)
- `worksheet_viewed`
- `worksheet_downloaded`
- `paywall_shown`
- `subscription_started`
- `subscription_cancelled`

### Analytics Providers
- Firebase Analytics (primary)
- Segment (optional)
- Internal API tracking (all events)

### Adaptive Learning
Algorithm in backend (`RecommendationService`):
1. Analyze last 7 days of progress
2. Calculate avg accuracy & error rate
3. Recommend easier if errors > 50%
4. Recommend harder if accuracy > 90%
5. Suggest new categories based on interests

## Offline Mode

### Implementation
1. **Games**: All game logic is local, no API required
2. **Worksheets**: Download and cache using expo-file-system
3. **Progress**: Queue in AsyncStorage, sync when online
4. **Assets**: Bundle core assets, lazy-load premium content

### Sync Strategy
```typescript
// Check connectivity
// If online, flush queued progress
// Download new content
// Update catalog cache
```

## Accessibility Features

### Visual
- High contrast mode
- Large touch targets (min 44x44pt)
- Clear, simple icons
- Color-blind friendly palette

### Audio
- TTS for all text
- Audio descriptions
- Captions for videos/stories
- Mute option

### Motor
- No time pressure (except timed challenges)
- Large, forgiving tap areas
- Alternative control methods
- Haptic feedback

### Settings
All configurable in Parent Dashboard:
- Visual adjustments
- Audio preferences
- Difficulty overrides
- Content filtering

## Localization (i18n)

### Supported Languages
1. Portuguese (Brazil) - pt-BR (default)
2. English - en
3. Spanish - es

### Implementation
```typescript
// i18next configuration
// Language detection based on device
// Fallback to pt-BR
// Dynamic language switching in Parent Settings
```

### Translation Structure
```
/locales
  /pt-BR
    common.json       # Buttons, labels, errors
    games.json        # Game instructions, feedback
    parents.json      # Parent dashboard
    worksheets.json   # Worksheet descriptions
    onboarding.json   # Onboarding flow
  /en/...
  /es/...
```

## Testing Strategy

### Backend (Laravel)
```bash
php artisan test
```
- Feature tests for all API endpoints
- Unit tests for services (RecommendationService, SubscriptionService)
- Database factories for seeding

### Mobile (React Native)
```bash
npm test           # Jest unit tests
npm run test:e2e   # Detox E2E tests
```
- Unit tests for utils, hooks, stores
- Component tests with React Testing Library
- E2E tests for critical flows:
  - Onboarding → Create Profile → Play Game
  - View Worksheet → Download → Share
  - Parent Dashboard → View Progress
  - Paywall → Subscribe → Unlock Content

## Deployment

### Backend (Docker on Hostinger VPS)
```bash
# Build images
docker-compose build

# Deploy
make deploy

# Run migrations
make migrate

# Monitor
docker-compose logs -f
```

### Mobile
```bash
# Development
npm start

# Build for production
eas build --platform ios
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

## Environment Variables

### Backend (.env)
- `APP_KEY`, `APP_URL`, `APP_ENV`
- `DB_*` - Database credentials
- `REDIS_*` - Redis configuration
- `APPLE_APP_STORE_SHARED_SECRET`
- `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`
- `STRIPE_KEY`, `STRIPE_SECRET`
- `MAIL_*` - Email configuration
- `SENTRY_LARAVEL_DSN`

### Mobile (.env)
- `API_URL` - Backend API endpoint
- `SENTRY_DSN`
- `ANALYTICS_ENABLED`
- `FEATURE_FLAGS_ENABLED`

## Security Considerations

1. **API**: Rate limiting, CORS, input validation
2. **Authentication**: Sanctum tokens with short expiry
3. **Parental Gate**: Multiple verification methods
4. **Data Privacy**: COPPA/GDPR compliant, no tracking without consent
5. **Content**: All original, no third-party copyrighted material
6. **Payments**: Never store payment info, use platform APIs
7. **File Uploads**: Strict validation, size limits, S3 storage

## Performance Optimization

### Backend
- Redis caching for catalog, flags
- Database indexing on common queries
- Eager loading relationships
- API response compression
- CDN for static assets

### Mobile
- Lazy loading of game modules
- Image optimization
- Memoization of expensive computations
- FlatList optimization
- Bundle size monitoring

## Monitoring & Logging

### Backend
- Laravel logs to `/storage/logs`
- Sentry for error tracking
- Horizon for queue monitoring
- Database query logging in dev

### Mobile
- Sentry for crash reporting
- Console logs in debug mode
- Performance monitoring (React Native Performance)
- Network request logging

## Next Steps for Development

1. ✅ Project structure & Docker setup
2. ✅ Database migrations & models
3. ✅ API routes definition
4. 🔄 API controllers implementation
5. ⏳ Services layer (RecommendationService, SubscriptionService)
6. ⏳ OpenAPI documentation
7. ⏳ Mobile app scaffolding with Expo
8. ⏳ Authentication flow
9. ⏳ Profile management
10. ⏳ Game modules implementation
11. ⏳ Worksheets system
12. ⏳ Parent dashboard
13. ⏳ Subscription/paywall
14. ⏳ i18n setup
15. ⏳ Testing
16. ⏳ Deployment scripts

## Additional Resources

- [Laravel Documentation](https://laravel.com/docs/11.x)
- [Expo Documentation](https://docs.expo.dev)
- [React Native](https://reactnative.dev)
- [Apple App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policies](https://play.google.com/about/developer-content-policy/)
- [COPPA Compliance](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions)

---

**Note**: All code comments MUST be in English. All user-facing text uses i18n. No third-party copyrighted content.
