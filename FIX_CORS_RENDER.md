# Fix CORS Error in Render

## The Problem

CORS error: `No 'Access-Control-Allow-Origin' header is present`

Your Vercel URL is: `https://smart-planner-ai-cyan.vercel.app`

But Render's `CORS_ORIGINS` doesn't include it.

---

## Solution: Update CORS_ORIGINS in Render

### Step 1: Go to Render Environment Variables

1. Go to **Render** → Your Service (`smartplanner-ai-igxh`) → **Environment** tab
2. Find `CORS_ORIGINS`

### Step 2: Update CORS_ORIGINS

1. **Edit** `CORS_ORIGINS`
2. **Set value** to:
   ```
   https://smart-planner-ai-cyan.vercel.app,http://localhost:3000
   ```
   
   Or if you only want production:
   ```
   https://smart-planner-ai-cyan.vercel.app
   ```

3. **Save**

### Step 3: Wait for Redeploy

Render will auto-redeploy. Wait ~1-2 minutes.

---

## Verify It's Working

After redeploy:
1. Go to your Vercel URL: `https://smart-planner-ai-cyan.vercel.app`
2. Try registering or logging in
3. CORS error should be gone!

---

## Quick Checklist

- [ ] Went to Render → Environment tab
- [ ] Found `CORS_ORIGINS`
- [ ] Updated to: `https://smart-planner-ai-cyan.vercel.app,http://localhost:3000`
- [ ] Saved
- [ ] Waited for redeploy (~1-2 minutes)
- [ ] Tested frontend - CORS error gone

---

## Important Notes

- **Use https**: Always use `https://` for Vercel URLs
- **No trailing slash**: `https://smart-planner-ai-cyan.vercel.app` ✅ (not `/` at the end)
- **Exact match**: The URL must match exactly
