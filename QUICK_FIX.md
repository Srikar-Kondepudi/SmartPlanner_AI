# 🚀 QUICK FIX - Do These 2 Things

## ✅ Backend is Running! 
Tested: `https://smartplanner-ai-igxh.onrender.com/` ✅

---

## Fix #1: Vercel (Frontend)

### Set NEXT_PUBLIC_API_URL

1. **Go to:** [vercel.com](https://vercel.com) → Your Project → **Settings** → **Environment Variables**

2. **Add/Edit:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://smartplanner-ai-igxh.onrender.com`
   - **Enable for:** Production ✅ Preview ✅ Development ✅

3. **CRITICAL:** Go to **Deployments** → Latest → **"..."** → **Redeploy**
   - ⚠️ **Must redeploy** or variable won't work!

---

## Fix #2: Render (Backend)

### Set CORS_ORIGINS

1. **Go to:** [Render Dashboard](https://dashboard.render.com) → Your Service → **Environment** tab

2. **Add/Edit:** `CORS_ORIGINS`
   - **Value:** `https://smart-planner-ai-cyan.vercel.app,http://localhost:3000`

3. **Save** - Render will auto-redeploy (~1-2 min)

---

## ✅ Verify It Works

After both fixes:

1. **Wait** for both redeploys to finish
2. **Visit:** `https://smart-planner-ai-cyan.vercel.app`
3. **Try:** Register or login
4. **Check:** Browser console (F12) - should have NO errors

---

## 🎯 Why This Happens

- **Frontend** defaults to `localhost:8000` if `NEXT_PUBLIC_API_URL` is missing
- **Backend** blocks requests if `CORS_ORIGINS` doesn't include your Vercel URL

**Both must be set correctly!**

---

## 📋 Checklist

- [ ] Vercel: `NEXT_PUBLIC_API_URL` = `https://smartplanner-ai-igxh.onrender.com`
- [ ] Vercel: **Redeployed** after adding variable
- [ ] Render: `CORS_ORIGINS` = `https://smart-planner-ai-cyan.vercel.app,http://localhost:3000`
- [ ] Render: Finished redeploying
- [ ] Tested: Registration/login works

---

**That's it! These 2 fixes will solve the connection issue.**

