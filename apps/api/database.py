# File: apps/api/database.py
import os
from sqlalchemy import create_engine, Column, String
from sqlalchemy.orm import sessionmaker, declarative_base
from pgvector.sqlalchemy import Vector
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# This class mirrors the relevant fields from the Prisma Student model
class Student(Base):
    __tablename__ = "Student" # Prisma model names are case-sensitive
    id = Column(String, primary_key=True)
    rollNumber = Column(String, unique=True, nullable=False)
    encoding = Column(Vector(4096)) # Must match the dimension in Prisma

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()