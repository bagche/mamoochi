#!/usr/bin/env sh

# abort on errors
set -e
rm -rf .wrangler
rm -rf ./migrations
npx drizzle-kit generate
# npx drizzle-kit push
npx wrangler d1 migrations apply inbox --local
