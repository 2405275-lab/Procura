#!/bin/bash
# Backup Procura database schema contents to local directory dump
BACKUP_DIR="./backups"
mkdir -p $BACKUP_DIR
TIMESTAMP=$(date +%F_%T)
BACKUP_FILE="$BACKUP_DIR/procura_db_$TIMESTAMP.sql"

echo "Creating PostgreSQL backup of Procura database..."
pg_dump $DATABASE_URL > $BACKUP_FILE
echo "Database backup completed successfully: $BACKUP_FILE"
