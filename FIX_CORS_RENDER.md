# Fix CORS Error in Render

## The Problem

CORS error: `No 'Access-Control-Allow-Origin' header is present`

Your Vercel URL is: `https://smart-planner-ip6t8mj2l-srikar-kondepudis-projects.vercel.app`

But Render's `CORS_ORIGINS` doesn't include it.

---

## Solution: Update CORS_ORIGINS in Render

### Step 1: Go to Render Environment Variables

1. Go to **Render** → Your Service (`smartplanner-ai-igxh`) → **Environment** tab
2. Find `CORS_ORIGINS`

### Step 2: Update CORS_ORIGINS

You need to add your Vercel URL. You can set it to:

**Option 1: Just your Vercel URL**
```
https://smart-planner-ip6t8mj2l-srikar-kondepudis-projects.vercel.app
```

**Option 2: Multiple URLs (if you have a custom domain too)**
```
https://smart-planner-ip6t8mj2l-srikar-kondepudis-projects.vercel.app,https://your-custom-domain.com
```

**Option 3: All Vercel preview URLs (if you want preview deployments to work)**
```
https://smart-planner-ip6t8mj2l-srikar-kondepudis-projects.vercel.app,https://*.vercel.app
```

### Step 3: Update in Render

1. **Edit** `CORS_ORIGINS`
2. **Set value** to:
   ```
   https://smart-planner-ip6t8mj2l-srikar-kondepudis-projects.vercel.app
   ```
3. **Save**

### Step 4: Wait for Redeploy

Render will auto-redeploy. Wait ~1-2 minutes.

---

## Verify Your Vercel URL

To find your exact Vercel URL:
1. Go to **Vercel** → Your Project → **Settings** → **Domains**
2. Copy the exact URL shown there
3. Use that in `CORS_ORIGINS`

---

## After Fixing

1. Wait for Render to redeploy
2. Try registering/login again on your Vercel frontend
3. CORS error should be gone!

---

## Quick Checklist

- [ ] Went to Render → Environment tab
- [ ] Found `CORS_ORIGINS`
- [ ] Updated to include Vercel URL: `https://smart-planner-ip6t8mj2l-srikar-kondepudis-projects.vercel.app`
- [ ] Saved
- [ ] Waited for redeploy
- [ ] Tested frontend - CORS error gone

---

## Important Notes

- **No trailing slash**: `https://your-url.vercel.app` ✅ (not `https://your-url.vercel.app/` ❌)
- **Use https**: Always use `https://` not `http://`
- **Exact match**: The URL must match exactly what Vercel shows

---

## If You Have Multiple Domains

If you have a custom domain or multiple Vercel URLs, separate them with commas:
```
https://smart-planner-ip6t8mj2l-srikar-kondepudis-projects.vercel.app,https://your-custom-domain.com
```

