"""
Sprint endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.auth import get_current_active_user
from app.models.user import User
from app.models.project import Project, Sprint
from app.schemas.project import SprintCreate, SprintResponse
from app.services.sprint_service import SprintService

router = APIRouter()

@router.post("/", response_model=SprintResponse, status_code=status.HTTP_201_CREATED)
async def create_sprint(
    project_id: int,
    sprint_data: SprintCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new sprint"""
    # Verify project ownership
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.owner_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Create sprint
    sprint_service = SprintService()
    sprint = await sprint_service.create_sprint(
        db=db,
        project_id=project_id,
        sprint_name=sprint_data.name,
        task_ids=sprint_data.task_ids,
        start_date=sprint_data.start_date.isoformat() if sprint_data.start_date else None,
        end_date=sprint_data.end_date.isoformat() if sprint_data.end_date else None
    )
    
    return sprint

@router.get("/project/{project_id}", response_model=List[SprintResponse])
async def list_sprints(
    project_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """List all sprints for a project"""
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.owner_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    sprints = db.query(Sprint).filter(Sprint.project_id == project_id).all()
    return sprints

@router.get("/{sprint_id}", response_model=SprintResponse)
async def get_sprint(
    sprint_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get a specific sprint"""
    sprint = db.query(Sprint).join(Project).filter(
        Sprint.id == sprint_id,
        Project.owner_id == current_user.id
    ).first()
    
    if not sprint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sprint not found"
        )
    
    return sprint

