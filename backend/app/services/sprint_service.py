"""
Sprint service - orchestrates LLM pipelines for sprint planning
"""
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.project import Project, Epic, Story, Task, Sprint
from app.services.llm_service import LLMService
from app.services.pinecone_service import PineconeService
import logging
import json
import asyncio

logger = logging.getLogger(__name__)

class SprintService:
    """Service for sprint planning orchestration"""
    
    def __init__(self):
        self.llm_service = LLMService()
        try:
            self.pinecone_service = PineconeService()
        except Exception as e:
            logger.warning(f"Pinecone service initialization failed: {e}. Velocity prediction will be disabled.")
            self.pinecone_service = None
    
    async def process_spec_to_sprint_plan(
        self,
        db: Session,
        project_id: int,
        spec_content: str,
        llm_provider: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Complete pipeline: Spec → Epics → Stories → Tasks → Sprint Plan
        """
        try:
            project = db.query(Project).filter(Project.id == project_id).first()
            if not project:
                raise ValueError(f"Project {project_id} not found")
            
            # Step 1: Extract Epics
            logger.info("Step 1: Extracting epics from spec")
            epics_data = await self.llm_service.extract_epics(spec_content, llm_provider)
            
            # Create epics in database
            created_epics = []
            for epic_data in epics_data:
                epic = Epic(
                    project_id=project_id,
                    title=epic_data["title"],
                    description=epic_data.get("description", ""),
                    priority=epic_data.get("priority", "medium"),
                    estimated_effort=epic_data.get("estimated_effort", 0)
                )
                db.add(epic)
                db.flush()
                created_epics.append(epic)
            
            db.commit()
            logger.info(f"Created {len(created_epics)} epics")
            
            # Step 2: Generate Stories for each Epic
            logger.info("Step 2: Generating stories from epics")
            all_stories = []
            for epic in created_epics:
                epic_description = f"{epic.title}: {epic.description}"
                stories_data = await self.llm_service.generate_stories(epic_description, llm_provider)
                # Small delay to avoid hitting rate limits (Groq free tier: 6000 tokens/minute)
                await asyncio.sleep(0.5)
                
                for story_data in stories_data:
                    story = Story(
                        epic_id=epic.id,
                        title=story_data["title"],
                        description=story_data.get("description", ""),
                        acceptance_criteria=story_data.get("acceptance_criteria", ""),
                        priority=story_data.get("priority", "medium"),
                        estimated_effort=story_data.get("estimated_effort", 0)
                    )
                    db.add(story)
                    db.flush()
                    all_stories.append(story)
            
            db.commit()
            logger.info(f"Created {len(all_stories)} stories")
            
            # Step 3: Generate Tasks for each Story
            logger.info("Step 3: Generating tasks from stories")
            all_tasks = []
            for story in all_stories:
                tasks_data = await self.llm_service.generate_tasks(
                    story.description,
                    story.acceptance_criteria or "",
                    llm_provider
                )
                # Small delay to avoid hitting rate limits (Groq free tier: 6000 tokens/minute)
                await asyncio.sleep(0.3)
                
                for task_data in tasks_data:
                    task = Task(
                        story_id=story.id,
                        title=task_data["title"],
                        description=task_data.get("description", ""),
                        estimated_hours=task_data.get("estimated_hours", 0),
                        priority=task_data.get("priority", "medium")
                    )
                    db.add(task)
                    db.flush()
                    all_tasks.append(task)
            
            db.commit()
            logger.info(f"Created {len(all_tasks)} tasks")
            
            # Step 4: Predict velocity and estimate timeline
            logger.info("Step 4: Predicting velocity and estimating timeline")
            total_effort = sum(epic.estimated_effort or 0 for epic in created_epics)
            
            # Try to predict velocity using Pinecone, fallback to default if unavailable
            if self.pinecone_service:
                try:
                    project_summary = f"{project.name}: {project.description or ''}"
                    velocity_prediction = await self.pinecone_service.predict_velocity(
                        project_summary,
                        project_id
                    )
                    predicted_velocity = velocity_prediction.get("predicted_velocity", 20.0)
                except Exception as e:
                    logger.warning(f"Pinecone velocity prediction failed: {e}. Using default velocity.")
                    predicted_velocity = 20.0
                    velocity_prediction = {"predicted_velocity": 20.0, "confidence": "low", "reason": "Pinecone unavailable"}
            else:
                predicted_velocity = 20.0  # Default velocity
                velocity_prediction = {"predicted_velocity": 20.0, "confidence": "low", "reason": "Pinecone not configured"}
            
            estimated_sprints = max(1, int(total_effort / predicted_velocity) if predicted_velocity > 0 else 1)
            
            timeline = await self.llm_service.estimate_timeline(
                f"Total effort: {total_effort} story points. Predicted velocity: {predicted_velocity}",
                historical_context=json.dumps(velocity_prediction),
                provider=llm_provider
            )
            
            # Step 5: Create Sprint Plan
            sprint_plan = {
                "project_id": project_id,
                "epics": len(created_epics),
                "stories": len(all_stories),
                "tasks": len(all_tasks),
                "total_effort": total_effort,
                "predicted_velocity": predicted_velocity,
                "estimated_sprints": estimated_sprints,
                "timeline": timeline,
                "velocity_prediction": velocity_prediction
            }
            
            logger.info("Sprint plan generation completed")
            return sprint_plan
            
        except Exception as e:
            logger.error(f"Error processing spec to sprint plan: {e}")
            db.rollback()
            raise
    
    async def create_sprint(
        self,
        db: Session,
        project_id: int,
        sprint_name: str,
        task_ids: List[int],
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> Sprint:
        """Create a sprint and assign tasks"""
        try:
            # Get tasks
            tasks = db.query(Task).filter(Task.id.in_(task_ids)).all()
            if not tasks:
                raise ValueError("No tasks found")
            
            # Calculate sprint velocity (sum of story points from stories)
            total_effort = sum(
                task.story.estimated_effort or 0 
                for task in tasks 
                if task.story
            )
            
            # Create sprint
            sprint = Sprint(
                project_id=project_id,
                name=sprint_name,
                velocity=total_effort,
                start_date=start_date,
                end_date=end_date
            )
            db.add(sprint)
            db.flush()
            
            # Assign tasks to sprint
            sprint.tasks = tasks
            db.commit()
            
            # Store sprint embedding in Pinecone (if available)
            if self.pinecone_service:
                try:
                    sprint_data = {
                        "name": sprint_name,
                        "velocity": total_effort,
                        "tasks": [{"title": t.title} for t in tasks]
                    }
                    await self.pinecone_service.store_sprint_embedding(
                        sprint.id,
                        project_id,
                        sprint_data
                    )
                except Exception as e:
                    logger.warning(f"Failed to store sprint embedding in Pinecone: {e}")
            
            logger.info(f"Created sprint {sprint.id}")
            return sprint
            
        except Exception as e:
            logger.error(f"Error creating sprint: {e}")
            db.rollback()
            raise

