#!/bin/bash
set -e

# Load NVM so we can use npm/node
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo "--- Checking Dependencies ---"

# 1. PHP Dependencies
if [ ! -d "vendor" ]; then
    echo "Vendor folder missing. Running composer install..."
    composer install --no-interaction --optimize-autoloader
fi

# 2. Node Dependencies
if [ ! -d "node_modules" ]; then
    echo "node_modules missing. Running npm install..."
    npm install
fi

echo "--- Starting Frontend Dev Server ---"

# Execute the CMD (which will be npm run dev)
exec "$@"