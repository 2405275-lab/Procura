#!/bin/bash
# Restore Procura database state from SQL file
if [ -z "$1" ]; then
  echo "Error: Please specify the SQL file path to restore."
  exit 1
fi

BACKUP_FILE=$1
echo "Restoring Procura database state from $BACKUP_FILE..."
psql $DATABASE_URL < $BACKUP_FILE
echo "Database restore completed successfully!"
