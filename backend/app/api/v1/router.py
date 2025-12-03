"""
Main API router
"""
from fastapi import APIRouter
from app.api.v1 import auth, projects, sprints

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(sprints.router, prefix="/sprints", tags=["sprints"])

