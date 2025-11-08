from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

@app.get("/courses")
def get_courses():
    return {"courses": ["Course 1", "Course 2", "Course 3"]}