import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas
from auth import get_current_user, require_role
from services.candidate_matcher import calculate_job_candidate_match

router = APIRouter(prefix="/api/v1/recruiter", tags=["Recruiter & HR Portal"])

@router.post("/jobs", response_model=schemas.JobResponse)
def create_job(
    job_in: schemas.JobCreate,
    current_user: models.User = Depends(require_role(["recruiter", "admin"])),
    db: Session = Depends(get_db)
):
    company = db.query(models.Company).filter(models.Company.user_id == current_user.id).first()
    if not company:
        company = models.Company(
            user_id=current_user.id,
            name=f"{current_user.full_name}'s Company",
            description="Recruiter account company"
        )
        db.add(company)
        db.commit()
        db.refresh(company)

    new_job = models.Job(
        company_id=company.id,
        title=job_in.title,
        location=job_in.location,
        work_type=job_in.work_type,
        employment_type=job_in.employment_type,
        experience_level=job_in.experience_level,
        salary_range=job_in.salary_range,
        required_skills=job_in.required_skills,
        preferred_skills=job_in.preferred_skills,
        education_requirement=job_in.education_requirement,
        description=job_in.description,
        deadline=job_in.deadline,
        last_verified_at=datetime.datetime.utcnow(),
        is_active=True
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return {
        "id": new_job.id,
        "company_id": new_job.company_id,
        "company_name": company.name,
        "title": new_job.title,
        "location": new_job.location,
        "work_type": new_job.work_type,
        "employment_type": new_job.employment_type,
        "experience_level": new_job.experience_level,
        "salary_range": new_job.salary_range,
        "required_skills": new_job.required_skills,
        "preferred_skills": new_job.preferred_skills,
        "education_requirement": new_job.education_requirement,
        "description": new_job.description,
        "deadline": new_job.deadline,
        "last_verified_at": new_job.last_verified_at,
        "created_at": new_job.created_at
    }

@router.get("/my-jobs", response_model=List[schemas.JobResponse])
def get_my_jobs(current_user: models.User = Depends(require_role(["recruiter", "admin"])), db: Session = Depends(get_db)):
    company = db.query(models.Company).filter(models.Company.user_id == current_user.id).first()
    if not company:
        return []

    jobs = db.query(models.Job).filter(models.Job.company_id == company.id).all()
    results = []
    for j in jobs:
        results.append({
            "id": j.id,
            "company_id": j.company_id,
            "company_name": company.name,
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

@router.get("/candidates/search", response_model=List[schemas.CandidateMatchItem])
def search_candidates(
    job_id: Optional[int] = Query(None),
    role: Optional[str] = Query(None),
    skill: Optional[str] = Query(None),
    min_experience: Optional[float] = Query(None),
    current_user: models.User = Depends(require_role(["recruiter", "admin"])),
    db: Session = Depends(get_db)
):
    # Query candidate profiles with allow_recruiter_discovery=True
    query = db.query(models.Profile).join(models.User).filter(
        models.Profile.allow_recruiter_discovery == True,
        models.User.role == "student"
    )

    if role:
        query = query.filter(models.Profile.target_role.ilike(f"%{role}%"))
    if min_experience is not None:
        query = query.filter(models.Profile.experience_years >= min_experience)

    profiles = query.all()

    # If job_id specified, fetch job info for deterministic job-profile matching
    job_info = None
    if job_id:
        job_db = db.query(models.Job).filter(models.Job.id == job_id).first()
        if job_db:
            job_info = {
                "required_skills": job_db.required_skills,
                "preferred_skills": job_db.preferred_skills
            }

    candidates_list = []
    for p in profiles:
        u = p.user
        candidate_skills = p.skills or []

        if skill:
            if not any(skill.lower() == s.lower() for s in candidate_skills):
                continue

        if job_info:
            match_res = calculate_job_candidate_match(job_info, {
                "user_id": u.id,
                "skills": candidate_skills,
                "experience_years": p.experience_years
            })
            score = match_res["match_score"]
            matched_skills = match_res["matched_skills"]
            missing_skills = match_res["missing_skills"]
            exp_note = match_res["relevant_experience_note"]
        else:
            score = min(100.0, round(len(candidate_skills) * 10.0 + p.experience_years * 15.0, 1))
            matched_skills = candidate_skills[:5]
            missing_skills = []
            exp_note = f"{p.experience_years} years experience in {p.headline or 'software engineering'}."

        candidates_list.append({
            "student_id": u.id,
            "full_name": u.full_name,
            "headline": p.headline or "Student Candidate",
            "location": p.location or "Remote",
            "experience_years": p.experience_years,
            "education": p.education or "Higher Education",
            "match_score": score,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "relevant_experience_note": exp_note
        })

    candidates_list.sort(key=lambda x: -x["match_score"])
    return candidates_list

@router.post("/contact", response_model=schemas.ContactRequestResponse)
def contact_candidate(
    contact_in: schemas.ContactRequestCreate,
    current_user: models.User = Depends(require_role(["recruiter", "admin"])),
    db: Session = Depends(get_db)
):
    student = db.query(models.User).filter(models.User.id == contact_in.student_id, models.User.role == "student").first()
    if not student:
        raise HTTPException(status_code=404, detail="Student candidate not found.")

    new_contact = models.ContactRequest(
        recruiter_id=current_user.id,
        student_id=contact_in.student_id,
        job_id=contact_in.job_id,
        message=contact_in.message,
        status="pending"
    )
    db.add(new_contact)
    db.commit()
    db.refresh(new_contact)

    job_title = None
    if contact_in.job_id:
        job = db.query(models.Job).filter(models.Job.id == contact_in.job_id).first()
        if job:
            job_title = job.title

    return {
        "id": new_contact.id,
        "recruiter_id": current_user.id,
        "student_id": student.id,
        "recruiter_name": current_user.full_name,
        "job_title": job_title,
        "message": new_contact.message,
        "status": new_contact.status,
        "created_at": new_contact.created_at
    }

@router.get("/contact-requests", response_model=List[schemas.ContactRequestResponse])
def get_contact_requests(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role == "recruiter":
        requests = db.query(models.ContactRequest).filter(models.ContactRequest.recruiter_id == current_user.id).all()
    else:
        requests = db.query(models.ContactRequest).filter(models.ContactRequest.student_id == current_user.id).all()

    results = []
    for r in requests:
        recruiter = db.query(models.User).filter(models.User.id == r.recruiter_id).first()
        job = db.query(models.Job).filter(models.Job.id == r.job_id).first() if r.job_id else None
        results.append({
            "id": r.id,
            "recruiter_id": r.recruiter_id,
            "student_id": r.student_id,
            "recruiter_name": recruiter.full_name if recruiter else "Recruiter",
            "job_title": job.title if job else "General Role Inquiry",
            "message": r.message,
            "status": r.status,
            "created_at": r.created_at
        })
    return results
