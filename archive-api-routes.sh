#!/bin/bash

# Create archive directory
mkdir -p archived-api-routes

# Move the entire api directory to archive
mv src/app/api archived-api-routes/

echo "Archived all API routes to archived-api-routes/"
echo "If you need to restore them, run: mv archived-api-routes/api src/app/"