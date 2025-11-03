.PHONY: dev build test migrate seed deploy clean help

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-15s %s\n", $$1, $$2}'

dev: ## Start development environment
	docker-compose up -d
	@echo "Services started. API: http://localhost:8000, Docs: http://localhost:8000/api/docs"

build: ## Build Docker images
	docker-compose build --no-cache

stop: ## Stop all services
	docker-compose down

restart: ## Restart all services
	docker-compose restart

logs: ## Show logs
	docker-compose logs -f

migrate: ## Run database migrations
	docker-compose exec app php artisan migrate

migrate-fresh: ## Fresh migration with seed
	docker-compose exec app php artisan migrate:fresh --seed

seed: ## Seed database
	docker-compose exec app php artisan db:seed

test: ## Run backend tests
	docker-compose exec app php artisan test

test-mobile: ## Run mobile tests
	cd mobile && npm test

optimize: ## Optimize Laravel
	docker-compose exec app php artisan config:cache
	docker-compose exec app php artisan route:cache
	docker-compose exec app php artisan view:cache

clear-cache: ## Clear all caches
	docker-compose exec app php artisan cache:clear
	docker-compose exec app php artisan config:clear
	docker-compose exec app php artisan route:clear
	docker-compose exec app php artisan view:clear

shell: ## Enter app container shell
	docker-compose exec app bash

mysql: ## Enter MySQL shell
	docker-compose exec mysql mysql -u root -p

redis-cli: ## Enter Redis CLI
	docker-compose exec redis redis-cli

clean: ## Clean up containers and volumes
	docker-compose down -v
	rm -rf backend/vendor backend/node_modules
	rm -rf mobile/node_modules

deploy: ## Deploy to production (requires environment setup)
	@echo "Starting deployment..."
	@bash infra/scripts/deploy.sh

backup: ## Backup database
	@bash infra/scripts/backup.sh

docs: ## Generate API documentation
	docker-compose exec app php artisan l5-swagger:generate
