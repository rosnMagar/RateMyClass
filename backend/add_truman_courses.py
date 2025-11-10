#!/usr/bin/env python3
"""
Script to add Truman State University courses to the database.
Adds a small selection of popular courses including dialogues courses.
"""

import sys
from sqlalchemy.orm import Session
from database import SessionLocal, School, Course, Professor, Book, Rating
from sqlalchemy import func

# Comprehensive selection of Truman State University courses
COURSES = [
    # Computer Science
    {"course_name": "Introduction to Computer Science", "course_number": "CS 170", "major": "Computer Science", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Data Structures", "course_number": "CS 180", "major": "Computer Science", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Computer Organization", "course_number": "CS 210", "major": "Computer Science", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Programming Languages", "course_number": "CS 240", "major": "Computer Science", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Algorithms", "course_number": "CS 300", "major": "Computer Science", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Database Systems", "course_number": "CS 320", "major": "Computer Science", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Software Engineering", "course_number": "CS 330", "major": "Computer Science", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Operating Systems", "course_number": "CS 340", "major": "Computer Science", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Computer Networks", "course_number": "CS 350", "major": "Computer Science", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Artificial Intelligence", "course_number": "CS 420", "major": "Computer Science", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Machine Learning", "course_number": "CS 430", "major": "Computer Science", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    
    # Biology
    {"course_name": "General Biology I", "course_number": "BIOL 100", "major": "Biology", "dialogues_requirement": "Natural & Physical World", "delivery_mode": "In-Person"},
    {"course_name": "General Biology II", "course_number": "BIOL 101", "major": "Biology", "dialogues_requirement": "Natural & Physical World", "delivery_mode": "In-Person"},
    {"course_name": "Cell Biology", "course_number": "BIOL 200", "major": "Biology", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Genetics", "course_number": "BIOL 210", "major": "Biology", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Ecology", "course_number": "BIOL 220", "major": "Biology", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Microbiology", "course_number": "BIOL 300", "major": "Biology", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Molecular Biology", "course_number": "BIOL 310", "major": "Biology", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Evolution", "course_number": "BIOL 320", "major": "Biology", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Human Anatomy", "course_number": "BIOL 330", "major": "Biology", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Physiology", "course_number": "BIOL 340", "major": "Biology", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    
    # Chemistry
    {"course_name": "General Chemistry I", "course_number": "CHEM 131", "major": "Chemistry", "dialogues_requirement": "Natural & Physical World", "delivery_mode": "In-Person"},
    {"course_name": "General Chemistry II", "course_number": "CHEM 132", "major": "Chemistry", "dialogues_requirement": "Natural & Physical World", "delivery_mode": "In-Person"},
    {"course_name": "Organic Chemistry I", "course_number": "CHEM 331", "major": "Chemistry", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Organic Chemistry II", "course_number": "CHEM 332", "major": "Chemistry", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Physical Chemistry I", "course_number": "CHEM 350", "major": "Chemistry", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Physical Chemistry II", "course_number": "CHEM 351", "major": "Chemistry", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Biochemistry", "course_number": "CHEM 420", "major": "Chemistry", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Analytical Chemistry", "course_number": "CHEM 410", "major": "Chemistry", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Inorganic Chemistry", "course_number": "CHEM 430", "major": "Chemistry", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    
    # Mathematics
    {"course_name": "Calculus I", "course_number": "MATH 198", "major": "Mathematics", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Calculus II", "course_number": "MATH 199", "major": "Mathematics", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Calculus III", "course_number": "MATH 263", "major": "Mathematics", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Linear Algebra", "course_number": "MATH 280", "major": "Mathematics", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Differential Equations", "course_number": "MATH 300", "major": "Mathematics", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Abstract Algebra", "course_number": "MATH 350", "major": "Mathematics", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Real Analysis", "course_number": "MATH 360", "major": "Mathematics", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Probability and Statistics", "course_number": "MATH 320", "major": "Mathematics", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Number Theory", "course_number": "MATH 370", "major": "Mathematics", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Topology", "course_number": "MATH 380", "major": "Mathematics", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    
    # Psychology
    {"course_name": "Introduction to Psychology", "course_number": "PSYC 166", "major": "Psychology", "dialogues_requirement": "Social & Behavioral", "delivery_mode": "In-Person"},
    {"course_name": "Developmental Psychology", "course_number": "PSYC 200", "major": "Psychology", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Abnormal Psychology", "course_number": "PSYC 210", "major": "Psychology", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Cognitive Psychology", "course_number": "PSYC 220", "major": "Psychology", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Social Psychology", "course_number": "PSYC 230", "major": "Psychology", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Research Methods", "course_number": "PSYC 300", "major": "Psychology", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Biological Psychology", "course_number": "PSYC 310", "major": "Psychology", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Personality Psychology", "course_number": "PSYC 320", "major": "Psychology", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Clinical Psychology", "course_number": "PSYC 400", "major": "Psychology", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    
    # English
    {"course_name": "World Literature", "course_number": "ENGL 200", "major": "English", "dialogues_requirement": "Aesthetic & Interpretive", "delivery_mode": "In-Person"},
    {"course_name": "British Literature I", "course_number": "ENGL 210", "major": "English", "dialogues_requirement": "Aesthetic & Interpretive", "delivery_mode": "In-Person"},
    {"course_name": "British Literature II", "course_number": "ENGL 211", "major": "English", "dialogues_requirement": "Aesthetic & Interpretive", "delivery_mode": "In-Person"},
    {"course_name": "American Literature I", "course_number": "ENGL 220", "major": "English", "dialogues_requirement": "Aesthetic & Interpretive", "delivery_mode": "In-Person"},
    {"course_name": "American Literature II", "course_number": "ENGL 221", "major": "English", "dialogues_requirement": "Aesthetic & Interpretive", "delivery_mode": "In-Person"},
    {"course_name": "Creative Writing", "course_number": "ENGL 300", "major": "English", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Shakespeare", "course_number": "ENGL 310", "major": "English", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Modern Poetry", "course_number": "ENGL 320", "major": "English", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Literary Theory", "course_number": "ENGL 400", "major": "English", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    
    # Physics
    {"course_name": "General Physics I", "course_number": "PHYS 185", "major": "Physics", "dialogues_requirement": "Natural & Physical World", "delivery_mode": "In-Person"},
    {"course_name": "General Physics II", "course_number": "PHYS 186", "major": "Physics", "dialogues_requirement": "Natural & Physical World", "delivery_mode": "In-Person"},
    {"course_name": "Mechanics", "course_number": "PHYS 300", "major": "Physics", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Electricity and Magnetism", "course_number": "PHYS 310", "major": "Physics", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Thermodynamics", "course_number": "PHYS 320", "major": "Physics", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Quantum Mechanics", "course_number": "PHYS 400", "major": "Physics", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Optics", "course_number": "PHYS 410", "major": "Physics", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    
    # History
    {"course_name": "World History I", "course_number": "HIST 100", "major": "History", "dialogues_requirement": "Historical Perspectives", "delivery_mode": "In-Person"},
    {"course_name": "World History II", "course_number": "HIST 101", "major": "History", "dialogues_requirement": "Historical Perspectives", "delivery_mode": "In-Person"},
    {"course_name": "American History I", "course_number": "HIST 200", "major": "History", "dialogues_requirement": "Historical Perspectives", "delivery_mode": "In-Person"},
    {"course_name": "American History II", "course_number": "HIST 201", "major": "History", "dialogues_requirement": "Historical Perspectives", "delivery_mode": "In-Person"},
    {"course_name": "European History", "course_number": "HIST 300", "major": "History", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Ancient History", "course_number": "HIST 310", "major": "History", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Medieval History", "course_number": "HIST 320", "major": "History", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Modern European History", "course_number": "HIST 330", "major": "History", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    
    # Business
    {"course_name": "Principles of Accounting I", "course_number": "ACCT 200", "major": "Business", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Principles of Accounting II", "course_number": "ACCT 201", "major": "Business", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Principles of Management", "course_number": "MGMT 200", "major": "Business", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Marketing Principles", "course_number": "MKTG 200", "major": "Business", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Financial Management", "course_number": "FIN 300", "major": "Business", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Business Law", "course_number": "BUS 300", "major": "Business", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Organizational Behavior", "course_number": "MGMT 310", "major": "Business", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Strategic Management", "course_number": "MGMT 400", "major": "Business", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    
    # Economics
    {"course_name": "Principles of Microeconomics", "course_number": "ECON 200", "major": "Economics", "dialogues_requirement": "Social & Behavioral", "delivery_mode": "In-Person"},
    {"course_name": "Principles of Macroeconomics", "course_number": "ECON 201", "major": "Economics", "dialogues_requirement": "Social & Behavioral", "delivery_mode": "In-Person"},
    {"course_name": "Intermediate Microeconomics", "course_number": "ECON 300", "major": "Economics", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Intermediate Macroeconomics", "course_number": "ECON 301", "major": "Economics", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Econometrics", "course_number": "ECON 400", "major": "Economics", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "International Economics", "course_number": "ECON 410", "major": "Economics", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    
    # Political Science
    {"course_name": "American Government", "course_number": "POL 100", "major": "Political Science", "dialogues_requirement": "Social & Behavioral", "delivery_mode": "In-Person"},
    {"course_name": "Comparative Politics", "course_number": "POL 200", "major": "Political Science", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "International Relations", "course_number": "POL 300", "major": "Political Science", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Political Theory", "course_number": "POL 310", "major": "Political Science", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Public Policy", "course_number": "POL 400", "major": "Political Science", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    
    # Philosophy
    {"course_name": "Introduction to Philosophy", "course_number": "PHIL 100", "major": "Philosophy", "dialogues_requirement": "Values & Beliefs", "delivery_mode": "In-Person"},
    {"course_name": "Ethics", "course_number": "PHIL 200", "major": "Philosophy", "dialogues_requirement": "Values & Beliefs", "delivery_mode": "In-Person"},
    {"course_name": "Logic", "course_number": "PHIL 210", "major": "Philosophy", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Ancient Philosophy", "course_number": "PHIL 300", "major": "Philosophy", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Modern Philosophy", "course_number": "PHIL 310", "major": "Philosophy", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    
    # Communication
    {"course_name": "Public Speaking", "course_number": "COMM 100", "major": "Communication", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Interpersonal Communication", "course_number": "COMM 200", "major": "Communication", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Mass Media", "course_number": "COMM 300", "major": "Communication", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Rhetoric and Persuasion", "course_number": "COMM 310", "major": "Communication", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    
    # Education
    {"course_name": "Introduction to Education", "course_number": "EDUC 100", "major": "Education", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Educational Psychology", "course_number": "EDUC 200", "major": "Education", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Curriculum Development", "course_number": "EDUC 300", "major": "Education", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    {"course_name": "Classroom Management", "course_number": "EDUC 310", "major": "Education", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    
    # Art
    {"course_name": "Drawing I", "course_number": "ART 100", "major": "Art", "dialogues_requirement": "Aesthetic & Interpretive", "delivery_mode": "In-Person"},
    {"course_name": "Painting I", "course_number": "ART 200", "major": "Art", "dialogues_requirement": "Aesthetic & Interpretive", "delivery_mode": "In-Person"},
    {"course_name": "Art History I", "course_number": "ART 300", "major": "Art", "dialogues_requirement": "Aesthetic & Interpretive", "delivery_mode": "In-Person"},
    {"course_name": "Sculpture", "course_number": "ART 310", "major": "Art", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    
    # Music
    {"course_name": "Music Theory I", "course_number": "MUS 100", "major": "Music", "dialogues_requirement": "Aesthetic & Interpretive", "delivery_mode": "In-Person"},
    {"course_name": "Music History", "course_number": "MUS 200", "major": "Music", "dialogues_requirement": "Aesthetic & Interpretive", "delivery_mode": "In-Person"},
    {"course_name": "Orchestration", "course_number": "MUS 300", "major": "Music", "dialogues_requirement": None, "delivery_mode": "In-Person"},
    
    # Online/Hybrid courses
    {"course_name": "Introduction to Statistics", "course_number": "STAT 200", "major": "Statistics", "dialogues_requirement": None, "delivery_mode": "Online"},
    {"course_name": "Web Development", "course_number": "CS 250", "major": "Computer Science", "dialogues_requirement": None, "delivery_mode": "Hybrid"},
    {"course_name": "Digital Marketing", "course_number": "MKTG 310", "major": "Business", "dialogues_requirement": None, "delivery_mode": "Online"},
]


def get_or_create_school(db: Session, school_name: str) -> School:
    """Get existing school or create a new one"""
    school = db.query(School).filter(
        func.lower(School.school_name).like(f'%{school_name.lower()}%')
    ).first()
    
    if not school:
        school = School(school_name=school_name)
        db.add(school)
        db.commit()
        db.refresh(school)
        print(f"✓ Created school: {school_name}")
    else:
        print(f"✓ Found existing school: {school.school_name}")
    
    return school


def course_exists(db: Session, school_id: int, course_number: str) -> bool:
    """Check if a course already exists"""
    existing = db.query(Course).filter(
        Course.school_id == school_id,
        Course.course_number == course_number
    ).first()
    return existing is not None


def add_courses(db: Session, school: School):
    """Add courses to the database"""
    added_count = 0
    skipped_count = 0
    
    for course_data in COURSES:
        # Check if course already exists
        if course_exists(db, school.school_id, course_data["course_number"]):
            print(f"⊘ Skipping {course_data['course_number']} - already exists")
            skipped_count += 1
            continue
        
        # Create course
        course = Course(
            course_name=course_data["course_name"],
            course_number=course_data["course_number"],
            major=course_data["major"],
            school_id=school.school_id,
            dialogues_requirement=course_data["dialogues_requirement"],
            delivery_mode=course_data["delivery_mode"]
        )
        
        db.add(course)
        db.commit()
        db.refresh(course)
        
        print(f"✓ Added: {course_data['course_number']} - {course_data['course_name']} ({course_data['major']})")
        if course_data["dialogues_requirement"]:
            print(f"  └─ Dialogues: {course_data['dialogues_requirement']}")
        
        added_count += 1
    
    return added_count, skipped_count


def main():
    """Main function to add courses"""
    db = SessionLocal()
    
    try:
        print("=" * 60)
        print("Adding Truman State University Courses")
        print("=" * 60)
        print()
        
        # Get or create Truman State University
        school = get_or_create_school(db, "Truman State University")
        print()
        
        # Add courses
        print("Adding courses...")
        print("-" * 60)
        added_count, skipped_count = add_courses(db, school)
        print("-" * 60)
        print()
        
        # Summary
        print("=" * 60)
        print("Summary:")
        print(f"  ✓ Added: {added_count} courses")
        print(f"  ⊘ Skipped: {skipped_count} courses (already exist)")
        print(f"  Total courses in database: {db.query(Course).filter(Course.school_id == school.school_id).count()}")
        print("=" * 60)
        
    except Exception as e:
        db.rollback()
        print(f"\n✗ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    main()

