import os
import shutil
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas
from auth import get_current_user, require_role
from services.resume_parser import extract_text_from_file, parse_resume_structure
from services.ats_engine import calculate_ats_score

router = APIRouter(prefix="/api/v1/student", tags=["Student Resume & Profile"])

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload-resume", response_model=schemas.ResumeAnalysisResponse)
async def upload_resume(
    file: UploadFile = File(...),
    target_role: Optional[str] = Form(None),
    job_description: Optional[str] = Form(None),
    current_user: models.User = Depends(require_role(["student", "admin"])),
    db: Session = Depends(get_db)
):
    # Validate File Type
    ext = file.filename.split(".")[-1].lower()
    if ext not in ["pdf", "docx", "doc"]:
        raise HTTPException(status_code=400, detail="Unsupported file format. Please upload a PDF or DOCX file.")

    contents = await file.read()
    file_size = len(contents)
    if file_size > 10 * 1024 * 1024:  # 10 MB limit
        raise HTTPException(status_code=400, detail="File size exceeds maximum limit of 10MB.")

    # Save File to Disk
    safe_filename = f"user_{current_user.id}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)
    with open(file_path, "wb") as f:
        f.write(contents)

    # Extract Text & Structure
    text = extract_text_from_file(contents, file.filename)
    if not text or len(text.strip()) < 30:
        raise HTTPException(status_code=422, detail="Failed to parse text from file. Please ensure document contains readable text.")

    struct_data, sections = parse_resume_structure(text)

    # Save Resume Record
    new_resume = models.Resume(
        user_id=current_user.id,
        filename=file.filename,
        file_path=file_path,
        file_type=file.content_type or f"application/{ext}",
        file_size=file_size,
        parsed_text=text,
        structured_data=struct_data
    )
    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)

    # Fetch Target Role Info if specified
    target_role_info = None
    if target_role and target_role != "I'm not sure yet":
        role_db = db.query(models.Role).filter(models.Role.title == target_role).first()
        if role_db:
            target_role_info = {
                "title": role_db.title,
                "required_skills": role_db.required_skills,
                "preferred_skills": role_db.preferred_skills
            }

    # Fetch Backend ATS Weight Config
    weight_config = db.query(models.ATSWeightConfig).filter(models.ATSWeightConfig.is_active == True).first()
    weights_dict = None
    if weight_config:
        weights_dict = {
            "structure_weight": weight_config.structure_weight,
            "keyword_weight": weight_config.keyword_weight,
            "experience_weight": weight_config.experience_weight,
            "content_weight": weight_config.content_weight,
            "compatibility_weight": weight_config.compatibility_weight
        }

    # Calculate Deterministic ATS Score
    ats_result = calculate_ats_score(
        text=text,
        structured_data=struct_data,
        sections=sections,
        target_role_info=target_role_info,
        job_description=job_description,
        weights=weights_dict
    )

    # Store Analysis Record
    analysis = models.ResumeAnalysis(
        resume_id=new_resume.id,
        user_id=current_user.id,
        target_role=target_role if target_role != "I'm not sure yet" else None,
        job_description=job_description,
        ats_score=ats_result["ats_score"],
        structure_score=ats_result["structure_score"],
        keyword_score=ats_result["keyword_score"],
        experience_score=ats_result["experience_score"],
        content_score=ats_result["content_score"],
        compatibility_score=ats_result["compatibility_score"],
        category_breakdown=ats_result["category_breakdown"],
        strengths=ats_result["strengths"],
        problems=ats_result["problems"],
        suggestions=ats_result["suggestions"],
        extracted_skills=ats_result["extracted_skills"],
        matched_keywords=ats_result["matched_keywords"],
        missing_keywords=ats_result["missing_keywords"]
    )
    db.add(analysis)

    # Update Profile extracted skills
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    if profile:
        all_ext = []
        for s_list in ats_result["extracted_skills"].values():
            all_ext.extend(s_list)
        profile.skills = list(set(profile.skills + all_ext))
        if target_role and target_role != "I'm not sure yet":
            profile.target_role = target_role

    db.commit()
    db.refresh(analysis)
    return analysis

@router.get("/analyses", response_model=List[schemas.ResumeAnalysisResponse])
def get_user_analyses(current_user: models.User = Depends(require_role(["student", "admin"])), db: Session = Depends(get_db)):
    return db.query(models.ResumeAnalysis).filter(models.ResumeAnalysis.user_id == current_user.id).order_by(models.ResumeAnalysis.created_at.desc()).all()

@router.get("/analysis/{analysis_id}", response_model=schemas.ResumeAnalysisResponse)
def get_analysis_by_id(analysis_id: int, current_user: models.User = Depends(require_role(["student", "admin"])), db: Session = Depends(get_db)):
    analysis = db.query(models.ResumeAnalysis).filter(models.ResumeAnalysis.id == analysis_id, models.ResumeAnalysis.user_id == current_user.id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis report not found.")
    return analysis

@router.get("/profile", response_model=schemas.ProfileResponse)
def get_profile(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    if not profile:
        profile = models.Profile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.put("/profile", response_model=schemas.ProfileResponse)
def update_profile(profile_in: schemas.ProfileUpdate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    if not profile:
        profile = models.Profile(user_id=current_user.id)
        db.add(profile)

    update_data = profile_in.dict(exclude_unset=True)
    for field, val in update_data.items():
        setattr(profile, field, val)

    db.commit()
    db.refresh(profile)
    return profile
