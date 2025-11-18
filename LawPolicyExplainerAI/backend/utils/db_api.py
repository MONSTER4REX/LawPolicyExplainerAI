from supabase import create_client
from backend.utils.config_loader import get_supabase_credentials
from datetime import datetime
import json
import os


# ===============================
# Setup Supabase client
# ===============================
try:
    SUPABASE_URL, SUPABASE_KEY = get_supabase_credentials()
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("Supabase client initialized successfully")
except Exception as e:
    print(f"Supabase connection failed: {e}")
    print("Running in offline mode with local storage")
    supabase = None

# Local storage for offline mode
LOCAL_STORAGE_FILE = "local_data.json"

def load_local_data():
    """Load data from local JSON file"""
    if os.path.exists(LOCAL_STORAGE_FILE):
        with open(LOCAL_STORAGE_FILE, 'r') as f:
            return json.load(f)
    return {"users": [], "documents": []}

def save_local_data(data):
    """Save data to local JSON file"""
    with open(LOCAL_STORAGE_FILE, 'w') as f:
        json.dump(data, f, indent=2)


# ===============================
# USERS
# ===============================
def create_user(name: str, email: str, role: str, password: str = None):
    """Insert a new user into the database."""
    user_data = {
        "name": name,
        "email": email,
        "role": role,
        "created_at": datetime.now().isoformat()
    }
    
    # Add password if provided (in a real app, you'd hash this)
    if password:
        user_data["password"] = password
    
    if supabase:
        try:
            response = supabase.table("users").insert(user_data).execute()
            return response
        except Exception as e:
            print(f"Supabase error: {e}, falling back to local storage")
    
    # Fallback to local storage
    data = load_local_data()
    user_id = len(data["users"]) + 1
    new_user = {
        "id": user_id,
        "name": name,
        "email": email,
        "role": role,
        "created_at": datetime.now().isoformat()
    }
    
    # Add password to local storage too
    if password:
        new_user["password"] = password
    
    data["users"].append(new_user)
    save_local_data(data)
    
    # Create a mock response object
    class MockResponse:
        def __init__(self, data):
            self.data = [data]
    return MockResponse(new_user)

def update_user_created_at(email: str, created_at: str):
    """Update user's created_at field"""
    if supabase:
        try:
            supabase.table("users").update({"created_at": created_at}).eq("email", email).execute()
        except Exception as e:
            print(f"Supabase error: {e}, falling back to local storage")
    
    # Fallback to local storage
    data = load_local_data()
    for user in data["users"]:
        if user["email"] == email:
            user["created_at"] = created_at
            break
    save_local_data(data)


def get_user_by_email(email: str):
    """Fetch a user by email."""
    if supabase:
        try:
            response = supabase.table("users").select("*").eq("email", email).execute()
            return response
        except Exception as e:
            print(f"Supabase error: {e}, falling back to local storage")
    
    # Fallback to local storage
    data = load_local_data()
    user = next((u for u in data["users"] if u["email"] == email), None)
    
    # Create a mock response object
    class MockResponse:
        def __init__(self, data):
            self.data = [data] if data else []
    return MockResponse(user)


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

    if supabase:
        try:
            response = supabase.table("documents").insert({
                "user_id": user_id,
                "filename": filename,
                "content": content,
                "summary": summary,
                "risks": risks
            }).execute()
            return response
        except Exception as e:
            print(f"Supabase error: {e}, falling back to local storage")
    
    # Fallback to local storage
    data = load_local_data()
    doc_id = len(data["documents"]) + 1
    new_document = {
        "id": doc_id,
        "user_id": user_id,
        "filename": filename,
        "content": content,
        "summary": summary,
        "risks": risks,
        "created_at": datetime.now().isoformat()
    }
    data["documents"].append(new_document)
    save_local_data(data)
    
    # Create a mock response object
    class MockResponse:
        def __init__(self, data):
            self.data = [data]
    return MockResponse(new_document)


def update_document_summary_risks(document_id, summary: str, risks: str):
    """Update summary and risks for a given document id."""
    if supabase:
        try:
            response = (
                supabase
                .table("documents")
                .update({"summary": summary, "risks": risks})
                .eq("id", document_id)
                .execute()
            )
            return response
        except Exception as e:
            print(f"Supabase error: {e}, falling back to local storage")
    
    # Fallback to local storage
    data = load_local_data()
    for doc in data["documents"]:
        if str(doc["id"]) == str(document_id):
            doc["summary"] = summary
            doc["risks"] = risks
            save_local_data(data)
            break
    
    # Create a mock response object
    class MockResponse:
        def __init__(self, data):
            self.data = [data] if data else []
    return MockResponse(None)


def get_documents_by_user(email: str):
    """Fetch all documents for a given user by email."""
    user = get_user_by_email(email)
    if not user.data:
        return {"error": "User not found"}

    user_id = user.data[0]["id"]

    if supabase:
        try:
            response = supabase.table("documents").select("*").eq("user_id", user_id).execute()
            return response.data
        except Exception as e:
            print(f"Supabase error: {e}, falling back to local storage")
    
    # Fallback to local storage
    data = load_local_data()
    user_documents = [doc for doc in data["documents"] if doc["user_id"] == user_id]
    return user_documents


def delete_document(document_id, user_email: str):
    """Delete a document by ID for a specific user."""
    # Find user first
    user = get_user_by_email(user_email)
    if not user.data:
        return {"error": "User not found"}

    user_id = user.data[0]["id"]

    if supabase:
        try:
            response = supabase.table("documents").delete().eq("id", document_id).eq("user_id", user_id).execute()
            return {"success": True}
        except Exception as e:
            print(f"Supabase error: {e}, falling back to local storage")
    
    # Fallback to local storage
    data = load_local_data()
    data["documents"] = [
        doc for doc in data["documents"]
        if not (str(doc["id"]) == str(document_id) and doc["user_id"] == user_id)
    ]
    save_local_data(data)
    return {"success": True}
