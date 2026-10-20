from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

# 1. Database Connection Setup
# SQLite requires check_same_thread=False; PostgreSQL does not need it.
connect_args = {}
engine_kwargs = {}

if settings.DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False
else:
    # Recommended settings for cloud-hosted PostgreSQL (Neon, Supabase)
    engine_kwargs["pool_pre_ping"] = True
    engine_kwargs["pool_recycle"] = 300

# 2. Create the Database Engine
engine = create_engine(settings.sync_database_url, connect_args=connect_args, **engine_kwargs)

# 3. Create Session Factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. Base class for our SQLAlchemy Models
Base = declarative_base()


# 5. Dependency to get DB session in route functions
def get_db():
    """Opens a database session for each request and automatically closes it when finished."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
