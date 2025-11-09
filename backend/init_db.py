#!/usr/bin/env python3
"""
Database initialization script for RateMyClass
Creates the database and tables if they don't exist
"""

from database import init_db, engine, Base
import sys

def main():
    print("Initializing RateMyClass database...")
    try:
        # Create all tables
        Base.metadata.create_all(bind=engine)
        print("✓ Database tables created successfully!")
        print("\nYou can now start the backend server with:")
        print("  uvicorn main:app --reload")
    except Exception as e:
        print(f"✗ Error initializing database: {e}")
        print("\nPlease check:")
        print("1. MySQL server is running")
        print("2. Database 'ratemyclass' exists")
        print("3. Database credentials in database.py are correct")
        sys.exit(1)

if __name__ == "__main__":
    main()

