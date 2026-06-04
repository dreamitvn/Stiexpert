#!/bin/bash
set -e
echo "=== STI-Expert Backend Startup ==="

echo "Running migrations..."
python manage.py migrate --noinput 2>/dev/null || true

echo "Collecting static files..."
python manage.py collectstatic --noinput --clear 2>/dev/null || true

echo "=== Starting server ==="
exec "$@"