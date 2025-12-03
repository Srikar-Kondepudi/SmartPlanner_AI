# Fix Supabase Connection String

## The Problem

The error shows: `connection to server at "db.qcjuudpuotywsiadsvit.supabase.co", port 5432 failed: Network is unreachable`

This means:
1. ✅ Connection string format is correct now
2. ❌ But you're using the **direct connection** (port 5432) instead of **pooler** (port 6543)
3. ❌ Or Supabase database might not be accessible from Render

---

## Solution: Use Pooler Connection String

Supabase provides two types of connection strings:

### ❌ Direct Connection (Port 5432)
- Less reliable
- Can have connection limits
- Format: `postgresql://postgres.xxx:password@db.xxx.supabase.co:5432/postgres`

### ✅ Pooler Connection (Port 6543) - **USE THIS**
- More reliable
- Better for serverless/cloud deployments
- Format: `postgresql://postgres.xxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres`

---

## How to Get the Correct Connection String

1. **Go to Supabase** → Your Project → **Settings** → **Database**
2. **Scroll to "Connection string"** section
3. **Click on "URI" tab**
4. **Look for "Connection pooling"** section
5. **Select "Transaction" mode** (or "Session" if Transaction doesn't work)
6. **Copy the connection string** - it should have:
   - `pooler.supabase.com` in the hostname
   - Port `6543` (not 5432)
   - Example: `postgresql://postgres.xxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres`

---

## Update in Render

1. Go to **Render** → Your Service → **Environment** tab
2. Find `DATABASE_URL`
3. **Edit** it
4. **Replace** with the pooler connection string (port 6543)
5. **Make sure**:
   - Hostname contains `pooler.supabase.com`
   - Port is `6543`
   - Password is replaced (not `[YOUR-PASSWORD]`)
6. **Save**

---

## Alternative: Check Supabase Settings

If pooler still doesn't work:

1. **Go to Supabase** → Your Project → **Settings** → **Database**
2. **Check "Connection pooling"** is enabled
3. **Check "Network restrictions"** - make sure it's not blocking Render's IPs
4. **For free tier**: Usually no restrictions, but check anyway

---

## Connection String Format

**Correct (Pooler):**
```
postgresql://postgres.xxx:your-password@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Wrong (Direct):**
```
postgresql://postgres.xxx:your-password@db.xxx.supabase.co:5432/postgres
```

---

## After Updating

1. Render will auto-redeploy
2. Check logs - should see: `Database tables created/verified successfully`
3. If still fails, try "Session" mode instead of "Transaction" mode

---

## Quick Checklist

- [ ] Using pooler connection string (port 6543)
- [ ] Hostname contains `pooler.supabase.com`
- [ ] Password is replaced (not placeholder)
- [ ] Connection pooling enabled in Supabase
- [ ] No network restrictions blocking Render
- [ ] Render redeployed successfully

---

## Still Not Working?

If you still get "Network is unreachable":

1. **Try Session mode** instead of Transaction mode in Supabase
2. **Check Supabase project status** - make sure it's active
3. **Verify the connection string** - test it locally if possible
4. **Check Render logs** for more specific error messages

The app will now start even if DB connection fails initially (I made it lazy), but database features won't work until connection is fixed.

