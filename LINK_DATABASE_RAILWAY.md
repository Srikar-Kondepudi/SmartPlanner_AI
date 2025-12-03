# How to Link PostgreSQL Database in Railway

## Step-by-Step Instructions

### Step 1: Check if PostgreSQL Service Exists

1. Go to [railway.app](https://railway.app)
2. Click on your **project** (SmartPlanner_AI)
3. Look at your services list
4. **Do you see a service called "PostgreSQL" or "Database"?**
   - ✅ **YES** → Go to Step 2
   - ❌ **NO** → Create it first (see below)

#### If PostgreSQL Doesn't Exist:

1. In your Railway project, click **"New"** button (top right)
2. Click **"Database"**
3. Click **"Add PostgreSQL"**
4. Wait for it to deploy (takes ~30 seconds)
5. Now you have PostgreSQL! → Go to Step 2

---

### Step 2: Link PostgreSQL to Your Backend Service

1. **Click on your backend service** (the one that's crashing)
2. Go to **"Settings"** tab (top navigation)
3. Scroll down to **"Variables"** section
4. Look for a button that says **"Add Reference"** or **"New Variable"**
   - It might be next to the variable input fields
   - Or at the top of the variables list
5. **Click "Add Reference"**
6. A dropdown will appear asking you to select a service
7. **Select your PostgreSQL service** from the dropdown
8. Another dropdown will appear asking which variable to reference
9. **Select `DATABASE_URL`** from the dropdown
10. Click **"Add"** or **"Save"**

---

### Step 3: Verify DATABASE_URL is Added

After adding the reference, you should see:
- A new variable in your list: `DATABASE_URL`
- It should show as a **reference** (not a plain value)
- It might look like: `${{PostgreSQL.DATABASE_URL}}` or show a link icon

---

### Step 4: Wait for Redeploy

Railway should automatically redeploy your backend service. You'll see:
- A new deployment starting
- Logs showing the build process
- Eventually, the service should start successfully

---

## Visual Guide

```
Railway Dashboard
├── Your Project
    ├── PostgreSQL Service (Database) ← Make sure this exists
    └── Backend Service ← Click this
        └── Settings Tab
            └── Variables Section
                └── "Add Reference" Button ← Click this
                    └── Select: PostgreSQL Service
                        └── Select Variable: DATABASE_URL
                            └── Add/Save
```

---

## Alternative: Manual DATABASE_URL (If Reference Doesn't Work)

If the "Add Reference" method doesn't work, you can manually add it:

1. Go to your **PostgreSQL service** → **Settings** → **Variables**
2. Find `DATABASE_URL` (it should be there automatically)
3. **Copy the entire value** (it's a long connection string)
4. Go to your **Backend service** → **Settings** → **Variables**
5. Click **"New Variable"** or the **"+"** button
6. Variable Name: `DATABASE_URL`
7. Variable Value: Paste the connection string you copied
8. Click **"Add"**

---

## After DATABASE_URL is Added

1. **Check Railway logs**:
   - Go to your backend service → **Deployments** tab
   - Click on the latest deployment
   - Check **"View Logs"**
   - You should see the service starting successfully

2. **Test your backend**:
   - Visit: `https://your-railway-url.up.railway.app/docs`
   - Should show Swagger API docs (not an error)

3. **If it still fails**, check:
   - Is `JWT_SECRET` set? (not just `JWT_SECRET_KEY`)
   - Are all other variables set correctly?

---

## Still Stuck?

If you can't find the "Add Reference" button:

1. **Try the manual method** (copy DATABASE_URL from PostgreSQL service)
2. **Check Railway documentation**: https://docs.railway.app/develop/variables#referencing-variables
3. **Take a screenshot** of your Railway Variables page and I can help identify where the button is

---

## Quick Checklist

- [ ] PostgreSQL service exists in Railway
- [ ] Clicked on backend service
- [ ] Went to Settings → Variables
- [ ] Found "Add Reference" button
- [ ] Selected PostgreSQL service
- [ ] Selected DATABASE_URL variable
- [ ] Saved/Added the reference
- [ ] DATABASE_URL appears in variables list
- [ ] Service redeployed successfully
- [ ] Backend is running (check `/docs` endpoint)

