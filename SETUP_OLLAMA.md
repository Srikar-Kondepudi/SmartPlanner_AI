# Setting Up Ollama (Free Local LLM)

Ollama is the default LLM provider for SmartPlanner AI. It runs completely locally and requires **no API tokens or payments**.

## Quick Setup

### 1. Install Ollama

**macOS:**
```bash
# Download from https://ollama.com/download/mac
# Or use Homebrew:
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**Windows:**
- Download the installer from https://ollama.com/download/windows
- Run the installer

### 2. Pull the Model

After installing Ollama, pull the recommended model:

```bash
ollama pull qwen2.5:7b-instruct
```

This will download the model (about 4.4 GB). The first time may take a few minutes depending on your internet speed.

**Alternative models** (if you want to try different ones):
```bash
# Smaller, faster model
ollama pull qwen2.5:3b-instruct

# Coding-focused model
ollama pull qwen2.5-coder:7b
```

### 3. Start Ollama

**Option A: Run as a service (Recommended)**
- On macOS/Linux: Ollama usually starts automatically as a service
- On Windows: Ollama runs as a background service after installation

**Option B: Run manually**
```bash
ollama serve
```

Keep this terminal open while using the app.

### 4. Verify Installation

Test that Ollama is running:

```bash
# Check if Ollama is responding
curl http://localhost:11434/api/tags

# Or test with a simple prompt
ollama run qwen2.5:7b-instruct "Hello, how are you?"
```

### 5. Test with SmartPlanner

Run the smoke test script:

```bash
cd backend
python scripts/test_llm_provider.py
```

You should see:
```
✅ SUCCESS!
Response: Hello, SmartPlanner AI! ...
```

## Troubleshooting

### "Could not connect to Ollama"

**Problem:** Ollama is not running or not accessible.

**Solutions:**
1. Check if Ollama is running:
   ```bash
   # macOS/Linux
   ps aux | grep ollama
   
   # Windows
   tasklist | findstr ollama
   ```

2. Start Ollama manually:
   ```bash
   ollama serve
   ```

3. Check if port 11434 is available:
   ```bash
   # macOS/Linux
   lsof -i :11434
   
   # Windows
   netstat -ano | findstr :11434
   ```

4. If using Docker, ensure Ollama is accessible from the container:
   - Use `host.docker.internal:11434` instead of `localhost:11434`
   - Or run Ollama on the host machine, not in Docker

### "Model not found"

**Problem:** The model hasn't been pulled yet.

**Solution:**
```bash
ollama pull qwen2.5:7b-instruct
```

### Slow Responses

**Problem:** The model is large and may be slow on older hardware.

**Solutions:**
1. Use a smaller model:
   ```bash
   ollama pull qwen2.5:3b-instruct
   ```
   Then update `.env`:
   ```
   OLLAMA_MODEL=qwen2.5:3b-instruct
   ```

2. Ensure you have enough RAM (7B models need ~8GB RAM)

3. Use GPU acceleration if available (Ollama automatically uses GPU if detected)

## Using Ollama with Docker

If you're running the app in Docker but Ollama is on your host machine:

1. Update `.env`:
   ```
   OLLAMA_BASE_URL=http://host.docker.internal:11434
   ```

2. Or use Docker network:
   - Add Ollama as a service in `docker-compose.yml`
   - Or connect containers to the same network

## Benefits of Ollama

✅ **Completely Free** - No API costs  
✅ **Privacy** - All processing happens locally  
✅ **No Rate Limits** - Use as much as you want  
✅ **Offline** - Works without internet (after model download)  
✅ **Fast** - No network latency for API calls  

## Next Steps

Once Ollama is set up:
1. Start your SmartPlanner AI app
2. Create a project
3. Upload a spec or add a description
4. Click "Generate with Ollama (Free)" - it should work!

For more information, visit: https://ollama.com

