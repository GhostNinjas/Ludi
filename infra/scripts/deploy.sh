#!/bin/bash

# Ludi Deployment Script
# Usage: ./deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "🚀 Starting deployment to $ENVIRONMENT environment..."

# Check if required environment variables are set
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found"
    exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Build Docker images
echo "📦 Building Docker images..."
docker-compose build --no-cache

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Start services
echo "🎬 Starting services..."
docker-compose up -d

# Wait for MySQL to be ready
echo "⏳ Waiting for MySQL to be ready..."
sleep 10

# Run migrations
echo "🗄️  Running database migrations..."
docker-compose exec -T app php artisan migrate --force

# Clear and cache configurations
echo "🧹 Optimizing application..."
docker-compose exec -T app php artisan config:cache
docker-compose exec -T app php artisan route:cache
docker-compose exec -T app php artisan view:cache

# Link storage
echo "🔗 Linking storage..."
docker-compose exec -T app php artisan storage:link

# Generate API documentation
echo "📚 Generating API documentation..."
docker-compose exec -T app php artisan l5-swagger:generate

# Health check
echo "🏥 Running health check..."
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/health)

if [ "$HEALTH_CHECK" -eq 200 ]; then
    echo "✅ Deployment successful! Application is healthy."
else
    echo "⚠️  Warning: Health check returned status $HEALTH_CHECK"
fi

echo "📝 Deployment log saved to logs/deploy_${TIMESTAMP}.log"
echo "🎉 Deployment completed!"
