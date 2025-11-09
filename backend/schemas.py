from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# Request Schemas
class CourseCreate(BaseModel):
    course_name: str
    course_number: str
    major: str
    school_name: str
    dialogues_requirement: Optional[str] = None
    delivery_mode: str
    rating: int = Field(..., ge=1, le=5)
    review: str
    textbook: Optional[str] = None


class RatingCreate(BaseModel):
    course_id: int
    rating: int = Field(..., ge=1, le=5)
    review: str
    textbook: Optional[str] = None


# Response Schemas
class SchoolResponse(BaseModel):
    school_id: int
    school_name: str
    
    class Config:
        from_attributes = True


class CourseResponse(BaseModel):
    course_id: int
    course_name: str
    course_number: str
    major: str
    school_id: int
    dialogues_requirement: Optional[str]
    delivery_mode: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class RatingResponse(BaseModel):
    rating_id: int
    course_id: int
    rating: int
    review: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class CourseDetail(BaseModel):
    course_id: int
    course_name: str
    course_number: str
    major: str
    school_name: str
    dialogues_requirement: Optional[str]
    delivery_mode: str
    average_rating: Optional[float]
    rating_count: int
    created_at: datetime
    ratings: List[RatingResponse]
    
    class Config:
        from_attributes = True


class CourseWithRatings(BaseModel):
    course_id: int
    course_name: str
    course_number: str
    major: str
    school_name: str
    dialogues_requirement: Optional[str]
    delivery_mode: str
    average_rating: Optional[float]
    rating_count: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class CourseListItem(BaseModel):
    course_id: int
    course_name: str
    course_number: str
    major: str
    
    class Config:
        from_attributes = True

