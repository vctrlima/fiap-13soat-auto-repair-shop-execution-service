#!/bin/sh
set -e

echo "Starting Execution & Notification Service..."

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Database setup complete!"

echo "Starting application..."
exec "$@"
