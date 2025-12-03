# Fix Railway Environment Variables

## The Problem

Railway crashed because two required environment variables are missing:
1. `DATABASE_URL` - Should be auto-created by Railway
2. `JWT_SECRET` - You set `JWT_SECRET_KEY` but the code expects `JWT_SECRET`

## The Fix

I've updated the code to accept both `JWT_SECRET` and `JWT_SECRET_KEY`. Now you need to:

### Step 1: Add DATABASE_URL

1. **Go to Railway** → Your Project
2. **Check if you have a PostgreSQL service**:
   - Look for a service named "PostgreSQL" or "Database"
   - If you don't have one, create it:
     - Click "New" → "Database" → "Add PostgreSQL"
3. **Link the database to your backend service**:
   - Click on your **backend service**
   - Go to **Settings** → **Variables** tab
   - Look for **"Add Reference"** button
   - Click it and select your **PostgreSQL service**
   - Select **`DATABASE_URL`** from the dropdown
   - Railway will automatically add `DATABASE_URL` as a reference

### Step 2: Fix JWT_SECRET

You have two options:

**Option A: Rename the variable (Recommended)**
1. Go to Railway → Your Backend Service → **Variables** tab
2. Find `JWT_SECRET_KEY`
3. Click on it to edit
4. Change the name from `JWT_SECRET_KEY` to `JWT_SECRET`
5. Keep the same value
6. Save

**Option B: Add JWT_SECRET (Alternative)**
1. Go to Railway → Your Backend Service → **Variables** tab
2. Add a new variable:
   - Name: `JWT_SECRET`
   - Value: `fbf9bef7b0d2d34984591f531b00bd498d781a7bb0ccb1879f05ff96884f3864` (same as your JWT_SECRET_KEY)
3. Click "Add"

### Step 3: Verify All Variables

Make sure you have these variables set:

✅ `DATABASE_URL` - From PostgreSQL service (via reference)
✅ `JWT_SECRET` - Your secret key
✅ `LLM_PROVIDER` - `ollama`
✅ `OLLAMA_BASE_URL` - `http://host.docker.internal:11434`
✅ `OLLAMA_MODEL` - `qwen2.5:7b-instruct`
✅ `SECRET_KEY` - Your secret key
✅ `CORS_ORIGINS` - Your Vercel URL

### Step 4: Redeploy

After fixing the variables, Railway should auto-redeploy. If not:
1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment

---

## Quick Checklist

- [ ] PostgreSQL service exists in Railway
- [ ] PostgreSQL is linked to backend service (DATABASE_URL reference added)
- [ ] `JWT_SECRET` variable exists (not just `JWT_SECRET_KEY`)
- [ ] All other variables are set
- [ ] Service redeployed successfully

---

## Still Having Issues?

If Railway still crashes:

1. **Check Railway logs**:
   - Go to your service → **Deployments** → Latest deployment → **View Logs**
   - Look for the exact error message

2. **Verify DATABASE_URL**:
   - In Variables tab, make sure `DATABASE_URL` shows as a reference (not a plain value)
   - It should show something like: `${{PostgreSQL.DATABASE_URL}}`

3. **Test locally** (optional):
   - Make sure your `.env` file has all required variables
   - Run: `python -c "from app.core.config import settings; print('OK')"`

---

## After Fix

Once Railway deploys successfully:
1. Test backend: `https://your-railway-url.up.railway.app/docs`
2. Test frontend: Try registering/logging in
3. Create test user: `railway run python scripts/create_test_user.py`

