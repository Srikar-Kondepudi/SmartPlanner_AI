"""
Project, Epic, Story, Task, and Sprint models
"""
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.core.database import Base

class TaskStatus(str, enum.Enum):
    """Task status enumeration"""
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    IN_REVIEW = "in_review"
    DONE = "done"

class Priority(str, enum.Enum):
    """Priority enumeration"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class Project(Base):
    """Project model"""
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    spec_content = Column(Text, nullable=True)  # Original spec document content
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    owner = relationship("User", back_populates="projects")
    epics = relationship("Epic", back_populates="project", cascade="all, delete-orphan")
    sprints = relationship("Sprint", back_populates="project", cascade="all, delete-orphan")

class Epic(Base):
    """Epic model"""
    __tablename__ = "epics"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    priority = Column(SQLEnum(Priority), default=Priority.MEDIUM)
    estimated_effort = Column(Float, nullable=True)  # Story points
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    project = relationship("Project", back_populates="epics")
    stories = relationship("Story", back_populates="epic", cascade="all, delete-orphan")

class Story(Base):
    """User story model"""
    __tablename__ = "stories"
    
    id = Column(Integer, primary_key=True, index=True)
    epic_id = Column(Integer, ForeignKey("epics.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    acceptance_criteria = Column(Text, nullable=True)
    priority = Column(SQLEnum(Priority), default=Priority.MEDIUM)
    estimated_effort = Column(Float, nullable=True)  # Story points
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    epic = relationship("Epic", back_populates="stories")
    tasks = relationship("Task", back_populates="story", cascade="all, delete-orphan")

class Task(Base):
    """Task model"""
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    story_id = Column(Integer, ForeignKey("stories.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(SQLEnum(TaskStatus), default=TaskStatus.TODO)
    priority = Column(SQLEnum(Priority), default=Priority.MEDIUM)
    estimated_hours = Column(Float, nullable=True)
    actual_hours = Column(Float, nullable=True)
    assignee = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    story = relationship("Story", back_populates="tasks")
    sprint = relationship("Sprint", secondary="sprint_tasks", back_populates="tasks")

class Sprint(Base):
    """Sprint model"""
    __tablename__ = "sprints"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    name = Column(String, nullable=False)
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    velocity = Column(Float, nullable=True)  # Predicted velocity
    actual_velocity = Column(Float, nullable=True)  # Actual velocity after completion
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    project = relationship("Project", back_populates="sprints")
    tasks = relationship("Task", secondary="sprint_tasks", back_populates="sprint")

# Association table for Sprint-Task many-to-many relationship
from sqlalchemy import Table
sprint_tasks = Table(
    "sprint_tasks",
    Base.metadata,
    Column("sprint_id", Integer, ForeignKey("sprints.id"), primary_key=True),
    Column("task_id", Integer, ForeignKey("tasks.id"), primary_key=True),
)

