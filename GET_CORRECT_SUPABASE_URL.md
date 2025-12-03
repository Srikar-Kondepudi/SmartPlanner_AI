# Get Correct Supabase Pooler Connection String

## The Problem

The error shows: `FATAL: Tenant or user not found`

This means the username format in the pooler connection string is incorrect.

---

## Solution: Get the Exact Connection String from Supabase

### Step 1: Go to Supabase Dashboard

1. Go to [supabase.com](https://supabase.com)
2. Login and select your project

### Step 2: Get Pooler Connection String

1. Click **Settings** (gear icon) → **Database**
2. Scroll down to **"Connection string"** section
3. **IMPORTANT**: Look for **"Connection pooling"** section (below the regular connection strings)
4. You'll see different modes:
   - **Transaction mode** (recommended)
   - **Session mode**
5. Click on **"Transaction"** mode
6. You'll see a connection string that looks like:
   ```
   postgresql://postgres.refid:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
7. **Copy this EXACT string** (it will have the correct username format)

### Step 3: Replace Password

The connection string will have `[YOUR-PASSWORD]` - replace it with your actual password: `Srisai2342`

**Example:**
- If Supabase shows: `postgresql://postgres.xxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres`
- Replace with: `postgresql://postgres.xxx:Srisai2342@aws-0-us-east-1.pooler.supabase.com:6543/postgres`

### Step 4: Update in Render

1. Go to **Render** → Your Service → **Environment** tab
2. Find `DATABASE_URL`
3. **Edit** it
4. **Paste** the connection string you got from Supabase (with password replaced)
5. **Save**

---

## What to Look For

The correct pooler connection string should have:
- ✅ Username format: `postgres.xxxxx` (with a dot, not just `postgres`)
- ✅ Hostname: `pooler.supabase.com` (or `aws-0-us-east-1.pooler.supabase.com`)
- ✅ Port: `6543`
- ✅ Password: Your actual password (not `[YOUR-PASSWORD]`)

---

## Alternative: If You Can't Find Pooler

If you don't see the "Connection pooling" section:

1. Go to **Settings** → **Database**
2. Look for **"Connection string"** → **"URI"** tab
3. You might see a **"Use connection pooling"** toggle or link
4. Enable it or click it
5. Then copy the connection string shown

---

## After Updating

1. Render will auto-redeploy
2. Check logs - should see: `Database tables created/verified successfully`
3. No more "Tenant or user not found" error

---

## Quick Test

After updating, test your backend:
- Visit: `https://smartplanner-ai-igxh.onrender.com/docs`
- Should show Swagger API docs
- Try the `/health` endpoint - should work

The app is already live, we just need to fix the database connection!

