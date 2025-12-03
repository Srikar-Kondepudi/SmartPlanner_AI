# Final DATABASE_URL for Render

## ✅ Your Correct Connection String

Replace `[YOUR-PASSWORD]` with your password `Srisai2342`:

```
postgresql://postgres.qcjuudpuotywsiadsvit:Srisai2342@aws-1-us-east-1.pooler.supabase.com:6543/postgres
```

**Note**: The hostname is `aws-1-us-east-1` (not `aws-0-us-east-1` as I suggested earlier)

---

## Update in Render

1. Go to **Render** → Your Service (`smartplanner-ai-igxh`) → **Environment** tab
2. Find `DATABASE_URL`
3. Click to **edit** it
4. **Delete** the old value
5. **Paste** this exact string:
   ```
   postgresql://postgres.qcjuudpuotywsiadsvit:Srisai2342@aws-1-us-east-1.pooler.supabase.com:6543/postgres
   ```
6. Click **Save**

---

## After Saving

1. Render will automatically redeploy
2. Check the logs - should see: `Database tables created/verified successfully`
3. No more "Tenant or user not found" error!

---

## Test Your Backend

After the database connects:
- Visit: `https://smartplanner-ai-igxh.onrender.com/docs`
- Should show Swagger API docs
- Try `/health` endpoint - should work

---

## Then Update Vercel

Once database is working:
1. Go to **Vercel** → Your Project → **Settings** → **Environment Variables**
2. Update `NEXT_PUBLIC_API_URL` to: `https://smartplanner-ai-igxh.onrender.com`
3. **Redeploy** Vercel

Then your full app will be working! 🎉

