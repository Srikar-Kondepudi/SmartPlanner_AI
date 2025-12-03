# 🔧 How to Fix Vercel 404 Error - Step by Step

## ⚡ Quick Fix (5 minutes)

### Step 1: Open Vercel Dashboard
1. Go to: **https://vercel.com/dashboard**
2. Sign in if needed
3. You should see your projects list

### Step 2: Open Your Project
1. Find **SmartPlanner_AI** in the list
2. **Click on the project name** (not the three dots)

### Step 3: Change Root Directory
1. Look at the **top menu** - click **"Settings"**
2. In the left sidebar, click **"General"** (should be selected by default)
3. Scroll down until you see **"Root Directory"**
4. You'll see it says something like `./` or is empty
5. Click the **"Edit"** button (or pencil icon) next to it
6. **Delete** whatever is there
7. Type exactly: `frontend` (lowercase, no spaces, no slashes)
8. Click **"Save"** button

### Step 4: Add Environment Variable
1. Still in **Settings**, click **"Environment Variables"** in the left sidebar
2. Click the **"Add New"** button
3. In the **Key** field, type: `NEXT_PUBLIC_API_URL`
4. In the **Value** field, type: `http://localhost:8000` (or your backend URL if deployed)
5. Check all three boxes: **Production**, **Preview**, **Development**
6. Click **"Save"**

### Step 5: Redeploy
1. Click **"Deployments"** in the top menu
2. You'll see a list of deployments
3. Find the **most recent one** (top of the list)
4. Click the **three dots** (⋯) on the right side
5. Click **"Redeploy"**
6. Confirm by clicking **"Redeploy"** again
7. Wait 2-3 minutes for it to finish

## ✅ Done!

Your app should now work! Visit your Vercel URL and the 404 error should be gone.

## 📸 Visual Guide

**Settings → General:**
```
Root Directory: [frontend]  ← Change this
```

**Settings → Environment Variables:**
```
Key: NEXT_PUBLIC_API_URL
Value: http://localhost:8000
Environments: ☑ Production ☑ Preview ☑ Development
```

## 🆘 Still Not Working?

If you still get 404 after these steps:

1. **Check the build logs:**
   - Go to Deployments → Click latest deployment → Build Logs
   - Look for errors (red text)

2. **Verify Root Directory:**
   - Go back to Settings → General
   - Make sure it says exactly `frontend` (not `frontend/` or `/frontend`)

3. **Try redeploying again:**
   - Sometimes it needs a fresh deploy after settings change

## 💡 Pro Tip

After fixing, your Vercel URL should work! If your backend is on a different server, make sure to update `NEXT_PUBLIC_API_URL` to point to your actual backend URL.

