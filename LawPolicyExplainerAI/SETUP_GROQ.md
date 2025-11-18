# Setup GROQ API Key - Quick Guide

## Step 1: Get Your FREE GROQ API Key

1. **Visit**: https://console.groq.com/
2. **Sign up** (free account - no credit card needed)
3. **Navigate to**: API Keys section (left sidebar)
4. **Click**: "Create API Key"
5. **Copy** the key (starts with `gsk_...`)

## Step 2: Create .env File

Create a file named `.env` in the project root directory with this content:

```env
# Supabase Configuration (Already configured)
SUPABASE_URL=https://pmoamjggvhlpwfzhkrkp.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtb2FtamdndmhscHdmemhrcmtwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTc1OTgyNCwiZXhwIjoyMDcxMzM1ODI0fQ.vvVe1lOyji5uyUyTT_UdVVnWsRAGDhZVDzG46aNiic0

# GROQ API Key (Replace with your actual key)
GROQ_API_KEY=gsk_your_actual_key_here
```

**Replace `gsk_your_actual_key_here` with your actual GROQ API key!**

## Step 3: Restart Backend Server

1. Stop your current backend server (Ctrl+C)
2. Restart it:
   ```bash
   python -m uvicorn backend.app:app --reload --host 127.0.0.1 --port 8000
   ```

## Step 4: Test It!

1. Open your app in the browser
2. Go to **Settings** (gear icon)
3. Click **Help & Support** tab
4. Ask: "How do I upload a document?"
5. You should get an AI-powered response! 🎉

## Troubleshooting

**If AI still doesn't work:**
1. Make sure `.env` file is in the project root (same folder as `backend/`)
2. Make sure the key starts with `gsk_`
3. Check backend logs for error messages
4. Verify the key is valid at https://console.groq.com/

## Need Help?

The AI will work automatically once you:
- ✅ Have a `.env` file with `GROQ_API_KEY`
- ✅ Restart your backend server
- ✅ Test in the Help & Support section

Good luck! 🚀


