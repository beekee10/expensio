from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

# 1. Database Connection Setup
# SQLite requires check_same_thread=False; PostgreSQL does not need it.
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

database_url = settings.DATABASE_URL
if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

# 2. Create the Database Engine
engine = create_engine(database_url, connect_args=connect_args)

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
