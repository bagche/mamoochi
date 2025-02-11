#!/usr/bin/env sh

# Abort on errors
set -e

# Remove old database and migration files
rm -rf .wrangler
rm -rf ./migrations

# Ensure wrangler starts D1 before running Drizzle commands
# npx wrangler d1 execute inbox --command "SELECT 1;" --local > /dev/null 2>&1

# Wait for a moment to allow the database to be initialized
sleep 2

# Generate a fresh migration from the schema
npx drizzle-kit generate

# Forcefully apply schema to the database (even if migrations exist)
# npx drizzle-kit push --force

# Apply the migrations cleanly
npx wrangler d1 migrations apply inbox --local
