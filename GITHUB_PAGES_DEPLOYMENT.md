# Deploy Logo Reactivator to GitHub Pages

This guide will help you deploy your Logo Reactivator app to GitHub Pages for free hosting.

## Step 1: Push Your Code to GitHub

1. **Create a new repository** on GitHub (if you haven't already)
2. **Name it**: `copy-of-logo-reactivator` (or whatever you prefer)
3. **Push your code**:
   ```bash
   git add .
   git commit -m "Initial commit - Logo Reactivator app"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/copy-of-logo-reactivator.git
   git push -u origin main
   ```

## Step 2: Set Up GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

**Add these secrets** (Repository secrets):

```
VITE_GEMINI_API_KEY = AIzaSyDLbqH7JRGjQiyIC2dmxI9gKzN_Rb5Dd5g
VITE_STRIPE_PUBLISHABLE_KEY = pk_test_your_stripe_key_here
VITE_EMAILJS_SERVICE_ID = service_471pfai
VITE_EMAILJS_TEMPLATE_ID = template_w91nsw8
VITE_EMAILJS_PUBLIC_KEY = vqKMEE--EfkRvwkwb
VITE_SUPABASE_URL = https://slvpkxwkmsdnsqjudyrl.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsdnBreHdrbXNkbnNxanVkeXJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NzExMTEsImV4cCI6MjA3NzQ0NzExMX0.SaLmN-raStMYWomyZRdhEOMJggJz-Eiqai3iE27qOQ4
```

## Step 3: Enable GitHub Pages

1. **Go to your repository** → Settings → Pages
2. **Source**: Deploy from a branch
3. **Branch**: Select `gh-pages`
4. **Folder**: `/ (root)`
5. **Click Save**

## Step 4: Trigger Deployment

1. **Make any small change** to your code (like updating README.md)
2. **Commit and push**:

   ```bash
   git add .
   git commit -m "Enable GitHub Pages deployment"
   git push
   ```

3. **Check Actions tab** in your GitHub repo to see the deployment progress

## Step 5: Access Your Live App

After deployment completes (2-3 minutes), your app will be available at:

```
https://YOUR_USERNAME.github.io/copy-of-logo-reactivator/
```

## What the Deployment Does

✅ **Automatic builds** on every push to main branch
✅ **Environment variables** securely injected during build
✅ **Optimized production build** with Vite
✅ **Static file hosting** on GitHub's CDN
✅ **HTTPS enabled** by default
✅ **Custom domain support** (optional)

## Troubleshooting

### If deployment fails:

1. **Check the Actions tab** for error messages
2. **Verify all secrets** are set correctly
3. **Make sure repository is public** (or you have GitHub Pro)

### If app doesn't load:

1. **Check the base URL** in vite.config.ts matches your repo name
2. **Verify environment variables** are set in GitHub secrets
3. **Check browser console** for any errors

### If APIs don't work:

1. **Supabase**: Make sure your domain is added to allowed origins
2. **EmailJS**: Add your GitHub Pages domain to allowed origins
3. **Stripe**: Test mode should work from any domain

## Benefits of GitHub Pages

✅ **Free hosting** for static sites
✅ **Automatic SSL** certificates
✅ **Global CDN** for fast loading
✅ **Custom domains** supported
✅ **Automatic deployments** on code changes
✅ **Version control** integrated

## Next Steps

Once deployed:

1. **Test all functionality** on the live site
2. **Share the URL** with users
3. **Monitor usage** through your service dashboards
4. **Consider custom domain** for professional branding

Your Logo Reactivator will be live and accessible to anyone on the internet! 🚀
