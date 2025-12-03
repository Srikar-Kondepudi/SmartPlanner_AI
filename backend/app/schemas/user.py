"""
User schemas
"""
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    """Schema for user creation"""
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class UserResponse(BaseModel):
    """Schema for user response"""
    id: int
    email: str
    full_name: Optional[str]
    is_active: bool
    is_admin: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    """Schema for authentication token"""
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    """Schema for token data"""
    user_id: Optional[int] = None

