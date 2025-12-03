# 🚀 SmartPlanner AI - AI-Powered Sprint & Task Automation Platform

**Created by:** [Srikar Sai Kondepudi](https://github.com/Srikar-Kondepudi)

A production-grade full-stack application that converts product requirement documents into JIRA-style sprint plans with epics, stories, tasks, and effort estimates using AI.

---

## 📖 The Journey: From Concept to Production

### The Beginning

This project started as an ambitious idea: **"What if we could automate sprint planning using AI?"** The goal was to build a platform where product managers could simply upload a spec document and get a complete, structured sprint plan with epics, user stories, tasks, and effort estimates—all powered by AI.

### The Tech Stack Decision

We chose a modern, scalable architecture:
- **Frontend:** Next.js 14 with TailwindCSS and shadcn/ui for a beautiful, responsive UI
- **Backend:** FastAPI with Python for robust API design
- **AI/LLM:** LangChain for orchestration, with support for multiple LLM providers
- **Database:** PostgreSQL for reliable data storage
- **Vector DB:** Pinecone for velocity prediction using historical sprint embeddings
- **Deployment:** Vercel (frontend) + Render (backend)

### The First Challenge: LLM Provider Selection

Initially, we planned to use **OpenAI GPT-4o** and **Claude 3.5 Sonnet** as the primary LLM providers. However, we quickly ran into a critical issue: **API costs and quotas**.

**What happened:**
- OpenAI API keys had quota limits
- Users exceeded their free tier quotas
- API costs would be prohibitive for a free-to-use platform

**The pivot:** We needed a **free, reliable LLM solution** that could work in production.

### The Ollama Experiment

We discovered **Ollama**—a local LLM runner that's completely free and doesn't require API tokens. Perfect! We integrated it as the default provider.

**The setup:**
- Users could run Ollama locally
- No API costs, no tokens required
- Works great for development

**But then came deployment...**

### The Deployment Challenge

When we deployed to **Render** (cloud hosting), we hit a wall: **Ollama requires local access**. Render's cloud servers couldn't connect to Ollama running on a user's local machine. The `host.docker.internal` approach worked in Docker, but not in cloud deployments.

**The problem:**
```
Error: Could not connect to Ollama at http://host.docker.internal:11434
```

**What we tried:**
1. Different URL configurations (`localhost`, `host.docker.internal`)
2. Network bridge configurations
3. Service discovery approaches

**Result:** None worked. Ollama simply isn't designed for cloud deployments without running Ollama itself in the cloud.

### The Search for a Free Cloud LLM

We needed a solution that:
- ✅ Works in cloud deployments (Render)
- ✅ Free tier available
- ✅ No credit card required
- ✅ Reliable and fast
- ✅ Good quality outputs

**Options we explored:**
1. **OpenAI** - Paid, quota limits
2. **Anthropic Claude** - Paid, expensive
3. **Hugging Face Inference** - Free tier, but slower
4. **Groq** - **FREE tier, fast, cloud-based!** 🎯

### The Groq Solution

**Groq** turned out to be the perfect fit:
- ✅ **100% FREE tier** - No credit card required
- ✅ **Fast inference** - Powered by custom chips
- ✅ **Cloud-based API** - Works perfectly on Render
- ✅ **Generous limits** - 6000 tokens/minute on free tier
- ✅ **OpenAI-compatible API** - Easy integration

**The integration:**
1. Added `GroqProvider` class to our LLM abstraction layer
2. Updated configuration to support Groq API keys
3. Modified frontend to use Groq as default
4. Added retry logic for rate limits

### The Rate Limit Challenge

Even with Groq's generous free tier, we hit rate limits when generating large sprint plans. The issue: **sprint generation makes many sequential API calls** (epics → stories → tasks).

**What happened:**
- Generated 8-9 epics ✅
- Started generating stories from epics ✅
- Hit rate limit: "6000 tokens/minute exceeded" ❌

**The solution:**
1. **Retry logic with exponential backoff** - Automatically retries on 429 errors
2. **Delays between API calls** - Small delays to avoid hitting limits
3. **Better error messages** - Clear guidance when rate limits are hit

### The UI Evolution

The UI went through multiple iterations based on user feedback:

**Version 1:** Basic, functional but bland
- User feedback: "the ui is very very back please make it an ulitmate beast"

**Version 2:** High-tech design with animations
- User feedback: "i cant see anything the high tech ui it is like this now"
- Issue: Custom CSS classes weren't compiling correctly

**Version 3:** Clean, minimal, elegant
- User feedback: "improve the ui and buttons very neatly like the colours should be very light and solid colours"
- Result: Pale, solid colors, neatly organized buttons, modern aesthetic

### The Deployment Saga

#### Vercel Deployment (Frontend)

**Challenge 1:** 404 NOT_FOUND error
- **Cause:** Next.js app in `frontend/` subdirectory, but Vercel root was repository root
- **Solution:** Set Root Directory to `frontend` in Vercel settings

**Challenge 2:** Backend connectivity
- **Cause:** Backend not deployed, frontend couldn't connect
- **Solution:** Deploy backend to cloud (Render)

#### Railway Deployment (Backend - Attempt 1)

**Challenge 1:** Build plan error
- **Cause:** Missing build configuration
- **Solution:** Added `Procfile`, `runtime.txt`, `railway.json`, `nixpacks.toml`

**Challenge 2:** Port variable error
- **Error:** `Invalid value for '--port': '$PORT' is not a valid integer`
- **Solution:** Created `start.py` to properly read `PORT` environment variable

**Challenge 3:** Missing environment variables
- **Error:** `DATABASE_URL` and `JWT_SECRET` required
- **Solution:** Added validation and clear error messages

**Challenge 4:** Database connection
- **Issue:** PostgreSQL service not linked
- **Solution:** Used Railway's "Add Reference" feature to link database

**Result:** Too many issues, user requested migration to another platform.

#### Render Deployment (Backend - Final)

**Challenge 1:** Malformed DATABASE_URL
- **Error:** `could not translate host name "2342@db.qcjuudpuotywsiadsvit.supabase.co"`
- **Cause:** Incorrect connection string format
- **Solution:** Used Supabase pooler connection (port 6543) instead of direct connection

**Challenge 2:** Network unreachable
- **Error:** `connection to server at "db.qcjuudpuotywsiadsvit.supabase.co" (2600:1f18:...), port 5432 failed: Network is unreachable`
- **Cause:** Using direct connection instead of pooler
- **Solution:** Switched to `pooler.supabase.com:6543` connection string

**Challenge 3:** CORS configuration
- **Error:** `No 'Access-Control-Allow-Origin' header is present`
- **Cause:** `CORS_ORIGINS` didn't include Vercel URL
- **Solution:** Added Vercel URL to `CORS_ORIGINS` in Render

**Challenge 4:** Route 405 errors
- **Error:** `Method Not Allowed` on POST requests
- **Cause:** FastAPI route path mismatch (trailing slash issues)
- **Solution:** Simplified routes to use empty string path `""` instead of `"/"`

**Challenge 5:** Frontend environment variable
- **Error:** Frontend defaulting to `localhost:8000`
- **Cause:** `NEXT_PUBLIC_API_URL` not set in Vercel
- **Solution:** Added environment variable and redeployed Vercel

### The Authentication Journey

**Challenge 1:** Password length
- **Error:** `password cannot be longer than 72 bytes`
- **Solution:** Truncated passwords to 72 bytes before bcrypt hashing

**Challenge 2:** JWT token validation
- **Error:** `Token invalid: Subject must be a string`
- **Solution:** Converted user ID to string when creating token, back to int when decoding

**Challenge 3:** Redirect loops
- **Issue:** Users redirected to login immediately after login
- **Solution:** Improved token validation logic, only redirect on explicit 401 errors

### The File Export Feature

**User request:** "there is no download option for the page once the stories are generated"

**Solution:** Added three export formats:
1. **PDF** - Professional sprint plan document
2. **CSV** - Spreadsheet-compatible format
3. **JIRA CSV** - Direct import into JIRA

### The Final Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   Vercel        │         │     Render      │
│   (Frontend)    │────────▶│    (Backend)    │
│   Next.js 14    │  HTTPS  │    FastAPI      │
└─────────────────┘         └─────────────────┘
                                      │
                                      ▼
                            ┌─────────────────┐
                            │    Supabase     │
                            │   PostgreSQL    │
                            └─────────────────┘
                                      │
                                      ▼
                            ┌─────────────────┐
                            │      Groq       │
                            │   LLM API       │
                            │   (FREE!)       │
                            └─────────────────┘
```

---

## ✨ Features

### Core Features
- 📄 **Product Spec Upload** - Upload PDF, DOCX, or plain text specifications
- 🤖 **AI-Powered Decomposition** - Automatically breaks down specs into epics, stories, and tasks
- 📊 **Effort Estimation** - AI estimates story points and task hours
- 📅 **Sprint Planning** - Generates sprint plans with velocity predictions
- 📥 **Export Options** - Download as PDF, CSV, or JIRA-compatible CSV
- 👤 **User Authentication** - JWT-based auth with optional OAuth
- 📈 **Admin Dashboard** - View velocity history and sprint analytics

### AI Features
- **Multi-LLM Support:** Groq (free), Ollama (local), OpenAI (paid)
- **LangChain Orchestration:** Epic extraction → Story generation → Task breakdown
- **Velocity Prediction:** Uses Pinecone embeddings for historical sprint analysis
- **Smart Retry Logic:** Automatic retry with exponential backoff for rate limits

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** TailwindCSS
- **Components:** shadcn/ui
- **State Management:** React Query
- **Deployment:** Vercel

### Backend
- **Framework:** FastAPI (Python)
- **AI/LLM:** LangChain + Groq API (free tier)
- **Database:** PostgreSQL (Supabase)
- **Vector DB:** Pinecone (optional, for velocity prediction)
- **Authentication:** JWT + OAuth (optional)
- **Deployment:** Render

### Infrastructure
- **Containerization:** Docker + Docker Compose
- **CI/CD:** GitHub Actions
- **Code Quality:** Ruff, Black, Pytest
- **Monitoring:** OpenTelemetry

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Docker & Docker Compose
- Groq API key (free): [Get one here](https://console.groq.com/keys)
- Supabase account (free): [Sign up here](https://supabase.com)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Srikar-Kondepudi/SmartPlanner_AI.git
   cd SmartPlanner_AI
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Environment Variables

**Backend (.env):**
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/smartplanner

# JWT
JWT_SECRET=your-secret-key-here
SECRET_KEY=another-secret-key

# LLM Provider (Groq - FREE!)
LLM_PROVIDER=groq
GROQ_API_KEY=gsk-your-key-here
GROQ_MODEL=llama-3.1-8b-instant

# CORS
CORS_ORIGINS=http://localhost:3000

# Optional: Pinecone (for velocity prediction)
PINECONE_API_KEY=your-pinecone-key
PINECONE_ENVIRONMENT=us-east-1-aws
PINECONE_INDEX_NAME=smartplanner-sprints
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📚 Project Structure

```
SmartPlanner_AI/
├── backend/
│   ├── app/
│   │   ├── api/v1/          # API routes
│   │   ├── core/            # Config, auth, database
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── services/        # Business logic
│   │   │   ├── llm_provider.py    # LLM abstraction (Groq, Ollama, OpenAI)
│   │   │   ├── llm_service.py     # LangChain orchestration
│   │   │   ├── sprint_service.py  # Sprint planning logic
│   │   │   └── pinecone_service.py # Velocity prediction
│   │   └── utils/           # Export, file parsing
│   ├── scripts/             # Database migrations, tests
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── app/                 # Next.js app directory
│   │   ├── dashboard/       # Dashboard pages
│   │   ├── login/           # Auth pages
│   │   └── register/
│   ├── components/          # React components
│   ├── lib/                 # API client, utilities
│   └── package.json
└── docker-compose.yml
```

---

## 🎯 Key Learnings & Edge Cases

### 1. LLM Provider Abstraction is Critical
We built a flexible abstraction layer that allows switching between LLM providers without changing business logic. This proved invaluable when we needed to switch from OpenAI to Groq.

### 2. Rate Limiting is Real
Even "free" APIs have rate limits. We learned to:
- Add retry logic with exponential backoff
- Implement delays between sequential API calls
- Provide clear error messages to users

### 3. Deployment Environments Vary
What works locally (Ollama) doesn't always work in cloud (Render). Always test deployment scenarios early.

### 4. CORS is Tricky
CORS configuration must match exactly:
- No trailing slashes
- Use `https://` not `http://`
- Include all domains (production, preview, development)

### 5. Environment Variables Need Redeploys
Frontend environment variables (especially `NEXT_PUBLIC_*`) require a full redeploy to take effect.

### 6. Database Connection Strings Matter
Supabase has two connection types:
- Direct connection (port 5432) - Doesn't work from cloud
- Pooler connection (port 6543) - Works from cloud ✅

### 7. FastAPI Route Paths
Trailing slashes can cause 405 errors. Use empty string `""` for root routes to avoid issues.

---

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests (if configured)
cd frontend
npm test
```

---

## 📖 API Documentation

Once running, visit:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

---

## 🚢 Deployment

### Frontend (Vercel)
1. Connect GitHub repository
2. Set Root Directory to `frontend`
3. Add `NEXT_PUBLIC_API_URL` environment variable
4. Deploy!

### Backend (Render)
1. Create new Web Service
2. Connect GitHub repository
3. Set Root Directory to `backend`
4. Add environment variables (see `.env.example`)
5. Link Supabase PostgreSQL database
6. Deploy!

**Detailed guides:**
- `VERCEL_DEPLOYMENT.md` - Frontend deployment
- `RENDER_SETUP.md` - Backend deployment
- `FREE_LLM_SETUP.md` - Groq API setup

---

## 🎨 UI/UX Highlights

- **Minimal, elegant design** with pale, solid colors
- **Neatly organized buttons** and components
- **Smooth animations** and transitions
- **Responsive layout** for all screen sizes
- **Real-time task tree visualizer**
- **One-click JIRA export**

---

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- SQL injection prevention (SQLAlchemy ORM)
- Environment variable security

---

## 📝 License

This project is open source and available for use.

---

## 👤 Author

**Srikar Sai Kondepudi**

- GitHub: [@Srikar-Kondepudi](https://github.com/Srikar-Kondepudi)
- Project Repository: [SmartPlanner_AI](https://github.com/Srikar-Kondepudi/SmartPlanner_AI)

---

## 🙏 Acknowledgments

- **Groq** - For providing a free, fast LLM API
- **LangChain** - For excellent LLM orchestration tools
- **FastAPI** - For a modern, fast Python web framework
- **Next.js** - For an amazing React framework
- **Vercel & Render** - For free hosting tiers

---

## 📊 Project Statistics

- **Total Commits:** 50+
- **Files Changed:** 100+
- **Deployment Attempts:** 3 platforms (Vercel, Railway, Render)
- **LLM Providers Tried:** 4 (OpenAI, Anthropic, Ollama, Groq)
- **Final LLM:** Groq (100% free!)
- **Time to Production:** Multiple iterations, continuous improvement

---

## 🎉 Success Metrics

✅ **Fully functional** AI-powered sprint planning  
✅ **Free LLM integration** (Groq) - no token costs  
✅ **Production deployment** on Vercel + Render  
✅ **Beautiful, modern UI** with excellent UX  
✅ **Complete export functionality** (PDF, CSV, JIRA)  
✅ **Robust error handling** and retry logic  
✅ **Comprehensive documentation**  

---

## 🔮 Future Enhancements

- [ ] Real-time collaboration features
- [ ] Advanced velocity prediction with ML
- [ ] Integration with more project management tools
- [ ] Custom sprint templates
- [ ] Team member assignment
- [ ] Sprint burndown charts
- [ ] Mobile app version

---

## 📞 Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Built with ❤️ by Srikar Sai Kondepudi**

*"From concept to production, with all the challenges, failures, and successes along the way."*
