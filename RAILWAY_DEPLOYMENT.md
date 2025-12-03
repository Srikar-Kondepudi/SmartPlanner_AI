# Railway Deployment Guide

## Quick Fix for "Error creating build plan with Railpack"

I've added the necessary configuration files. Follow these steps:

### Step 1: Push the Changes

The configuration files have been added. Make sure they're pushed to GitHub:

```bash
git add backend/Procfile backend/runtime.txt backend/railway.json backend/nixpacks.toml
git commit -m "Add Railway deployment configuration"
git push origin main
```

### Step 2: Configure Railway

1. **Go to Railway Dashboard** → Your Project
2. **Delete the existing service** (if it exists and failed)
3. **Create a new service**:
   - Click "New" → "GitHub Repo"
   - Select your repository
   - **IMPORTANT**: Set **Root Directory** to: `backend`
4. **Add PostgreSQL Database**:
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway will auto-create `DATABASE_URL` environment variable
5. **Add Environment Variables**:
   - Go to your service → Variables tab
   - Add these variables:
     ```
     LLM_PROVIDER=ollama
     OLLAMA_BASE_URL=http://host.docker.internal:11434
     OLLAMA_MODEL=qwen2.5:7b-instruct
     SECRET_KEY=<generate-a-random-string-here>
     JWT_SECRET_KEY=<generate-another-random-string-here>
     CORS_ORIGINS=https://your-vercel-app.vercel.app
     ```
   - **Generate secrets**: Use `openssl rand -hex 32` or any random string generator
6. **Deploy**:
   - Railway will auto-detect the configuration and start building
   - Wait for deployment to complete

### Step 3: Get Backend URL

1. Once deployed, Railway will show your service URL
2. It will look like: `https://your-app-name.up.railway.app`
3. Copy this URL

### Step 4: Update Vercel

1. Go to Vercel → Your Project → Settings → Environment Variables
2. Add/Update: `NEXT_PUBLIC_API_URL` = `https://your-app-name.up.railway.app`
3. **Redeploy** your Vercel app

### Step 5: Create Test User

1. In Railway, go to your service → **Deployments** tab
2. Click on the latest deployment
3. Click **"View Logs"** or use **Railway CLI**:
   ```bash
   # Install Railway CLI
   npm i -g @railway/cli
   
   # Login
   railway login
   
   # Link to your project
   railway link
   
   # Run the script
   railway run python scripts/create_test_user.py
   ```

---

## Alternative: If Railway Still Fails

If you're still getting build errors, try **Render** instead:

### Render Deployment (Alternative)

1. Go to [render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect GitHub repo
4. Settings:
   - **Name**: `smartplanner-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables (same as Railway)
6. Add PostgreSQL database
7. Deploy

---

## Troubleshooting

### Error: "No module named 'app'"
- **Fix**: Make sure Root Directory is set to `backend` in Railway settings

### Error: "Port already in use"
- **Fix**: Railway automatically sets `$PORT`, make sure you're using it in the start command

### Error: "Database connection failed"
- **Fix**: Check that PostgreSQL service is added and `DATABASE_URL` is set

### Error: "Build timeout"
- **Fix**: Some packages take time. Wait longer or try Render which has longer timeouts

---

## Files Added

- `backend/Procfile` - Tells Railway how to run the app
- `backend/runtime.txt` - Specifies Python 3.11
- `backend/railway.json` - Railway-specific configuration
- `backend/nixpacks.toml` - Nixpacks build configuration

These files help Railway auto-detect and build your Python application correctly.

