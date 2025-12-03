# Update Vercel Environment Variable

## The Problem

Frontend can't connect to backend because `NEXT_PUBLIC_API_URL` is not set correctly in Vercel.

---

## Solution: Update NEXT_PUBLIC_API_URL in Vercel

### Step 1: Go to Vercel Settings

1. Go to [vercel.com](https://vercel.com)
2. Click on your **SmartPlanner AI** project
3. Go to **Settings** tab (top navigation)
4. Click **Environment Variables** (left sidebar)

### Step 2: Update NEXT_PUBLIC_API_URL

1. **Find** `NEXT_PUBLIC_API_URL` in the list
   - If it exists: Click to **edit** it
   - If it doesn't exist: Click **"Add New"** button

2. **Set the value** to:
   ```
   https://smartplanner-ai-igxh.onrender.com
   ```

3. **IMPORTANT**: Make sure it's enabled for:
   - ✅ **Production**
   - ✅ **Preview** 
   - ✅ **Development**
   
   (Check all three checkboxes)

4. Click **Save**

### Step 3: Redeploy Vercel

**This is critical!** Environment variable changes require a redeploy:

1. Go to **Deployments** tab
2. Find the **latest deployment**
3. Click the **"..."** (three dots) menu
4. Click **"Redeploy"**
5. Confirm the redeploy

**OR** you can trigger a redeploy by:
- Pushing a new commit to GitHub, OR
- Going to Deployments → Latest → "..." → Redeploy

---

## Verify It's Working

After redeploy:

1. **Wait for deployment to complete** (~2-3 minutes)
2. **Visit your Vercel URL**
3. **Try to register** or login
4. **Check browser console** (F12 → Console) - should not see connection errors

---

## Quick Checklist

- [ ] Went to Vercel → Settings → Environment Variables
- [ ] Found/Added `NEXT_PUBLIC_API_URL`
- [ ] Set value to: `https://smartplanner-ai-igxh.onrender.com`
- [ ] Enabled for Production, Preview, and Development
- [ ] Saved the variable
- [ ] Redeployed Vercel (important!)
- [ ] Waited for deployment to complete
- [ ] Tested the frontend

---

## Test Your Backend First

Before updating Vercel, verify backend is accessible:

1. Visit: `https://smartplanner-ai-igxh.onrender.com/docs`
   - Should show Swagger API docs ✅

2. Visit: `https://smartplanner-ai-igxh.onrender.com/`
   - Should show: `{"status":"healthy",...}` ✅

If these work, backend is fine - just need to update Vercel!

---

## Common Mistakes

❌ **Wrong**: `http://localhost:8000`
❌ **Wrong**: `https://your-railway-url.up.railway.app` (if you removed Railway)
✅ **Correct**: `https://smartplanner-ai-igxh.onrender.com`

❌ **Forgot to redeploy** after updating environment variable
✅ **Must redeploy** for changes to take effect

---

## After Fixing

Once `NEXT_PUBLIC_API_URL` is set correctly and Vercel is redeployed:
- Frontend will connect to backend
- Registration/login will work
- All API calls will work

Your app will be fully functional! 🎉

