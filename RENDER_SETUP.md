# Quick Render Setup Guide

## Prerequisites
1. Supabase account (free) - for PostgreSQL
2. Render account (free) - for backend hosting
3. Your GitHub repo already connected

---

## Part 1: Get Database URL (5 minutes)

### Using Supabase:

1. **Sign up**: [supabase.com](https://supabase.com) → Sign up with GitHub
2. **Create Project**:
   - Click "New Project"
   - Name: `smartplanner-ai`
   - Password: Create a strong password (SAVE IT!)
   - Region: Choose closest
   - Click "Create new project"
3. **Wait 2 minutes** for database to provision
4. **Get Connection String**:
   - Go to **Settings** (gear icon) → **Database**
   - Scroll to **"Connection string"**
   - Click **"URI"** tab
   - Copy the string (looks like: `postgresql://postgres.xxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres`)
   - **SAVE THIS** - you'll paste it into Render

---

## Part 2: Deploy to Render (10 minutes)

### Step 1: Create Web Service

1. Go to [render.com](https://render.com)
2. Sign up/login (use GitHub for easy connection)
3. Click **"New +"** button (top right)
4. Select **"Web Service"**
5. **Connect Repository**:
   - Click "Connect account" if needed
   - Select: `Srikar-Kondepudi/SmartPlanner_AI`
   - Click "Connect"

### Step 2: Configure Service

Fill in these settings:

- **Name**: `smartplanner-backend`
- **Environment**: `Python 3`
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: `backend` ⚠️ **IMPORTANT**
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `python start.py`

### Step 3: Add Environment Variables

Click **"Advanced"** to expand, then scroll to **"Environment Variables"**

Click **"Add Environment Variable"** for each:

1. **DATABASE_URL**
   - Key: `DATABASE_URL`
   - Value: `<paste-your-supabase-connection-string>`

2. **JWT_SECRET**
   - Key: `JWT_SECRET`
   - Value: `fbf9bef7b0d2d34984591f531b00bd498d781a7bb0ccb1879f05ff96884f3864`

3. **SECRET_KEY**
   - Key: `SECRET_KEY`
   - Value: `5da6385f5373ca42142731cbeb467c663dde1123864ea1baffc34505c6179c95`

4. **LLM_PROVIDER**
   - Key: `LLM_PROVIDER`
   - Value: `ollama`

5. **OLLAMA_BASE_URL**
   - Key: `OLLAMA_BASE_URL`
   - Value: `http://host.docker.internal:11434`

6. **OLLAMA_MODEL**
   - Key: `OLLAMA_MODEL`
   - Value: `qwen2.5:7b-instruct`

7. **CORS_ORIGINS**
   - Key: `CORS_ORIGINS`
   - Value: `https://your-vercel-app.vercel.app` (replace with your actual Vercel URL)

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (~5 minutes)
3. Watch the logs - it will show build progress
4. When done, you'll see: **"Your service is live"**
5. **Copy the URL** (e.g., `https://smartplanner-backend.onrender.com`)

---

## Part 3: Update Vercel (2 minutes)

1. Go to [vercel.com](https://vercel.com)
2. Select your **SmartPlanner AI** project
3. Go to **Settings** → **Environment Variables**
4. Find `NEXT_PUBLIC_API_URL`
5. **Edit** it:
   - Change value to: `https://smartplanner-backend.onrender.com` (your Render URL)
   - Make sure it's set for **Production**, **Preview**, and **Development**
6. Click **"Save"**
7. Go to **Deployments** tab
8. Click **"..."** on latest deployment → **"Redeploy"**

---

## Part 4: Create Test User

After Render is deployed:

1. Go to Render → Your Service (`smartplanner-backend`)
2. Click on **"Shell"** tab (or look for terminal/console)
3. Run:
   ```bash
   cd backend
   python scripts/create_test_user.py
   ```
4. You should see:
   ```
   ✅ Test user created successfully!
   Email: test@smartplanner.ai
   Password: Test123!
   ```

---

## Test Everything

1. **Test Backend**: Visit `https://smartplanner-backend.onrender.com/docs`
   - Should show Swagger API docs

2. **Test Frontend**: Go to your Vercel URL
   - Try registering with your email
   - Or login with: `test@smartplanner.ai` / `Test123!`

---

## That's It! 🎉

Your app is now running on:
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Supabase

All free tier, no Railway needed!

---

## Troubleshooting

### Render build fails
- Check logs in Render dashboard
- Make sure `Root Directory` is `backend` (not empty)
- Verify `Start Command` is `python start.py`

### Database connection error
- Double-check DATABASE_URL in Render
- Make sure Supabase project is active
- Test connection string format

### CORS errors
- Update `CORS_ORIGINS` in Render to match Vercel URL exactly
- No `http://` vs `https://` mismatch
- No trailing slashes

### Render service sleeps
- Free tier spins down after 15min inactivity
- First request takes ~30 seconds to wake up
- This is normal for free tier

