# Getting Started with Ludi

## Project Overview

Ludi is an educational mobile app for children aged 1-6 years, featuring:
- 10+ educational game modules
- Printable worksheets system
- Multi-child profiles
- Parent dashboard with progress tracking
- Premium subscription
- Offline mode
- Available in Portuguese (BR), English, and Spanish

## Prerequisites

### Backend
- Docker & Docker Compose
- Make (optional, for convenience commands)

### Mobile
- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac only) or Android Studio

## Installation

### 1. Clone Repository
```bash
cd /Users/arnon/Public/GitHub/Ludi
```

### 2. Backend Setup

```bash
# Copy environment file
cp backend/.env.example backend/.env

# Start Docker services (MySQL, Redis, PHP-FPM, Nginx)
make dev

# Wait for services to be ready (~30 seconds)

# Run migrations
make migrate

# Seed database with sample data
make seed

# Verify API is running
curl http://localhost:8000/api/health
```

**Backend should now be running at**: http://localhost:8000

**API Documentation**: http://localhost:8000/api/docs (once OpenAPI is generated)

### 3. Mobile Setup

```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your API URL (default should work for local dev)
# API_URL=http://localhost:8000/api

# Start Expo development server
npm start
```

You can now:
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code with Expo Go app on your phone

## Project Structure

```
/Ludi
├── backend/          # Laravel 11 API
│   ├── app/          # Models, Controllers, Services
│   ├── database/     # Migrations, Seeders, Factories
│   ├── routes/       # API routes
│   └── tests/        # PHPUnit tests
│
├── mobile/           # React Native (Expo) app
│   ├── app/          # Screens (expo-router)
│   ├── components/   # Reusable components
│   ├── lib/          # API clients, stores, utils
│   ├── constants/    # Colors, Config
│   └── assets/       # Images, sounds, fonts
│
├── infra/            # Docker & deployment
│   ├── nginx/        # Nginx configuration
│   └── scripts/      # Deployment scripts
│
└── docs/             # Documentation
    ├── IMPLEMENTATION.md
    ├── BACKEND_COMPLETION.md
    ├── MOBILE_COMPLETION.md
    └── PROJECT_SUMMARY.md
```

## Development Workflow

### Backend Development

```bash
# View logs
make logs

# Run migrations
make migrate

# Seed database
make seed

# Run tests
make test

# Access MySQL
make mysql

# Access Redis CLI
make redis-cli

# Clear cache
make clear-cache

# Optimize for production
make optimize
```

### Mobile Development

```bash
cd mobile

# Start dev server
npm start

# Run type check
npm run type-check

# Run linter
npm run lint

# Run tests
npm test

# Run E2E tests
npm run test:e2e
```

## API Endpoints

### Authentication
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login user
POST   /api/auth/logout        - Logout user
GET    /api/auth/me            - Get current user
PUT    /api/auth/update-profile - Update user profile
```

### Profiles (Child Profiles)
```
GET    /api/profiles           - Get all profiles
POST   /api/profiles           - Create profile
GET    /api/profiles/{id}      - Get profile
PUT    /api/profiles/{id}      - Update profile
DELETE /api/profiles/{id}      - Delete profile
```

### Catalog
```
GET    /api/catalog/modules    - Get game modules
GET    /api/catalog/modules/{slug} - Get module details
GET    /api/catalog/worksheets - Get worksheets
GET    /api/catalog/worksheets/{id} - Get worksheet
GET    /api/catalog/worksheets/{id}/download - Download worksheet
```

### Progress
```
POST   /api/progress           - Submit progress
GET    /api/progress/profile/{id} - Get progress by profile
GET    /api/progress/profile/{id}/summary - Get summary
```

### Subscriptions
```
GET    /api/subscriptions/status - Get subscription status
POST   /api/subscriptions/verify-receipt - Verify receipt
POST   /api/subscriptions/restore - Restore purchase
```

## Testing the App

### 1. Create Account
1. Open mobile app
2. Tap "Sign Up"
3. Enter email and password
4. Choose language (pt-BR, en, or es)

### 2. Create Child Profile
1. After login, create first profile
2. Enter child's name
3. Select age range (1-2, 3-4, or 5-6)
4. Choose avatar
5. Select interests

### 3. Play Games
1. Browse game categories on home screen
2. Tap a game to start
3. Complete activities
4. Earn stars based on performance

### 4. View Progress (Parent Area)
1. Access parent area (will require parental gate)
2. View progress dashboard
3. See stats per child
4. Adjust settings

### 5. Download Worksheets
1. Go to Worksheets tab
2. Browse or filter worksheets
3. Download for offline use
4. Share or print

## Common Issues & Solutions

### Backend Issues

**Problem**: Database connection error
```bash
# Solution: Ensure MySQL is running
docker-compose ps

# Restart services
docker-compose restart mysql
```

**Problem**: Cache issues
```bash
# Solution: Clear all caches
make clear-cache
```

**Problem**: Permission errors
```bash
# Solution: Fix storage permissions
docker-compose exec app chmod -R 777 storage bootstrap/cache
```

### Mobile Issues

**Problem**: Metro bundler cache issues
```bash
# Solution: Clear cache and restart
npm start -- --clear
```

**Problem**: API connection issues
```bash
# Solution: Check API_URL in .env
# For iOS Simulator: use http://localhost:8000/api
# For Android Emulator: use http://10.0.2.2:8000/api
# For physical device: use your computer's IP
```

**Problem**: Module not found errors
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Building for Production

### Backend

```bash
# Build production Docker images
make build

# Deploy to server
make deploy

# Backup database
make backup
```

### Mobile

```bash
cd mobile

# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for iOS
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

## Environment Variables

### Backend (.env)
```bash
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=ludi
DB_USERNAME=ludi
DB_PASSWORD=secret

REDIS_HOST=redis
REDIS_PORT=6379

# Add your keys:
APPLE_APP_STORE_SHARED_SECRET=
GOOGLE_PLAY_SERVICE_ACCOUNT_JSON=
STRIPE_KEY=
STRIPE_SECRET=
SENTRY_LARAVEL_DSN=
```

### Mobile (.env)
```bash
API_URL=http://localhost:8000/api
SENTRY_DSN=
ANALYTICS_ENABLED=true
```

## Next Steps

1. **Read Documentation**:
   - IMPLEMENTATION.md - Full feature specification
   - BACKEND_COMPLETION.md - Remaining backend tasks
   - MOBILE_COMPLETION.md - Remaining mobile tasks
   - PROJECT_SUMMARY.md - Project status

2. **Complete Remaining Features**:
   - Worksheet download implementation
   - Subscription webhook handlers
   - All game components
   - Parent dashboard charts
   - Paywall screens

3. **Add Content**:
   - Create original game assets
   - Design worksheets (20+)
   - Record/generate audio files
   - Create animations

4. **Test Thoroughly**:
   - Write unit tests
   - Write E2E tests
   - Manual QA testing
   - Accessibility testing

5. **Deploy**:
   - Set up production server
   - Configure domain and SSL
   - Submit to app stores
   - Set up monitoring

## Support & Resources

- **Laravel Docs**: https://laravel.com/docs/11.x
- **Expo Docs**: https://docs.expo.dev
- **React Native**: https://reactnative.dev
- **TypeScript**: https://www.typescriptlang.org

## License

Proprietary - All Rights Reserved

## Notes

- All code comments are in English
- User-facing text uses i18n (pt-BR, en, es)
- No third-party copyrighted content
- COPPA compliant architecture
- Accessibility features included
- Offline mode supported
- Security best practices followed

---

**Happy Coding! 🚀**
