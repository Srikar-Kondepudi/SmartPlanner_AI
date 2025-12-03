#!/usr/bin/env python3
"""
Script to create a test user in the database
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.models.user import User
from app.core.auth import get_password_hash

def create_test_user():
    """Create a test user"""
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == "test@smartplanner.ai").first()
        if existing_user:
            print("✅ Test user already exists!")
            print(f"   Email: test@smartplanner.ai")
            print(f"   Password: Test123!")
            return
        
        # Create test user
        test_user = User(
            email="test@smartplanner.ai",
            hashed_password=get_password_hash("Test123!"),
            full_name="Test User",
            is_active=True,
            is_admin=False
        )
        
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        
        print("✅ Test user created successfully!")
        print("\n📧 Login Credentials:")
        print("   Email: test@smartplanner.ai")
        print("   Password: Test123!")
        print("\nYou can now use these credentials to login at http://localhost:3000/login")
        
    except Exception as e:
        print(f"❌ Error creating test user: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user()

