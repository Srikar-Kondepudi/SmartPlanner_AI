# How to Find Your Railway Backend URL

## Step-by-Step Guide

### Method 1: From the Service Dashboard (Easiest)

1. **Go to Railway Dashboard**: https://railway.app
2. **Click on your project** (SmartPlanner_AI)
3. **Click on your service** (the backend service you created)
4. **Look at the top of the page** - You'll see:
   - A section showing your service name
   - Below it, you'll see **"Settings"** tab
   - In the **Settings** tab, scroll down to **"Networking"** section
   - You'll see **"Public Domain"** or **"Custom Domain"**
   - The URL will look like: `https://your-service-name.up.railway.app`

### Method 2: From the Deployments Tab

1. **Go to Railway Dashboard** → Your Project → Your Service
2. **Click on "Deployments"** tab
3. **Click on the latest deployment** (the most recent one)
4. **Look at the deployment details** - The URL will be shown there

### Method 3: From the Service Settings

1. **Go to Railway Dashboard** → Your Project → Your Service
2. **Click on "Settings"** tab
3. **Scroll down to "Networking"** section
4. **Look for "Public Domain"** - This is your Railway URL
   - It will be something like: `https://smartplanner-production.up.railway.app`
   - Or: `https://your-app-name.up.railway.app`

### Method 4: Check the Service URL Directly

1. **In your Railway project**, you should see your services listed
2. **Hover over or click on your backend service**
3. **The URL might be displayed** in a tooltip or in the service card
4. **Or click on the service** → The URL is usually shown at the top

---

## What the URL Looks Like

Your Railway URL will be in one of these formats:

- `https://your-service-name.up.railway.app`
- `https://smartplanner-production.up.railway.app`
- `https://backend-production.up.railway.app`

**Note**: Railway automatically generates a domain for your service. It's usually based on your service name.

---

## If You Don't See a URL

If you don't see a public domain:

1. **Make sure your service is deployed successfully**
   - Check the "Deployments" tab
   - Make sure the latest deployment shows "Active" or "Success"

2. **Check if the service is running**
   - Go to "Metrics" tab
   - You should see activity if the service is running

3. **Generate a public domain** (if needed):
   - Go to Settings → Networking
   - Click "Generate Domain" or "Add Domain"
   - Railway will create a public URL for you

---

## Quick Visual Guide

```
Railway Dashboard
├── Your Project (SmartPlanner_AI)
    ├── Your Service (backend)
        ├── Settings Tab
        │   └── Networking Section
        │       └── Public Domain ← YOUR URL IS HERE
        ├── Deployments Tab
        │   └── Latest Deployment
        │       └── Shows URL in details
        └── Metrics Tab
            └── Shows if service is running
```

---

## After Finding the URL

Once you have your Railway URL:

1. **Copy the full URL** (e.g., `https://smartplanner-production.up.railway.app`)
2. **Go to Vercel** → Your Project → Settings → Environment Variables
3. **Add or Update**: `NEXT_PUBLIC_API_URL`
4. **Value**: Paste your Railway URL (without trailing slash)
5. **Save** and **Redeploy** Vercel

---

## Test Your Backend URL

After you find it, test it by visiting:

- `https://your-railway-url.up.railway.app/` - Should show health check
- `https://your-railway-url.up.railway.app/docs` - Should show Swagger API docs
- `https://your-railway-url.up.railway.app/health` - Should show health status

If these work, your backend is running correctly!

