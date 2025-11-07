# 🚀 Complete Deployment Guide

## Overview
This guide will help you deploy your Law Policy Explainer AI application using free services:
- **Frontend**: Vercel (React app)
- **Backend**: Railway (FastAPI)
- **Database**: Supabase (PostgreSQL)

## Prerequisites
1. GitHub account
2. Vercel account (free)
3. Railway account (free)
4. Supabase account (free)
5. GROQ API key (free)

## Step 1: Prepare Your Repository

### 1.1 Commit All Changes
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 1.2 Environment Variables
Create a `.env` file in your project root:
```env
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_anon_key_here
GROQ_API_KEY=your_groq_api_key_here
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app,http://localhost:3000
```

## Step 2: Deploy Backend to Railway

### 2.1 Connect Railway to GitHub
1. Go to [Railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository

### 2.2 Configure Railway
1. Railway will automatically detect Python
2. Set these environment variables in Railway dashboard:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_KEY`: Your Supabase anon key
   - `GROQ_API_KEY`: Your GROQ API key
   - `ALLOWED_ORIGINS`: `https://your-frontend-domain.vercel.app,http://localhost:3000`

### 2.3 Deploy
1. Railway will automatically build and deploy
2. Note the generated URL (e.g., `https://your-app-name.railway.app`)

## Step 3: Deploy Frontend to Vercel

### 3.1 Connect Vercel to GitHub
1. Go to [Vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your repository

### 3.2 Configure Vercel
1. **Framework Preset**: Create React App
2. **Root Directory**: `frontend`
3. **Build Command**: `npm run build`
4. **Output Directory**: `build`
5. **Install Command**: `npm install`

### 3.3 Set Environment Variables
In Vercel dashboard, add:
- `REACT_APP_API_URL`: Your Railway backend URL (e.g., `https://your-app-name.railway.app`)

### 3.4 Deploy
1. Click "Deploy"
2. Vercel will build and deploy your frontend
3. Note the generated URL (e.g., `https://your-app-name.vercel.app`)

## Step 4: Update CORS Settings

### 4.1 Update Backend CORS
Update your Railway backend environment variables:
- `ALLOWED_ORIGINS`: `https://your-frontend-domain.vercel.app,http://localhost:3000`

### 4.2 Update Frontend API URL
Update your Vercel environment variables:
- `REACT_APP_API_URL`: `https://your-backend-domain.railway.app`

## Step 5: Test Your Deployment

### 5.1 Test Backend
Visit: `https://your-backend-domain.railway.app/`
Should return: `{"message": "Law Policy Explainer AI Backend is running!"}`

### 5.2 Test Frontend
Visit: `https://your-frontend-domain.vercel.app/`
Should load your React application

### 5.3 Test Integration
1. Try uploading a document
2. Check if AI analysis works
3. Verify database operations

## Troubleshooting

### Common Issues

#### 1. CORS Errors
- Ensure `ALLOWED_ORIGINS` includes your Vercel domain
- Check that `REACT_APP_API_URL` points to your Railway backend

#### 2. Environment Variables
- Double-check all environment variables are set correctly
- Ensure no typos in variable names

#### 3. Build Failures
- Check Railway logs for backend issues
- Check Vercel logs for frontend issues
- Ensure all dependencies are in `requirements.txt`

#### 4. Database Connection
- Verify Supabase credentials
- Check if database is accessible from Railway

### Debugging Commands

#### Check Railway Logs
```bash
railway logs
```

#### Check Vercel Logs
In Vercel dashboard, go to Functions tab and check logs

#### Test API Endpoints
```bash
curl https://your-backend-domain.railway.app/
curl https://your-backend-domain.railway.app/users
```

## Cost Breakdown
- **Vercel**: Free (100GB bandwidth/month)
- **Railway**: Free (500 hours/month)
- **Supabase**: Free (500MB database, 50MB file storage)
- **GROQ**: Free (14,400 requests/day)

## Monitoring
- **Railway**: Monitor backend performance and logs
- **Vercel**: Monitor frontend performance and analytics
- **Supabase**: Monitor database usage and performance

## Updates
To update your deployment:
1. Make changes to your code
2. Commit and push to GitHub
3. Railway and Vercel will automatically redeploy

## Support
- Railway: [docs.railway.app](https://docs.railway.app)
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Supabase: [supabase.com/docs](https://supabase.com/docs)
- GROQ: [console.groq.com](https://console.groq.com)

---

🎉 **Congratulations!** Your Law Policy Explainer AI is now live and accessible to users worldwide!



