# Your Correct DATABASE_URL for Render

## Your Current Connection String (Direct - Not Working)
```
postgresql://postgres:Srisai2342@db.qcjuudpuotywsiadsvit.supabase.co:5432/postgres
```

## ✅ Correct Connection String (Pooler - Use This)

Replace it with this pooler connection string:

```
postgresql://postgres.qcjuudpuotywsiadsvit:Srisai2342@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Key Changes:**
- `postgres` → `postgres.qcjuudpuotywsiadsvit` (adds project ID to username)
- `db.qcjuudpuotywsiadsvit.supabase.co` → `aws-0-us-east-1.pooler.supabase.com` (pooler hostname)
- `5432` → `6543` (pooler port)
- Password stays the same: `Srisai2342`

---

## How to Update in Render

1. Go to **Render** → Your Service → **Environment** tab
2. Find `DATABASE_URL`
3. Click to **edit** it
4. **Delete** the old value
5. **Paste** this new value:
   ```
   postgresql://postgres.qcjuudpuotywsiadsvit:Srisai2342@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
6. Click **Save**

---

## Important Notes

- **Password**: `Srisai2342` (keep this secure!)
- **Port**: Must be `6543` (pooler), not `5432` (direct)
- **Hostname**: Must have `pooler.supabase.com`

---

## After Updating

1. Render will auto-redeploy
2. Check logs - should see: `Database tables created/verified successfully`
3. Test: Visit `https://your-render-url.onrender.com/docs`

---

## If Pooler Doesn't Work

If the pooler connection still fails, try this alternative (Session mode):

```
postgresql://postgres.qcjuudpuotywsiadsvit:Srisai2342@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

But the first one should work!

