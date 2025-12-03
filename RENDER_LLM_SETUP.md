# LLM Setup for Render Deployment

## The Problem

Render (cloud hosting) **cannot access Ollama** running on your local machine. The `host.docker.internal` URL only works when Docker is running on the same machine.

## Solution: Use Cloud LLM Providers

For Render deployment, you need to use **OpenAI** or **Anthropic** instead of Ollama.

---

## Option 1: Use OpenAI (Recommended for Production)

### Step 1: Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Click **"Create new secret key"**
4. Copy the key (starts with `sk-...`)

### Step 2: Add to Render Environment Variables

1. Go to **Render** → Your Service → **Environment** tab
2. Add/Edit these variables:

   **LLM_PROVIDER**
   - Key: `LLM_PROVIDER`
   - Value: `openai`

   **OPENAI_API_KEY**
   - Key: `OPENAI_API_KEY`
   - Value: `sk-your-actual-key-here` (paste your OpenAI key)

3. **Save** - Render will auto-redeploy

### Step 3: Update Frontend (Optional)

The frontend should already support OpenAI. When generating sprint plans, it will use OpenAI instead of Ollama.

---

## Option 2: Use Anthropic Claude

### Step 1: Get Anthropic API Key

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Go to **API Keys**
4. Click **"Create Key"**
5. Copy the key (starts with `sk-ant-...`)

### Step 2: Add to Render Environment Variables

1. Go to **Render** → Your Service → **Environment** tab
2. Add/Edit these variables:

   **LLM_PROVIDER**
   - Key: `LLM_PROVIDER`
   - Value: `anthropic`

   **ANTHROPIC_API_KEY**
   - Key: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-your-actual-key-here` (paste your Anthropic key)

3. **Save** - Render will auto-redeploy

---

## Option 3: Keep Ollama for Local Development Only

If you want to use Ollama locally but cloud LLM on Render:

### Local Development (.env file)
```env
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:7b-instruct
```

### Render (Environment Variables)
```env
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your-key-here
```

This way:
- **Local:** Uses Ollama (free, no tokens)
- **Render:** Uses OpenAI (requires API key)

---

## Recommended: Use OpenAI on Render

**Why OpenAI?**
- ✅ Works immediately (no setup needed)
- ✅ Reliable and fast
- ✅ Good for production
- ✅ Free tier available ($5 credit)

**Setup:**
1. Get OpenAI API key (see above)
2. Add `LLM_PROVIDER=openai` to Render
3. Add `OPENAI_API_KEY=sk-...` to Render
4. Save and wait for redeploy

---

## Current Render Environment Variables

Make sure you have these set in Render:

### Required:
- `DATABASE_URL` - Your Supabase connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `SECRET_KEY` - Another secret key
- `CORS_ORIGINS` - Your Vercel URL

### For LLM (choose one):

**Option A: OpenAI**
- `LLM_PROVIDER=openai`
- `OPENAI_API_KEY=sk-...`

**Option B: Anthropic**
- `LLM_PROVIDER=anthropic`
- `ANTHROPIC_API_KEY=sk-ant-...`

**Option C: Ollama (won't work on Render)**
- `LLM_PROVIDER=ollama`
- `OLLAMA_BASE_URL=http://host.docker.internal:11434` ❌ This won't work!

---

## After Setting Up

1. **Wait for Render to redeploy** (~1-2 minutes)
2. **Test your app:** Try generating a sprint plan
3. **Should work:** No more Ollama connection errors!

---

## Troubleshooting

### Still getting Ollama errors?

**Check Render logs:**
1. Go to Render → Your Service → Logs
2. Look for errors mentioning Ollama
3. Verify `LLM_PROVIDER` is set to `openai` or `anthropic` (not `ollama`)

### OpenAI API errors?

**Check:**
- API key is correct (starts with `sk-`)
- You have credits/quota available
- `LLM_PROVIDER=openai` is set correctly

### Want to use Ollama?

**You can't use Ollama on Render** because it requires local access. Options:
1. Use OpenAI/Anthropic on Render (recommended)
2. Deploy backend to a VPS where you can run Ollama
3. Use Ollama only for local development

---

## Summary

**For Render deployment:**
- ❌ Ollama won't work (requires local access)
- ✅ Use OpenAI or Anthropic instead
- ✅ Set `LLM_PROVIDER=openai` and `OPENAI_API_KEY=sk-...` in Render
- ✅ Save and wait for redeploy

**For local development:**
- ✅ Ollama works great (free, no tokens)
- ✅ Keep using `LLM_PROVIDER=ollama` in your local `.env`

