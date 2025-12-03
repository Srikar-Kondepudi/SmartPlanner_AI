# Verify Connection - Step by Step

## The Error
"Cannot connect to server. Please check if the backend is running and NEXT_PUBLIC_API_URL is configured correctly."

This means the frontend can't reach the backend. Let's verify both are configured correctly.

---

## Step 1: Check Backend is Running

### Test Backend Directly

1. **Open a new browser tab**
2. **Visit:** `https://smartplanner-ai-igxh.onrender.com/`
3. **Expected:** You should see:
   ```json
   {"status":"healthy","service":"SmartPlanner AI Backend","version":"1.0.0"}
   ```

**If you see this:** ✅ Backend is running

**If you see an error or timeout:** ❌ Backend is down - check Render logs

---

## Step 2: Check Render Deployment Status

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click your service: **smartplanner-ai-igxh**
3. Check the **latest deployment**:
   - **Green checkmark** ✅ = Deployed successfully
   - **Red X** ❌ = Deployment failed
   - **Yellow spinner** ⏳ = Still deploying

**If deployment failed:** Check logs for errors

**If still deploying:** Wait for it to finish (~2-5 minutes)

---

## Step 3: Verify Vercel Environment Variable

### Check if NEXT_PUBLIC_API_URL is Set

1. Go to [Vercel Dashboard](https://vercel.com)
2. Click your project: **SmartPlanner AI**
3. Go to **Settings** → **Environment Variables**
4. Look for `NEXT_PUBLIC_API_URL`

**If it exists:**
- Check the value: Should be `https://smartplanner-ai-igxh.onrender.com`
- If wrong, edit it

**If it doesn't exist:**
- Click **"Add New"**
- Key: `NEXT_PUBLIC_API_URL`
- Value: `https://smartplanner-ai-igxh.onrender.com`
- Enable for: Production ✅ Preview ✅ Development ✅
- Click **Save**

### IMPORTANT: Redeploy Vercel

After adding/updating the variable:

1. Go to **Deployments** tab
2. Click **"..."** (three dots) on latest deployment
3. Click **"Redeploy"**
4. Wait for completion (~2-3 minutes)

**⚠️ This is critical!** Environment variables require a redeploy to take effect.

---

## Step 4: Verify CORS Configuration

### Check Render CORS_ORIGINS

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click your service: **smartplanner-ai-igxh**
3. Go to **Environment** tab
4. Look for `CORS_ORIGINS`

**Should be:**
```
https://smart-planner-ai-cyan.vercel.app,http://localhost:3000
```

**If missing or wrong:**
- Add/Edit `CORS_ORIGINS`
- Set value to: `https://smart-planner-ai-cyan.vercel.app,http://localhost:3000`
- Save (Render will auto-redeploy)

---

## Step 5: Test in Browser Console

After both are configured and redeployed:

1. **Open your Vercel app:** `https://smart-planner-ai-cyan.vercel.app`
2. **Open DevTools** (F12)
3. **Go to Console tab**
4. **Type:** `process.env.NEXT_PUBLIC_API_URL`
5. **Press Enter**

**Expected:** `"https://smartplanner-ai-igxh.onrender.com"`

**If you see:**
- `undefined` → Variable not set or not redeployed
- `"http://localhost:8000"` → Variable not set correctly

---

## Step 6: Check Network Tab

1. **Open DevTools** (F12)
2. **Go to Network tab**
3. **Try to register or login**
4. **Look for requests to:** `smartplanner-ai-igxh.onrender.com`

**If you see:**
- **404 or 405:** Route issue (should be fixed now)
- **CORS error:** CORS_ORIGINS not configured correctly
- **Connection refused:** Backend is down
- **No requests:** NEXT_PUBLIC_API_URL not set

---

## Quick Checklist

- [ ] Backend is running: `https://smartplanner-ai-igxh.onrender.com/` shows health check
- [ ] Render deployment completed successfully (green checkmark)
- [ ] Vercel has `NEXT_PUBLIC_API_URL` = `https://smartplanner-ai-igxh.onrender.com`
- [ ] Vercel has been **redeployed** after setting variable
- [ ] Render has `CORS_ORIGINS` = `https://smart-planner-ai-cyan.vercel.app,http://localhost:3000`
- [ ] Browser console shows correct API URL
- [ ] Network tab shows requests going to Render backend

---

## Common Issues

### Issue: "Cannot connect" even after fixing

**Possible causes:**
1. **Vercel not redeployed** - Must redeploy after adding environment variable
2. **Browser cache** - Try incognito mode or hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
3. **Backend still deploying** - Wait for Render to finish

### Issue: Backend shows health check but frontend still fails

**Check:**
- Vercel environment variable is set correctly
- Vercel has been redeployed
- CORS_ORIGINS includes your Vercel URL
- Browser console shows correct API URL

---

## Still Not Working?

If you've completed all steps above:

1. **Share Render logs** - Copy the latest deployment logs
2. **Share Vercel deployment logs** - Check if there are any build errors
3. **Share browser console errors** - Screenshot of DevTools Console
4. **Share Network tab** - Screenshot showing the failed request

This will help identify the exact issue.

