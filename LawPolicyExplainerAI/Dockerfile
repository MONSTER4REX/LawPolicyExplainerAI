FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY backend/ ./backend/
COPY config.yaml .

# Create a simple start script
RUN echo '#!/bin/bash\nuvicorn backend.app:app --host 0.0.0.0 --port $PORT' > start.sh && chmod +x start.sh

# Expose port
EXPOSE 8000

# Run the application
CMD ["./start.sh"]





