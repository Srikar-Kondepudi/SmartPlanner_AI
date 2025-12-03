# Railway Environment Variables Setup Guide

## Step-by-Step Instructions

### Step 1: Generate Secret Keys

I'll generate these for you, or you can run:
```bash
openssl rand -hex 32  # Run this twice to get two different keys
```

### Step 2: Add Variables One by One

For each variable below, follow these steps:

1. **Click in the left field** (VARIABLE_NAME) and type the variable name
2. **Click in the right field** (VALUE) and type the value
3. **Click the purple "Add" button** (with checkmark)
4. **Repeat for each variable**

---

## Variables to Add (In Order)

### 1. LLM_PROVIDER
- **Variable Name**: `LLM_PROVIDER`
- **Value**: `ollama`
- Click "Add"

### 2. OLLAMA_BASE_URL
- **Variable Name**: `OLLAMA_BASE_URL`
- **Value**: `http://host.docker.internal:11434`
- Click "Add"

### 3. OLLAMA_MODEL
- **Variable Name**: `OLLAMA_MODEL`
- **Value**: `qwen2.5:7b-instruct`
- Click "Add"

### 4. SECRET_KEY
- **Variable Name**: `SECRET_KEY`
- **Value**: `<paste-generated-secret-here>` (I'll generate this for you)
- Click "Add"

### 5. JWT_SECRET_KEY
- **Variable Name**: `JWT_SECRET_KEY`
- **Value**: `<paste-generated-secret-here>` (I'll generate this for you)
- Click "Add"

### 6. CORS_ORIGINS
- **Variable Name**: `CORS_ORIGINS`
- **Value**: `https://your-vercel-app.vercel.app` (Replace with your actual Vercel URL)
- Click "Add"

---

## Important Notes

1. **Replace Vercel URL**: For `CORS_ORIGINS`, replace `your-vercel-app` with your actual Vercel app name
   - Example: If your Vercel URL is `https://smartplanner-ai.vercel.app`, use that
   - You can find it in your Vercel dashboard

2. **Secret Keys**: Use the generated keys I'll provide below (or generate your own)

3. **Railway Auto-Variables**: The "7 variables added by Railway" are automatically managed (like DATABASE_URL). Don't delete those!

4. **After Adding**: Railway will automatically redeploy with the new variables

---

## Quick Copy-Paste Values

Here are the exact values to copy:

```
LLM_PROVIDER
ollama

OLLAMA_BASE_URL
http://host.docker.internal:11434

OLLAMA_MODEL
qwen2.5:7b-instruct

SECRET_KEY
<paste-secret-1-here>

JWT_SECRET_KEY
<paste-secret-2-here>

CORS_ORIGINS
https://your-vercel-app.vercel.app
```

---

## Visual Guide

1. Type variable name in **left field** (VARIABLE_NAME)
2. Type value in **right field** (VALUE or ${{REF}})
3. Click **purple "Add" button** (with checkmark ✓)
4. Variable appears in the list below
5. Repeat for next variable

---

## After Adding All Variables

1. Wait for Railway to redeploy (automatic)
2. Check the deployment logs to ensure it's successful
3. Copy your Railway service URL (e.g., `https://your-app.up.railway.app`)
4. Go to Vercel → Settings → Environment Variables
5. Add: `NEXT_PUBLIC_API_URL` = your Railway URL
6. Redeploy Vercel

