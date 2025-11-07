# backend/app.py
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tempfile
import os
from backend.utils.db_api import (
    create_user,
    get_user_by_email,
    add_document,
    get_documents_by_user,
    update_document_summary_risks,
    delete_document,
)
from backend.services.summarizer import summarize_text
from backend.services.risk_highlighter import analyze_risks
from backend.services.document_parser import extract_text_from_file
from backend.utils.config_loader import get_ai_config

app = FastAPI(title="Law Policy Explainer API")

# Add CORS middleware
# CORS configuration for production and development
allowed_origins = [
    "http://localhost:3000", 
    "http://127.0.0.1:3000",
    "https://law-policy-explainer.vercel.app",  # Vercel frontend URL (update this)
    "https://law-policy-explainer-frontend.vercel.app",  # Alternative Vercel URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================
# Schemas (request/response)
# ==========================
class UserCreate(BaseModel):
    name: str
    role: str
    email: str
    password: str = None  # Optional password for now

class DocumentCreate(BaseModel):
    email: str        # find user by email
    filename: str
    content: str

# ==========================
# Routes
# ==========================

@app.get("/")
def health_check():
    """Simple health check endpoint"""
    return {"status": "ok", "message": "Law Policy Explainer API is running"}

@app.post("/users")
def add_user(user: UserCreate):
    """Create a new user"""
    try:
        # Check if user already exists
        existing_user = get_user_by_email(user.email)
        if existing_user.data:
            # Return existing user but ensure created_at is set
            user_data = existing_user.data[0]
            if not user_data.get('created_at'):
                from datetime import datetime
                user_data['created_at'] = datetime.now().isoformat()
                # Update the user in storage
                update_user_created_at(user.email, user_data['created_at'])
            return {"status": "success", "user": user_data, "message": "User already exists"}
        
        res = create_user(user.name, user.email, user.role, user.password)
        return {"status": "success", "user": res.data[0]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/users/{email}")
def get_user(email: str):
    """Fetch user by email"""
    res = get_user_by_email(email)
    if not res.data:
        raise HTTPException(status_code=404, detail="User not found")
    return {"user": res.data[0]}

@app.post("/documents")
def add_document_route(doc: DocumentCreate):   # renamed route fn to avoid confusion
    """Add a document for a user (found by email), analyze with AI, and update summary/risks."""
    # Ensure user exists
    user_res = get_user_by_email(doc.email)
    if not user_res.data:
        # Auto-create user if not found
        default_name = doc.email.split("@")[0].replace(".", " ").title()
        created = create_user(default_name, doc.email, "student", None)
        user_res = created

    # Insert raw document first (empty summary/risks)
    insert_res = add_document(
        user_email=doc.email,
        filename=doc.filename,
        content=doc.content,
        summary="",
        risks="",
    )
    if not getattr(insert_res, "data", None):
        raise HTTPException(status_code=400, detail="Failed to insert document")

    doc_row = insert_res.data[0]
    doc_id = doc_row["id"]

    # Analyze with AI services
    summary = summarize_text(doc.content)
    risks = analyze_risks(doc.content)

    # Update the same row with AI outputs
    update_document_summary_risks(doc_id, summary, risks)

    return {
        "status": "success",
        "document": {
            "id": doc_id,
            "filename": doc.filename,
            "summary": summary,
            "risks": risks,
        },
    }

@app.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    email: str = Form(...)
):
    """Upload a document file and extract text for analysis."""
    # Ensure user exists
    user_res = get_user_by_email(email)
    if not user_res.data:
        # Auto-create user if not found
        default_name = email.split("@")[0].replace(".", " ").title()
        created = create_user(default_name, email, "student", None)
        user_res = created

    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=f"_{file.filename}") as tmp_file:
        content = await file.read()
        tmp_file.write(content)
        tmp_file_path = tmp_file.name

    try:
        # Extract text from the file
        extracted_text = extract_text_from_file(tmp_file_path, file.filename)
        
        if not extracted_text or extracted_text.strip() == "":
            raise HTTPException(status_code=400, detail="Could not extract text from file")

        # Insert document with extracted text
        insert_res = add_document(
            user_email=email,
            filename=file.filename,
            content=extracted_text,
            summary="",
            risks="",
        )
        
        if not getattr(insert_res, "data", None):
            raise HTTPException(status_code=400, detail="Failed to insert document")

        doc_row = insert_res.data[0]
        doc_id = doc_row["id"]

        # Analyze with AI services
        summary = summarize_text(extracted_text)
        risks = analyze_risks(extracted_text)

        # Update the same row with AI outputs
        update_document_summary_risks(doc_id, summary, risks)

        return {
            "status": "success",
            "document": {
                "id": doc_id,
                "filename": file.filename,
                "summary": summary,
                "risks": risks,
            },
        }
    
    finally:
        # Clean up temporary file
        if os.path.exists(tmp_file_path):
            os.unlink(tmp_file_path)

@app.get("/documents/{email}")
def list_documents(email: str):
    """Fetch all documents for a user by email"""
    docs = get_documents_by_user(email)
    if "error" in docs:  # our db_api returns {"error": "..."} when user not found
        raise HTTPException(status_code=404, detail=docs["error"])
    return {"documents": docs}

@app.get("/documents/{email}/{document_id}")
def get_document_detail(email: str, document_id: int):
    """Fetch a single document by id for a given user; backfill summary/risks if missing."""
    # Ensure user exists
    user = get_user_by_email(email)
    if not user.data:
        raise HTTPException(status_code=404, detail="User not found")

    # Get all docs for user and locate the requested one (storage backends differ)
    docs = get_documents_by_user(email)
    if isinstance(docs, dict) and "error" in docs:
        raise HTTPException(status_code=404, detail=docs["error"])

    doc = next((d for d in docs if int(d.get("id")) == int(document_id)), None)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    # Ensure summary/risks exist; if missing, compute and persist
    summary = doc.get("summary") or ""
    risks = doc.get("risks") or ""
    content = doc.get("content") or ""

    changed = False
    if not summary and content:
        summary = summarize_text(content)
        changed = True
    if not risks and content:
        risks = analyze_risks(content)
        changed = True
    if changed:
        try:
            update_document_summary_risks(int(document_id), summary, risks)
        except Exception:
            pass

    doc["summary"] = summary
    doc["risks"] = risks
    return {"document": doc}

@app.delete("/documents/{document_id}")
def delete_document_route(document_id: int, email: str):
    """Delete a document by ID for a specific user"""
    result = delete_document(document_id, email)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return {"status": "success", "message": "Document deleted successfully"}

@app.post("/ai-help")
async def ai_help_endpoint(request: dict):
    """AI Assistant endpoint for help and support"""
    query = request.get("query", "")
    user_email = request.get("user_email", "")
    
    if not query.strip():
        raise HTTPException(status_code=400, detail="Query is required")
    
    try:
        # Get AI configuration
        ai_config = get_ai_config()
        groq_api_key = ai_config.get("groq_api_key")
        
        if groq_api_key:
            # Use GROQ API for AI responses
            import requests
            
            headers = {
                "Authorization": f"Bearer {groq_api_key}",
                "Content-Type": "application/json"
            }
            
            # Create a context-aware prompt for legal document help
            prompt = f"""You are an AI assistant specialized in legal document analysis and risk assessment. 
            A user is asking for help with the following question: "{query}"
            
            Please provide a helpful, accurate response related to:
            - Legal document analysis
            - Risk assessment
            - Document management
            - Using the Law Policy Explainer platform
            - General legal document questions
            
            Keep your response concise but informative. If the question is not related to legal documents or the platform, politely redirect to relevant topics.
            
            User question: {query}
            
            Response:"""
            
            data = {
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a helpful AI assistant specializing in legal document analysis and risk assessment. Provide clear, accurate, and helpful responses."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "model": "llama-3.1-8b-instant",
                "max_tokens": 500,
                "temperature": 0.7
            }
            
            response = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers=headers,
                json=data,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                ai_response = result["choices"][0]["message"]["content"].strip()
                return {"response": ai_response}
            else:
                return {"response": "I'm having trouble connecting to the AI service right now. Please try again later."}
        else:
            # Fallback response when GROQ API key is not available
            fallback_responses = {
                "upload": "To upload documents, go to the Upload page and drag & drop your PDF, DOCX, or TXT files. The AI will automatically analyze them for risks and provide summaries.",
                "risk": "Risk analysis identifies potentially problematic clauses in legal documents. Look for high-risk items marked in red, medium-risk in orange, and low-risk in yellow.",
                "groups": "Create document groups to organize your legal documents by category (e.g., 'Contracts', 'Policies'). Click 'Create Group' and add documents to organize them better.",
                "download": "You can download document analysis reports from the Documents page. Click the 'Download' button on any document to get a text file with the summary and risk analysis.",
                "theme": "Switch between light and dark mode in Settings > Appearance. Your preference will be saved and persist across sessions.",
                "delete": "To delete documents, go to the Documents page and click the red 'Delete' button. This action cannot be undone, so be careful.",
                "summary": "Document summaries provide a plain-language explanation of complex legal documents, making them easier to understand for non-lawyers."
            }
            
            # Simple keyword matching for fallback responses
            query_lower = query.lower()
            for keyword, response in fallback_responses.items():
                if keyword in query_lower:
                    return {"response": response}
            
            return {"response": "I can help you with legal document analysis, risk assessment, uploading documents, creating groups, and using the platform. Please ask a specific question about these topics."}
            
    except Exception as e:
        print(f"Error in AI help endpoint: {e}")
        return {"response": "I'm experiencing technical difficulties. Please try again later or contact support."}
