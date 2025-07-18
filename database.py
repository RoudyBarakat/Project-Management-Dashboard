# Backend/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from models import Base # Import Base from your models

# SQLAlchemy Database URL for SQLite
SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db" # This creates a sqlite file in the project root

# For PostgreSQL, you'd use something like:
# SQLALCHEMY_DATABASE_URL = "postgresql://user:password@host:port/dbname"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False} # Needed for SQLite only
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Function to create all tables
def create_db_tables():
    Base.metadata.create_all(bind=engine)
    print("Database tables created or already exist.")

if __name__ == "__main__":
    create_db_tables()