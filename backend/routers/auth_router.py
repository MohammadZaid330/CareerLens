from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

@router.post("/register", response_model=schemas.Token)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = models.User(
        email=user_in.email,
        hashed_password=hash_password(user_in.password),
        full_name=user_in.full_name,
        role=user_in.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create associated profile or company
    if new_user.role == "student":
        profile = models.Profile(
            user_id=new_user.id,
            headline=f"Aspiring {new_user.full_name}",
            skills=[]
        )
        db.add(profile)
    elif new_user.role == "recruiter":
        company = models.Company(
            user_id=new_user.id,
            name=f"{new_user.full_name}'s Organization",
            description="Recruiting platform account."
        )
        db.add(company)
    db.commit()

    token = create_access_token({"sub": new_user.email, "role": new_user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": new_user.id,
        "email": new_user.email,
        "full_name": new_user.full_name,
        "role": new_user.role
    }

@router.post("/login", response_model=schemas.Token)
def login(login_in: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == login_in.email).first()
    if not user or not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": user.email, "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role
    }

@router.post("/demo-login/{demo_role}", response_model=schemas.Token)
def demo_login(demo_role: str, db: Session = Depends(get_db)):
    role_email_map = {
        "student": "student@careerlens.demo",
        "recruiter": "recruiter@careerlens.demo",
        "admin": "admin@careerlens.demo"
    }

    if demo_role not in role_email_map:
        raise HTTPException(status_code=400, detail="Invalid demo role")

    user = db.query(models.User).filter(models.User.email == role_email_map[demo_role]).first()
    if not user:
        raise HTTPException(status_code=404, detail="Demo account not found. Please seed database.")

    token = create_access_token({"sub": user.email, "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role
    }

@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user
