# 🆓 FREE LLM Setup - No Credit Card Required!

## The Problem

You want to use AI-powered sprint planning **without paying for API tokens**. Ollama works locally but not on Render (cloud hosting).

## ✅ Solution: Use Groq API (100% FREE!)

**Groq offers:**
- ✅ **FREE tier** - No credit card required
- ✅ **Fast inference** - Powered by their custom chips
- ✅ **Works on Render** - Cloud-based API
- ✅ **Generous limits** - Perfect for development/testing
- ✅ **Powerful models** - Llama 3.1 70B, Mixtral, and more

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get Free Groq API Key

1. Go to [Groq Console](https://console.groq.com/)
2. Click **"Sign Up"** (or log in if you have an account)
3. **No credit card required!** Just email signup
4. Go to **"API Keys"** section
5. Click **"Create API Key"**
6. Copy the key (starts with `gsk_...`)

### Step 2: Add to Render Environment Variables

1. Go to **Render** → Your Service → **Environment** tab
2. Add/Edit these variables:

   **LLM_PROVIDER**
   - Key: `LLM_PROVIDER`
   - Value: `groq`

   **GROQ_API_KEY**
   - Key: `GROQ_API_KEY`
   - Value: `gsk-your-actual-key-here` (paste your Groq key)

3. **Save** - Render will auto-redeploy (~1-2 minutes)

### Step 3: Test!

After redeploy, try generating a sprint plan. It should work **completely free!** 🎉

---

## 📋 Available Groq Models (All FREE!)

You can use any of these models (set `GROQ_MODEL` in Render):

- `llama-3.1-70b-versatile` (Recommended - most powerful)
- `llama-3.1-8b-instant` (Fastest)
- `mixtral-8x7b-32768` (Great for long contexts)
- `gemma-7b-it` (Google's model)

**Default:** `llama-3.1-70b-versatile` (already set)

---

## 🔄 Comparison: Free Options

| Provider | Cost | Works on Render | Speed | Quality |
|----------|------|----------------|-------|---------|
| **Groq** | ✅ FREE | ✅ Yes | ⚡ Very Fast | ⭐⭐⭐⭐⭐ Excellent |
| Ollama | ✅ FREE | ❌ No (local only) | ⚡ Fast | ⭐⭐⭐⭐ Good |
| OpenAI | 💰 Paid | ✅ Yes | ⚡ Fast | ⭐⭐⭐⭐⭐ Excellent |
| Anthropic | 💰 Paid | ✅ Yes | ⚡ Fast | ⭐⭐⭐⭐⭐ Excellent |

**Winner: Groq** - Free, fast, and works on Render! 🏆

---

## 🎯 Recommended Setup

### For Render (Production):
```env
LLM_PROVIDER=groq
GROQ_API_KEY=gsk-your-key-here
GROQ_MODEL=llama-3.1-70b-versatile
```

### For Local Development:
```env
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:7b-instruct
```

This way:
- **Render:** Uses Groq (free, cloud-based)
- **Local:** Uses Ollama (free, local)

---

## 📝 Complete Render Environment Variables

Make sure you have these in Render:

### Required:
- `DATABASE_URL` - Your Supabase connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `SECRET_KEY` - Another secret key
- `CORS_ORIGINS` - Your Vercel URL

### For FREE LLM (Groq):
- `LLM_PROVIDER=groq`
- `GROQ_API_KEY=gsk-...` (get from https://console.groq.com/keys)

---

## 🆘 Troubleshooting

### "GROQ_API_KEY is required"

**Solution:** Make sure you:
1. Got your API key from https://console.groq.com/keys
2. Added it to Render as `GROQ_API_KEY`
3. Set `LLM_PROVIDER=groq`
4. Saved and waited for redeploy

### Rate Limit Errors

**Groq free tier limits:**
- Very generous limits for development/testing
- If you hit limits, wait a few minutes and try again
- For production, consider upgrading (still very affordable)

### Still Getting Ollama Errors?

**Check:**
- `LLM_PROVIDER` is set to `groq` (not `ollama`)
- `GROQ_API_KEY` is set correctly
- Render has finished redeploying

---

## 🎉 Summary

**You can now use AI-powered sprint planning 100% FREE!**

1. ✅ Get free Groq API key (no credit card)
2. ✅ Add to Render: `LLM_PROVIDER=groq` and `GROQ_API_KEY=...`
3. ✅ Save and wait for redeploy
4. ✅ Enjoy free AI sprint planning! 🚀

**No more token costs!** Groq's free tier is perfect for development and testing.

