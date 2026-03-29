#!/bin/sh
set -e  # Exit immediately if a command fails

# 1. Guarantee Laravel's required directories exist
mkdir -p storage/framework/views storage/framework/cache storage/framework/sessions storage/logs bootstrap/cache

# Optional: Install deps if they are missing
if [ ! -d "vendor" ]; then 
    echo "Installing composer dependencies..."
    # Using --no-dev is best practice for staging/prod, but you can leave it off if you need dev tools
    COMPOSER_ALLOW_SUPERUSER=1 composer install --no-interaction --quiet
fi

echo "Waiting for database..."
until php artisan db:monitor > /dev/null 2>&1; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

# Now run migrations
echo "Running database migrations..."
php artisan migrate --force

# Install npm dependencies
if [ ! -d "node_modules" ]; then 
    echo "Installing npm dependencies..."
    npm install --silent
fi

# Build the assets instead of running the dev server
echo "Building Vite assets..."
npm run build

# Optional but recommended for staging: Cache Laravel's config and routes for speed
echo "Caching configuration..."
php artisan optimize

# 3. THE MAGIC BULLET: Fix all permissions on the mounted volume
# We forcefully hand ownership of the generated files to the web user
echo "Setting correct permissions for www-data..."
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache /var/www/public

# Start PHP-FPM in the foreground
echo "Starting PHP-FPM..."
exec php-fpm