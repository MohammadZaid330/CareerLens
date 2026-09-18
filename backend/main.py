import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal
from seed_data import seed_database

from routers import (
    auth_router,
    student_router,
    career_router,
    company_router,
    recruiter_router,
    admin_router
)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CareerLens - Resume Analyzer & Career Guidance API",
    description="Production-grade FastAPI backend for CareerLens Platform",
    version="1.0.0"
)

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for development flexibility
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed database on startup
@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()

# Include Routers
app.include_router(auth_router.router)
app.include_router(student_router.router)
app.include_router(career_router.router)
app.include_router(company_router.router)
app.include_router(recruiter_router.router)
app.include_router(admin_router.router)

@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy",
        "service": "CareerLens Backend API",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
