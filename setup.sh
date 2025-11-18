#!/bin/bash

# Ludi - Complete Setup Script
# This script sets up the entire application

set -e

echo "🚀 Ludi - Installation Script"
echo "======================================"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running!"
    echo "Please start Docker Desktop and run this script again."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Navigate to project directory
cd "$(dirname "$0")"
PROJECT_DIR=$(pwd)

echo "📁 Project directory: $PROJECT_DIR"
echo ""

# Backend setup
echo "🔧 Setting up Backend..."
echo "-----------------------"

cd "$PROJECT_DIR/backend"

# Install Composer dependencies
echo "📦 Installing PHP dependencies..."
docker run --rm -v "$(pwd):/app" -w /app composer:latest install --ignore-platform-reqs --no-scripts --quiet

# Generate application key if not exists
if grep -q "APP_KEY=base64:GENERATE_THIS_KEY" .env 2>/dev/null; then
    echo "🔑 Generating Laravel application key..."
    # Generate a random base64 key
    APP_KEY="base64:$(openssl rand -base64 32)"
    sed -i.bak "s|APP_KEY=base64:GENERATE_THIS_KEY|APP_KEY=$APP_KEY|g" .env
    rm .env.bak 2>/dev/null || true
    echo "✅ Application key generated"
else
    echo "✅ Application key already exists"
fi

cd "$PROJECT_DIR"

# Start Docker services
echo ""
echo "🐳 Starting Docker services..."
echo "------------------------------"
docker compose up -d

echo "⏳ Waiting for services to be ready (30 seconds)..."
sleep 30

# Check if MySQL is ready
echo "🔍 Checking MySQL connection..."
until docker compose exec -T mysql mysqladmin ping -h"localhost" --silent 2>/dev/null; do
    echo "⏳ Waiting for MySQL..."
    sleep 2
done
echo "✅ MySQL is ready"

# Run migrations
echo ""
echo "🗄️  Running database migrations..."
echo "----------------------------------"
docker compose exec -T app php artisan migrate --force

echo "✅ Migrations completed"

# Create .gitkeep files in storage
echo ""
echo "📂 Setting up storage directories..."
docker compose exec -T app sh -c "find storage -type d -exec touch {}/.gitkeep \;"

echo ""
echo "✅ Backend setup completed!"
echo ""

# Mobile setup
echo "📱 Mobile App Setup"
echo "-------------------"

cd "$PROJECT_DIR/mobile"

if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install --silent
else
    echo "✅ Node modules already installed"
fi

echo "✅ Mobile app setup completed!"
echo ""

# Final summary
echo ""
echo "🎉 Installation completed successfully!"
echo "========================================"
echo ""
echo "📊 Services Status:"
echo ""
docker compose ps
echo ""
echo "🌐 Backend API: http://localhost:8000"
echo "📚 API Documentation: http://localhost:8000/api/docs (after generating)"
echo ""
echo "🚀 Next Steps:"
echo ""
echo "1. Start the mobile app:"
echo "   cd mobile && npm start"
echo ""
echo "2. Generate seed data (optional):"
echo "   make seed"
echo ""
echo "3. View logs:"
echo "   make logs"
echo ""
echo "4. Access services:"
echo "   - API: http://localhost:8000/api/health"
echo "   - MySQL: localhost:3306 (user: ludi, password: secret)"
echo "   - Redis: localhost:6379"
echo ""
echo "5. Useful commands:"
echo "   make dev       - Start all services"
echo "   make stop      - Stop all services"
echo "   make logs      - View logs"
echo "   make migrate   - Run migrations"
echo "   make test      - Run backend tests"
echo ""
echo "📖 Read GETTING_STARTED.md for detailed instructions"
echo ""
echo "Happy coding! 🎨👶📱"
