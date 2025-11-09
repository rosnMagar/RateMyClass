from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey, CheckConstraint, Boolean, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os
import enum
from dotenv import load_dotenv

load_dotenv()

# Database connection string
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://root:password@localhost:3306/ratemyclass"
)

# Create engine
engine = create_engine(DATABASE_URL, echo=True)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


class UserRole(enum.Enum):
    ADMIN = "admin"
    USER = "user"


# Database Models
class User(Base):
    __tablename__ = "user"
    
    user_id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(100), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.USER)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class School(Base):
    __tablename__ = "school"
    
    school_id = Column(Integer, primary_key=True, autoincrement=True)
    school_name = Column(String(255), nullable=False, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    courses = relationship("Course", back_populates="school")


class Book(Base):
    __tablename__ = "books"
    
    book_id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(500), nullable=True)
    isbn = Column(String(20), nullable=True, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    ratings = relationship("Rating", back_populates="book")


class Professor(Base):
    __tablename__ = "professor"
    
    professor_id = Column(Integer, primary_key=True, autoincrement=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=True, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    ratings = relationship("Rating", back_populates="professor")


class Course(Base):
    __tablename__ = "course"
    
    course_id = Column(Integer, primary_key=True, autoincrement=True)
    course_name = Column(String(255), nullable=False)
    course_number = Column(String(50), nullable=False)
    major = Column(String(100), nullable=False)
    school_id = Column(Integer, ForeignKey("school.school_id", ondelete="CASCADE"), nullable=False)
    dialogues_requirement = Column(String(50), nullable=True)
    delivery_mode = Column(String(20), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    school = relationship("School", back_populates="courses")
    ratings = relationship("Rating", back_populates="course")


class Rating(Base):
    __tablename__ = "rating"
    
    rating_id = Column(Integer, primary_key=True, autoincrement=True)
    course_id = Column(Integer, ForeignKey("course.course_id", ondelete="CASCADE"), nullable=False)
    professor_id = Column(Integer, ForeignKey("professor.professor_id", ondelete="CASCADE"), nullable=False)
    book_id = Column(Integer, ForeignKey("books.book_id", ondelete="SET NULL"), nullable=True)
    rating = Column(Integer, nullable=False)
    review = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    course = relationship("Course", back_populates="ratings")
    professor = relationship("Professor", back_populates="ratings")
    book = relationship("Book", back_populates="ratings")
    
    __table_args__ = (
        CheckConstraint('rating >= 1 AND rating <= 5', name='check_rating_range'),
    )


# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Create all tables
def init_db():
    Base.metadata.create_all(bind=engine)

