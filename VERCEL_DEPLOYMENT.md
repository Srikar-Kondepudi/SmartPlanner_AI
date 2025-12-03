# Vercel Deployment Guide

## Quick Deploy

### Option 1: Deploy Frontend Directory (Recommended)

1. **In Vercel Dashboard:**
   - Go to your project settings
   - Set **Root Directory** to `frontend`
   - Framework Preset: **Next.js**
   - Build Command: `npm run build` (or leave default)
   - Output Directory: `.next` (or leave default)
   - Install Command: `npm install` (or leave default)

2. **Environment Variables:**
   Add these in Vercel Dashboard → Settings → Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```

3. **Deploy:**
   - Connect your GitHub repository
   - Vercel will auto-detect Next.js and deploy

### Option 2: Deploy from Root with Configuration

If deploying from root directory:

1. The `vercel.json` in root is configured to build from `frontend/`
2. Make sure Root Directory in Vercel is set to project root
3. Vercel will use the build commands from `vercel.json`

## Common Issues

### 404 NOT_FOUND Error

**Cause:** Vercel can't find the Next.js app

**Solutions:**
1. **Set Root Directory in Vercel:**
   - Go to Project Settings → General
   - Set "Root Directory" to `frontend`
   - Save and redeploy

2. **Or Deploy Frontend Separately:**
   - Create a separate Vercel project
   - Point it to the `frontend/` directory
   - This is the cleanest approach

### API Connection Issues

**Set Environment Variable:**
```
NEXT_PUBLIC_API_URL=https://your-backend-api-url.com
```

If your backend is also on Vercel, use the backend's Vercel URL.

### Build Failures

**Check:**
- Node.js version (should be 18+)
- All dependencies are in `package.json`
- Build command is correct

## Recommended Setup

1. **Frontend on Vercel:**
   - Root Directory: `frontend`
   - Framework: Next.js (auto-detected)
   - Environment: `NEXT_PUBLIC_API_URL` pointing to your backend

2. **Backend on Separate Service:**
   - Deploy backend to Railway, Render, or another service
   - Or use Vercel Serverless Functions (requires refactoring)

## Environment Variables Checklist

```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

That's all you need for the frontend! The backend runs separately.

