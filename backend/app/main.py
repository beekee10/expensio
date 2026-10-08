from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base
from app.routers.auth_router import router as auth_router
from app.routers.expense_router import router as expense_router
from app.routers.analytics_router import router as analytics_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on application startup
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="High-performance FinTech Expense & Analytics REST API built with FastAPI and SQLAlchemy.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS configuration
origins = settings.cors_origins
if not origins or "*" not in origins:
    # Ensure standard frontend dev ports are explicitly supported
    origins.extend(["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for seamless development & deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth_router)
app.include_router(expense_router)
app.include_router(analytics_router)


@app.get("/", tags=["Health"])
def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "docs": "/docs",
        "version": "1.0.0"
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}
