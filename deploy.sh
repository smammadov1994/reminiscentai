#!/bin/bash

# Logo Reactivator - GitHub Pages Deployment Script

echo "🚀 Deploying Logo Reactivator to GitHub Pages..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized. Please run 'git init' first."
    exit 1
fi

# Add all changes
echo "📦 Adding changes..."
git add .

# Commit changes
echo "💾 Committing changes..."
read -p "Enter commit message (or press Enter for default): " commit_msg
if [ -z "$commit_msg" ]; then
    commit_msg="Update Logo Reactivator app"
fi
git commit -m "$commit_msg"

# Push to main branch
echo "🔄 Pushing to GitHub..."
git push origin main

echo "✅ Deployment triggered!"
echo "📱 Check your GitHub Actions tab for deployment progress"
echo "🌐 Your app will be live at: https://YOUR_USERNAME.github.io/copy-of-logo-reactivator/"
echo ""
echo "📋 Don't forget to:"
echo "   1. Set up GitHub Secrets (see GITHUB_PAGES_DEPLOYMENT.md)"
echo "   2. Enable GitHub Pages in repository settings"
echo "   3. Wait 2-3 minutes for deployment to complete"