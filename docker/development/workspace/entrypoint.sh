#!/bin/bash
set -e

# Load NVM so Node.js commands work
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Run npm install if node_modules is missing
if [ ! -d "node_modules" ]; then
    echo "Running npm install..."
    npm install
fi

# Start the dev server in the background
echo "Starting npm dev server..."
npm run dev &



# Execute the CMD passed to container (default: bash)
exec "$@"