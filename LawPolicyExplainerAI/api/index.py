# Vercel serverless function entry point
from backend.app import app

# This is the entry point for Vercel serverless functions
handler = app
