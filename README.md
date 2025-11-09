# RateMyClass Setup Guide

## Prerequisites
- Python 3.8+
- MySQL Server running locally
- Node.js 16+ (required for React frontend)

## Database Setup

1. **Create MySQL Database**
   ```sql
   CREATE DATABASE ratemyclass;
   ```

2. **Update Database Connection**
   Edit `backend/database.py` and update the `DATABASE_URL`:
   ```python
   DATABASE_URL = "mysql+pymysql://username:password@localhost:3306/ratemyclass"
   ```
   Replace `username` and `password` with your MySQL credentials.

   Alternatively, create a `.env` file in the `backend` directory:
   ```
   DATABASE_URL=mysql+pymysql://username:password@localhost:3306/ratemyclass
   ```

## Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment (recommended)**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the backend server**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   The API will be available at `http://localhost:8000`
   API documentation: `http://localhost:8000/docs`

## Frontend Setup (React)

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:8080`

4. **Build for production (optional)**
   ```bash
   npm run build
   ```

## Usage

1. Start MySQL server
2. Start the backend server (port 8000)
3. Start the frontend server (port 8080)
4. Open `http://localhost:8080` in your browser
5. Add course ratings using the "Add Rating" page
6. View courses on the home page

## Database Tables

The application will automatically create the following tables on first run:
- `school` - Stores school information
- `course` - Stores course information
- `rating` - Stores course ratings
- `books` - Stores textbook information
- `professor` - Stores professor information

## API Endpoints

- `GET /` - API status
- `GET /courses` - Get all courses (supports `?search=term` query parameter)
- `GET /courses/{course_id}` - Get specific course
- `POST /courses` - Create new course with rating

