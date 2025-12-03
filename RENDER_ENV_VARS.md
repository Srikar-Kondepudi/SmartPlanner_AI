# Render Environment Variables - Complete List

## Copy-Paste Ready Values

Add these **7 environment variables** to your Render service:

---

### 1. DATABASE_URL
**Key:** `DATABASE_URL`  
**Value:** `<paste-your-supabase-connection-string-here>`

**How to get it:**
- Go to Supabase → Your Project → Settings → Database
- Find "Connection string" → Click "URI" tab
- Copy the entire string (looks like: `postgresql://postgres.xxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres`)

---

### 2. JWT_SECRET
**Key:** `JWT_SECRET`  
**Value:** `fbf9bef7b0d2d34984591f531b00bd498d781a7bb0ccb1879f05ff96884f3864`

*(This is a secure random key I generated earlier - you can use this one)*

---

### 3. SECRET_KEY
**Key:** `SECRET_KEY`  
**Value:** `5da6385f5373ca42142731cbeb467c663dde1123864ea1baffc34505c6179c95`

*(Another secure random key - safe to use)*

---

### 4. LLM_PROVIDER
**Key:** `LLM_PROVIDER`  
**Value:** `ollama`

---

### 5. OLLAMA_BASE_URL
**Key:** `OLLAMA_BASE_URL`  
**Value:** `http://host.docker.internal:11434`

*(Note: This is for local Ollama. If you're not using Ollama, you can skip this)*

---

### 6. OLLAMA_MODEL
**Key:** `OLLAMA_MODEL`  
**Value:** `qwen2.5:7b-instruct`

*(Note: Only needed if using Ollama)*

---

### 7. CORS_ORIGINS
**Key:** `CORS_ORIGINS`  
**Value:** `https://smart-planner-ai-cyan.vercel.app,http://localhost:3000`

**Your Vercel URL:** `https://smart-planner-ai-cyan.vercel.app`

**If you only want production (no localhost):**
```
https://smart-planner-ai-cyan.vercel.app
```

---

## How to Add in Render

1. Go to your Render service dashboard
2. Click on **"Environment"** tab (or look for "Environment Variables" in Settings)
3. Click **"Add Environment Variable"**
4. For each variable above:
   - Paste the **Key** in the left field
   - Paste the **Value** in the right field
   - Click **"Save"**
5. Repeat for all 7 variables

---

## Quick Checklist

- [ ] DATABASE_URL (from Supabase)
- [ ] JWT_SECRET
- [ ] SECRET_KEY
- [ ] LLM_PROVIDER
- [ ] OLLAMA_BASE_URL
- [ ] OLLAMA_MODEL
- [ ] CORS_ORIGINS (with your actual Vercel URL)

---

## Example: What It Looks Like in Render

```
Environment Variables:
┌─────────────────────┬─────────────────────────────────────────────┐
│ DATABASE_URL        │ postgresql://postgres.xxx:...@...supabase...│
│ JWT_SECRET          │ fbf9bef7b0d2d34984591f531b00bd498d781a7b... │
│ SECRET_KEY          │ 5da6385f5373ca42142731cbeb467c663dde1123... │
│ LLM_PROVIDER        │ ollama                                      │
│ OLLAMA_BASE_URL     │ http://host.docker.internal:11434          │
│ OLLAMA_MODEL        │ qwen2.5:7b-instruct                         │
│ CORS_ORIGINS        │ https://smart-planner-ai-cyan.vercel.app  │
└─────────────────────┴─────────────────────────────────────────────┘
```

---

## After Adding All Variables

1. Render will automatically redeploy
2. Wait for deployment to complete (~5 minutes)
3. Check logs to make sure it started successfully
4. Test: Visit `https://your-render-url.onrender.com/docs`

---

## Troubleshooting

### "DATABASE_URL not found"
- Make sure you copied the entire connection string from Supabase
- Check that it starts with `postgresql://`
- Verify your Supabase project is active

### "CORS error"
- Make sure `CORS_ORIGINS` matches your Vercel URL exactly
- No trailing slash
- Use `https://` not `http://`

### "JWT_SECRET missing"
- Double-check the variable name is exactly `JWT_SECRET` (not `JWT_SECRET_KEY`)
- Make sure you saved it

