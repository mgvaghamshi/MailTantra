#!/bin/bash

# ColdEdge Email Service - Frontend Startup Script
# This script installs dependencies (if needed) and starts the frontend dev server

set -e  # Exit on error

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check if node_modules exists
if [ ! -d "$SCRIPT_DIR/node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo "🚀 Starting ColdEdge Email Service Frontend..."
echo "📍 Dashboard will be available at: http://localhost:3000"
echo ""
npm run dev
