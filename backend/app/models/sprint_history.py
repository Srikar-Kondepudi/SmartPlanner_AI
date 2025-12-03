"""
Sprint history model for velocity tracking
"""
from sqlalchemy import Column, Integer, Float, DateTime, Text, String
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class SprintHistory(Base):
    """Sprint history for velocity prediction"""
    __tablename__ = "sprint_history"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, nullable=False, index=True)
    sprint_name = Column(String, nullable=False)
    velocity = Column(Float, nullable=False)  # Actual velocity
    embedding = Column(Text, nullable=True)  # JSON string of embedding vector
    metadata_json = Column(Text, nullable=True)  # Additional metadata as JSON
    created_at = Column(DateTime, default=datetime.utcnow)

