# 🚀 Quick Start - GROQ API Setup

## ✅ Step 1: Get Your FREE GROQ API Key

1. Go to: **https://console.groq.com/**
2. Sign up (FREE - no credit card needed)
3. Click **"API Keys"** in the left sidebar
4. Click **"Create API Key"**
5. Copy your key (starts with `gsk_...`)

## ✅ Step 2: Add Key to .env File

Open the `.env` file in your project root and replace this line:

```
GROQ_API_KEY=your_groq_api_key_here
```

With your actual key:

```
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxx
```

**Save the file!**

## ✅ Step 3: Restart Your Backend

1. **Stop** your backend server (press `Ctrl+C` in the terminal)
2. **Restart** it:
   ```bash
   python -m uvicorn backend.app:app --reload --host 127.0.0.1 --port 8000
   ```

## ✅ Step 4: Test It!

1. Open your app in the browser
2. Click **Settings** (gear icon)
3. Go to **"Help & Support"** tab
4. Ask: **"How do I upload a document?"**
5. You should get an AI-powered response! 🎉

---

## 🎯 What You'll Get

- ✅ **AI-powered responses** to user questions
- ✅ **Better document summaries** using GROQ
- ✅ **Improved risk analysis** with AI insights
- ✅ **Natural language understanding** for help queries

## 🔧 Troubleshooting

**If it doesn't work:**
1. Make sure `.env` file is in the project root
2. Make sure the key starts with `gsk_`
3. Restart the backend server after adding the key
4. Check backend logs for error messages

**Need help?** Check `SETUP_GROQ.md` for detailed instructions.

---

**That's it! You're all set! 🚀**


