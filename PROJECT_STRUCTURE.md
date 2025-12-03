# SmartPlanner AI - Project Structure

## Overview
This document describes the complete project structure of SmartPlanner AI, an AI-powered sprint & task automation platform.

## Directory Structure

```
smartplanner-ai/
├── backend/                    # FastAPI backend application
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py            # FastAPI app entry point
│   │   ├── api/               # API routes
│   │   │   └── v1/
│   │   │       ├── router.py  # Main API router
│   │   │       ├── auth.py     # Authentication endpoints
│   │   │       ├── projects.py # Project management endpoints
│   │   │       └── sprints.py  # Sprint management endpoints
│   │   ├── core/              # Core configuration
│   │   │   ├── config.py      # Application settings
│   │   │   ├── database.py    # Database connection
│   │   │   ├── auth.py        # JWT authentication
│   │   │   └── logging.py     # Logging configuration
│   │   ├── models/            # SQLAlchemy models
│   │   │   ├── user.py        # User model
│   │   │   ├── project.py     # Project, Epic, Story, Task, Sprint models
│   │   │   └── sprint_history.py # Sprint history model
│   │   ├── schemas/           # Pydantic schemas
│   │   │   ├── user.py        # User request/response schemas
│   │   │   └── project.py     # Project-related schemas
│   │   ├── services/          # Business logic services
│   │   │   ├── llm_service.py      # LLM abstraction layer
│   │   │   ├── pinecone_service.py # Pinecone vector DB service
│   │   │   └── sprint_service.py   # Sprint planning orchestration
│   │   └── utils/             # Utility functions
│   │       ├── file_parser.py # File parsing (PDF, DOCX)
│   │       └── export.py      # Export utilities (PDF, CSV, JIRA)
│   ├── tests/                 # Test suite
│   │   ├── test_llm_service.py
│   │   └── test_auth.py
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile            # Backend Docker image
│   └── pytest.ini            # Pytest configuration
│
├── frontend/                  # Next.js frontend application
│   ├── app/                  # Next.js App Router
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Homepage
│   │   ├── globals.css       # Global styles
│   │   ├── providers.tsx     # React Query provider
│   │   ├── login/           # Login page
│   │   ├── register/        # Registration page
│   │   └── dashboard/       # Dashboard pages
│   │       ├── page.tsx     # Dashboard home
│   │       └── projects/    # Project management
│   ├── components/           # React components
│   │   └── ui/              # shadcn/ui components
│   │       ├── button.tsx
│   │       └── card.tsx
│   ├── lib/                  # Utility libraries
│   │   ├── api.ts           # API client
│   │   └── utils.ts         # Helper functions
│   ├── package.json         # Node.js dependencies
│   ├── Dockerfile          # Frontend Docker image
│   ├── next.config.js     # Next.js configuration
│   ├── tailwind.config.js  # TailwindCSS configuration
│   └── tsconfig.json       # TypeScript configuration
│
├── scripts/                  # Utility scripts
│   └── init_db.py          # Database initialization
│
├── examples/                 # Example files
│   ├── example_spec.txt     # Sample product spec
│   └── example_sprint_output.json # Sample output
│
├── .github/                  # GitHub Actions
│   └── workflows/
│       └── ci.yml          # CI/CD pipeline
│
├── docker-compose.yml        # Docker orchestration
├── .gitignore               # Git ignore rules
├── README.md                # Main documentation
└── PROJECT_STRUCTURE.md     # This file

```

## Key Components

### Backend Architecture

1. **API Layer** (`app/api/v1/`)
   - RESTful endpoints for all operations
   - Authentication middleware
   - Request/response validation

2. **Service Layer** (`app/services/`)
   - `LLMService`: Unified interface for OpenAI and Anthropic
   - `PineconeService`: Vector database operations
   - `SprintService`: Orchestrates sprint planning pipeline

3. **Data Layer** (`app/models/`)
   - SQLAlchemy ORM models
   - Database relationships and constraints

4. **Core** (`app/core/`)
   - Configuration management
   - Database connection pooling
   - Authentication utilities
   - Logging setup

### Frontend Architecture

1. **Pages** (`app/`)
   - Next.js App Router structure
   - Server and client components
   - Route handlers

2. **Components** (`components/`)
   - Reusable UI components
   - shadcn/ui component library

3. **API Client** (`lib/api.ts`)
   - Axios-based API client
   - Request interceptors for auth
   - Type-safe API methods

## Data Flow

1. **Sprint Plan Generation Flow**:
   ```
   User uploads spec → Backend parses file → LLM extracts epics → 
   LLM generates stories → LLM generates tasks → 
   Pinecone predicts velocity → Timeline estimation → 
   Sprint plan returned to frontend
   ```

2. **Authentication Flow**:
   ```
   User logs in → JWT token generated → Token stored in localStorage →
   Token included in API requests → Backend validates token →
   User authenticated
   ```

## Technology Stack

### Backend
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: ORM for database operations
- **LangChain**: LLM orchestration
- **Pinecone**: Vector database
- **PostgreSQL**: Relational database
- **JWT**: Authentication tokens

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety
- **TailwindCSS**: Utility-first CSS
- **shadcn/ui**: Component library
- **React Query**: Data fetching and caching
- **Axios**: HTTP client

## Environment Variables

See `backend/.env.example` for all required environment variables.

## Running the Project

1. **Development**:
   ```bash
   docker-compose up --build
   ```

2. **Production**:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Testing

- **Backend**: `pytest` (run from `backend/` directory)
- **Frontend**: `npm test` (run from `frontend/` directory)

## Deployment

The project is containerized and ready for deployment to:
- Docker Swarm
- Kubernetes
- Cloud platforms (AWS, GCP, Azure)

## Notes

- All LLM operations are async for better performance
- Vector embeddings are stored in Pinecone for similarity search
- JWT tokens expire after 24 hours (configurable)
- Database migrations handled by SQLAlchemy on startup

