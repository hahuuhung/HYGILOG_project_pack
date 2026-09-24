#!/bin/bash
set -e

MONGODB_URI=${1:-$MONGODB_URI}

if [ -z "$MONGODB_URI" ]; then
  echo "Error: MONGODB_URI is not set."
  exit 1
fi

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_DIR="backups/mongodb_backup_$TIMESTAMP"

echo "Starting backup to $BACKUP_DIR..."

if mongodump --uri="$MONGODB_URI" --out="$BACKUP_DIR" --gzip; then
  echo "Backup completed successfully!"
else
  echo "Backup failed!"
  exit 1
fi
