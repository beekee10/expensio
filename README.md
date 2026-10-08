# Zenith Finance — FinTech Expense & Analytics REST Platform

A high-performance full-stack web application built with **FastAPI**, **SQLAlchemy 2.0**, **Alembic**, **Pytest**, and **React**. Designed as a production-grade interview showcase highlighting idiomatic Python backend architecture, relational data modeling, database migrations, and clean UI design.

![Zenith Finance Dashboard Preview](https://raw.githubusercontent.com/placeholder/demo.png)

---

## ⚡ Tech Stack

| Layer | Technologies | Key Features |
| :--- | :--- | :--- |
| **Backend** | Python 3.12+, FastAPI, Uvicorn | Async/await, Auto-generated Swagger docs (`/docs`), Dependency Injection |
| **ORM & Migrations** | SQLAlchemy 2.0, Alembic | Declarative mapping, foreign key cascades, indexed queries, versioned migrations |
| **Validation** | Pydantic v2 | Type validation, request payload checking, serialization schemas |
| **Auth & Security** | PyJWT, Bcrypt, OAuth2PasswordBearer | Salted password hashing, JWT bearer authorization, protected route dependencies |
| **Testing** | Pytest, HTTPX | In-memory SQLite test database fixtures, automated endpoint testing |
| **Frontend** | React 18, Vite, Lucide Icons, Axios | Dark-mode fintech dashboard, real-time KPI metrics, responsive CSS design |
| **Database** | SQLite (Local) / PostgreSQL (Cloud) | Seamless switch via `DATABASE_URL` environment variable |

---

## 📂 Project Structure

```text
pyt/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                # FastAPI initialization, CORS & lifespan
│   │   ├── config.py              # Pydantic Settings & environment variables
│   │   ├── database.py            # SQLAlchemy engine, sessionmaker & get_db generator
│   │   ├── models.py              # Relational models (User, Expense)
│   │   ├── schemas.py             # Pydantic v2 request/response schemas
│   │   ├── auth.py                # JWT creation, bcrypt hashing, Depends(get_current_user)
│   │   └── routers/
│   │       ├── auth_router.py     # /api/auth (register, login, me)
│   │       ├── expense_router.py  # /api/expenses (CRUD, filtering, search)
│   │       └── analytics_router.py# /api/analytics (SQL aggregation, dashboard stats)
│   ├── alembic/                   # Database version migration scripts
│   ├── tests/
│   │   ├── conftest.py            # Pytest fixtures & in-memory test database
│   │   └── test_api.py            # Automated test suite
│   ├── pytest.ini
│   ├── requirements.txt
│   ├── .env.example
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx         # Header & user auth indicator
    │   │   ├── StatsCards.jsx     # Top KPI metric summary cards
    │   │   ├── CategoryBreakdown.jsx # Spending progress bars & savings meter
    │   │   ├── TransactionTable.jsx  # Search, filter, and CRUD data table
    │   │   ├── ExpenseModal.jsx   # Create/Edit expense modal
    │   │   └── AuthModal.jsx      # Login, Register & 1-Click Demo login
    │   ├── api.js                 # Axios client with JWT interceptor
    │   ├── App.jsx                # Main dashboard orchestrator
    │   └── index.css              # Dark mode fintech design tokens
    └── package.json
```

---

## 🚀 Quickstart Guide

### 1. Run the Backend

```powershell
# Navigate to backend directory
cd backend

# Create & activate virtual environment (Windows)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```

* API server runs at: `http://localhost:8000`
* Interactive Swagger UI docs: `http://localhost:8000/docs`

### 2. Run the Automated Tests

```powershell
cd backend
pytest -v
```

### 3. Run the Frontend

```powershell
# In a new terminal window
cd frontend

# Install packages
npm install

# Start Vite development server
npm run dev
```

* Frontend runs at: `http://localhost:5173`

---

## ☁️ Free 1-Click Deployment (Zero Docker)

### Backend (Render.com)
1. Push repository to GitHub.
2. In Render, click **New + > Web Service** and connect your repo.
3. Settings:
   * **Root Directory**: `backend`
   * **Build Command**: `pip install -r requirements.txt && alembic upgrade head`
   * **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Set Environment Variables:
   * `DATABASE_URL`: Your free PostgreSQL string from [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com).
   * `SECRET_KEY`: A random secure string.

### Frontend (Vercel)
1. Import repo into Vercel.
2. Set **Root Directory** to `frontend`.
3. Add Environment Variable:
   * `VITE_API_URL`: Your live Render backend URL (e.g. `https://zenith-backend.onrender.com`).
4. Click **Deploy**.

---

## 💡 Key Python Interview Topics Demonstrated in This Codebase

When speaking with technical interviewers, highlight these exact patterns:

1. **Dependency Injection Pattern (`FastAPI Depends`)**:
   * How `get_db` yields a database session and safely closes it via Python generator `finally:` blocks.
   * How `get_current_user` extracts and verifies the JWT token before routing execution to the controller.
2. **Pydantic v2 vs SQLAlchemy Models**:
   * Clear separation of concerns: SQLAlchemy handles persistence and SQL translation; Pydantic handles validation, sanitization, and JSON serialization (`from_attributes=True`).
3. **Database Aggregations in SQL vs Memory**:
   * The `/api/analytics/by-category` endpoint uses SQLAlchemy `func.sum()` and `group_by()` so aggregation happens directly on the database engine rather than looping in Python application memory.
4. **Database Migrations with Alembic**:
   * Version-controlled schema migrations (`alembic revision --autogenerate` and `alembic upgrade head`) ensuring zero data loss during schema evolution.
5. **Testing Architecture with Pytest**:
   * Using an isolated `sqlite:///:memory:` database per test run with FastAPI `dependency_overrides` so tests run in milliseconds without dirtying production/local data.
