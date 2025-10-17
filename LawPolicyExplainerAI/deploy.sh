#!/bin/bash

# 🚀 Free Deployment Script for Law Policy Explainer AI
echo "🚀 Starting deployment process..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized. Please run: git init"
    exit 1
fi

# Check if all changes are committed
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Uncommitted changes found. Committing them..."
    git add .
    git commit -m "Prepare for deployment"
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

echo "✅ Code pushed to GitHub!"
echo ""
echo "🎯 Next Steps:"
echo "1. Go to Railway.app and deploy your backend"
echo "2. Go to Vercel.com and deploy your frontend"
echo "3. Update CORS settings with your Vercel URL"
echo "4. Set environment variables in both platforms"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions!"








