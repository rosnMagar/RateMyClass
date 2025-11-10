from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from database import get_db, init_db, School, Course, Rating, Book, Professor, SessionLocal, User, UserRole
from schemas import CourseCreate, CourseWithRatings, CourseResponse, RatingResponse, SchoolResponse, CourseListItem, CourseDetail, RatingCreate
from auth import get_password_hash, verify_password, create_access_token, get_current_admin, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import timedelta
from pydantic import BaseModel
import os

app = FastAPI()

# CORS middleware to allow frontend-backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL")],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request/Response schemas for auth
class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    role: str


class TokenData(BaseModel):
    username: Optional[str] = None


@app.on_event("startup")
async def startup_event():
    """Initialize database tables on startup"""
    init_db()
    
    # Ensure Truman State University exists
    db = SessionLocal()
    try:
        truman = db.query(School).filter(
            func.lower(School.school_name).like('%truman%')
        ).first()
        if not truman:
            truman = School(school_name="Truman State University")
            db.add(truman)
            db.commit()
        
        # Create default admin user if it doesn't exist
        admin = db.query(User).filter(User.username == "courseadmin").first()
        if not admin:
            admin = User(
                username="courseadmin",
                password_hash=get_password_hash("password"),
                role=UserRole.ADMIN
            )
            db.add(admin)
            db.commit()
            print("✓ Default admin user created (username: courseadmin, password: password)")
    except Exception as e:
        db.rollback()
        print(f"Warning: Could not initialize database: {e}")
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"message": "RateMyClass API is running!"}


@app.get("/schools", response_model=List[SchoolResponse])
def get_schools(db: Session = Depends(get_db)):
    """Get all schools"""
    schools = db.query(School).all()
    return schools


@app.get("/schools/{school_id}/courses", response_model=List[CourseListItem])
def get_courses_by_school(school_id: int, db: Session = Depends(get_db)):
    """Get all courses for a specific school"""
    courses = db.query(Course).filter(Course.school_id == school_id).all()
    return courses


@app.post("/auth/login", response_model=LoginResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Admin login endpoint"""
    user = db.query(User).filter(User.username == login_data.username).first()
    
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role.value},
        expires_delta=access_token_expires
    )
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        role=user.role.value
    )


@app.post("/ratings", response_model=RatingResponse)
def create_rating(rating_data: RatingCreate, db: Session = Depends(get_db)):
    """Create a rating for an existing course (no authentication required)"""
    try:
        # Verify course exists
        course = db.query(Course).filter(Course.course_id == rating_data.course_id).first()
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        
        # Handle textbook (optional)
        book_id = None
        if rating_data.textbook and rating_data.textbook != 'n/a':
            book = db.query(Book).filter(
                (Book.isbn == rating_data.textbook) | (Book.title == rating_data.textbook)
            ).first()
            if not book:
                # Try to determine if it's ISBN or title
                if rating_data.textbook.replace("-", "").replace(" ", "").isdigit():
                    book = Book(isbn=rating_data.textbook)
                else:
                    book = Book(title=rating_data.textbook)
                db.add(book)
                db.flush()
            book_id = book.book_id
        
        # Create a default professor if none exists
        professor = db.query(Professor).filter(
            Professor.first_name == "Unknown",
            Professor.last_name == "Professor"
        ).first()
        if not professor:
            professor = Professor(first_name="Unknown", last_name="Professor")
            db.add(professor)
            db.flush()
        
        # Create rating
        rating = Rating(
            course_id=rating_data.course_id,
            professor_id=professor.professor_id,
            book_id=book_id,
            rating=rating_data.rating,
            review=rating_data.review
        )
        db.add(rating)
        db.commit()
        db.refresh(rating)
        
        return rating
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating rating: {str(e)}")


@app.post("/courses", response_model=CourseResponse)
def create_course(course_data: CourseCreate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    """Create a new course (optionally with rating)"""
    try:
        # Get or create school
        school = db.query(School).filter(School.school_name == course_data.school_name).first()
        if not school:
            school = School(school_name=course_data.school_name)
            db.add(school)
            db.flush()
        
        # Check if course already exists
        existing_course = db.query(Course).filter(
            Course.course_number == course_data.course_number,
            Course.school_id == school.school_id
        ).first()
        
        if existing_course:
            course = existing_course
        else:
            # Create new course
            course = Course(
                course_name=course_data.course_name,
                course_number=course_data.course_number,
                major=course_data.major,
                school_id=school.school_id,
                dialogues_requirement=course_data.dialogues_requirement,
                delivery_mode=course_data.delivery_mode
            )
            db.add(course)
            db.flush()
        
        # Only create rating if rating and review are provided
        if course_data.rating and course_data.review:
            # Handle textbook (optional)
            book_id = None
            if course_data.textbook:
                book = db.query(Book).filter(
                    (Book.isbn == course_data.textbook) | (Book.title == course_data.textbook)
                ).first()
                if not book:
                    # Try to determine if it's ISBN or title
                    if course_data.textbook.replace("-", "").replace(" ", "").isdigit():
                        book = Book(isbn=course_data.textbook)
                    else:
                        book = Book(title=course_data.textbook)
                    db.add(book)
                    db.flush()
                book_id = book.book_id
            
            # Create a default professor if none exists
            professor = db.query(Professor).filter(
                Professor.first_name == "Unknown",
                Professor.last_name == "Professor"
            ).first()
            if not professor:
                professor = Professor(first_name="Unknown", last_name="Professor")
                db.add(professor)
                db.flush()
            
            # Create rating
            rating = Rating(
                course_id=course.course_id,
                professor_id=professor.professor_id,
                book_id=book_id,
                rating=course_data.rating,
                review=course_data.review
            )
            db.add(rating)
        
        db.commit()
        db.refresh(course)
        
        return course
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating course: {str(e)}")


@app.get("/courses", response_model=List[CourseWithRatings])
def get_courses(
    search: Optional[str] = None,
    major: Optional[str] = None,
    delivery_mode: Optional[str] = None,
    school_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Get all courses with their average ratings"""
    query = db.query(
        Course,
        School.school_name,
        func.avg(Rating.rating).label('avg_rating'),
        func.count(Rating.rating_id).label('rating_count')
    ).join(School).outerjoin(Rating).group_by(Course.course_id, School.school_name)
    
    # Apply filters
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (func.lower(Course.course_name).like(func.lower(search_term))) |
            (func.lower(Course.course_number).like(func.lower(search_term))) |
            (func.lower(Course.major).like(func.lower(search_term))) |
            (func.lower(Course.dialogues_requirement).like(func.lower(search_term))) |
            (func.lower(Course.delivery_mode).like(func.lower(search_term)))
        )
    
    if major:
        query = query.filter(func.lower(Course.major).like(func.lower(f"%{major}%")))
    
    if delivery_mode:
        query = query.filter(Course.delivery_mode == delivery_mode)
    
    if school_id:
        query = query.filter(Course.school_id == school_id)
    
    results = query.all()
    
    courses_with_ratings = []
    for course, school_name, avg_rating, rating_count in results:
        courses_with_ratings.append(CourseWithRatings(
            course_id=course.course_id,
            course_name=course.course_name,
            course_number=course.course_number,
            major=course.major,
            school_name=school_name,
            dialogues_requirement=course.dialogues_requirement,
            delivery_mode=course.delivery_mode,
            average_rating=float(avg_rating) if avg_rating else None,
            rating_count=rating_count or 0,
            created_at=course.created_at
        ))
    
    return courses_with_ratings


@app.get("/courses/{course_id}", response_model=CourseWithRatings)
def get_course(course_id: int, db: Session = Depends(get_db)):
    """Get a specific course by ID"""
    result = db.query(
        Course,
        School.school_name,
        func.avg(Rating.rating).label('avg_rating'),
        func.count(Rating.rating_id).label('rating_count')
    ).join(School).outerjoin(Rating).filter(
        Course.course_id == course_id
    ).group_by(Course.course_id, School.school_name).first()
    
    if not result:
        raise HTTPException(status_code=404, detail="Course not found")
    
    course, school_name, avg_rating, rating_count = result
    
    return CourseWithRatings(
        course_id=course.course_id,
        course_name=course.course_name,
        course_number=course.course_number,
        major=course.major,
        school_name=school_name,
        dialogues_requirement=course.dialogues_requirement,
        delivery_mode=course.delivery_mode,
        average_rating=float(avg_rating) if avg_rating else None,
        rating_count=rating_count or 0,
        created_at=course.created_at
    )


@app.get("/courses/{course_id}/detail", response_model=CourseDetail)
def get_course_detail(course_id: int, db: Session = Depends(get_db)):
    """Get a specific course with all its ratings"""
    # Get course info with average rating
    result = db.query(
        Course,
        School.school_name,
        func.avg(Rating.rating).label('avg_rating'),
        func.count(Rating.rating_id).label('rating_count')
    ).join(School).outerjoin(Rating).filter(
        Course.course_id == course_id
    ).group_by(Course.course_id, School.school_name).first()
    
    if not result:
        raise HTTPException(status_code=404, detail="Course not found")
    
    course, school_name, avg_rating, rating_count = result
    
    # Get all ratings for this course
    ratings = db.query(Rating).filter(Rating.course_id == course_id).order_by(Rating.created_at.desc()).all()
    
    return CourseDetail(
        course_id=course.course_id,
        course_name=course.course_name,
        course_number=course.course_number,
        major=course.major,
        school_name=school_name,
        dialogues_requirement=course.dialogues_requirement,
        delivery_mode=course.delivery_mode,
        average_rating=float(avg_rating) if avg_rating else None,
        rating_count=rating_count or 0,
        created_at=course.created_at,
        ratings=[RatingResponse(
            rating_id=r.rating_id,
            course_id=r.course_id,
            rating=r.rating,
            review=r.review,
            created_at=r.created_at
        ) for r in ratings]
    )