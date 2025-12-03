# Step-by-Step Vercel Setup Guide

## 🚀 Quick Fix for 404 Error

### Step 1: Go to Vercel Dashboard
1. Open https://vercel.com/dashboard
2. Sign in to your account
3. Find your **SmartPlanner_AI** project
4. Click on it to open project settings

### Step 2: Update Root Directory
1. Click on **Settings** tab (left sidebar)
2. Scroll down to **General** section
3. Find **Root Directory** setting
4. Click **Edit** button next to it
5. Type: `frontend` (exactly like this, no slash at the end)
6. Click **Save**

### Step 3: Add Environment Variable
1. Still in **Settings** tab
2. Click on **Environment Variables** (left sidebar)
3. Click **Add New**
4. For **Key**, enter: `NEXT_PUBLIC_API_URL`
5. For **Value**, enter your backend URL:
   - If backend is on localhost: `http://localhost:8000` (for development)
   - If backend is deployed: `https://your-backend-url.com`
   - If you don't have backend deployed yet: `http://localhost:8000` (you'll update later)
6. Select **Production**, **Preview**, and **Development** (check all three)
7. Click **Save**

### Step 4: Redeploy
1. Go to **Deployments** tab (left sidebar)
2. Find the latest deployment (top of the list)
3. Click the **three dots** (⋯) menu
4. Click **Redeploy**
5. Wait for deployment to complete (2-3 minutes)

## ✅ That's It!

After redeployment, your app should work! The 404 error will be gone.

## 🔍 If Still Getting 404

### Check Build Logs:
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **Build Logs** tab
4. Look for any errors

### Common Issues:

**Issue:** "Cannot find module"
- **Fix:** Make sure Root Directory is set to `frontend`

**Issue:** "Build failed"
- **Fix:** Check that `package.json` exists in `frontend/` directory

**Issue:** "404 on all routes"
- **Fix:** Make sure Root Directory is `frontend` (not `frontend/`)

## 📝 Quick Reference

**Root Directory:** `frontend`  
**Framework:** Next.js (auto-detected)  
**Build Command:** `npm run build` (auto-detected)  
**Output Directory:** `.next` (auto-detected)

## 🆘 Still Need Help?

If you're still getting errors, share:
1. The build logs from Vercel
2. A screenshot of your Settings → General page
3. The error message you're seeing

