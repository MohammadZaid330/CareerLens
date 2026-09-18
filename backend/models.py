import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default="student", nullable=False)  # student, recruiter, admin
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    profile = relationship("Profile", back_populates="user", uselist=False)
    resumes = relationship("Resume", back_populates="user")
    analyses = relationship("ResumeAnalysis", back_populates="user")
    company = relationship("Company", back_populates="user", uselist=False)
    contact_requests_sent = relationship("ContactRequest", foreign_keys="[ContactRequest.recruiter_id]", back_populates="recruiter")
    contact_requests_received = relationship("ContactRequest", foreign_keys="[ContactRequest.student_id]", back_populates="student")

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    headline = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    location = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    education = Column(String, nullable=True)
    experience_years = Column(Float, default=0.0)
    availability = Column(String, default="Immediate")
    allow_recruiter_discovery = Column(Boolean, default=True)
    target_role = Column(String, nullable=True)
    skills = Column(JSON, default=list)  # List of skill strings
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="profile")

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    parsed_text = Column(Text, nullable=True)
    structured_data = Column(JSON, default=dict)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="resumes")
    analyses = relationship("ResumeAnalysis", back_populates="resume")

class ResumeAnalysis(Base):
    __tablename__ = "resume_analyses"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    target_role = Column(String, nullable=True)
    job_description = Column(Text, nullable=True)
    ats_score = Column(Float, nullable=False)
    structure_score = Column(Float, nullable=False)
    keyword_score = Column(Float, nullable=False)
    experience_score = Column(Float, nullable=False)
    content_score = Column(Float, nullable=False)
    compatibility_score = Column(Float, nullable=False)
    category_breakdown = Column(JSON, default=dict)
    strengths = Column(JSON, default=list)
    problems = Column(JSON, default=list)
    suggestions = Column(JSON, default=list)
    extracted_skills = Column(JSON, default=dict)  # technical, soft, tools, domain
    matched_keywords = Column(JSON, default=list)
    missing_keywords = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    resume = relationship("Resume", back_populates="analyses")
    user = relationship("User", back_populates="analyses")

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    canonical_name = Column(String, nullable=False)
    category = Column(String, default="technical")  # technical, soft, tool, domain
    aliases = Column(JSON, default=list)

class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    required_skills = Column(JSON, default=list)
    preferred_skills = Column(JSON, default=list)
    min_experience_years = Column(Float, default=0.0)
    icon = Column(String, default="Briefcase")

class LearningResource(Base):
    __tablename__ = "learning_resources"

    id = Column(Integer, primary_key=True, index=True)
    skill_name = Column(String, index=True, nullable=False)
    title = Column(String, nullable=False)
    platform = Column(String, nullable=False)
    level = Column(String, default="Beginner")  # Beginner, Intermediate, Advanced
    is_free = Column(Boolean, default=True)
    estimated_duration = Column(String, nullable=False)
    url = Column(String, nullable=False)

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    name = Column(String, nullable=False)
    logo_url = Column(String, nullable=True)
    website = Column(String, nullable=True)
    location = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    is_verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="company")
    jobs = relationship("Job", back_populates="company")

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    title = Column(String, nullable=False)
    location = Column(String, nullable=False)
    work_type = Column(String, default="Remote")  # Remote, Hybrid, On-site
    employment_type = Column(String, default="Full-time")  # Full-time, Part-time, Internship, Contract
    experience_level = Column(String, default="Entry Level")
    salary_range = Column(String, nullable=True)
    required_skills = Column(JSON, default=list)
    preferred_skills = Column(JSON, default=list)
    education_requirement = Column(String, nullable=True)
    description = Column(Text, nullable=False)
    deadline = Column(String, nullable=True)
    last_verified_at = Column(DateTime, default=datetime.datetime.utcnow)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    company = relationship("Company", back_populates="jobs")

class ContactRequest(Base):
    __tablename__ = "contact_requests"

    id = Column(Integer, primary_key=True, index=True)
    recruiter_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=True)
    message = Column(Text, nullable=False)
    status = Column(String, default="pending")  # pending, accepted, declined
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    recruiter = relationship("User", foreign_keys=[recruiter_id], back_populates="contact_requests_sent")
    student = relationship("User", foreign_keys=[student_id], back_populates="contact_requests_received")

class ATSWeightConfig(Base):
    __tablename__ = "ats_weight_configs"

    id = Column(Integer, primary_key=True, index=True)
    structure_weight = Column(Float, default=20.0)
    keyword_weight = Column(Float, default=30.0)
    experience_weight = Column(Float, default=20.0)
    content_weight = Column(Float, default=15.0)
    compatibility_weight = Column(Float, default=15.0)
    is_active = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)
