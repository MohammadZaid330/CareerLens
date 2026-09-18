from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr
import datetime

# --- Auth Schemas ---
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = "student"  # student, recruiter, admin

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    email: str
    full_name: str
    role: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    is_active: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# --- Profile Schemas ---
class ProfileUpdate(BaseModel):
    headline: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    education: Optional[str] = None
    experience_years: Optional[float] = None
    availability: Optional[str] = None
    allow_recruiter_discovery: Optional[bool] = None
    target_role: Optional[str] = None
    skills: Optional[List[str]] = None

class ProfileResponse(BaseModel):
    id: int
    user_id: int
    headline: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    education: Optional[str] = None
    experience_years: float
    availability: str
    allow_recruiter_discovery: bool
    target_role: Optional[str] = None
    skills: List[str] = []

    class Config:
        from_attributes = True

# --- Resume & Analysis Schemas ---
class ResumeAnalysisResponse(BaseModel):
    id: int
    resume_id: int
    user_id: int
    target_role: Optional[str] = None
    ats_score: float
    structure_score: float
    keyword_score: float
    experience_score: float
    content_score: float
    compatibility_score: float
    category_breakdown: Dict[str, Any]
    strengths: List[str]
    problems: List[str]
    suggestions: List[str]
    extracted_skills: Dict[str, List[str]]
    matched_keywords: List[str]
    missing_keywords: List[str]
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# --- Career & Skill Gap Schemas ---
class RoleRecommendation(BaseModel):
    role_id: int
    title: str
    qualitative_fit: str  # Strong Fit, Good Fit, Potential Fit, Needs Development
    fit_score_estimate: str
    why_reasons: List[str]
    next_focus_skills: List[str]
    icon: str

class SkillGapItem(BaseModel):
    skill_name: str
    category: str  # Critical, High Priority, Medium Priority, Nice to Have
    importance_reason: str
    resources_count: int

class SkillGapAnalysisResponse(BaseModel):
    target_role: str
    already_have: List[str]
    missing_skills: List[SkillGapItem]

class RoadmapStepItem(BaseModel):
    phase_number: int
    phase_title: str
    duration: str
    skills_to_learn: List[str]
    description: str
    is_completed: bool = False

class LearningResourceResponse(BaseModel):
    id: int
    skill_name: str
    title: str
    platform: str
    level: str
    is_free: bool
    estimated_duration: str
    url: str

    class Config:
        from_attributes = True

# --- Recruiter & Job Schemas ---
class JobCreate(BaseModel):
    title: str
    location: str
    work_type: str = "Remote"  # Remote, Hybrid, On-site
    employment_type: str = "Full-time"
    experience_level: str = "Entry Level"
    salary_range: Optional[str] = None
    required_skills: List[str]
    preferred_skills: List[str] = []
    education_requirement: Optional[str] = None
    description: str
    deadline: Optional[str] = None

class JobResponse(BaseModel):
    id: int
    company_id: int
    company_name: str
    title: str
    location: str
    work_type: str
    employment_type: str
    experience_level: str
    salary_range: Optional[str] = None
    required_skills: List[str]
    preferred_skills: List[str]
    education_requirement: Optional[str] = None
    description: str
    deadline: Optional[str] = None
    last_verified_at: datetime.datetime
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class CandidateMatchItem(BaseModel):
    student_id: int
    full_name: str
    headline: Optional[str]
    location: Optional[str]
    experience_years: float
    education: Optional[str]
    match_score: float  # Deterministic job-profile match score (0-100)
    matched_skills: List[str]
    missing_skills: List[str]
    relevant_experience_note: str

class ContactRequestCreate(BaseModel):
    student_id: int
    job_id: Optional[int] = None
    message: str

class ContactRequestResponse(BaseModel):
    id: int
    recruiter_id: int
    student_id: int
    recruiter_name: str
    job_title: Optional[str] = None
    message: str
    status: str
    created_at: datetime.datetime

# --- Admin Schemas ---
class ATSWeightUpdate(BaseModel):
    structure_weight: float
    keyword_weight: float
    experience_weight: float
    content_weight: float
    compatibility_weight: float
