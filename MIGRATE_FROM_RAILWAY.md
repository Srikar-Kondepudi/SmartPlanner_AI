# Migrate from Railway to Render (Simpler Alternative)

## Why Render?
- ✅ Easier setup (no complex linking)
- ✅ Free tier available
- ✅ Automatic deployments from GitHub
- ✅ Simple environment variables
- ✅ Better documentation

---

## Step 1: Set Up Free PostgreSQL Database

### Option A: Supabase (Recommended - Easiest)

1. Go to [supabase.com](https://supabase.com)
2. Sign up (free)
3. Click "New Project"
4. Fill in:
   - Project Name: `smartplanner-ai`
   - Database Password: (save this!)
   - Region: Choose closest to you
5. Wait ~2 minutes for setup
6. Go to **Settings** → **Database**
7. Find **"Connection string"** → **"URI"**
8. Copy the connection string (looks like: `postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres`)
9. **Save this** - you'll need it for Render

### Option B: Neon (Alternative)

1. Go to [neon.tech](https://neon.tech)
2. Sign up (free)
3. Create a new project
4. Copy the connection string
5. Save it

---

## Step 2: Deploy Backend to Render

1. Go to [render.com](https://render.com)
2. Sign up/login (free tier available)
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository: `Srikar-Kondepudi/SmartPlanner_AI`
5. Configure:
   - **Name**: `smartplanner-backend`
   - **Environment**: `Python 3`
   - **Region**: Choose closest
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python start.py`
6. Click **"Advanced"** → Add environment variables:

```
DATABASE_URL=<paste-your-supabase-connection-string>
JWT_SECRET=fbf9bef7b0d2d34984591f531b00bd498d781a7bb0ccb1879f05ff96884f3864
SECRET_KEY=5da6385f5373ca42142731cbeb467c663dde1123864ea1baffc34505c6179c95
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://host.docker.internal:11434
OLLAMA_MODEL=qwen2.5:7b-instruct
CORS_ORIGINS=https://your-vercel-app.vercel.app
```

7. Click **"Create Web Service"**
8. Wait for deployment (~5 minutes)
9. Copy your Render URL (e.g., `https://smartplanner-backend.onrender.com`)

---

## Step 3: Update Vercel

1. Go to [vercel.com](https://vercel.com)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Find `NEXT_PUBLIC_API_URL`
5. Update it to your Render URL: `https://smartplanner-backend.onrender.com`
6. **Redeploy** your Vercel app

---

## Step 4: Create Test User

After Render deploys:

1. Go to Render → Your Service → **Shell** tab
2. Run:
   ```bash
   cd backend
   python scripts/create_test_user.py
   ```

Or use Render's web terminal:
1. Click on your service
2. Look for **"Shell"** or **"Logs"** tab
3. Run the command above

---

## Step 5: Clean Up Railway (Optional)

1. Go to Railway
2. Delete your project (or just leave it - won't cost if unused)
3. No need to keep it running

---

## Benefits of This Setup

✅ **Simpler**: No complex service linking
✅ **Free**: Both Supabase and Render have free tiers
✅ **Reliable**: Render auto-deploys on git push
✅ **Easy Variables**: Just paste them in, no references needed
✅ **Better Docs**: Render has clearer documentation

---

## Troubleshooting

### Render deployment fails
- Check build logs in Render dashboard
- Make sure `Root Directory` is set to `backend`
- Verify all environment variables are set

### Database connection fails
- Double-check your Supabase connection string
- Make sure password is correct
- Check Supabase dashboard → Settings → Database → Connection string

### CORS errors
- Update `CORS_ORIGINS` in Render to match your Vercel URL exactly
- No trailing slashes
- Include `https://`

---

## Quick Checklist

- [ ] Created Supabase project
- [ ] Copied DATABASE_URL from Supabase
- [ ] Created Render web service
- [ ] Added all environment variables to Render
- [ ] Render deployment successful
- [ ] Updated Vercel `NEXT_PUBLIC_API_URL` to Render URL
- [ ] Vercel redeployed
- [ ] Created test user in Render
- [ ] Tested login/registration

---

## Cost

- **Supabase**: Free tier (500MB database, 2GB bandwidth)
- **Render**: Free tier (spins down after 15min inactivity, but free)
- **Vercel**: Free tier (unlimited for frontend)

**Total: $0/month** 🎉

