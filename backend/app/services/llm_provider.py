"""
LLM Provider Abstraction Layer
Supports multiple LLM providers with a unified interface
"""
from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
import httpx
import json
import logging

logger = logging.getLogger(__name__)


class LLMProvider(ABC):
    """Base class for LLM providers"""
    
    @abstractmethod
    async def generate_text(
        self,
        messages: List[Dict[str, str]],
        options: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Generate text from messages
        
        Args:
            messages: List of message dicts with 'role' and 'content'
                     roles: "system", "user", "assistant"
            options: Optional provider-specific options
        
        Returns:
            Dict with 'text' and optional 'usage' keys
        """
        pass


class OllamaProvider(LLMProvider):
    """Ollama local LLM provider (default)"""
    
    def __init__(
        self,
        base_url: str = "http://localhost:11434",
        model: str = "qwen2.5:7b-instruct"
    ):
        self.base_url = base_url.rstrip('/')
        self.model = model
        self.client = httpx.AsyncClient(timeout=120.0)
    
    async def generate_text(
        self,
        messages: List[Dict[str, str]],
        options: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Generate text using Ollama Chat API"""
        options = options or {}
        
        # Convert messages to Ollama format
        ollama_messages = []
        for msg in messages:
            role = msg.get('role', 'user')
            content = msg.get('content', '')
            # Ollama uses 'system', 'user', 'assistant'
            ollama_messages.append({
                'role': role,
                'content': content
            })
        
        payload = {
            "model": options.get('model', self.model),
            "messages": ollama_messages,
            "stream": False
        }
        
        # Add optional parameters
        if 'temperature' in options:
            payload['options'] = {'temperature': options['temperature']}
        
        url = f"{self.base_url}/api/chat"
        
        try:
            logger.info(f"Calling Ollama at {url} with model {payload['model']}")
            response = await self.client.post(url, json=payload)
            response.raise_for_status()
            
            data = response.json()
            
            # Extract text from response
            text = data.get('message', {}).get('content', '')
            
            if not text:
                raise ValueError("Empty response from Ollama")
            
            return {
                'text': text,
                'usage': {
                    'prompt_tokens': data.get('prompt_eval_count', 0),
                    'completion_tokens': data.get('eval_count', 0),
                    'total_tokens': data.get('prompt_eval_count', 0) + data.get('eval_count', 0)
                }
            }
        
        except httpx.ConnectError:
            error_msg = (
                f"Could not connect to Ollama at {self.base_url}. "
                f"Please ensure Ollama is running and the model '{self.model}' is pulled. "
                f"Run: ollama pull {self.model}"
            )
            logger.error(error_msg)
            raise ConnectionError(error_msg)
        
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                error_msg = (
                    f"Model '{self.model}' not found. Please pull it first: "
                    f"ollama pull {self.model}"
                )
                logger.error(error_msg)
                raise ValueError(error_msg)
            raise
        
        except Exception as e:
            logger.error(f"Ollama API error: {e}")
            raise
    
    async def __aenter__(self):
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.client.aclose()


class OpenAIProvider(LLMProvider):
    """OpenAI provider (optional, requires API key)"""
    
    def __init__(self, api_key: str, model: str = "gpt-4o"):
        if not api_key:
            raise ValueError("OPENAI_API_KEY is required for OpenAI provider")
        self.api_key = api_key
        self.model = model
        self.client = httpx.AsyncClient(
            base_url="https://api.openai.com/v1",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            timeout=120.0
        )
    
    async def generate_text(
        self,
        messages: List[Dict[str, str]],
        options: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Generate text using OpenAI Chat API"""
        options = options or {}
        
        # Convert messages to OpenAI format
        openai_messages = []
        for msg in messages:
            role = msg.get('role', 'user')
            content = msg.get('content', '')
            # OpenAI uses 'system', 'user', 'assistant'
            openai_messages.append({
                'role': role,
                'content': content
            })
        
        payload = {
            "model": options.get('model', self.model),
            "messages": openai_messages,
            "temperature": options.get('temperature', 0.7)
        }
        
        try:
            logger.info(f"Calling OpenAI with model {payload['model']}")
            response = await self.client.post("/chat/completions", json=payload)
            response.raise_for_status()
            
            data = response.json()
            
            # Extract text and usage
            text = data['choices'][0]['message']['content']
            usage = data.get('usage', {})
            
            return {
                'text': text,
                'usage': {
                    'prompt_tokens': usage.get('prompt_tokens', 0),
                    'completion_tokens': usage.get('completion_tokens', 0),
                    'total_tokens': usage.get('total_tokens', 0)
                }
            }
        
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 401:
                error_msg = (
                    "OpenAI API key is invalid. Please check your OPENAI_API_KEY. "
                    "Alternatively, use Ollama (default) by setting LLM_PROVIDER=ollama"
                )
                logger.error(error_msg)
                raise ValueError(error_msg)
            
            elif e.response.status_code == 429:
                error_msg = (
                    "OpenAI API quota exceeded. Please check your billing at "
                    "https://platform.openai.com/account/billing or switch to Ollama "
                    "by setting LLM_PROVIDER=ollama"
                )
                logger.error(error_msg)
                raise ValueError(error_msg)
            
            raise
        
        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            raise
    
    async def __aenter__(self):
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.client.aclose()


class GroqProvider(LLMProvider):
    """Groq provider (FREE tier, no credit card required!)"""
    
    def __init__(self, api_key: str, model: str = "llama-3.1-70b-versatile"):
        if not api_key:
            raise ValueError("GROQ_API_KEY is required for Groq provider")
        self.api_key = api_key
        self.model = model
        self.client = httpx.AsyncClient(
            base_url="https://api.groq.com/openai/v1",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            timeout=120.0
        )
    
    async def generate_text(
        self,
        messages: List[Dict[str, str]],
        options: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Generate text using Groq API (OpenAI-compatible)"""
        options = options or {}
        
        # Convert messages to OpenAI format (Groq uses OpenAI-compatible API)
        groq_messages = []
        for msg in messages:
            role = msg.get('role', 'user')
            content = msg.get('content', '')
            groq_messages.append({
                'role': role,
                'content': content
            })
        
        payload = {
            "model": options.get('model', self.model),
            "messages": groq_messages,
            "temperature": options.get('temperature', 0.7)
        }
        
        try:
            logger.info(f"Calling Groq API with model {payload['model']}")
            response = await self.client.post("/chat/completions", json=payload)
            
            # Log response for debugging
            if response.status_code != 200:
                error_body = response.text
                logger.error(f"Groq API error {response.status_code}: {error_body}")
            
            response.raise_for_status()
            
            data = response.json()
            
            # Extract text and usage
            text = data['choices'][0]['message']['content']
            usage = data.get('usage', {})
            
            return {
                'text': text,
                'usage': {
                    'prompt_tokens': usage.get('prompt_tokens', 0),
                    'completion_tokens': usage.get('completion_tokens', 0),
                    'total_tokens': usage.get('total_tokens', 0)
                }
            }
        
        except httpx.HTTPStatusError as e:
            error_body = ""
            try:
                error_body = e.response.json()
            except:
                error_body = e.response.text
            
            if e.response.status_code == 400:
                error_msg = (
                    f"Groq API bad request: {error_body}. "
                    f"Check that the model '{payload['model']}' is valid. "
                    f"Valid models: llama-3.1-70b-versatile, llama-3.1-8b-instant, mixtral-8x7b-32768"
                )
                logger.error(error_msg)
                raise ValueError(error_msg)
            
            elif e.response.status_code == 401:
                error_msg = (
                    "Groq API key is invalid. Please check your GROQ_API_KEY. "
                    "Get a free API key at https://console.groq.com/keys"
                )
                logger.error(error_msg)
                raise ValueError(error_msg)
            
            elif e.response.status_code == 429:
                error_msg = (
                    "Groq API rate limit exceeded. Free tier has generous limits. "
                    "Please wait a moment and try again."
                )
                logger.error(error_msg)
                raise ValueError(error_msg)
            
            raise ValueError(f"Groq API error {e.response.status_code}: {error_body}")
        
        except Exception as e:
            logger.error(f"Groq API error: {e}")
            raise
    
    async def __aenter__(self):
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.client.aclose()


def get_provider(provider_name: str, **kwargs) -> LLMProvider:
    """
    Factory function to get the appropriate LLM provider
    
    Args:
        provider_name: 'ollama', 'openai', or 'groq'
        **kwargs: Provider-specific configuration
    
    Returns:
        LLMProvider instance
    """
    if provider_name == "ollama":
        return OllamaProvider(
            base_url=kwargs.get('ollama_base_url', 'http://localhost:11434'),
            model=kwargs.get('ollama_model', 'qwen2.5:7b-instruct')
        )
    
    elif provider_name == "openai":
        api_key = kwargs.get('openai_api_key')
        if not api_key:
            raise ValueError(
                "OPENAI_API_KEY is required for OpenAI provider. "
                "Use Ollama (default) by setting LLM_PROVIDER=ollama"
            )
        return OpenAIProvider(
            api_key=api_key,
            model=kwargs.get('openai_model', 'gpt-4o')
        )
    
    elif provider_name == "groq":
        api_key = kwargs.get('groq_api_key')
        if not api_key:
            raise ValueError(
                "GROQ_API_KEY is required for Groq provider. "
                "Get a free API key at https://console.groq.com/keys"
            )
        return GroqProvider(
            api_key=api_key,
            model=kwargs.get('groq_model', 'llama-3.1-70b-versatile')
        )
    
    else:
        raise ValueError(
            f"Unknown provider: {provider_name}. "
            f"Supported providers: 'ollama', 'openai', 'groq'"
        )

