# Next Steps After Deployment

## Step 1: Test Your Backend

1. **Open your Railway URL in a browser**:
   - Go to: `https://your-railway-url.up.railway.app/`
   - You should see: `{"status":"healthy","service":"SmartPlanner AI Backend","version":"1.0.0"}`

2. **Test the API docs**:
   - Go to: `https://your-railway-url.up.railway.app/docs`
   - You should see the Swagger API documentation

3. **Test health endpoint**:
   - Go to: `https://your-railway-url.up.railway.app/health`
   - Should show health status

✅ **If these work, your backend is running!**

---

## Step 2: Create Test User

You need to create a test user in the database. You have 3 options:

### Option A: Using Railway CLI (Recommended)

1. **Install Railway CLI**:
   ```bash
   npm i -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Link to your project**:
   ```bash
   railway link
   ```
   - Select your project when prompted

4. **Run the test user script**:
   ```bash
   cd backend
   railway run python scripts/create_test_user.py
   ```

5. **You should see**:
   ```
   ✅ Test user created successfully!
   
   📧 Login Credentials:
      Email: test@smartplanner.ai
      Password: Test123!
   ```

### Option B: Using Railway Web Interface

1. Go to Railway → Your Service → **Deployments** tab
2. Click on the latest deployment
3. Look for **"View Logs"** or **"Shell"** option
4. Run: `python scripts/create_test_user.py`

### Option C: Using Railway's One-Click Deploy Terminal

1. In Railway dashboard, go to your service
2. Click on **"View Logs"** or find the **"Shell"** button
3. Run: `python scripts/create_test_user.py`

---

## Step 3: Test Your Frontend

1. **Go to your Vercel app** (your frontend URL)
2. **Try to register** with your personal Gmail:
   - Go to `/register`
   - Enter your email, password (min 6 chars), and name
   - Click "Create Account"
   - Should redirect to dashboard

3. **Or try logging in** with test credentials:
   - Go to `/login`
   - Email: `test@smartplanner.ai`
   - Password: `Test123!`
   - Should redirect to dashboard

---

## Step 4: Verify Everything Works

### ✅ Checklist:

- [ ] Backend URL accessible (shows health check)
- [ ] API docs accessible (`/docs` endpoint)
- [ ] Test user created successfully
- [ ] Can register new account on frontend
- [ ] Can login with test credentials
- [ ] Can create a new project
- [ ] Can upload a spec file
- [ ] Can generate sprint plan (if Ollama is configured)

---

## Troubleshooting

### "Cannot connect to server" on frontend
- **Check**: Is `NEXT_PUBLIC_API_URL` set correctly in Vercel?
- **Verify**: Can you access `https://your-railway-url.up.railway.app/docs`?
- **Fix**: Make sure there's no trailing slash in the URL

### "Registration failed" or "Email already registered"
- **Check**: Backend logs in Railway
- **Verify**: Database connection is working
- **Try**: Use a different email address

### "Test credentials not working"
- **Check**: Did you run `create_test_user.py`?
- **Verify**: Check Railway logs for errors
- **Try**: Create a new account instead

### Backend shows errors in logs
- **Check**: Are all environment variables set correctly?
- **Verify**: Is PostgreSQL database connected?
- **Check**: Railway logs for specific error messages

---

## Success Indicators

✅ **Everything is working if:**
- You can access `/docs` on your Railway URL
- You can register/login on your Vercel frontend
- You can create projects
- No errors in browser console (F12)

🎉 **You're all set!** Your SmartPlanner AI is now live!

