"""
Application configuration using Pydantic settings
"""
from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    """Application settings"""
    
    # App
    APP_NAME: str = "SmartPlanner AI"
    APP_ENV: str = "development"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = ""  # Will be auto-provided by Railway when PostgreSQL is linked
    
    # JWT - support both JWT_SECRET and JWT_SECRET_KEY for compatibility
    JWT_SECRET: str = ""
    JWT_SECRET_KEY: str = ""  # Alternative name
    
    @property
    def jwt_secret_key(self) -> str:
        """Get JWT secret, supporting both variable names"""
        return self.JWT_SECRET or self.JWT_SECRET_KEY
    
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 24
    
    # OAuth
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI: str = "http://localhost:3000/auth/callback"
    
    # LLM Providers
    LLM_PROVIDER: str = "ollama"  # Default to Ollama (no tokens required)
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "qwen2.5:7b-instruct"
    
    # Optional: OpenAI (only needed if LLM_PROVIDER=openai)
    OPENAI_API_KEY: str = ""
    DEFAULT_MODEL: str = "gpt-4o"
    
    # Deprecated: Anthropic support removed
    ANTHROPIC_API_KEY: str = ""
    CLAUDE_MODEL: str = "claude-3-5-sonnet-20241022"
    
    # Pinecone (optional, for velocity prediction)
    PINECONE_API_KEY: str = ""
    PINECONE_ENVIRONMENT: str = "us-east-1-aws"
    PINECONE_INDEX_NAME: str = "smartplanner-sprints"
    
    # CORS
    CORS_ORIGINS: str = "http://localhost:3000"
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS_ORIGINS string into list"""
        if isinstance(self.CORS_ORIGINS, str):
            return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]
        return self.CORS_ORIGINS if isinstance(self.CORS_ORIGINS, list) else ["http://localhost:3000"]
    
    # OpenTelemetry
    OTEL_ENABLED: bool = True
    OTEL_SERVICE_NAME: str = "smartplanner-backend"
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "allow"  # Allow extra environment variables for flexibility

settings = Settings()

# Validate required settings at startup (but allow graceful failure for Railway to show better errors)
def validate_settings():
    """Validate that required settings are present"""
    errors = []
    
    if not settings.DATABASE_URL:
        errors.append("DATABASE_URL is required. Make sure PostgreSQL service is linked in Railway. Go to: Backend Service → Settings → Variables → Add Reference → Select PostgreSQL → Select DATABASE_URL")
    
    if not settings.jwt_secret_key:
        errors.append("JWT_SECRET or JWT_SECRET_KEY is required. Set one of these in Railway environment variables.")
    
    if errors:
        error_msg = "❌ Missing required environment variables:\n\n" + "\n".join(f"  • {e}" for e in errors)
        error_msg += "\n\n📖 See LINK_DATABASE_RAILWAY.md for detailed instructions."
        raise ValueError(error_msg)

# Validate on import (but allow for testing)
try:
    validate_settings()
except ValueError as e:
    import sys
    if "pytest" not in sys.modules:  # Don't fail during tests
        print("\n" + "="*60)
        print(str(e))
        print("="*60 + "\n")
        raise

