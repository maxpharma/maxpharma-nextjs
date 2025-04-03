#!/bin/bash
set -e

# Install only necessary system dependencies
echo "Installing system dependencies..."
apt update && apt install -y \
    netcat-openbsd \
    libvips-dev


# Wait for the database to be ready
echo "Waiting for the database to be ready..."
until bun run -e "
import mysql from 'mysql2/promise';
(async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });
        await connection.end();
    } catch (err) {
        process.exit(1);
    }
})()
" > /dev/null 2>&1; do
    echo "Database is not ready, retrying..."
    sleep 2
done
echo "Database is ready!"

# Run migrations using the existing migration script
echo "Running migrations..."
bun run migrate

# Start the application
echo "Starting the application..."
bun run start