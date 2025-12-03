"""
Pinecone service for storing and retrieving sprint embeddings
"""
from typing import List, Dict, Any, Optional
from pinecone import Pinecone, ServerlessSpec
from app.core.config import settings
import json
import logging
from langchain_openai import OpenAIEmbeddings

logger = logging.getLogger(__name__)

class PineconeService:
    """Service for managing Pinecone vector database"""
    
    def __init__(self):
        """Initialize Pinecone client"""
        if not settings.PINECONE_API_KEY or settings.PINECONE_API_KEY == "":
            raise ValueError("PINECONE_API_KEY is not set")
        
        self.pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        self.index_name = settings.PINECONE_INDEX_NAME
        self.embeddings = OpenAIEmbeddings(api_key=settings.OPENAI_API_KEY)
        
        # Initialize or get index
        self._ensure_index()
    
    def _ensure_index(self):
        """Ensure Pinecone index exists, create if not"""
        try:
            existing_indexes = [idx.name for idx in self.pc.list_indexes()]
            
            if self.index_name not in existing_indexes:
                logger.info(f"Creating Pinecone index: {self.index_name}")
                self.pc.create_index(
                    name=self.index_name,
                    dimension=1536,  # OpenAI embedding dimension
                    metric="cosine",
                    spec=ServerlessSpec(
                        cloud="aws",
                        region=settings.PINECONE_ENVIRONMENT
                    )
                )
                logger.info(f"Index {self.index_name} created successfully")
            else:
                logger.info(f"Index {self.index_name} already exists")
        except Exception as e:
            logger.error(f"Error ensuring index: {e}")
            raise
    
    def get_index(self):
        """Get the Pinecone index"""
        return self.pc.Index(self.index_name)
    
    async def store_sprint_embedding(
        self,
        sprint_id: int,
        project_id: int,
        sprint_data: Dict[str, Any],
        metadata: Optional[Dict[str, Any]] = None
    ):
        """
        Store sprint data as embedding in Pinecone
        """
        try:
            # Create text representation of sprint
            sprint_text = self._sprint_to_text(sprint_data)
            
            # Generate embedding
            embedding = await self.embeddings.aembed_query(sprint_text)
            
            # Prepare metadata
            vector_metadata = {
                "sprint_id": sprint_id,
                "project_id": project_id,
                "velocity": sprint_data.get("velocity", 0),
                "sprint_name": sprint_data.get("name", ""),
                **(metadata or {})
            }
            
            # Store in Pinecone
            index = self.get_index()
            index.upsert(
                vectors=[{
                    "id": f"sprint_{sprint_id}",
                    "values": embedding,
                    "metadata": vector_metadata
                }]
            )
            
            logger.info(f"Stored embedding for sprint {sprint_id}")
        except Exception as e:
            logger.error(f"Error storing sprint embedding: {e}")
            raise
    
    async def find_similar_sprints(
        self,
        query_text: str,
        project_id: Optional[int] = None,
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Find similar historical sprints using vector search
        """
        try:
            # Generate query embedding
            query_embedding = await self.embeddings.aembed_query(query_text)
            
            # Build filter
            filter_dict = {}
            if project_id:
                filter_dict["project_id"] = project_id
            
            # Search Pinecone
            index = self.get_index()
            results = index.query(
                vector=query_embedding,
                top_k=top_k,
                include_metadata=True,
                filter=filter_dict if filter_dict else None
            )
            
            # Format results
            similar_sprints = []
            for match in results.matches:
                similar_sprints.append({
                    "sprint_id": match.metadata.get("sprint_id"),
                    "velocity": match.metadata.get("velocity"),
                    "similarity": match.score,
                    "metadata": match.metadata
                })
            
            logger.info(f"Found {len(similar_sprints)} similar sprints")
            return similar_sprints
        except Exception as e:
            logger.error(f"Error finding similar sprints: {e}")
            return []
    
    async def predict_velocity(
        self,
        project_summary: str,
        project_id: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Predict sprint velocity based on similar historical sprints
        """
        try:
            # Find similar sprints
            similar_sprints = await self.find_similar_sprints(
                query_text=project_summary,
                project_id=project_id,
                top_k=10
            )
            
            if not similar_sprints:
                # Default velocity if no history
                return {
                    "predicted_velocity": 20.0,  # Default story points per sprint
                    "confidence": "low",
                    "based_on_sprints": 0
                }
            
            # Calculate average velocity from similar sprints
            velocities = [s["velocity"] for s in similar_sprints if s["velocity"]]
            avg_velocity = sum(velocities) / len(velocities) if velocities else 20.0
            
            # Weight by similarity
            weighted_sum = sum(s["velocity"] * s["similarity"] for s in similar_sprints if s["velocity"])
            similarity_sum = sum(s["similarity"] for s in similar_sprints)
            weighted_velocity = weighted_sum / similarity_sum if similarity_sum > 0 else avg_velocity
            
            confidence = "high" if len(similar_sprints) >= 5 else "medium" if len(similar_sprints) >= 2 else "low"
            
            return {
                "predicted_velocity": round(weighted_velocity, 2),
                "confidence": confidence,
                "based_on_sprints": len(similar_sprints),
                "similar_sprints": similar_sprints[:3]  # Top 3 for reference
            }
        except Exception as e:
            logger.error(f"Error predicting velocity: {e}")
            return {
                "predicted_velocity": 20.0,
                "confidence": "low",
                "based_on_sprints": 0
            }
    
    def _sprint_to_text(self, sprint_data: Dict[str, Any]) -> str:
        """Convert sprint data to text for embedding"""
        parts = [
            f"Sprint: {sprint_data.get('name', '')}",
            f"Velocity: {sprint_data.get('velocity', 0)}",
        ]
        
        if "tasks" in sprint_data:
            task_titles = [t.get("title", "") for t in sprint_data["tasks"]]
            parts.append(f"Tasks: {', '.join(task_titles)}")
        
        if "metadata" in sprint_data:
            parts.append(f"Metadata: {json.dumps(sprint_data['metadata'])}")
        
        return " | ".join(parts)

