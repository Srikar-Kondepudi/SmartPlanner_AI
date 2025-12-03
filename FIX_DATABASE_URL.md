# Fix DATABASE_URL Connection String

## The Problem

Your `DATABASE_URL` in Render is incorrectly formatted. The error shows:
```
could not translate host name "2342@db.qcjuudpuotywsiadsvit.supabase.co"
```

This means the connection string is malformed - the port number is being read as part of the hostname.

---

## The Solution

### Step 1: Get the Correct Connection String from Supabase

1. Go to [supabase.com](https://supabase.com) → Your Project
2. Click **Settings** (gear icon) → **Database**
3. Scroll to **"Connection string"** section
4. **IMPORTANT**: Click on the **"URI"** tab (not "JDBC" or "Session mode")
5. You should see something like:
   ```
   postgresql://postgres.xxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
6. **Copy the ENTIRE string** - it should look like:
   ```
   postgresql://postgres.xxx:your-password-here@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

### Step 2: Replace [YOUR-PASSWORD] with Your Actual Password

The connection string will have `[YOUR-PASSWORD]` - you need to replace it with the password you set when creating the Supabase project.

**Example:**
- If your password is `MySecurePass123!`
- And the connection string is: `postgresql://postgres.xxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres`
- Replace it to: `postgresql://postgres.xxx:MySecurePass123!@aws-0-us-east-1.pooler.supabase.com:6543/postgres`

### Step 3: Update DATABASE_URL in Render

1. Go to Render → Your Service → **Environment** tab
2. Find `DATABASE_URL`
3. Click to edit it
4. **Delete the old value completely**
5. **Paste the correct connection string** (with your password replaced)
6. Make sure it:
   - Starts with `postgresql://`
   - Has your password (not `[YOUR-PASSWORD]`)
   - Has the correct hostname (like `aws-0-us-east-1.pooler.supabase.com`)
   - Has a port number (like `:6543` or `:5432`)
   - Ends with `/postgres`
7. Click **Save**

### Step 4: Redeploy

Render should auto-redeploy. If not:
1. Go to **Manual Deploy** tab
2. Click **Deploy latest commit**

---

## Correct Format Examples

✅ **Correct:**
```
postgresql://postgres.xxx:MyPassword123@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

❌ **Wrong (what you probably have):**
```
postgresql://postgres.xxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```
or
```
2342@db.qcjuudpuotywsiadsvit.supabase.co
```

---

## If You Forgot Your Supabase Password

1. Go to Supabase → Your Project → **Settings** → **Database**
2. Scroll to **"Database password"**
3. Click **"Reset database password"**
4. Set a new password (save it!)
5. Get the new connection string and update Render

---

## Quick Checklist

- [ ] Went to Supabase → Settings → Database
- [ ] Clicked "URI" tab (not JDBC)
- [ ] Copied the entire connection string
- [ ] Replaced `[YOUR-PASSWORD]` with actual password
- [ ] Updated `DATABASE_URL` in Render
- [ ] Connection string starts with `postgresql://`
- [ ] Connection string has correct format
- [ ] Render redeployed successfully

---

## After Fixing

Once you update the `DATABASE_URL` correctly, Render should:
1. Auto-redeploy
2. Successfully connect to the database
3. Start the backend service

Check the logs - you should see:
```
INFO:     Application startup complete.
```

Instead of the database connection error.

