import pytest
import os
import sys

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from services.ats_engine import calculate_ats_score
from services.resume_parser import parse_resume_structure
from services.career_engine import evaluate_role_recommendations
from services.roadmap_engine import analyze_skill_gaps

EXCELLENT_RESUME = """
Jane Doe
San Francisco, CA | jane.doe@example.com | (555) 123-4567
LinkedIn: linkedin.com/in/janedoe | GitHub: github.com/janedoe

PROFESSIONAL SUMMARY
Senior Software Engineer with 5+ years of experience engineering high-throughput backend services, REST APIs, and microservices in Python, FastAPI, and PostgreSQL.

EDUCATION
University of California, Berkeley — B.S. in Computer Science (2019)

TECHNICAL SKILLS
Languages: Python, SQL, JavaScript, TypeScript
Frameworks: FastAPI, React, Node.js, Django
Tools & Databases: Docker, PostgreSQL, Redis, Git, AWS, Kubernetes

EXPERIENCE
Senior Python Engineer | TechCorp Inc. | 2021 – Present
• Engineered multi-tenant microservice APIs handling 5,000,000+ daily transactions with 99.99% uptime.
• Reduced database query response times by 45% through PostgreSQL index optimization and Redis caching.
• Led a team of 4 engineers deploying containerized services with Docker and Kubernetes on AWS.

PROJECTS
OpenSource API Framework | 2023
• Developed an open-source async Python API gateway with 2,000+ GitHub stars.
"""

POOR_RESUME = """
Hardworking team player looking for any job.
Contact: none@none.com
Skills: good communication, dynamic thinker.
"""

def test_ats_score_deterministic_repeatability():
    """Verify that scoring the exact same resume 100 times returns the EXACT SAME score every single time."""
    struct_data, sections = parse_resume_structure(EXCELLENT_RESUME)
    target_role_info = {
        "title": "Python Developer",
        "required_skills": ["Python", "FastAPI", "SQL", "PostgreSQL"],
        "preferred_skills": ["Docker", "Redis", "AWS"]
    }

    first_run = calculate_ats_score(EXCELLENT_RESUME, struct_data, sections, target_role_info)
    first_score = first_run["ats_score"]

    for _ in range(50):
        run = calculate_ats_score(EXCELLENT_RESUME, struct_data, sections, target_role_info)
        assert run["ats_score"] == first_score, f"Expected {first_score}, got {run['ats_score']}"

def test_excellent_vs_poor_resume_scoring():
    """Verify that excellent resume scores higher than poor resume."""
    s_exc, sec_exc = parse_resume_structure(EXCELLENT_RESUME)
    s_poor, sec_poor = parse_resume_structure(POOR_RESUME)

    res_exc = calculate_ats_score(EXCELLENT_RESUME, s_exc, sec_exc)
    res_poor = calculate_ats_score(POOR_RESUME, s_poor, sec_poor)

    assert res_exc["ats_score"] > res_poor["ats_score"]
    assert res_exc["ats_score"] >= 75.0
    assert res_poor["ats_score"] < 50.0

def test_strong_vs_weak_keyword_match():
    """Verify keyword match score reflects presence of role skills."""
    struct_data, sections = parse_resume_structure(EXCELLENT_RESUME)

    role_strong = {
        "title": "Python Developer",
        "required_skills": ["Python", "FastAPI", "SQL", "PostgreSQL"],
        "preferred_skills": ["Docker", "AWS"]
    }

    role_mismatch = {
        "title": "iOS Swift Developer",
        "required_skills": ["Swift", "Objective-C", "iOS", "Xcode"],
        "preferred_skills": ["CoreData", "SwiftUI"]
    }

    score_strong = calculate_ats_score(EXCELLENT_RESUME, struct_data, sections, role_strong)
    score_mismatch = calculate_ats_score(EXCELLENT_RESUME, struct_data, sections, role_mismatch)

    assert score_strong["keyword_score"] > score_mismatch["keyword_score"]
    assert "Python" in score_strong["matched_keywords"]
    assert "Swift" in score_mismatch["missing_keywords"]

def test_qualitative_role_recommendation_evidence():
    """Verify role recommendation output contains qualitative fit categories and no fake percentages."""
    extracted_skills = {"technical": ["Python", "FastAPI", "SQL", "Docker"], "soft": [], "tools": ["Git"], "domain": []}
    roles = [
        {"id": 1, "title": "Python Developer", "required_skills": ["Python", "FastAPI", "SQL"], "preferred_skills": ["Docker"]},
        {"id": 2, "title": "Mobile Developer", "required_skills": ["Swift", "Kotlin"], "preferred_skills": ["Flutter"]}
    ]

    recs = evaluate_role_recommendations(extracted_skills, 2.0, roles)
    top_rec = recs[0]

    assert top_rec["qualitative_fit"] in ["Strong Fit", "Good Fit"]
    assert top_rec["title"] == "Python Developer"
    assert len(top_rec["why_reasons"]) > 0

def test_skill_gap_analysis():
    """Verify skill gap categorization into Critical and High Priority."""
    extracted_skills = {"technical": ["Python", "SQL"], "soft": [], "tools": [], "domain": []}
    target_role = {
        "title": "AI/ML Engineer",
        "required_skills": ["Python", "Machine Learning", "PyTorch"],
        "preferred_skills": ["FastAPI", "Docker"]
    }

    gaps = analyze_skill_gaps(extracted_skills, target_role)
    assert "Python" in gaps["already_have"]

    missing_names = [m["skill_name"] for m in gaps["missing_skills"]]
    assert "Machine Learning" in missing_names
    assert "PyTorch" in missing_names


def test_phone_and_education_detection():
    """Verify phone extraction and education section detection across various formatting styles."""
    test_resumes = [
        ("Mohammad Zaid\nContact No: +91 98765 43210 | zaid@example.com\nACADEMIC QUALIFICATIONS\nB.Tech CSE", "+91 98765 43210"),
        ("Rahul Sharma\nMob: 9876543210 | rahul@test.com\nEDUCATIONAL BACKGROUND\nBachelor of Science", "9876543210"),
        ("Ananya Patel\nPhone: +91-98765-43210 | ananya@demo.com\nACADEMICS\n10th & 12th CBSE", "+91-98765-43210"),
    ]

    for resume_text, expected_phone in test_resumes:
        struct_data, sections = parse_resume_structure(resume_text)
        assert struct_data["contact_info"]["phone"] is not None, f"Failed to extract phone for: {resume_text}"
        assert "education" in struct_data["sections_found"], f"Failed to detect education section for: {resume_text}"

        score_res = calculate_ats_score(resume_text, struct_data, sections)
        assert "Missing phone number." not in score_res["problems"]
        assert "Missing standard 'Education' section heading." not in score_res["problems"]

