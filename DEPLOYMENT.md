# Deployment Guide

## Frontend (Vercel) - ✅ Deployed

The frontend is deployed on Vercel. Make sure you have configured:

1. **Root Directory**: Set to `frontend` in Vercel project settings
2. **Environment Variables**: Add `NEXT_PUBLIC_API_URL` pointing to your backend API

### Vercel Environment Variables

Go to your Vercel project settings → Environment Variables and add:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

**Important**: Replace `https://your-backend-url.com` with your actual backend API URL.

---

## Backend - ⚠️ Needs Deployment

The backend is currently **NOT deployed**. You have two options:

### Option 1: Deploy Backend to Railway/Render/Fly.io (Recommended)

1. **Railway** (Easiest):
   - Go to [railway.app](https://railway.app)
   - Create new project → Deploy from GitHub
   - Select your repository
   - Set root directory to `backend`
   - Add environment variables from `.env.example`
   - Railway will auto-deploy

2. **Render**:
   - Go to [render.com](https://render.com)
   - Create new Web Service
   - Connect GitHub repo
   - Set root directory to `backend`
   - Build command: `pip install -r requirements.txt && alembic upgrade head`
   - Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Add environment variables

3. **Fly.io**:
   - Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
   - Run: `fly launch` in the `backend` directory
   - Follow prompts

### Option 2: Run Backend Locally (For Testing)

If you want to test locally:

1. Make sure Docker is running
2. Run: `docker-compose up -d postgres backend`
3. Update Vercel environment variable:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
   **Note**: This only works if you're testing locally. For production, you need a deployed backend.

---

## Database Setup

The backend requires PostgreSQL. Options:

1. **Railway/Render**: They provide managed PostgreSQL
2. **Supabase**: Free tier available at [supabase.com](https://supabase.com)
3. **Neon**: Serverless PostgreSQL at [neon.tech](https://neon.tech)
4. **Local**: Use Docker Compose (for development only)

### Database Connection String

Update your backend environment variable:
```
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

---

## Test Credentials

After deploying the backend and setting up the database, create a test user:

1. SSH into your backend or run locally:
   ```bash
   cd backend
   python scripts/create_test_user.py
   ```

2. Test credentials:
   - Email: `test@smartplanner.ai`
   - Password: `test123`

---

## Quick Checklist

- [ ] Backend deployed (Railway/Render/Fly.io)
- [ ] Database configured and connected
- [ ] Environment variables set in backend
- [ ] `NEXT_PUBLIC_API_URL` set in Vercel
- [ ] Test user created
- [ ] Test login/registration

---

## Troubleshooting

### "Cannot connect to server" Error

- Check if `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Verify backend is running and accessible
- Check CORS settings in backend (should allow your Vercel domain)

### "Registration failed" or "Email already registered"

- Check backend logs for detailed error
- Verify database connection
- Check if email validation is working

### Test credentials not working

- Run `python scripts/create_test_user.py` in backend
- Verify database has the test user
- Check password hashing is working

