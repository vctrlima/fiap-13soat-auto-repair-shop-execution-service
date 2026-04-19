#!/bin/sh
set -e

echo "Starting Execution & Notification Service..."

echo "Starting application..."
exec "$@"
