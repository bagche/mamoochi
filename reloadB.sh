#!/usr/bin/env sh

# Abort on errors
set -e

# Remove old wrangler directory and bundled migration files
rm -rf .wrangler
rm -rf ./migrations

# Create the output directory for bundled migrations
mkdir -p ./migrations

# Wait a moment (if needed)
sleep 2

# Generate fresh migration files using drizzle-kit
npx drizzle-kit generate

# Define the directory where drizzle-kit outputs SQL migration files.
MIGRATION_DIR="./migrations"

# Debug: list migration files found in MIGRATION_DIR
echo "Listing migration files in ${MIGRATION_DIR}:"
ls -l "${MIGRATION_DIR}" || true

# Set output file for bundled migrations
output_file=./server/utils/migrations.ts

# Write header for the migrations.ts file
cat <<'EOF' >"$output_file"
// This file is auto-generated. Do not edit manually.
export const dbMigrations = [
EOF

# Loop over each SQL file in MIGRATION_DIR
for file in "$MIGRATION_DIR"/*.sql; do
    if [ -f "$file" ]; then
        base=$(basename "$file")
        # Read file content and convert it to a JSON string using Python.
        content=$(python -c 'import sys, json; print(json.dumps(sys.stdin.read()))' <"$file")
        # Append a migration object to the output file.
        cat <<EOF >>"$output_file"
  {
    name: "$base",
    content: $content,
  },
EOF
    fi
done

# Close the exported array
echo "];" >>"$output_file"

echo "Bundled migrations generated at $output_file"
