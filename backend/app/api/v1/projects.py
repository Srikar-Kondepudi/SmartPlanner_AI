"""
Project endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.auth import get_current_active_user
from app.models.user import User
from app.models.project import Project, Epic, Story, Task
from app.schemas.project import (
    ProjectCreate, ProjectResponse,
    EpicResponse, StoryResponse, TaskResponse
)
from app.services.sprint_service import SprintService
from app.utils.file_parser import parse_uploaded_file
from app.utils.export import export_sprint_plan_to_pdf, export_sprint_plan_to_csv, format_for_jira
from app.core.config import settings
from fastapi.responses import Response
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

"""
Note on routing:
- We support BOTH \"/projects\" and \"/projects/\" to avoid 405 Method Not
  Allowed issues caused by subtle trailing-slash differences on some hosts.
"""

@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_data: ProjectCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new project"""
    project = Project(
        name=project_data.name,
        description=project_data.description,
        owner_id=current_user.id
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.get("", response_model=List[ProjectResponse])
async def list_projects(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """List all projects for current user"""
    projects = db.query(Project).filter(Project.owner_id == current_user.id).all()
    return projects

@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get a specific project"""
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.owner_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    return project

@router.post("/{project_id}/upload-spec")
async def upload_spec(
    project_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Upload product specification document"""
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.owner_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Parse uploaded file
    spec_content = await parse_uploaded_file(file)
    
    # Store spec content
    project.spec_content = spec_content
    db.commit()
    
    return {"message": "Spec uploaded successfully", "content_length": len(spec_content)}

@router.post("/{project_id}/generate-sprint-plan")
async def generate_sprint_plan(
    project_id: int,
    llm_provider: str = "ollama",  # Default to Ollama (no tokens required)
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Generate sprint plan from project spec"""
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.owner_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Use spec_content if available, otherwise use description
    spec_content = project.spec_content
    if not spec_content and project.description:
        spec_content = project.description
        logger.info(f"Using project description as spec content for project {project_id}")
    
    if not spec_content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No spec content or description found. Please upload a spec or add a project description first."
        )
    
    # Generate sprint plan using SprintService
    try:
        sprint_service = SprintService()
        sprint_plan = await sprint_service.process_spec_to_sprint_plan(
            db=db,
            project_id=project_id,
            spec_content=spec_content,
            llm_provider=llm_provider
        )
        return sprint_plan
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Error generating sprint plan: {error_msg}")
        
        # Check for Ollama connection errors
        if "Could not connect to Ollama" in error_msg or "ConnectionError" in error_msg:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"{error_msg}. Please ensure Ollama is running: 'ollama serve' and the model is pulled: 'ollama pull {settings.OLLAMA_MODEL}'"
            )
        # Check for model not found errors
        elif "not found" in error_msg.lower() and "model" in error_msg.lower():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"{error_msg}. Run: ollama pull {settings.OLLAMA_MODEL}"
            )
        # Check for quota/rate limit errors (OpenAI)
        elif "429" in error_msg or "quota" in error_msg.lower() or "insufficient_quota" in error_msg:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail="OpenAI API quota exceeded. Please check your billing at https://platform.openai.com/account/billing or switch to Ollama (default, no tokens) by setting llm_provider=ollama"
            )
        # Check for API key errors (OpenAI)
        elif "API key" in error_msg or "AuthenticationError" in error_msg or "401" in error_msg:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="OpenAI API key is invalid or not configured. Please check your OPENAI_API_KEY in the .env file, or use Ollama (default) by setting llm_provider=ollama"
            )
        elif "Pinecone" in error_msg:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Pinecone configuration error. Sprint plan generation will continue without velocity prediction."
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to generate sprint plan: {error_msg}"
            )

@router.get("/{project_id}/epics", response_model=List[EpicResponse])
async def list_epics(
    project_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """List all epics for a project"""
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.owner_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    epics = db.query(Epic).filter(Epic.project_id == project_id).all()
    return epics

@router.get("/{project_id}/stories", response_model=List[StoryResponse])
async def list_stories(
    project_id: int,
    epic_id: int = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """List all stories for a project or epic"""
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.owner_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    query = db.query(Story).join(Epic).filter(Epic.project_id == project_id)
    if epic_id:
        query = query.filter(Story.epic_id == epic_id)
    
    stories = query.all()
    return stories

@router.get("/{project_id}/tasks", response_model=List[TaskResponse])
async def list_tasks(
    project_id: int,
    story_id: int = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """List all tasks for a project or story"""
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.owner_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    query = db.query(Task).join(Story).join(Epic).filter(Epic.project_id == project_id)
    if story_id:
        query = query.filter(Task.story_id == story_id)
    
    tasks = query.all()
    return tasks

@router.get("/{project_id}/export/pdf")
async def export_pdf(
    project_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Export sprint plan as PDF"""
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.owner_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Get all data
    epics = db.query(Epic).filter(Epic.project_id == project_id).all()
    stories = db.query(Story).join(Epic).filter(Epic.project_id == project_id).all()
    tasks = db.query(Task).join(Story).join(Epic).filter(Epic.project_id == project_id).all()
    
    # Create sprint plan summary
    total_effort = sum(epic.estimated_effort or 0 for epic in epics)
    sprint_plan = {
        "epics": len(epics),
        "stories": len(stories),
        "tasks": len(tasks),
        "total_effort": total_effort,
        "predicted_velocity": 20.0,  # Default, should come from velocity prediction
        "estimated_sprints": max(1, int(total_effort / 20)),
        "timeline": {}
    }
    
    # Generate PDF
    pdf_content = export_sprint_plan_to_pdf(sprint_plan)
    
    return Response(
        content=pdf_content,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=sprint_plan_{project_id}.pdf"}
    )

@router.get("/{project_id}/export/csv")
async def export_csv(
    project_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Export sprint plan as CSV"""
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.owner_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Get all data
    epics = db.query(Epic).filter(Epic.project_id == project_id).all()
    stories = db.query(Story).join(Epic).filter(Epic.project_id == project_id).all()
    tasks = db.query(Task).join(Story).join(Epic).filter(Epic.project_id == project_id).all()
    
    # Convert to dict format
    epics_dict = [{"title": e.title, "description": e.description, "priority": e.priority, "estimated_effort": e.estimated_effort} for e in epics]
    stories_dict = [{"title": s.title, "description": s.description, "acceptance_criteria": s.acceptance_criteria, "priority": s.priority, "estimated_effort": s.estimated_effort} for s in stories]
    tasks_dict = [{"title": t.title, "description": t.description, "status": t.status, "priority": t.priority, "estimated_hours": t.estimated_hours} for t in tasks]
    
    total_effort = sum(epic.estimated_effort or 0 for epic in epics)
    sprint_plan = {
        "epics": len(epics),
        "stories": len(stories),
        "tasks": len(tasks),
        "total_effort": total_effort,
        "predicted_velocity": 20.0,
        "estimated_sprints": max(1, int(total_effort / 20))
    }
    
    # Generate CSV
    csv_content = export_sprint_plan_to_csv(sprint_plan, epics_dict, stories_dict, tasks_dict)
    
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=sprint_plan_{project_id}.csv"}
    )

@router.get("/{project_id}/export/jira")
async def export_jira(
    project_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Export sprint plan in JIRA-compatible CSV format"""
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.owner_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Get all data
    epics = db.query(Epic).filter(Epic.project_id == project_id).all()
    stories = db.query(Story).join(Epic).filter(Epic.project_id == project_id).all()
    tasks = db.query(Task).join(Story).join(Epic).filter(Epic.project_id == project_id).all()
    
    # Convert to dict format
    epics_dict = [{"title": e.title, "description": e.description, "priority": e.priority, "estimated_effort": e.estimated_effort} for e in epics]
    stories_dict = [{"title": s.title, "description": s.description, "acceptance_criteria": s.acceptance_criteria, "priority": s.priority, "estimated_effort": s.estimated_effort} for s in stories]
    tasks_dict = [{"title": t.title, "description": t.description, "status": t.status, "priority": t.priority, "estimated_hours": t.estimated_hours} for t in tasks]
    
    # Generate JIRA CSV
    jira_csv = format_for_jira({}, epics_dict, stories_dict, tasks_dict)
    
    return Response(
        content=jira_csv,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=jira_import_{project_id}.csv"}
    )

