#!/bin/sh
set -e

# Sync the baked public files to a shared volume for Nginx to serve
# This ensures Nginx always gets the latest frontend build after a deployment
cp -rT /var/www/public /var/www/shared_public

echo "Waiting for database..."
until php artisan db:monitor > /dev/null 2>&1; do
  sleep 2
done

# Run migrations (ensure you backup DBs in prod before this runs automatically, 
# or remove this and run it manually via CI/CD)
echo "Running database migrations..."
php artisan migrate --force

echo "Caching Laravel configurations..."
php artisan config:cache
php artisan event:cache
php artisan route:cache
php artisan view:cache

# ==========================================
# START REVERB IN THE BACKGROUND
# ==========================================
echo "Starting Reverb WebSocket server..."
php artisan reverb:start --host="0.0.0.0" --port="8080" &

echo "Starting PHP-FPM..."
exec php-fpm