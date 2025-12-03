# SmartPlanner AI

An AI-powered sprint & task automation platform that converts product requirement documents into fully structured JIRA-style sprint plans.

## 🚀 Features

- **Product Spec Upload**: Upload product requirement documents and convert them into structured sprint plans
- **AI-Powered Decomposition**: Automatic epic → story → task decomposition using local LLM (Ollama) or OpenAI
- **Effort Estimation**: Intelligent effort estimation using historical velocity and embeddings
- **Sprint Planning**: Generate complete sprint plans with timelines and velocity predictions
- **Vector Search**: Pinecone integration for historical sprint data retrieval (optional)
- **Beautiful Dashboard**: Modern UI built with Next.js, TailwindCSS, and shadcn/ui
- **Export Options**: Download sprint plans as PDF or CSV
- **Authentication**: JWT-based auth with optional Google OAuth
- **No API Tokens Required**: Runs with Ollama by default (completely free, local LLM)

## 🏗️ Architecture

```
smartplanner-ai/
├── frontend/          # Next.js 14 application
├── backend/           # FastAPI application
├── scripts/           # Database migrations and utilities
├── docker-compose.yml # Docker orchestration
└── .env.example       # Environment variables template
```

## 🛠️ Tech Stack

### Frontend
- Next.js 14 (App Router)
- TailwindCSS
- shadcn/ui
- React Query
- TypeScript

### Backend
- FastAPI
- Ollama (default, local LLM - no tokens required)
- OpenAI (optional)
- Pinecone (optional, for velocity prediction)
- PostgreSQL
- JWT Authentication

### Infrastructure
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- OpenTelemetry (Monitoring)

## 📦 Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)
- **Ollama** (for local LLM - recommended, no tokens required)
  - Install: https://ollama.com
  - Pull model: `ollama pull qwen2.5:7b-instruct`

## 🚀 Quick Start

### Run with Ollama (Recommended - No Tokens Required)

1. **Install Ollama**
   ```bash
   # Visit https://ollama.com and install Ollama for your OS
   # Or use: curl -fsSL https://ollama.com/install.sh | sh
   ```

2. **Pull the model**
   ```bash
   ollama pull qwen2.5:7b-instruct
   ```

3. **Start Ollama** (if not running as a service)
   ```bash
   ollama serve
   # Keep this running in a separate terminal
   ```

4. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "ai resume project 1"
   ```

5. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env - LLM_PROVIDER=ollama is already set by default
   ```

6. **Start the application**
   ```bash
   docker-compose up --build
   ```

7. **Test the LLM provider** (optional)
   ```bash
   cd backend
   python scripts/test_llm_provider.py
   ```

8. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

9. **Initialize database** (if needed)
   ```bash
   python scripts/init_db.py
   ```

### Run with OpenAI (Optional)

If you prefer to use OpenAI instead:

1. Set `LLM_PROVIDER=openai` in your `.env` file
2. Add your `OPENAI_API_KEY` to `.env`
3. Restart the application

## 🔧 Environment Variables

See `.env.example` for all environment variables. Key variables include:

### Required
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens

### LLM Provider (Default: Ollama - No Tokens Required)
- `LLM_PROVIDER`: `ollama` (default) or `openai`
- `OLLAMA_BASE_URL`: Ollama API URL (default: `http://localhost:11434`)
- `OLLAMA_MODEL`: Model to use (default: `qwen2.5:7b-instruct`)

### Optional: OpenAI (only if LLM_PROVIDER=openai)
- `OPENAI_API_KEY`: Your OpenAI API key
- `DEFAULT_MODEL`: OpenAI model to use (default: `gpt-4o`)

### Optional: Pinecone (for velocity prediction)
- `PINECONE_API_KEY`: Your Pinecone API key
- `PINECONE_ENVIRONMENT`: Your Pinecone environment
- `PINECONE_INDEX_NAME`: Pinecone index name

### Optional: OAuth
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret

## 📚 API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📖 Usage

1. **Sign up / Log in** to your account at http://localhost:3000
2. **Create a new project** from the dashboard
3. **Upload a product spec** document (PDF, DOCX, or text) - see `examples/example_spec.txt` for format
4. **Click "Generate Sprint Plan"** to automatically:
   - Extract epics from the spec
   - Generate user stories for each epic
   - Break down stories into tasks
   - Estimate effort and predict velocity
   - Generate timeline estimates
5. **Review the sprint plan** with the hierarchical view (Epics → Stories → Tasks)
6. **Export** to PDF/CSV or copy to JIRA format

## 🏗️ Architecture

The project follows a clean architecture pattern:

- **Backend**: FastAPI with modular structure (models, services, API routes)
- **Frontend**: Next.js 14 with App Router and React Query
- **LLM Layer**: Provider abstraction supporting Ollama (default, local) and OpenAI (optional)
- **Vector DB**: Pinecone for historical sprint embeddings (optional)
- **Database**: PostgreSQL for structured data

See `PROJECT_STRUCTURE.md` for detailed architecture documentation.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

MIT License

## 🙏 Acknowledgments

Built with Ollama (local LLM), FastAPI, Next.js, and PostgreSQL.

## 🧪 Test LLM Provider

Test your LLM provider configuration:

```bash
cd backend
python scripts/test_llm_provider.py
```

This will verify that:
- Ollama is running (if using default provider)
- The model is available
- The provider can generate responses

If you see connection errors, ensure:
1. Ollama is installed and running: `ollama serve`
2. The model is pulled: `ollama pull qwen2.5:7b-instruct`

