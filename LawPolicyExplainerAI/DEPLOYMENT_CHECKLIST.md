# ✅ Deployment Checklist

## Pre-Deployment Setup
- [ ] GitHub repository is up to date
- [ ] All environment variables are ready
- [ ] Code is tested locally

## Backend Deployment (Railway)
- [ ] Go to [Railway.app](https://railway.app)
- [ ] Sign in with GitHub
- [ ] Create new project from GitHub repo
- [ ] Set environment variables:
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_KEY` 
  - [ ] `GROQ_API_KEY`
  - [ ] `ALLOWED_ORIGINS` (set to your Vercel domain later)
- [ ] Deploy and get backend URL
- [ ] Test backend: `https://your-backend.railway.app/`

## Frontend Deployment (Vercel)
- [ ] Go to [Vercel.com](https://vercel.com)
- [ ] Sign in with GitHub
- [ ] Import your repository
- [ ] Configure:
  - [ ] Framework: Create React App
  - [ ] Root Directory: `frontend`
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `build`
- [ ] Set environment variable:
  - [ ] `REACT_APP_API_URL`: Your Railway backend URL
- [ ] Deploy and get frontend URL
- [ ] Test frontend: `https://your-frontend.vercel.app/`

## Post-Deployment
- [ ] Update Railway CORS with Vercel domain
- [ ] Test full application flow
- [ ] Verify AI functionality works
- [ ] Check database operations
- [ ] Test document upload and analysis

## Environment Variables Reference
```env
# Supabase (get from supabase.com)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key

# GROQ (get from console.groq.com)
GROQ_API_KEY=your-groq-api-key

# CORS (update after getting Vercel URL)
ALLOWED_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000

# Frontend (set in Vercel)
REACT_APP_API_URL=https://your-backend.railway.app
```

## Quick Test Commands
```bash
# Test backend
curl https://your-backend.railway.app/

# Test frontend
open https://your-frontend.vercel.app/
```

## Troubleshooting
- [ ] Check Railway logs for backend issues
- [ ] Check Vercel logs for frontend issues
- [ ] Verify all environment variables are set
- [ ] Test API endpoints individually
- [ ] Check CORS settings

---
**Total Cost: $0/month** 🎉



