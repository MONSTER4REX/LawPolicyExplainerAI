# 🚀 Render + Vercel Deployment Guide

## Why Render Instead of Railway?
- ✅ **Reliable**: No Railpack issues
- ✅ **Python-friendly**: Excellent Python support
- ✅ **Free tier**: 750 hours/month
- ✅ **Easy setup**: Simple configuration
- ✅ **Fast builds**: Quick deployment times

## Step 1: Deploy Backend to Render

### 1.1 Create Render Account
1. Go to [Render.com](https://render.com)
2. Sign up with GitHub
3. Connect your GitHub account

### 1.2 Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `law-policy-explainer-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python main.py`
   - **Plan**: Free

### 1.3 Set Environment Variables
In Render dashboard, add these environment variables:
```
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_anon_key_here
GROQ_API_KEY=your_groq_api_key_here
ALLOWED_ORIGINS=http://localhost:3000
```

### 1.4 Deploy
1. Click "Create Web Service"
2. Render will automatically build and deploy
3. Note your service URL (e.g., `https://law-policy-explainer-backend.onrender.com`)

## Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Account
1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Connect your GitHub account

### 2.2 Import Project
1. Click "New Project"
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### 2.3 Set Environment Variables
In Vercel dashboard, add:
```
REACT_APP_API_URL=https://your-render-backend-url.onrender.com
```

### 2.4 Deploy
1. Click "Deploy"
2. Vercel will build and deploy your frontend
3. Note your frontend URL (e.g., `https://your-app.vercel.app`)

## Step 3: Update CORS Settings

### 3.1 Update Render Backend
1. Go to your Render service dashboard
2. Update environment variable:
   ```
   ALLOWED_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000
   ```
3. Redeploy the service

## Step 4: Test Your Deployment

### 4.1 Test Backend
Visit: `https://your-backend.onrender.com/`
Expected response: `{"message": "Law Policy Explainer AI Backend is running!"}`

### 4.2 Test Frontend
Visit: `https://your-frontend.vercel.app/`
Should load your React application

### 4.3 Test Integration
1. Try uploading a document
2. Check if AI analysis works
3. Verify database operations

## Environment Variables Reference

### Backend (Render)
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
GROQ_API_KEY=your-groq-api-key
ALLOWED_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000
```

### Frontend (Vercel)
```env
REACT_APP_API_URL=https://your-backend.onrender.com
```

## Troubleshooting

### Common Issues

#### 1. Build Failures
- Check Render build logs
- Ensure all dependencies are in `requirements.txt`
- Verify Python version compatibility

#### 2. CORS Errors
- Update `ALLOWED_ORIGINS` in Render
- Ensure `REACT_APP_API_URL` points to correct backend

#### 3. Environment Variables
- Double-check all variables are set correctly
- Ensure no typos in variable names

#### 4. Database Connection
- Verify Supabase credentials
- Check if database is accessible

### Debugging Commands

#### Test Backend API
```bash
curl https://your-backend.onrender.com/
curl https://your-backend.onrender.com/users
```

#### Check Render Logs
- Go to Render dashboard
- Click on your service
- View "Logs" tab

#### Check Vercel Logs
- Go to Vercel dashboard
- Click on your project
- View "Functions" tab

## Cost Breakdown
- **Render**: Free (750 hours/month)
- **Vercel**: Free (100GB bandwidth/month)
- **Supabase**: Free (500MB database)
- **GROQ**: Free (14,400 requests/day)

**Total: $0/month** 🎉

## Advantages of This Setup
1. **Reliability**: Render is more stable than Railway
2. **Speed**: Faster builds and deployments
3. **Simplicity**: Easier configuration
4. **Support**: Better documentation and support
5. **Performance**: Better performance for Python apps

## Next Steps After Deployment
1. Set up custom domain (optional)
2. Configure monitoring and alerts
3. Set up CI/CD pipeline
4. Add performance monitoring
5. Implement backup strategies

---

🎉 **Your Law Policy Explainer AI will be live and accessible worldwide!**



