# backend/app.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from backend.utils.db_api import create_user, get_user_by_email, add_document, get_documents_by_user

app = FastAPI(title="Law Policy Explainer API")

# ==========================
# Schemas (request/response)
# ==========================
class UserCreate(BaseModel):
    name: str
    role: str
    email: str

class DocumentCreate(BaseModel):
    email: str        # find user by email
    filename: str
    content: str
    summary: str
    risks: str

# ==========================
# Routes
# ==========================

@app.post("/users")
def add_user(user: UserCreate):
    """Create a new user"""
    try:
        res = create_user(user.name, user.email, user.role)
        return {"status": "success", "user": res.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/users/{email}")
def get_user(email: str):
    """Fetch user by email"""
    res = get_user_by_email(email)
    if not res.data:
        raise HTTPException(status_code=404, detail="User not found")
    return {"user": res.data}

@app.post("/documents")
def add_document_route(doc: DocumentCreate):   # renamed route fn to avoid confusion
    """Add a document for a user (found by email)"""
    res = add_document(
        user_email=doc.email,
        filename=doc.filename,
        content=doc.content,
        summary=doc.summary,
        risks=doc.risks
    )
    return {"status": "success", "document": res.data}

@app.get("/documents/{email}")
def list_documents(email: str):
    """Fetch all documents for a user by email"""
    docs = get_documents_by_user(email)
    if "error" in docs:  # our db_api returns {"error": "..."} when user not found
        raise HTTPException(status_code=404, detail=docs["error"])
    return {"documents": docs}
