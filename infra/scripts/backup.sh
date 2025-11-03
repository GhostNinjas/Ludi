#!/bin/bash

# Ludi Backup Script
# Backs up MySQL database and storage files

set -e

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups/${TIMESTAMP}"

echo "💾 Starting backup..."

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Backup MySQL database
echo "📦 Backing up MySQL database..."
docker-compose exec -T mysql mysqldump \
    -u ${DB_USERNAME:-ludi} \
    -p${DB_PASSWORD:-secret} \
    ${DB_DATABASE:-ludi} \
    > "${BACKUP_DIR}/database.sql"

# Compress database backup
gzip "${BACKUP_DIR}/database.sql"

# Backup storage files
echo "📂 Backing up storage files..."
tar -czf "${BACKUP_DIR}/storage.tar.gz" backend/storage/app/public

# Calculate backup size
BACKUP_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)

echo "✅ Backup completed successfully!"
echo "📊 Backup size: $BACKUP_SIZE"
echo "📁 Backup location: $BACKUP_DIR"

# Clean up old backups (keep last 7 days)
echo "🧹 Cleaning up old backups..."
find backups/ -type d -mtime +7 -exec rm -rf {} +

echo "🎉 Backup process finished!"
