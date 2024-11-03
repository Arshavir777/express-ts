#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Run migrations
echo "Running migrations..."
npm run migrate

# Run seeders
echo "Running seeders..."
npm run seed

# Start the app and worker using pm2
echo "Starting app and worker with pm2..."
pm2-runtime ecosystem.config.js
