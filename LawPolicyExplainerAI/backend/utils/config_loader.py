import os
from dotenv import load_dotenv


# Ensure environment variables from .env are loaded once at import time
load_dotenv()


def get_supabase_credentials() -> tuple[str, str]:
    """Return (SUPABASE_URL, SUPABASE_KEY) from environment.

    Raises a ValueError if either is missing to fail fast.
    """
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")
    if not supabase_url or not supabase_key:
        raise ValueError("Missing SUPABASE_URL or SUPABASE_KEY in environment")
    return supabase_url, supabase_key


def get_ai_config() -> dict:
    """Return AI configuration from environment.

    Supported env vars:
    - GROQ_API_KEY
    - GROQ_MODEL (default: 'llama-3.1-8b-instant')
    - OPENAI_API_KEY (optional alternative)
    - OPENAI_MODEL (default: 'gpt-4o-mini')
    """
    return {
        "groq_api_key": os.getenv("GROQ_API_KEY"),
        "groq_model": os.getenv("GROQ_MODEL", "llama-3.1-8b-instant"),
        "openai_api_key": os.getenv("OPENAI_API_KEY"),
        "openai_model": os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
    }





