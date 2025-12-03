# SmartPlanner AI - Setup Guide

## Prerequisites

Before starting, ensure you have:

1. **Docker & Docker Compose** installed
2. **API Keys** for:
   - OpenAI (for GPT-4o)
   - Anthropic (for Claude 3.5 Sonnet)
   - Pinecone (for vector database)

## Step-by-Step Setup

### 1. Clone and Navigate
```bash
cd "ai resume project 1"
```

### 2. Configure Environment Variables

Create `backend/.env` file:
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and add your API keys:
```env
OPENAI_API_KEY=sk-your-key-here
ANTHROPIC_API_KEY=sk-ant-your-key-here
PINECONE_API_KEY=your-pinecone-key-here
PINECONE_ENVIRONMENT=us-east-1-aws
JWT_SECRET=your-secret-key-here
```

### 3. Start Services

```bash
docker-compose up --build
```

This will:
- Start PostgreSQL database
- Start FastAPI backend on port 8000
- Start Next.js frontend on port 3000
- Create database tables automatically

### 4. Verify Installation

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

### 5. Create Your First Account

1. Go to http://localhost:3000/register
2. Create an account
3. You'll be automatically logged in

### 6. Test the Workflow

1. **Create a Project**:
   - Click "New Project" in dashboard
   - Enter project name and description

2. **Upload a Spec**:
   - Open your project
   - Click "Upload Spec"
   - Upload a PDF, DOCX, or text file
   - See `examples/example_spec.txt` for format

3. **Generate Sprint Plan**:
   - Click "Generate Sprint Plan"
   - Wait for AI processing (may take 1-2 minutes)
   - View the generated epics, stories, and tasks

4. **Export**:
   - Click "Export PDF" or "Copy to JIRA"
   - Download your sprint plan

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps

# Restart services
docker-compose restart postgres
```

### API Key Issues
- Ensure all API keys are correctly set in `backend/.env`
- Check API key permissions and quotas
- Verify Pinecone index is created (happens automatically)

### Frontend Not Loading
```bash
# Rebuild frontend
cd frontend
npm install
npm run dev
```

### Backend Errors
```bash
# Check backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

## Development Mode

### Backend Development
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

## Production Deployment

1. Update `docker-compose.yml` for production settings
2. Set `APP_ENV=production` in `.env`
3. Use production database (not local PostgreSQL)
4. Configure proper CORS origins
5. Set strong `JWT_SECRET`
6. Enable HTTPS

## Next Steps

- Review `PROJECT_STRUCTURE.md` for architecture details
- Check `examples/` for sample inputs and outputs
- Read API documentation at http://localhost:8000/docs
- Customize LLM prompts in `backend/app/services/llm_service.py`

## Support

For issues or questions:
1. Check the logs: `docker-compose logs`
2. Review API docs: http://localhost:8000/docs
3. Check example files in `examples/` directory

