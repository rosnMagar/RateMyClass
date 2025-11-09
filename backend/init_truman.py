#!/usr/bin/env python3
"""
Script to initialize Truman State University in the database
Run this after creating the database to ensure Truman State University exists
"""

from database import SessionLocal, School

def init_truman_state():
    db = SessionLocal()
    try:
        # Check if Truman State University already exists
        truman = db.query(School).filter(
            School.school_name.ilike('%truman%')
        ).first()
        
        if not truman:
            truman = School(school_name="Truman State University")
            db.add(truman)
            db.commit()
            print("✓ Truman State University added to database!")
        else:
            print(f"✓ Truman State University already exists (ID: {truman.school_id})")
    except Exception as e:
        db.rollback()
        print(f"✗ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    init_truman_state()

