from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas
from auth import get_current_user
from services.career_engine import evaluate_role_recommendations
from services.roadmap_engine import analyze_skill_gaps, generate_personalized_roadmap

router = APIRouter(prefix="/api/v1/career", tags=["Career Guidance"])

@router.get("/recommendations", response_model=List[schemas.RoleRecommendation])
def get_career_recommendations(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    user_skills = profile.skills if profile else []

    latest_analysis = db.query(models.ResumeAnalysis).filter(models.ResumeAnalysis.user_id == current_user.id).order_by(models.ResumeAnalysis.created_at.desc()).first()
    extracted_dict = latest_analysis.extracted_skills if latest_analysis else {"technical": user_skills, "soft": [], "tools": [], "domain": []}

    roles = db.query(models.Role).all()
    roles_list = [{
        "id": r.id,
        "title": r.title,
        "required_skills": r.required_skills,
        "preferred_skills": r.preferred_skills,
        "icon": r.icon
    } for r in roles]

    recs = evaluate_role_recommendations(
        extracted_skills_dict=extracted_dict,
        user_experience_years=profile.experience_years if profile else 0.0,
        all_roles=roles_list
    )
    return recs

@router.get("/skill-gaps", response_model=schemas.SkillGapAnalysisResponse)
def get_skill_gaps(target_role: str = Query(...), current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    role_db = db.query(models.Role).filter(models.Role.title == target_role).first()
    if not role_db:
        raise HTTPException(status_code=404, detail="Target role not found.")

    latest_analysis = db.query(models.ResumeAnalysis).filter(models.ResumeAnalysis.user_id == current_user.id).order_by(models.ResumeAnalysis.created_at.desc()).first()
    user_skills = latest_analysis.extracted_skills if latest_analysis else {"technical": [], "soft": [], "tools": [], "domain": []}

    resources = db.query(models.LearningResource).all()
    resources_list = [{"skill_name": r.skill_name} for r in resources]

    target_role_info = {
        "title": role_db.title,
        "required_skills": role_db.required_skills,
        "preferred_skills": role_db.preferred_skills
    }

    gaps = analyze_skill_gaps(user_skills, target_role_info, resources_list)
    return gaps

@router.get("/roadmap", response_model=List[schemas.RoadmapStepItem])
def get_personalized_roadmap(target_role: str = Query(...), current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    role_db = db.query(models.Role).filter(models.Role.title == target_role).first()
    if not role_db:
        raise HTTPException(status_code=404, detail="Target role not found.")

    latest_analysis = db.query(models.ResumeAnalysis).filter(models.ResumeAnalysis.user_id == current_user.id).order_by(models.ResumeAnalysis.created_at.desc()).first()
    user_skills = latest_analysis.extracted_skills if latest_analysis else {"technical": [], "soft": [], "tools": [], "domain": []}

    target_role_info = {
        "title": role_db.title,
        "required_skills": role_db.required_skills,
        "preferred_skills": role_db.preferred_skills
    }

    roadmap = generate_personalized_roadmap(user_skills, target_role_info)
    return roadmap

@router.get("/resources", response_model=List[schemas.LearningResourceResponse])
def get_learning_resources(skill: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(models.LearningResource)
    if skill:
        query = query.filter(models.LearningResource.skill_name.ilike(f"%{skill}%"))
    return query.all()

@router.get("/roles", response_model=List[dict])
def get_all_roles(db: Session = Depends(get_db)):
    roles = db.query(models.Role).all()
    return [{
        "id": r.id,
        "title": r.title,
        "description": r.description,
        "required_skills": r.required_skills,
        "preferred_skills": r.preferred_skills,
        "min_experience_years": r.min_experience_years,
        "icon": r.icon
    } for r in roles]
