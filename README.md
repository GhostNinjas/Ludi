# Ludi

An educational mobile app for children aged 1-6 years with games, worksheets, and parental controls.

## Tech Stack

### Mobile
- React Native + Expo + TypeScript
- Zustand (state management)
- expo-router (navigation)
- i18next (internationalization)
- Lottie (animations)
- Expo AV (audio/video)

### Backend
- Laravel 11 (PHP 8.3)
- MySQL 8
- Redis (cache/queues)
- Laravel Sanctum (authentication)
- Laravel Horizon (queue management)
- OpenAPI/Swagger documentation

### Infrastructure
- Docker + docker-compose
- Nginx (web server)
- PHP-FPM
- Queue workers
- Scheduler

## Project Structure

```
/ludi
  /mobile       # React Native Expo app
  /backend      # Laravel API
  /infra        # Docker infrastructure
    /nginx      # Nginx configuration
    /scripts    # Deployment scripts
```

## Quick Start

### Development

```bash
# Start all services
make dev

# Run migrations and seed
make migrate
make seed

# Run tests
make test
```

### Mobile Development

```bash
cd mobile
npm install
npm start
```

### Backend Development

```bash
cd backend
composer install
php artisan serve
```

## Environment Setup

1. Copy `.env.example` to `.env` in both `mobile` and `backend`
2. Configure database credentials
3. Set up API keys for services
4. Run migrations: `php artisan migrate`

## Features

- **Educational Games**: ABC tracing, numbers, colors, shapes, puzzles, drawing
- **Worksheets**: Printable activities organized by age and theme
- **Parent Dashboard**: Progress tracking, reports, controls
- **Multi-profile**: Multiple children per account
- **Offline Mode**: Downloaded content available offline
- **Parental Gate**: Security for parent-only areas
- **Subscription**: Free tier + Premium features
- **Accessibility**: High contrast, captions, large targets
- **Localization**: Portuguese (BR), English, Spanish

## API Documentation

OpenAPI documentation available at: `http://localhost:8000/api/docs`

## Testing

### Backend
```bash
cd backend
php artisan test
```

### Mobile
```bash
cd mobile
npm test
npm run test:e2e
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment instructions.

## License

Proprietary - All Rights Reserved
