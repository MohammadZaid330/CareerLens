from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
import models
import schemas
from auth import require_role

router = APIRouter(prefix="/api/v1/admin", tags=["Admin Dashboard & Configuration"])

@router.get("/stats")
def get_admin_stats(current_user: models.User = Depends(require_role(["admin"])), db: Session = Depends(get_db)):
    total_users = db.query(models.User).count()
    students_count = db.query(models.User).filter(models.User.role == "student").count()
    recruiters_count = db.query(models.User).filter(models.User.role == "recruiter").count()
    total_resumes = db.query(models.Resume).count()
    total_analyses = db.query(models.ResumeAnalysis).count()
    avg_ats = db.query(func.avg(models.ResumeAnalysis.ats_score)).scalar() or 75.0
    active_jobs = db.query(models.Job).filter(models.Job.is_active == True).count()
    contact_requests = db.query(models.ContactRequest).count()

    return {
        "total_users": total_users,
        "students_count": students_count,
        "recruiters_count": recruiters_count,
        "total_resumes": total_resumes,
        "total_analyses": total_analyses,
        "average_ats_score": round(float(avg_ats), 1),
        "active_jobs": active_jobs,
        "total_contact_requests": contact_requests
    }

@router.get("/ats-config")
def get_ats_config(db: Session = Depends(get_db)):
    config = db.query(models.ATSWeightConfig).filter(models.ATSWeightConfig.is_active == True).first()
    if not config:
        config = models.ATSWeightConfig(
            structure_weight=20.0,
            keyword_weight=30.0,
            experience_weight=20.0,
            content_weight=15.0,
            compatibility_weight=15.0
        )
        db.add(config)
        db.commit()
        db.refresh(config)

    return {
        "structure_weight": config.structure_weight,
        "keyword_weight": config.keyword_weight,
        "experience_weight": config.experience_weight,
        "content_weight": config.content_weight,
        "compatibility_weight": config.compatibility_weight,
        "total_weight": config.structure_weight + config.keyword_weight + config.experience_weight + config.content_weight + config.compatibility_weight
    }

@router.put("/ats-config")
def update_ats_config(
    weight_in: schemas.ATSWeightUpdate,
    current_user: models.User = Depends(require_role(["admin"])),
    db: Session = Depends(get_db)
):
    total = (weight_in.structure_weight + weight_in.keyword_weight +
             weight_in.experience_weight + weight_in.content_weight +
             weight_in.compatibility_weight)
    
    if abs(total - 100.0) > 0.01:
        raise HTTPException(status_code=400, detail=f"Category weights must sum up to exactly 100 points (Current sum: {total:.1f}).")

    config = db.query(models.ATSWeightConfig).filter(models.ATSWeightConfig.is_active == True).first()
    if not config:
        config = models.ATSWeightConfig()
        db.add(config)

    config.structure_weight = weight_in.structure_weight
    config.keyword_weight = weight_in.keyword_weight
    config.experience_weight = weight_in.experience_weight
    config.content_weight = weight_in.content_weight
    config.compatibility_weight = weight_in.compatibility_weight

    db.commit()
    db.refresh(config)

    return {
        "message": "ATS Weight Configuration updated successfully.",
        "config": {
            "structure_weight": config.structure_weight,
            "keyword_weight": config.keyword_weight,
            "experience_weight": config.experience_weight,
            "content_weight": config.content_weight,
            "compatibility_weight": config.compatibility_weight
        }
    }
