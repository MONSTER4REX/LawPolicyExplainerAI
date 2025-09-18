from supabase import create_client
import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()


# ===============================
# Setup Supabase client
# ===============================
SUPABASE_URL = os.getenv("https://pmoamjggvhlpwfzhkrkp.supabase.co")
SUPABASE_KEY = os.getenv("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtb2FtamdndmhscHdmemhrcmtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NTk4MjQsImV4cCI6MjA3MTMzNTgyNH0.dBMpTL_y2ETyqjWlSD2Tl3dbAMeOJtO2ChQRZK7gUUA")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError(
        "❌ Missing SUPABASE_URL or SUPABASE_KEY in .env file.\n"
        "Make sure your .env file exists in project root and looks like:\n\n"
        "SUPABASE_URL=https://<your-project-id>.supabase.co\n"
        "SUPABASE_KEY=<your-service-role-key>\n"
    )

# Create client safely
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


# ===============================
# USERS
# ===============================
def create_user(name: str, email: str, role: str):
    """Insert a new user into the database."""
    response = supabase.table("users").insert({
        "name": name,
        "email": email,
        "role": role
    }).execute()
    return response


def get_user_by_email(email: str):
    """Fetch a user by email."""
    response = supabase.table("users").select("*").eq("email", email).execute()
    return response


# ===============================
# DOCUMENTS
# ===============================
def add_document(user_email: str, filename: str, content: str, summary: str, risks: str):
    """Add a new document linked to a user by email."""
    # Find user first
    user = get_user_by_email(user_email)
    if not user.data:
        return {"error": "User not found"}

    user_id = user.data[0]["id"]

    response = supabase.table("documents").insert({
        "user_id": user_id,
        "filename": filename,
        "content": content,
        "summary": summary,
        "risks": risks
    }).execute()

    return response


def get_documents_by_user(email: str):
    """Fetch all documents for a given user by email."""
    user = get_user_by_email(email)
    if not user.data:
        return {"error": "User not found"}

    user_id = user.data[0]["id"]

    response = supabase.table("documents").select("*").eq("user_id", user_id).execute()
    return response.data
