# Check if Render Has Redeployed

## The Problem

You're still getting **405 Method Not Allowed** errors, which means Render might not have picked up the latest code changes yet.

---

## Step 1: Check Render Deployment Status

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click your service: **smartplanner-ai-igxh**
3. Go to **Logs** tab
4. Look at the **most recent deployment**:
   - **Green checkmark** ✅ = Deployed successfully
   - **Red X** ❌ = Deployment failed
   - **Yellow spinner** ⏳ = Still deploying

---

## Step 2: Check if Latest Code is Deployed

Look at the logs for the **latest commit hash**. It should match the latest commit in your GitHub repo.

**To check your latest commit:**
```bash
git log -1 --oneline
```

**In Render logs**, you should see something like:
```
==> Cloning from https://github.com/Srikar-Kondepudi/SmartPlanner_AI.git
==> Checking out commit abc123def456...
```

If the commit hash doesn't match, Render hasn't pulled the latest code yet.

---

## Step 3: Force a Manual Deploy

If Render hasn't deployed the latest code:

1. Go to Render → Your Service
2. Look for **"Manual Deploy"** button (usually top-right)
3. Click it → Select **"Deploy latest commit"**
4. Wait for deployment to complete (~2-5 minutes)

**OR** trigger a redeploy by:
- Making a tiny change (add a comment to any file)
- Commit and push:
  ```bash
  git add .
  git commit -m "Trigger redeploy"
  git push origin main
  ```

---

## Step 4: Verify Routes Are Working

After deployment, test the backend directly:

1. **Test GET (should work):**
   - Visit: `https://smartplanner-ai-igxh.onrender.com/api/v1/projects`
   - Should return: `{"detail":"Not authenticated"}` or similar (not 405)

2. **Test POST with curl** (if you have terminal access):
   ```bash
   curl -X POST https://smartplanner-ai-igxh.onrender.com/api/v1/projects \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{"name":"Test Project","description":"Test"}'
   ```
   - Should return: `{"detail":"Not authenticated"}` or project data (not 405)

---

## Step 5: Check Browser Network Tab

After Render redeploys:

1. Open your Vercel app: `https://smart-planner-ai-cyan.vercel.app`
2. Open **DevTools** (F12) → **Network** tab
3. Try creating a project again
4. Click on the `projects` request
5. Check:
   - **Status**: Should be **201 Created** (not 405)
   - **Request URL**: `https://smartplanner-ai-igxh.onrender.com/api/v1/projects`
   - **Request Method**: `POST`
   - **Response**: Should show project data or auth error (not "Method Not Allowed")

---

## Common Issues

### Issue: Render shows "Deployed" but still getting 405

**Possible causes:**
1. **Cached response** - Clear browser cache or try incognito mode
2. **Old deployment still running** - Check Render logs for actual deployment time
3. **Route not registered** - Check Render logs for import errors

**Solution:** Check Render logs for Python errors during startup.

---

### Issue: Render deployment failed

**Check Render logs for:**
- Import errors
- Missing dependencies
- Database connection errors
- Environment variable errors

**Solution:** Fix the error shown in logs, then redeploy.

---

### Issue: Still 405 after successful deployment

**This means the route isn't matching. Check:**

1. **Backend logs** - Look for route registration:
   ```
   INFO:     Application startup complete.
   ```

2. **Test OPTIONS request** (CORS preflight):
   ```bash
   curl -X OPTIONS https://smartplanner-ai-igxh.onrender.com/api/v1/projects \
     -H "Origin: https://smart-planner-ai-cyan.vercel.app" \
     -H "Access-Control-Request-Method: POST"
   ```
   Should return CORS headers (not 405)

3. **Verify route exists** - Check `/docs` endpoint:
   - Visit: `https://smartplanner-ai-igxh.onrender.com/docs`
   - Look for `POST /api/v1/projects` endpoint
   - If it's not there, the route isn't registered

---

## Quick Checklist

- [ ] Render shows latest commit hash in logs
- [ ] Render deployment completed successfully (green checkmark)
- [ ] Backend is running (check `/` endpoint)
- [ ] Routes are registered (check `/docs`)
- [ ] Browser cache cleared or incognito mode
- [ ] Network tab shows correct request method (POST)
- [ ] Network tab shows correct URL (`/api/v1/projects`)

---

## Still Not Working?

If you've checked everything above and still getting 405:

1. **Share Render logs** - Copy the latest deployment logs
2. **Share Network tab details**:
   - Request URL
   - Request Method
   - Request Headers
   - Response Status
   - Response Body

3. **Test backend directly** - Use curl or Postman to test the endpoint

This will help identify if it's a routing issue, CORS issue, or something else.

