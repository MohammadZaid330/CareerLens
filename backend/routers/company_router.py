from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas
from auth import get_current_user

router = APIRouter(prefix="/api/v1/companies", tags=["Companies & Job Discovery"])

@router.get("/jobs", response_model=List[schemas.JobResponse])
def get_hiring_jobs(
    role: Optional[str] = Query(None),
    skill: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(models.Job).filter(models.Job.is_active == True)
    if role:
        query = query.filter(models.Job.title.ilike(f"%{role}%"))
    if location:
        query = query.filter(models.Job.location.ilike(f"%{location}%"))

    jobs = query.order_by(models.Job.created_at.desc()).all()
    results = []
    for j in jobs:
        company_name = j.company.name if j.company else "Verified Company"
        if skill:
            all_j_skills = [s.lower() for s in j.required_skills + j.preferred_skills]
            if skill.lower() not in all_j_skills:
                continue
        results.append({
            "id": j.id,
            "company_id": j.company_id,
            "company_name": company_name,
            "title": j.title,
            "location": j.location,
            "work_type": j.work_type,
            "employment_type": j.employment_type,
            "experience_level": j.experience_level,
            "salary_range": j.salary_range,
            "required_skills": j.required_skills,
            "preferred_skills": j.preferred_skills,
            "education_requirement": j.education_requirement,
            "description": j.description,
            "deadline": j.deadline,
            "last_verified_at": j.last_verified_at,
            "created_at": j.created_at
        })
    return results

@router.get("/matching-jobs", response_model=List[schemas.JobResponse])
def get_matching_jobs_for_student(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    student_skills = profile.skills if profile else []
    target_role = profile.target_role if profile else None

    jobs = db.query(models.Job).filter(models.Job.is_active == True).all()
    matched_jobs = []

    for j in jobs:
        req_set = set([s.lower() for s in j.required_skills])
        pref_set = set([s.lower() for s in j.preferred_skills])
        stu_set = set([s.lower() for s in student_skills])

        overlap = req_set.intersection(stu_set)
        if overlap or (target_role and target_role.lower() in j.title.lower()):
            matched_jobs.append({
                "id": j.id,
                "company_id": j.company_id,
                "company_name": j.company.name if j.company else "Verified Company",
                "title": j.title,
                "location": j.location,
                "work_type": j.work_type,
                "employment_type": j.employment_type,
                "experience_level": j.experience_level,
                "salary_range": j.salary_range,
                "required_skills": j.required_skills,
                "preferred_skills": j.preferred_skills,
                "education_requirement": j.education_requirement,
                "description": j.description,
                "deadline": j.deadline,
                "last_verified_at": j.last_verified_at,
                "created_at": j.created_at
            })

    if not matched_jobs:
        # Fallback to returning all active jobs
        for j in jobs:
            matched_jobs.append({
                "id": j.id,
                "company_id": j.company_id,
                "company_name": j.company.name if j.company else "Verified Company",
                "title": j.title,
                "location": j.location,
                "work_type": j.work_type,
                "employment_type": j.employment_type,
                "experience_level": j.experience_level,
                "salary_range": j.salary_range,
                "required_skills": j.required_skills,
                "preferred_skills": j.preferred_skills,
                "education_requirement": j.education_requirement,
                "description": j.description,
                "deadline": j.deadline,
                "last_verified_at": j.last_verified_at,
                "created_at": j.created_at
            })
    return matched_jobs
