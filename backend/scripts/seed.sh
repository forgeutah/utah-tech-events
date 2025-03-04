#!/bin/bash

# This script seeds the database with test data

# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo "PostgreSQL is not running. Please start PostgreSQL and try again."
    exit 1
fi

# Create database if it doesn't exist
if ! psql -lqt | cut -d \| -f 1 | grep -qw events; then
    echo "Creating database 'events'..."
    createdb events
fi

# Run the seed script
echo "Seeding database with test data..."
psql -d events -f scripts/seed_data.sql

echo "Database seeded successfully!"
