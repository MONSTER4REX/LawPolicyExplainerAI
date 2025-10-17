#!/bin/bash

# Start script for Railway deployment
echo "Starting Law Policy Explainer AI Backend..."

# Set default port if not provided
if [ -z "$PORT" ]; then
    export PORT=8000
fi

# Start the FastAPI application
uvicorn backend.app:app --host 0.0.0.0 --port $PORT
