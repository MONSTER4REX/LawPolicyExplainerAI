#!/usr/bin/env python3
"""
Main entry point for the Law Policy Explainer AI Backend
This file is used by Render for deployment
"""

import os
import uvicorn
from backend.app import app

if __name__ == "__main__":
    # Get port from environment variable (Render sets this)
    port = int(os.environ.get("PORT", 8000))
    
    # Run the FastAPI application
    uvicorn.run(
        "backend.app:app",
        host="0.0.0.0",
        port=port,
        log_level="info"
    )
