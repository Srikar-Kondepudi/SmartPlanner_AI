"""
LLM abstraction layer using provider abstraction
Supports Ollama (default) and OpenAI (optional)
"""
from typing import List, Dict, Any, Optional
from app.core.config import settings
from app.services.llm_provider import get_provider, LLMProvider
import json
import logging

logger = logging.getLogger(__name__)

class LLMService:
    """Unified LLM service abstraction layer"""
    
    def __init__(self):
        """Initialize LLM provider"""
        self.default_provider_name = settings.LLM_PROVIDER
        
        # Initialize default provider
        try:
            self.default_provider = self._get_provider(self.default_provider_name)
            logger.info(f"Initialized LLM provider: {self.default_provider_name}")
        except Exception as e:
            logger.error(f"Failed to initialize LLM provider {self.default_provider_name}: {e}")
            # Fallback to Ollama if default fails
            if self.default_provider_name != "ollama":
                logger.warning("Falling back to Ollama provider")
                self.default_provider_name = "ollama"
                self.default_provider = self._get_provider("ollama")
            else:
                raise
    
    def _get_provider(self, provider_name: Optional[str] = None) -> LLMProvider:
        """Get the appropriate LLM provider"""
        provider_name = provider_name or self.default_provider_name
        
        if provider_name == "ollama":
            return get_provider(
                "ollama",
                ollama_base_url=settings.OLLAMA_BASE_URL,
                ollama_model=settings.OLLAMA_MODEL
            )
        elif provider_name == "openai":
            if not settings.OPENAI_API_KEY:
                raise ValueError(
                    "OPENAI_API_KEY is required for OpenAI provider. "
                    "Use Ollama (default) by setting LLM_PROVIDER=ollama"
                )
            return get_provider(
                "openai",
                openai_api_key=settings.OPENAI_API_KEY,
                openai_model=settings.DEFAULT_MODEL
            )
        elif provider_name == "anthropic":
            # Keep Anthropic support for backward compatibility
            # But recommend using Ollama or OpenAI
            logger.warning(
                "Anthropic provider is deprecated. "
                "Please use 'ollama' (default) or 'openai' instead."
            )
            raise ValueError(
                "Anthropic provider is no longer supported. "
                "Please use 'ollama' (default) or 'openai' instead."
            )
        else:
            raise ValueError(
                f"Unknown provider: {provider_name}. "
                f"Supported providers: 'ollama', 'openai'"
            )
    
    async def _call_provider(
        self,
        messages: List[Dict[str, str]],
        provider: Optional[str] = None,
        temperature: float = 0.7
    ) -> str:
        """Call the LLM provider and return text"""
        provider_instance = self._get_provider(provider) if provider else self.default_provider
        
        try:
            result = await provider_instance.generate_text(
                messages,
                options={'temperature': temperature}
            )
            return result['text']
        except Exception as e:
            logger.error(f"LLM provider error: {e}")
            raise
    
    async def extract_epics(self, spec_content: str, provider: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Extract epics from product specification
        """
        system_prompt = """You are an expert product manager and agile coach. 
        Your task is to analyze a product specification document and extract high-level epics.
        
        An epic is a large body of work that can be broken down into smaller user stories.
        Each epic should have:
        - A clear, descriptive title
        - A detailed description
        - A priority level (low, medium, high, critical)
        - An initial effort estimate in story points (1-100)
        
        Return your response as a JSON array of epics with the following structure:
        [
            {
                "title": "Epic Title",
                "description": "Detailed description of the epic",
                "priority": "high",
                "estimated_effort": 13
            }
        ]
        
        Be thorough but focused. Extract 3-10 epics depending on the scope of the specification."""
        
        human_prompt = f"""Analyze the following product specification and extract epics:
        
        {spec_content}
        
        Return only valid JSON array, no additional text."""
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": human_prompt}
        ]
        
        try:
            content = await self._call_provider(messages, provider)
            
            # Extract JSON from response (handle markdown code blocks)
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            
            epics = json.loads(content)
            logger.info(f"Extracted {len(epics)} epics")
            return epics
        except Exception as e:
            logger.error(f"Error extracting epics: {e}")
            raise
    
    async def generate_stories(self, epic_description: str, provider: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Generate user stories from an epic description
        """
        system_prompt = """You are an expert agile coach. Your task is to break down an epic into user stories.
        
        Each user story should follow the format: "As a [user type], I want [goal] so that [benefit]"
        Each story should have:
        - A clear title
        - A detailed description
        - Acceptance criteria (3-5 bullet points)
        - A priority level (low, medium, high, critical)
        - An estimated effort in story points (1-13, using Fibonacci sequence)
        
        Return your response as a JSON array:
        [
            {
                "title": "Story Title",
                "description": "As a user, I want...",
                "acceptance_criteria": "1. Criterion 1\\n2. Criterion 2",
                "priority": "medium",
                "estimated_effort": 5
            }
        ]"""
        
        human_prompt = f"""Break down the following epic into user stories:
        
        {epic_description}
        
        Return only valid JSON array, no additional text."""
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": human_prompt}
        ]
        
        try:
            content = await self._call_provider(messages, provider)
            
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            
            stories = json.loads(content)
            logger.info(f"Generated {len(stories)} stories from epic")
            return stories
        except Exception as e:
            logger.error(f"Error generating stories: {e}")
            raise
    
    async def generate_tasks(self, story_description: str, acceptance_criteria: str, provider: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Generate tasks from a user story
        """
        system_prompt = """You are an expert technical lead. Your task is to break down a user story into specific, actionable tasks.
        
        Each task should be:
        - Specific and actionable (can be completed by one developer in 1-8 hours)
        - Have a clear title
        - Have a description explaining what needs to be done
        - Have an estimated time in hours
        - Have a priority level
        
        Tasks typically include: design, implementation, testing, documentation, code review, deployment.
        
        Return your response as a JSON array:
        [
            {
                "title": "Task Title",
                "description": "Detailed task description",
                "estimated_hours": 4,
                "priority": "medium"
            }
        ]"""
        
        human_prompt = f"""Break down the following user story into tasks:
        
        Story: {story_description}
        Acceptance Criteria: {acceptance_criteria}
        
        Return only valid JSON array, no additional text."""
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": human_prompt}
        ]
        
        try:
            content = await self._call_provider(messages, provider)
            
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            
            tasks = json.loads(content)
            logger.info(f"Generated {len(tasks)} tasks from story")
            return tasks
        except Exception as e:
            logger.error(f"Error generating tasks: {e}")
            raise
    
    async def estimate_timeline(self, project_summary: str, historical_context: Optional[str] = None, provider: Optional[str] = None) -> Dict[str, Any]:
        """
        Estimate project timeline based on effort and historical velocity
        """
        system_prompt = """You are an expert project manager. Your task is to estimate project timelines.
        
        Based on the total effort (story points) and historical velocity data, estimate:
        - Number of sprints needed
        - Sprint duration (typically 2 weeks)
        - Start and end dates
        - Risk factors
        
        Return your response as JSON:
        {
            "estimated_sprints": 4,
            "sprint_duration_weeks": 2,
            "estimated_start_date": "2024-01-01",
            "estimated_end_date": "2024-02-26",
            "confidence_level": "high",
            "risk_factors": ["Risk 1", "Risk 2"]
        }"""
        
        context = f"\nHistorical Context:\n{historical_context}" if historical_context else ""
        
        human_prompt = f"""Estimate the timeline for this project:
        
        {project_summary}
        {context}
        
        Return only valid JSON, no additional text."""
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": human_prompt}
        ]
        
        try:
            content = await self._call_provider(messages, provider)
            
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            
            timeline = json.loads(content)
            logger.info("Generated timeline estimate")
            return timeline
        except Exception as e:
            logger.error(f"Error estimating timeline: {e}")
            raise
    
    async def groom_backlog(self, backlog_items: List[Dict[str, Any]], provider: Optional[str] = None) -> Dict[str, Any]:
        """
        Groom backlog - prioritize and refine items
        """
        system_prompt = """You are an expert product owner. Your task is to groom a product backlog.
        
        Analyze the backlog items and:
        - Suggest priority adjustments
        - Identify dependencies
        - Suggest effort estimate refinements
        - Identify potential risks or blockers
        
        Return your response as JSON:
        {
            "prioritized_items": [...],
            "dependencies": [...],
            "recommendations": "..."
        }"""
        
        human_prompt = f"""Groom the following backlog:
        
        {json.dumps(backlog_items, indent=2)}
        
        Return only valid JSON, no additional text."""
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": human_prompt}
        ]
        
        try:
            content = await self._call_provider(messages, provider)
            
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            
            groomed = json.loads(content)
            logger.info("Backlog grooming completed")
            return groomed
        except Exception as e:
            logger.error(f"Error grooming backlog: {e}")
            raise
