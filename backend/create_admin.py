#!/usr/bin/env python3
"""
Script to create the default admin user
Run this if the admin user was not created during startup
"""

from database import SessionLocal, User, UserRole
from auth import get_password_hash

def create_admin_user():
    """Create the default admin user"""
    db = SessionLocal()
    try:
        # Check if admin user already exists
        admin = db.query(User).filter(User.username == "courseadmin").first()
        if admin:
            print("Admin user already exists!")
            print(f"Username: {admin.username}")
            print(f"Role: {admin.role.value}")
            return
        
        # Create new admin user
        admin = User(
            username="courseadmin",
            password_hash=get_password_hash("password"),
            role=UserRole.ADMIN
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)
        
        print("✓ Admin user created successfully!")
        print(f"Username: {admin.username}")
        print(f"Password: password")
        print(f"Role: {admin.role.value}")
        
    except Exception as e:
        db.rollback()
        print(f"✗ Error creating admin user: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_user()

