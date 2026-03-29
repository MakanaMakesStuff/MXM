#!/bin/sh
set -e  # Exit immediately if a command fails

# Optional: Install deps if they are missing
if [ ! -d "vendor" ]; then 
    echo "Installing composer dependencies..."
    composer install --no-interaction --quiet
fi

# run artisan migration
echo "Running database migrations..."
php artisan migrate --force

# Start Vite in the background
echo "Starting Vite..."
npm run dev & 

# Start PHP-FPM in the foreground
echo "Starting PHP-FPM..."
exec php-fpm