# 🚀 Free Deployment Guide

This guide will help you deploy your Law Policy Explainer AI project for **FREE** using Railway (backend) and Vercel (frontend).

## 📋 Prerequisites

1. **GitHub Account** - Free
2. **Railway Account** - Free tier (500 hours/month)
3. **Vercel Account** - Free tier (unlimited)
4. **Supabase Account** - Free tier
5. **GROQ Account** - Free tier

## 🔧 Step 1: Prepare Your Repository

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

## 🚂 Step 2: Deploy Backend on Railway

1. **Go to [Railway.app](https://railway.app)**
2. **Sign up with GitHub**
3. **Click "New Project" → "Deploy from GitHub repo"**
4. **Select your repository**
5. **Railway will automatically detect it's a Python project**

### Configure Environment Variables on Railway:

1. **Go to your project → Variables tab**
2. **Add these environment variables:**
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   GROQ_API_KEY=gsk_your_groq_api_key_here
   ```

3. **Railway will automatically deploy your backend**
4. **Copy your Railway URL** (something like: `https://your-app.railway.app`)

## ⚡ Step 3: Deploy Frontend on Vercel

1. **Go to [Vercel.com](https://vercel.com)**
2. **Sign up with GitHub**
3. **Click "New Project" → Import from GitHub**
4. **Select your repository**
5. **Configure build settings:**
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

### Configure Environment Variables on Vercel:

1. **Go to your project → Settings → Environment Variables**
2. **Add this variable:**
   ```
   REACT_APP_API_URL=https://your-app.railway.app
   ```

## 🔄 Step 4: Update API URLs

After deployment, update the frontend to use your Railway backend URL:

1. **In your GitHub repository, update all API calls:**
   - Replace `http://127.0.0.1:8000` with your Railway URL
   - Or use environment variable `process.env.REACT_APP_API_URL`

2. **Update CORS in backend (`backend/app.py`):**
   - Add your Vercel URL to `allowed_origins`

3. **Push changes to GitHub:**
   ```bash
   git add .
   git commit -m "Update API URLs for production"
   git push origin main
   ```

## 🎉 Step 5: Test Your Deployment

1. **Visit your Vercel URL** (e.g., `https://your-app.vercel.app`)
2. **Test all features:**
   - User registration/login
   - Document upload
   - AI assistant
   - Groups functionality

## 💰 Cost Breakdown

- **Railway**: FREE (500 hours/month)
- **Vercel**: FREE (unlimited)
- **Supabase**: FREE (up to 50MB database)
- **GROQ**: FREE (up to 14,400 requests/day)

**Total Cost: $0/month** 🎉

## 🔧 Troubleshooting

### Backend Issues:
- Check Railway logs for errors
- Verify environment variables are set
- Ensure `python-multipart` is in requirements.txt

### Frontend Issues:
- Check Vercel build logs
- Verify API URLs are correct
- Check browser console for CORS errors

### CORS Issues:
- Update `allowed_origins` in `backend/app.py`
- Ensure your Vercel URL is included

## 📞 Support

If you encounter issues:
1. Check the logs in Railway/Vercel dashboards
2. Verify all environment variables are set
3. Test API endpoints directly using tools like Postman

## 🚀 Your Live URLs

After deployment, you'll have:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.railway.app`
- **API Docs**: `https://your-app.railway.app/docs`

Share your Vercel URL with anyone to access your Law Policy Explainer AI! 🌟




