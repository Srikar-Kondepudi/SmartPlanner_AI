# Troubleshooting Guide

## Issue: Test Credentials Not Working / Can't Create Account

### Problem
- Test credentials (`test@smartplanner.ai` / `Test123!`) don't work
- Can't register with personal Gmail
- Getting "Cannot connect to server" or "Registration failed" errors

### Root Cause
The **backend is not deployed** or not accessible from your Vercel frontend. The frontend is trying to connect to `http://localhost:8000`, which only works locally, not from Vercel.

---

## Solution: Deploy Backend

You have **3 options**:

### Option 1: Railway (Easiest - Recommended) ⭐

1. Go to [railway.app](https://railway.app) and sign up/login
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository: `Srikar-Kondepudi/SmartPlanner_AI`
4. Click "Add Service" → "GitHub Repo"
5. Set **Root Directory** to: `backend`
6. Railway will auto-detect it's a Python app
7. Add environment variables (click "Variables" tab):
   ```
   DATABASE_URL=postgresql://... (Railway will auto-create this)
   LLM_PROVIDER=ollama
   OLLAMA_BASE_URL=http://host.docker.internal:11434
   OLLAMA_MODEL=qwen2.5:7b-instruct
   SECRET_KEY=your-secret-key-here (generate a random string)
   JWT_SECRET_KEY=your-jwt-secret-here (generate a random string)
   CORS_ORIGINS=https://your-vercel-app.vercel.app
   ```
8. Railway will auto-deploy
9. Copy the backend URL (e.g., `https://your-app.railway.app`)
10. Go to Vercel → Your Project → Settings → Environment Variables
11. Add: `NEXT_PUBLIC_API_URL=https://your-app.railway.app`
12. Redeploy Vercel

### Option 2: Render

1. Go to [render.com](https://render.com) and sign up
2. Click "New" → "Web Service"
3. Connect your GitHub repo
4. Set:
   - **Name**: `smartplanner-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt && alembic upgrade head`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables (same as Railway above)
6. Create a PostgreSQL database in Render
7. Update `DATABASE_URL` with the new database URL
8. Copy the backend URL and update Vercel `NEXT_PUBLIC_API_URL`

### Option 3: Fly.io

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Run: `fly auth login`
3. In the `backend` directory: `fly launch`
4. Follow prompts, set environment variables
5. Deploy: `fly deploy`
6. Get URL: `fly info` (copy the hostname)
7. Update Vercel `NEXT_PUBLIC_API_URL`

---

## After Backend Deployment

### 1. Create Test User

SSH into your backend or use Railway's CLI:

```bash
# If using Railway
railway run python scripts/create_test_user.py

# If using Render (via SSH)
cd backend
python scripts/create_test_user.py

# If using Fly.io
fly ssh console
cd backend
python scripts/create_test_user.py
```

**Test Credentials:**
- Email: `test@smartplanner.ai`
- Password: `Test123!`

### 2. Update Vercel Environment Variable

1. Go to [vercel.com](https://vercel.com)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add/Update: `NEXT_PUBLIC_API_URL` = `https://your-backend-url.com`
5. **Redeploy** your Vercel app

### 3. Test Registration

Try registering with your Gmail. It should work now!

---

## Common Errors & Fixes

### Error: "Cannot connect to server"
- **Fix**: Backend not deployed or `NEXT_PUBLIC_API_URL` is wrong
- **Check**: Open browser console (F12) → Network tab → See what URL it's trying to connect to

### Error: "Email already registered"
- **Fix**: User already exists in database
- **Solution**: Try logging in instead, or use a different email

### Error: "Registration failed" (no details)
- **Fix**: Check backend logs
- **Railway**: Go to your service → Logs tab
- **Render**: Go to your service → Logs
- Look for Python errors

### Error: "CORS policy" error
- **Fix**: Update `CORS_ORIGINS` in backend to include your Vercel domain
- Example: `CORS_ORIGINS=https://your-app.vercel.app,https://your-app.vercel.app`

### Error: "Database connection failed"
- **Fix**: Check `DATABASE_URL` in backend environment variables
- Make sure PostgreSQL is running and accessible

---

## Quick Checklist

- [ ] Backend deployed (Railway/Render/Fly.io)
- [ ] Database created and connected
- [ ] All environment variables set in backend
- [ ] `NEXT_PUBLIC_API_URL` set in Vercel (pointing to deployed backend)
- [ ] Vercel app redeployed after env var change
- [ ] Test user created in database
- [ ] Can access backend URL directly (e.g., `https://your-backend.railway.app/docs`)

---

## Still Having Issues?

1. **Check Backend Logs**: Look for Python errors
2. **Check Browser Console**: Open DevTools (F12) → Console tab → Look for errors
3. **Test Backend Directly**: Visit `https://your-backend-url.com/docs` - should show Swagger UI
4. **Verify Environment Variables**: Make sure all are set correctly
5. **Check CORS**: Backend must allow your Vercel domain

---

## Need Help?

If you're still stuck:
1. Share the error message from browser console
2. Share backend logs
3. Verify backend URL is accessible (try opening `/docs` endpoint)

