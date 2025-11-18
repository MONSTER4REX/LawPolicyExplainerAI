# AI Setup Guide - GROQ API Key

## Quick Comparison

### Option 1: GROQ API Key (Recommended) ✅
- **Cost**: FREE (Generous free tier)
- **Quality**: AI-powered, intelligent responses
- **Setup Time**: 2 minutes
- **User Experience**: Excellent

### Option 2: Fallback Responses
- **Cost**: FREE (No API needed)
- **Quality**: Basic keyword matching
- **Setup Time**: 0 minutes (already working)
- **User Experience**: Limited

## Recommendation: Use GROQ API Key

**Why?** Better user experience with minimal setup and no cost for reasonable usage.

---

## Setup Instructions

### Step 1: Get Your GROQ API Key
1. Visit: https://console.groq.com/
2. Sign up for a free account (or log in)
3. Go to API Keys section
4. Create a new API key
5. Copy the key (starts with `gsk_...`)

### Step 2: Add to Environment
Create or edit `.env` file in the project root:

```env
GROQ_API_KEY=your_api_key_here
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

### Step 3: Restart Backend
```bash
# Stop current server (Ctrl+C)
# Then restart:
python -m uvicorn backend.app:app --reload --host 127.0.0.1 --port 8000
```

### Step 4: Test
1. Open your app
2. Go to Settings > Help & Support
3. Ask: "How do I upload a document?"
4. You should get an AI-powered response!

---

## Fallback Option (No API Key)

If you don't want to use GROQ:
- The system will automatically use keyword-based fallback responses
- Works immediately without setup
- Limited to predefined questions/responses

---

## Current Status

✅ AI endpoint fixed and ready
✅ Fallback responses implemented
✅ Error handling improved
⏳ GROQ_API_KEY: Not configured (using fallback mode)

