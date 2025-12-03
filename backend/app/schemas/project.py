"""
Project schemas
"""
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

# Project Schemas
class ProjectCreate(BaseModel):
    """Schema for project creation"""
    name: str
    description: Optional[str] = None

class ProjectResponse(BaseModel):
    """Schema for project response"""
    id: int
    name: str
    description: Optional[str]
    owner_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Epic Schemas
class EpicCreate(BaseModel):
    """Schema for epic creation"""
    title: str
    description: Optional[str] = None
    priority: Optional[str] = "medium"
    estimated_effort: Optional[float] = None

class EpicResponse(BaseModel):
    """Schema for epic response"""
    id: int
    project_id: int
    title: str
    description: Optional[str]
    priority: str
    estimated_effort: Optional[float]
    created_at: datetime
    
    class Config:
        from_attributes = True

# Story Schemas
class StoryResponse(BaseModel):
    """Schema for story response"""
    id: int
    epic_id: int
    title: str
    description: Optional[str]
    acceptance_criteria: Optional[str]
    priority: str
    estimated_effort: Optional[float]
    created_at: datetime
    
    class Config:
        from_attributes = True

# Task Schemas
class TaskResponse(BaseModel):
    """Schema for task response"""
    id: int
    story_id: int
    title: str
    description: Optional[str]
    status: str
    priority: str
    estimated_hours: Optional[float]
    actual_hours: Optional[float]
    assignee: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

# Sprint Schemas
class SprintCreate(BaseModel):
    """Schema for sprint creation"""
    name: str
    task_ids: List[int]
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

class SprintResponse(BaseModel):
    """Schema for sprint response"""
    id: int
    project_id: int
    name: str
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    velocity: Optional[float]
    actual_velocity: Optional[float]
    created_at: datetime
    
    class Config:
        from_attributes = True

# Sprint Plan Schema
class SprintPlanResponse(BaseModel):
    """Schema for complete sprint plan response"""
    project_id: int
    epics: int
    stories: int
    tasks: int
    total_effort: float
    predicted_velocity: float
    estimated_sprints: int
    timeline: Dict[str, Any]
    velocity_prediction: Dict[str, Any]

