#!/usr/bin/env python3
"""
Smoke test script for LLM provider
Tests the configured LLM provider with a simple prompt
"""
import asyncio
import sys
import os
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.services.llm_provider import get_provider
from app.core.config import settings


async def test_provider():
    """Test the LLM provider with a simple prompt"""
    print(f"Testing LLM Provider: {settings.LLM_PROVIDER}")
    print(f"Model: {settings.OLLAMA_MODEL if settings.LLM_PROVIDER == 'ollama' else settings.DEFAULT_MODEL}")
    print("-" * 60)
    
    try:
        # Get provider
        if settings.LLM_PROVIDER == "ollama":
            provider = get_provider(
                "ollama",
                ollama_base_url=settings.OLLAMA_BASE_URL,
                ollama_model=settings.OLLAMA_MODEL
            )
        elif settings.LLM_PROVIDER == "openai":
            if not settings.OPENAI_API_KEY:
                print("ERROR: OPENAI_API_KEY is required for OpenAI provider")
                print("Set LLM_PROVIDER=ollama to use Ollama (default, no tokens)")
                return 1
            provider = get_provider(
                "openai",
                openai_api_key=settings.OPENAI_API_KEY,
                openai_model=settings.DEFAULT_MODEL
            )
        else:
            print(f"ERROR: Unknown provider: {settings.LLM_PROVIDER}")
            return 1
        
        # Test prompt
        messages = [
            {
                "role": "system",
                "content": "You are a helpful assistant."
            },
            {
                "role": "user",
                "content": "Say 'Hello, SmartPlanner AI!' and briefly explain what you can do for sprint planning."
            }
        ]
        
        print("Sending test prompt...")
        result = await provider.generate_text(messages)
        
        print("\n✅ SUCCESS!")
        print("-" * 60)
        print("Response:")
        print(result['text'])
        print("-" * 60)
        
        if 'usage' in result:
            usage = result['usage']
            print(f"Usage: {usage.get('total_tokens', 'N/A')} tokens")
        
        return 0
    
    except ConnectionError as e:
        print(f"\n❌ CONNECTION ERROR: {e}")
        print("\nFor Ollama:")
        print("  1. Install Ollama: https://ollama.com")
        print(f"  2. Pull the model: ollama pull {settings.OLLAMA_MODEL}")
        print("  3. Start Ollama: ollama serve")
        return 1
    
    except ValueError as e:
        print(f"\n❌ CONFIGURATION ERROR: {e}")
        return 1
    
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    exit_code = asyncio.run(test_provider())
    sys.exit(exit_code)

