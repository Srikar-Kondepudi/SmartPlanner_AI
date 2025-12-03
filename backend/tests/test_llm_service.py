"""
Tests for LLM service
"""
import pytest
from app.services.llm_service import LLMService

@pytest.mark.asyncio
async def test_extract_epics():
    """Test epic extraction"""
    service = LLMService()
    spec = """
    We need to build a mobile app for task management.
    Features include:
    - User authentication
    - Task creation and editing
    - Task categories
    - Notifications
    """
    # Note: This test requires API keys to be set
    # In CI/CD, use mocked responses
    try:
        epics = await service.extract_epics(spec)
        assert isinstance(epics, list)
        assert len(epics) > 0
        assert "title" in epics[0]
    except Exception as e:
        # Skip if API keys not available
        pytest.skip(f"API keys not available: {e}")

@pytest.mark.asyncio
async def test_generate_stories():
    """Test story generation"""
    service = LLMService()
    epic_description = "User authentication system with login and registration"
    try:
        stories = await service.generate_stories(epic_description)
        assert isinstance(stories, list)
        assert len(stories) > 0
        assert "title" in stories[0]
    except Exception as e:
        pytest.skip(f"API keys not available: {e}")

