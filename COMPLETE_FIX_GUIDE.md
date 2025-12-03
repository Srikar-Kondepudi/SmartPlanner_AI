# Complete Fix Guide - Connection Issues

## The Problem

Frontend shows: "Cannot connect to server. Please check if the backend is running and NEXT_PUBLIC_API_URL is configured correctly."

This happens because:
1. **Vercel** doesn't have `NEXT_PUBLIC_API_URL` set (defaults to `localhost:8000`)
2. **Render** doesn't have `CORS_ORIGINS` set correctly (blocks requests)

---

## ✅ Step-by-Step Fix

### PART 1: Fix Vercel (Frontend)

#### Step 1: Go to Vercel Settings
1. Go to [vercel.com](https://vercel.com)
2. Click your project: **SmartPlanner AI**
3. Go to **Settings** → **Environment Variables**

#### Step 2: Add/Update NEXT_PUBLIC_API_URL
1. **Find** `NEXT_PUBLIC_API_URL`:
   - If it exists: Click to **edit**
   - If it doesn't exist: Click **"Add New"**

2. **Set the value** to:
   ```
   https://smartplanner-ai-igxh.onrender.com
   ```

3. **IMPORTANT**: Enable for all environments:
   - ✅ **Production**
   - ✅ **Preview**
   - ✅ **Development**

4. Click **Save**

#### Step 3: Redeploy Vercel (CRITICAL!)
Environment variables require a redeploy:

1. Go to **Deployments** tab
2. Click **"..."** (three dots) on the latest deployment
3. Click **"Redeploy"**
4. Wait for completion (~2-3 minutes)

---

### PART 2: Fix Render (Backend)

#### Step 1: Go to Render Environment Variables
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click your service: **smartplanner-ai-igxh**
3. Go to **Environment** tab

#### Step 2: Add/Update CORS_ORIGINS
1. **Find** `CORS_ORIGINS`:
   - If it exists: Click to **edit**
   - If it doesn't exist: Click **"Add Environment Variable"**

2. **Set the value** to:
   ```
   https://smart-planner-ai-cyan.vercel.app,http://localhost:3000
   ```
   
   (This allows both Vercel production and localhost for development)

3. Click **Save**

#### Step 3: Wait for Auto-Redeploy
Render will automatically redeploy (~1-2 minutes). Wait for it to finish.

---

## ✅ Verification Checklist

### Check 1: Backend is Running
Visit: `https://smartplanner-ai-igxh.onrender.com/`

**Expected:** `{"status":"healthy","service":"SmartPlanner AI Backend","version":"1.0.0"}`

**If you see this:** ✅ Backend is running

**If you see an error:** Backend is down - check Render logs

---

### Check 2: Backend API Docs
Visit: `https://smartplanner-ai-igxh.onrender.com/docs`

**Expected:** Swagger API documentation page

**If you see this:** ✅ Backend API is accessible

---

### Check 3: CORS Configuration
Open browser console (F12) on your Vercel site and check for CORS errors.

**If you see:** `Access-Control-Allow-Origin header is present` ✅ CORS is working

**If you see:** `CORS policy: No 'Access-Control-Allow-Origin' header` ❌ CORS not configured

---

### Check 4: Frontend Environment Variable
After redeploying Vercel, check if the variable is loaded:

1. Open your Vercel site: `https://smart-planner-ai-cyan.vercel.app`
2. Open browser console (F12)
3. Type: `process.env.NEXT_PUBLIC_API_URL`
4. **Expected:** `"https://smartplanner-ai-igxh.onrender.com"`

**If you see `undefined` or `"http://localhost:8000"`:** ❌ Variable not set or not redeployed

---

## 🔍 Troubleshooting

### Issue: "Cannot connect to server" after fixing

**Possible causes:**

1. **Vercel not redeployed after adding variable**
   - Solution: Go to Deployments → Latest → "..." → Redeploy

2. **Wrong API URL in Vercel**
   - Check: Settings → Environment Variables → `NEXT_PUBLIC_API_URL`
   - Should be: `https://smartplanner-ai-igxh.onrender.com`
   - NOT: `http://localhost:8000`

3. **CORS still blocking**
   - Check: Render → Environment → `CORS_ORIGINS`
   - Should include: `https://smart-planner-ai-cyan.vercel.app`
   - Wait for Render to redeploy

4. **Backend is down**
   - Check: Render → Logs
   - Visit: `https://smartplanner-ai-igxh.onrender.com/`
   - If down, check Render logs for errors

---

### Issue: CORS error persists

**Check Render logs:**
1. Go to Render → Your Service → Logs
2. Look for CORS-related errors
3. Verify `CORS_ORIGINS` is set correctly

**Common mistakes:**
- ❌ Trailing slash: `https://smart-planner-ai-cyan.vercel.app/`
- ✅ No trailing slash: `https://smart-planner-ai-cyan.vercel.app`
- ❌ Using `http://` instead of `https://`
- ❌ Wrong domain name

---

### Issue: Backend returns 500 errors

**Check Render logs:**
1. Go to Render → Your Service → Logs
2. Look for Python errors
3. Common issues:
   - Database connection failed
   - Missing environment variables
   - Import errors

---

## 📋 Final Checklist

Before testing, make sure:

- [ ] **Vercel** has `NEXT_PUBLIC_API_URL` = `https://smartplanner-ai-igxh.onrender.com`
- [ ] **Vercel** has been **redeployed** after adding variable
- [ ] **Render** has `CORS_ORIGINS` = `https://smart-planner-ai-cyan.vercel.app,http://localhost:3000`
- [ ] **Render** has finished redeploying
- [ ] **Backend** is accessible at `https://smartplanner-ai-igxh.onrender.com/`
- [ ] **Backend** shows health check response

---

## 🎯 Quick Test

After fixing everything:

1. **Visit:** `https://smart-planner-ai-cyan.vercel.app`
2. **Try:** Register a new account
3. **Check:** Browser console (F12) for errors
4. **Expected:** Registration/login should work without errors

---

## 📞 Still Not Working?

If you've completed all steps and it's still not working:

1. **Check Vercel deployment logs:**
   - Vercel → Deployments → Latest → Build Logs
   - Look for errors

2. **Check Render logs:**
   - Render → Your Service → Logs
   - Look for errors

3. **Test backend directly:**
   ```bash
   curl https://smartplanner-ai-igxh.onrender.com/
   ```
   Should return: `{"status":"healthy",...}`

4. **Test CORS:**
   ```bash
   curl -H "Origin: https://smart-planner-ai-cyan.vercel.app" \
        -H "Access-Control-Request-Method: POST" \
        -H "Access-Control-Request-Headers: Content-Type" \
        -X OPTIONS \
        https://smartplanner-ai-igxh.onrender.com/api/v1/auth/register
   ```
   Should return headers with `Access-Control-Allow-Origin`

---

## 🎉 Success Indicators

You'll know it's working when:

- ✅ No "Cannot connect to server" error
- ✅ Registration/login works
- ✅ No CORS errors in browser console
- ✅ API calls succeed (check Network tab in DevTools)

---

## Summary

**Two things to fix:**

1. **Vercel:** Set `NEXT_PUBLIC_API_URL` = `https://smartplanner-ai-igxh.onrender.com` → **Redeploy**
2. **Render:** Set `CORS_ORIGINS` = `https://smart-planner-ai-cyan.vercel.app,http://localhost:3000` → **Auto-redeploys**

Both must be done for the app to work!

