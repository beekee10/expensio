# Zenith Finance — Complete Project Documentation & Technical Guide

Welcome to the comprehensive technical documentation for **Zenith Finance**, a production-ready, beginner-friendly full-stack Personal Finance and Expense Analytics application. 

This document details the **entire project architecture**, **technology stack**, **database design**, **file-by-file functionality**, and **interview preparation guide**.

---

## 📑 Table of Contents
1. [Project Overview](#1-project-overview)
2. [Complete Technology Stack](#2-complete-technology-stack)
3. [Architecture & Data Flow](#3-architecture--data-flow)
4. [Database Design & Schema](#4-database-design--schema)
5. [Complete File-by-File Breakdown](#5-complete-file-by-file-breakdown)
   - [Backend Files](#a-backend-files-python--fastapi)
   - [Frontend Files](#b-frontend-files-react--tailwind-css-v4)
   - [Configuration & DevOps Files](#c-configuration--devops-files)
6. [API Endpoints Reference](#6-api-endpoints-reference)
7. [How to Run & Test the Application](#7-how-to-run--test-the-application)
8. [Interview Walkthrough & Key Talking Points](#8-interview-walkthrough--key-talking-points)

---

## 1. Project Overview

### What is Zenith Finance?
Zenith Finance is a modern full-stack web application that allows users to securely track personal income and expenses, monitor monthly budget health, categorize transactions, and view real-time analytical breakdowns in **Indian Rupees (₹)**.

### Why Was It Built?
As a developer transitioning from the **MERN (MongoDB, Express, React, Node.js)** stack to **Python Backend / Full-Stack**, this project was engineered to demonstrate:
1. Mastery of idiomatic Python using **FastAPI** and **SQLAlchemy 2.0**.
2. Relational database modeling with foreign keys, cascading deletes, and indexes (vs schemaless MongoDB).
3. Secure user authentication with **OAuth2 Password Bearer**, **JWT tokens**, and **Bcrypt salted password hashing**.
4. Production database migrations using **Alembic**.
5. Automated testing with **Pytest** using an in-memory SQLite database.
6. Clean frontend design using **React 18** and **Tailwind CSS v4**.

---

## 2. Complete Technology Stack

### Backend Technologies (Python)
| Tool / Library | Version | Purpose in this Project | MERN Equivalent |
| :--- | :--- | :--- | :--- |
| **Python** | 3.12+ / 3.14 | Core backend programming language. | Node.js |
| **FastAPI** | >= 0.115.0 | Web framework for building REST APIs with automatic OpenAPI docs (`/docs`). | Express.js |
| **Uvicorn** | >= 0.30.0 | High-performance ASGI server to run the FastAPI application. | Node HTTP Server |
| **SQLAlchemy** | >= 2.0.30 | Object Relational Mapper (ORM) for SQL database interaction. | Mongoose |
| **Pydantic** | >= 2.7.0 | Data validation and JSON serialization with type hinting. | Zod / Joi |
| **PyJWT** | >= 2.8.0 | Encodes and decodes signed JSON Web Tokens for authentication. | `jsonwebtoken` |
| **Bcrypt** | >= 4.1.2 | Secure cryptographic hashing algorithm with salt for passwords. | `bcryptjs` |
| **Alembic** | >= 1.13.0 | Version control and migration tool for relational databases. | None (Mongo is schemaless) |
| **Pytest** | >= 8.2.0 | Automated testing framework for unit and integration testing. | Jest / Mocha |
| **HTTPX** | >= 0.27.0 | Fast HTTP client used with `TestClient` to test API routes. | Supertest |
| **Python-Dotenv** | >= 1.0.1 | Loads environment variables from `.env` file into `os.environ`. | `dotenv` |
| **Email-Validator** | >= 2.1.0 | Validates email syntax in Pydantic's `EmailStr` field. | `validator.js` |

### Frontend Technologies (React + Tailwind)
| Tool / Library | Version | Purpose in this Project |
| :--- | :--- | :--- |
| **React** | 18+ | Component-based UI library for dynamic user interfaces. |
| **Vite** | 8+ | Lightning-fast frontend build tool and dev server. |
| **Tailwind CSS** | v4 | Modern utility-first CSS framework for clean, responsive UI styling. |
| **@tailwindcss/vite**| v4 | Native Vite plugin for zero-config Tailwind compilation. |
| **Axios** | >= 1.7.0 | HTTP client for making API calls with automated JWT header injection. |
| **Lucide-React** | >= 0.470.0 | Modern, clean vector SVG icons for categories and controls. |

### Database
* **Local Development**: **SQLite** (`expenses.db`) — Zero setup, local file-based SQL engine.
* **Production Deployment**: **PostgreSQL** (Hosted on Neon.tech or Supabase) — Swapped in seconds by changing the `DATABASE_URL` environment variable.

---

## 3. Architecture & Data Flow

```text
[ Browser / React UI ]
      │
      │ 1. User registers or logs in with email + password
      ▼
[ FastAPI Backend: /api/auth/login ]
      │
      │ 2. Verifies Bcrypt hash & issues signed JWT token (expires in 24 hours)
      ▼
[ Browser / LocalStorage ]
      │ (Stores zenith_token & user details)
      │
      │ 3. Future API requests send header: Authorization: Bearer <token>
      ▼
[ Axios Request Interceptor (api.js) ]
      │
      │ 4. Request arrives at FastAPI router
      ▼
[ FastAPI Depends(get_current_user) ]
      │ (Validates JWT signature, checks expiration, fetches User from DB)
      ▼
[ FastAPI Route Handler (e.g. /api/expenses) ]
      │
      │ 5. Interacts with database via Depends(get_db)
      ▼
[ SQLAlchemy 2.0 ORM ]
      │ (Translates Python queries into SQL SELECT, INSERT, UPDATE, DELETE)
      ▼
[ SQLite / PostgreSQL Database ]
```

---

## 4. Database Design & Schema

The database consists of two core relational tables: **`users`** and **`expenses`**.

### 1. `users` Table
Stores registered user accounts and encrypted passwords.
| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Primary Key, Indexed, Autoincrement | Unique ID of the user |
| `email` | String(255) | Unique, Indexed, Not Null | User's login email (stored lowercase) |
| `full_name` | String(255) | Nullable | Optional display name (e.g. "Rahul Sharma") |
| `hashed_password` | String(255) | Not Null | Bcrypt salted hash (plaintext password never saved) |
| `created_at` | DateTime | Not Null, Default UTC | Account creation timestamp |

### 2. `expenses` Table
Stores individual financial transactions linked to a user.
| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Primary Key, Indexed, Autoincrement | Unique transaction ID |
| `user_id` | Integer | Foreign Key (`users.id`), Indexed, Not Null | ID of the user who owns this expense |
| `title` | String(255) | Not Null | Description (e.g. "Swiggy Food Delivery") |
| `amount` | Float | Not Null, > 0 | Amount in Indian Rupees (₹) |
| `category` | String(100) | Indexed, Not Null | Category ("Food", "Utilities", "Entertainment", etc.) |
| `date` | Date | Indexed, Not Null | Date the expense occurred |
| `notes` | Text | Nullable | Optional extra details or notes |
| `created_at` | DateTime | Not Null, Default UTC | Record creation timestamp |

### Relational Integrity:
* **One-to-Many**: One `User` has many `expenses`.
* **Cascade Delete**: If a user is deleted, all their associated expenses are automatically deleted (`cascade="all, delete-orphan"` and `ondelete="CASCADE"`).

---

## 5. Complete File-by-File Breakdown

```text
pyt/
├── backend/
│   ├── alembic/
│   │   ├── versions/
│   │   │   └── 132aff4bebec_initial_migration_for_users_and_expenses.py
│   │   ├── env.py
│   │   └── script.py.mako
│   ├── app/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── routers/
│   │       ├── __init__.py
│   │       ├── analytics_router.py
│   │       ├── auth_router.py
│   │       └── expense_router.py
│   ├── tests/
│   │   ├── conftest.py
│   │   └── test_api.py
│   ├── .env
│   ├── .env.example
│   ├── alembic.ini
│   ├── pytest.ini
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthModal.jsx
│   │   │   ├── CategoryBreakdown.jsx
│   │   │   ├── ExpenseModal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── StatsCards.jsx
│   │   │   └── TransactionTable.jsx
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
├── README.md
└── PROJECT_DOCUMENTATION.md
```

---

### A. Backend Files (Python / FastAPI)

#### 1. `backend/app/main.py`
* **Purpose**: The main application entry point for the FastAPI server.
* **Key Functionality**:
  * Initializes the `FastAPI` application instance with titles, metadata, and `/docs` Swagger URL.
  * Configures **CORS (Cross-Origin Resource Sharing)** middleware so the React frontend on `localhost:5173` can securely communicate with the backend.
  * Registers routers: `auth_router`, `expense_router`, and `analytics_router`.
  * Implements `lifespan` handler to ensure database tables are created automatically on startup.
  * Provides health check routes: `GET /` and `GET /health`.

#### 2. `backend/app/config.py`
* **Purpose**: Centralized application configuration.
* **Key Functionality**:
  * Uses `pydantic-settings` to safely read configuration variables from `.env` files.
  * Manages settings like `PROJECT_NAME`, `DATABASE_URL`, `SECRET_KEY`, `ALGORITHM` (HS256), and token expiration time (`ACCESS_TOKEN_EXPIRE_MINUTES`).

#### 3. `backend/app/database.py`
* **Purpose**: Database connection and session management.
* **Key Functionality**:
  * Creates the SQLAlchemy `engine` using `create_engine()`.
  * Creates `SessionLocal`, a database session factory.
  * Defines `Base = declarative_base()`, which all database models inherit from.
  * Defines the `get_db()` dependency: A Python generator that yields a database session for each incoming HTTP request and guarantees it is closed via `finally: db.close()`.

#### 4. `backend/app/models.py`
* **Purpose**: Defines relational database tables in Python using SQLAlchemy ORM.
* **Key Functionality**:
  * Defines `User` table model (id, email, full_name, hashed_password, created_at, expenses relationship).
  * Defines `Expense` table model (id, user_id, title, amount, category, date, notes, created_at, owner relationship).
  * Uses timezone-aware UTC datetime defaults to avoid deprecation warnings.

#### 5. `backend/app/schemas.py`
* **Purpose**: Defines Pydantic models for input validation, data sanitization, and response serialization.
* **Key Classes**:
  * `UserCreate`: Validates registration input (valid email, password minimum 6 chars).
  * `UserLogin`: Validates login input.
  * `UserResponse`: Serializes public user profile (hides hashed password).
  * `Token`: Schema returning `access_token` and user details upon login.
  * `ExpenseCreate` & `ExpenseUpdate`: Validates expense attributes (amount > 0, required title and category).
  * `ExpenseResponse`: Serializes single expense object.
  * `CategorySummary` & `DashboardSummary`: Formats aggregated metrics for the frontend dashboard in Rupees (₹).

#### 6. `backend/app/auth.py`
* **Purpose**: Handles authentication, cryptography, and route authorization.
* **Key Functions**:
  * `hash_password(password)`: Hashes plaintext password using `bcrypt.hashpw()` with random salt.
  * `verify_password(plain, hashed)`: Compares plaintext against hashed password using `bcrypt.checkpw()`.
  * `create_access_token(data, expires_delta)`: Creates a signed JWT token containing the user ID in the `sub` claim.
  * `get_current_user(token, db)`: FastAPI route dependency that extracts the JWT Bearer token, decodes it, verifies the signature, and returns the active `User` object. Throws `401 Unauthorized` if invalid.

#### 7. `backend/app/routers/auth_router.py`
* **Prefix**: `/api/auth`
* **Endpoints**:
  * `POST /register`: Validates input, verifies email uniqueness, hashes password, saves user to DB, and returns JWT token.
  * `POST /login`: Validates credentials, verifies bcrypt hash, and issues a JWT token.
  * `GET /me`: Returns currently logged in user profile (protected by `get_current_user`).

#### 8. `backend/app/routers/expense_router.py`
* **Prefix**: `/api/expenses`
* **Endpoints**:
  * `POST /`: Creates a new expense for the logged-in user.
  * `GET /`: Lists expenses with query filters:
    * `category` (case-insensitive filter)
    * `search` (case-insensitive title substring search)
    * `start_date` & `end_date` (date range filter)
    * `skip` & `limit` (pagination)
  * `GET /{id}`: Returns a single expense by ID (verifies ownership).
  * `PUT /{id}`: Updates an expense (verifies ownership).
  * `DELETE /{id}`: Deletes an expense (verifies ownership).

#### 9. `backend/app/routers/analytics_router.py`
* **Prefix**: `/api/analytics`
* **Endpoints**:
  * `GET /by-category`: Executes a SQL `GROUP BY Expense.category` and `SUM(Expense.amount)` query using SQLAlchemy `func.sum()` to return total spending and percentage distribution by category.
  * `GET /dashboard`: Computes all-time total spending, current month spending (filtered by year & month), remaining monthly budget (default ₹25,000), transaction count, and category breakdown.

#### 10. `backend/tests/conftest.py`
* **Purpose**: Setup and fixtures for automated testing with `pytest`.
* **Key Functionality**:
  * Configures an isolated **in-memory SQLite database** (`sqlite:///:memory:`).
  * Uses FastAPI's `app.dependency_overrides[get_db]` so tests run against the in-memory database without modifying local data.
  * Provides `client` fixture (`TestClient(app)`).
  * Provides `auth_headers` fixture that registers a test user and returns a valid Bearer token header.

#### 11. `backend/tests/test_api.py`
* **Purpose**: Automated test suite.
* **Test Cases**:
  1. `test_health_check`: Verifies server health status.
  2. `test_user_registration`: Tests user sign-up and JWT token issuance.
  3. `test_user_duplicate_email_fails`: Tests that duplicate emails are rejected with `400 Bad Request`.
  4. `test_user_login`: Tests successful authentication.
  5. `test_create_expense_unauthorized`: Verifies that unauthenticated requests to `/expenses` return `401 Unauthorized`.
  6. `test_create_and_get_expense`: Tests creating and retrieving an expense with Bearer token.
  7. `test_expense_filtering_and_analytics`: Tests filtering by category and verifies SQL `SUM` and `GROUP BY` output.

#### 12. `backend/alembic/`
* **Purpose**: Database schema migration history.
* Contains `alembic.ini`, `alembic/env.py` (configured to import `Base.metadata` from `models.py`), and migration version scripts.

---

### B. Frontend Files (React / Tailwind CSS v4)

#### 1. `frontend/src/App.jsx`
* **Purpose**: Root application component and state coordinator.
* **Key Functionality**:
  * Tracks global state: `user`, `summary`, `expenses`, `searchTerm`, `selectedCategory`, and modal open/close states.
  * Calls `fetchDashboardData()` whenever filters change or an expense is modified.
  * Provides a **"Load Sample Transactions"** button that automatically pre-populates 6 realistic Indian Rupee expenses (Swiggy, Electricity, PVR Cinema, Netflix/Spotify, Chai, Airtel Wi-Fi) if an account is brand new.
  * Renders conditional views: Landing page if unauthenticated, Full Dashboard if logged in.

#### 2. `frontend/src/api.js`
* **Purpose**: Axios HTTP client configuration and API service functions.
* **Key Functionality**:
  * Base URL configured via `import.meta.env.VITE_API_URL` (defaults to `http://localhost:8000`).
  * **Axios Request Interceptor**: Automatically pulls `zenith_token` from `localStorage` and attaches `Authorization: Bearer <token>` to all outgoing requests.
  * **Axios Response Interceptor**: Catches `401 Unauthorized` responses and logs out the user cleanly.
  * Exports `authService` (`login`, `register`, `logout`, `getUser`) and `expenseService` (`getExpenses`, `createExpense`, `updateExpense`, `deleteExpense`, `getDashboardSummary`).

#### 3. `frontend/src/components/Navbar.jsx`
* **Purpose**: Top navigation header.
* **Key Functionality**:
  * Displays brand logo with vector icon.
  * Displays "+ Add Expense" quick action button.
  * Shows user initials badge and display name.
  * Provides one-click Sign Out button.

#### 4. `frontend/src/components/StatsCards.jsx`
* **Purpose**: Displays the top 3 KPI summary cards.
* **Key Cards**:
  1. **All-Time Spending**: Total amount spent in ₹ across all transactions.
  2. **This Month's Spending**: Amount spent in the current calendar month with a budget usage percentage badge.
  3. **Remaining Budget**: Calculates `₹25,000 - monthly_spent` with dynamic color indicators (green if healthy, red if budget is low).

#### 5. `frontend/src/components/CategoryBreakdown.jsx`
* **Purpose**: Visual analytics for spending categories and budget health.
* **Key Functionality**:
  * **Category Progress Bars**: Displays spending for Food (Teal), Utilities (Indigo), Entertainment (Purple), Subscriptions (Amber), and Other, with colored percentage bars and amounts in ₹.
  * **Monthly Budget Health Meter**: Circular gauge displaying the percentage of monthly budget remaining.

#### 6. `frontend/src/components/TransactionTable.jsx`
* **Purpose**: Searchable, filterable table of financial transactions.
* **Key Functionality**:
  * Search input to filter expenses by description/title.
  * Dropdown selector to filter by category ("All", "Food", "Utilities", etc.).
  * Formatted columns: Date, Category badge pill, Description + notes, Amount in Rupees (`-₹450.00`), Edit icon, and Delete icon.
  * Empty state message when no transactions match.

#### 7. `frontend/src/components/ExpenseModal.jsx`
* **Purpose**: Modal form popup to create or edit an expense.
* **Key Functionality**:
  * Form fields: Description/Title, Amount in ₹ (positive number validation), Category dropdown, Date picker, and Optional Notes.
  * Dynamically switches between "Add Expense" and "Edit Expense" modes based on whether `expenseToEdit` is provided.

#### 8. `frontend/src/components/AuthModal.jsx`
* **Purpose**: User authentication modal.
* **Key Functionality**:
  * Toggle between "Sign In" and "Create Account" tabs.
  * **"1-Click Demo Interviewer Login" button**: Logs in with a pre-configured demo account (`demo@zenith.com`) or creates it automatically in one click, allowing anyone to test the app without manual typing.

#### 9. `frontend/src/index.css`
* **Purpose**: Global stylesheet using **Tailwind CSS v4**.
* Uses `@import "tailwindcss";` and sets the dark-mode background color `#0b0f19` and Plus Jakarta Sans font.

#### 10. `frontend/vite.config.js`
* **Purpose**: Vite bundler configuration.
* Configures `@tailwindcss/vite` and `@vitejs/plugin-react` plugins.

---

### C. Configuration & DevOps Files

#### 1. `backend/requirements.txt`
* Explicit list of Python dependencies: `fastapi`, `uvicorn`, `sqlalchemy`, `pydantic`, `pydantic-settings`, `pyjwt`, `bcrypt`, `python-multipart`, `python-dotenv`, `httpx`, `pytest`, `email-validator`, and `alembic`.

#### 2. `backend/.env` & `backend/.env.example`
* Stores environment variables (`DATABASE_URL`, `SECRET_KEY`, `ALGORITHM`, `ACCESS_TOKEN_EXPIRE_MINUTES`, `ALLOWED_ORIGINS`).

#### 3. `backend/pytest.ini`
* Pytest configuration file setting `pythonpath = .` and `testpaths = tests`.

#### 4. `.gitignore`
* Prevents `backend/venv/`, `frontend/node_modules/`, `*.db`, `.env`, and build artifacts from being committed to Git.

---

## 6. API Endpoints Reference

All routes are prefixed with `/api`.

| HTTP Method | Route | Description | Auth Required? | Request Body / Query Params | Response Code |
| :--- | :--- | :--- | :---: | :--- | :---: |
| `GET` | `/` | API Information & Docs link | No | None | 200 |
| `GET` | `/health` | Health check endpoint | No | None | 200 |
| `POST` | `/api/auth/register` | Register new user account | No | `{"email", "password", "full_name"}` | 201 |
| `POST` | `/api/auth/login` | Authenticate user & get token | No | `{"email", "password"}` | 200 |
| `GET` | `/api/auth/me` | Fetch active user profile | Yes (JWT) | None | 200 |
| `POST` | `/api/expenses` | Create a new expense | Yes (JWT) | `{"title", "amount", "category", "date", "notes"}` | 201 |
| `GET` | `/api/expenses` | List user expenses | Yes (JWT) | `?category=...&search=...&skip=0&limit=50` | 200 |
| `GET` | `/api/expenses/{id}` | Get single expense | Yes (JWT) | None | 200 / 404 |
| `PUT` | `/api/expenses/{id}` | Update an expense | Yes (JWT) | `{"title", "amount", "category", ...}` | 200 / 404 |
| `DELETE`| `/api/expenses/{id}` | Delete an expense | Yes (JWT) | None | 204 / 404 |
| `GET` | `/api/analytics/by-category`| Category breakdown with % | Yes (JWT) | None | 200 |
| `GET` | `/api/analytics/dashboard` | Top KPI summary & metrics | Yes (JWT) | `?monthly_budget=25000` | 200 |

---

## 7. How to Run & Test the Application

### 1. Run the Backend
```powershell
cd backend

# Activate virtual environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Start server
uvicorn app.main:app --reload --port 8000
```
* **API Documentation**: Open [http://localhost:8000/docs](http://localhost:8000/docs) in your browser.

### 2. Run the Automated Tests
```powershell
cd backend
pytest -v
```
*(All 7 tests will execute in ~2 seconds).*

### 3. Run the Frontend
```powershell
cd frontend
npm run dev
```
* **Web Dashboard**: Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 8. Interview Walkthrough & Key Talking Points

Use this section to confidently answer technical interview questions when presenting this project:

### The 60-Second Elevator Pitch:
> *"I built **Zenith Finance**, a full-stack personal finance and expense analytics platform. The backend is built using **FastAPI** and **SQLAlchemy 2.0** with **OAuth2 JWT Bearer authentication** and **Bcrypt password hashing**. I used **Alembic** for tracked database migrations and wrote automated integration tests with **Pytest** using an in-memory SQLite database. The frontend is built with **React** and **Tailwind CSS v4**, featuring real-time KPI metrics in Indian Rupees and category aggregations pushed down to the database engine via SQL `GROUP BY` queries."*

### Top 5 Interview Questions & How to Answer Them:

#### Q1: "Why did you choose FastAPI over Flask or Django?"
* **Answer**: *"FastAPI offers modern async/await support, automatic OpenAPI/Swagger documentation generation, and native integration with Pydantic for data validation. Coming from Node/Express, FastAPI feels very modern, highly typed, and allows building clean microservices with minimal boilerplate compared to Django's heavy framework."*

#### Q2: "How does SQLAlchemy compare to Mongoose in MongoDB?"
* **Answer**: *"In Mongoose, data is schemaless and stored as JSON documents. In SQLAlchemy, data is normalized across relational SQL tables with strict column types, primary keys, foreign key constraints, and cascading deletes. SQLAlchemy 2.0 provides an explicit mapping between Python classes and database tables, allowing us to perform efficient SQL joins, aggregations, and migrations using Alembic."*

#### Q3: "How does your route protection work?"
* **Answer**: *"FastAPI uses a Dependency Injection system. I defined a `get_current_user` dependency that uses `OAuth2PasswordBearer`. When a protected route is requested, FastAPI extracts the Bearer token from the `Authorization` header, decodes and verifies the JWT signature, and fetches the user from the database. If the token is missing, expired, or invalid, it immediately halts execution and returns a 401 Unauthorized response."*

#### Q4: "How does the Category Analytics endpoint calculate percentages?"
* **Answer**: *"Rather than fetching all transactions into Python and doing slow array filtering in application memory, I designed a server-side SQL aggregation query using SQLAlchemy's `func.sum()` and `group_by(Expense.category)`. The database engine computes the totals directly, resulting in sub-millisecond response times even as data scales."*

#### Q5: "How do your tests work?"
* **Answer**: *"I used Pytest with FastAPI's `TestClient`. In `conftest.py`, I created an isolated in-memory SQLite database (`sqlite:///:memory:`) and used FastAPI's `app.dependency_overrides[get_db]` to swap the database connection. This ensures tests run in isolation without modifying the development database, running all 7 test cases in under 3 seconds."*

---

*Documentation generated for Zenith Finance. Repository root: `c:\Users\absin\Desktop\pyt`.*
