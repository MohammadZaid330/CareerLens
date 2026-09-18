import datetime
from sqlalchemy.orm import Session
import models
from auth import hash_password

def seed_database(db: Session):
    # Check if already seeded
    if db.query(models.User).filter(models.User.email == "student@careerlens.demo").first():
        return

    print("Seeding database with demo users, roles, skills, learning resources, and companies...")

    # 1. Create Demo Users
    student_user = models.User(
        email="student@careerlens.demo",
        hashed_password=hash_password("password123"),
        full_name="Alex Mercer",
        role="student",
        is_active=True
    )
    recruiter_user = models.User(
        email="recruiter@careerlens.demo",
        hashed_password=hash_password("password123"),
        full_name="Sarah Jenkins",
        role="recruiter",
        is_active=True
    )
    admin_user = models.User(
        email="admin@careerlens.demo",
        hashed_password=hash_password("password123"),
        full_name="System Administrator",
        role="admin",
        is_active=True
    )
    db.add_all([student_user, recruiter_user, admin_user])
    db.commit()

    # 2. Create Student Profile
    student_profile = models.Profile(
        user_id=student_user.id,
        headline="Aspiring AI/ML Engineer & Full Stack Python Developer",
        phone="+1 (555) 234-5678",
        location="San Francisco, CA",
        bio="Passionate computer science graduate specializing in Machine Learning, Python APIs, and Data Science.",
        education="B.S. in Computer Science, Stanford University",
        experience_years=1.5,
        availability="Immediate",
        allow_recruiter_discovery=True,
        target_role="AI/ML Engineer",
        skills=["Python", "NumPy", "Pandas", "SQL", "FastAPI", "React", "Git", "Scikit-Learn", "Machine Learning"]
    )
    db.add(student_profile)

    # 3. Create Company & Recruiter Profile
    company = models.Company(
        user_id=recruiter_user.id,
        name="NovaTech AI Solutions",
        website="https://novatech-ai.example.com",
        location="San Francisco, CA",
        description="Leading Enterprise AI & Machine Learning SaaS Innovation Hub.",
        is_verified=True
    )
    db.add(company)
    db.commit()

    # 4. Seed Standard Roles
    roles = [
        models.Role(
            title="AI/ML Engineer",
            description="Designs, trains, and deploys scalable machine learning models and AI pipelines.",
            required_skills=["Python", "Machine Learning", "PyTorch", "SQL", "Pandas"],
            preferred_skills=["FastAPI", "Docker", "Deep Learning", "NLP", "AWS"],
            min_experience_years=1.0,
            icon="Brain"
        ),
        models.Role(
            title="Python Developer",
            description="Builds high-performance REST APIs, data pipelines, and backend microservices.",
            required_skills=["Python", "FastAPI", "Django", "SQL", "PostgreSQL"],
            preferred_skills=["Docker", "Redis", "REST API", "Git", "AWS"],
            min_experience_years=1.0,
            icon="Code"
        ),
        models.Role(
            title="Full Stack Developer",
            description="Engineers modern frontend web applications paired with scalable backend services.",
            required_skills=["React", "TypeScript", "Node.js", "Python", "SQL"],
            preferred_skills=["Next.js", "Tailwind CSS", "PostgreSQL", "Docker", "GraphQL"],
            min_experience_years=2.0,
            icon="Layers"
        ),
        models.Role(
            title="Data Analyst",
            description="Transforms raw business data into actionable dashboards, statistical insights, and reports.",
            required_skills=["SQL", "Python", "Pandas", "Power BI", "Excel"],
            preferred_skills=["Tableau", "NumPy", "Statistics", "Data Visualization"],
            min_experience_years=0.5,
            icon="BarChart3"
        ),
        models.Role(
            title="DevOps Engineer",
            description="Automates cloud infrastructure, CI/CD pipelines, container orchestration, and reliability.",
            required_skills=["Docker", "Kubernetes", "AWS", "CI/CD", "Linux"],
            preferred_skills=["Terraform", "Python", "Bash", "Prometheus", "GCP"],
            min_experience_years=2.0,
            icon="Server"
        ),
        models.Role(
            title="Frontend Developer",
            description="Crafts beautiful, interactive user experiences using React, Next.js, and modern CSS.",
            required_skills=["JavaScript", "TypeScript", "React", "HTML", "CSS"],
            preferred_skills=["Next.js", "Tailwind CSS", "Redux", "Figma", "REST API"],
            min_experience_years=1.0,
            icon="Monitor"
        ),
        models.Role(
            title="Data Scientist",
            description="Applies advanced statistics, machine learning models, and predictive analytics to solve complex problems.",
            required_skills=["Python", "Machine Learning", "SQL", "Pandas", "Scikit-Learn"],
            preferred_skills=["Deep Learning", "NLP", "PyTorch", "Statistics", "Big Data"],
            min_experience_years=2.0,
            icon="Database"
        ),
        models.Role(
            title="Cybersecurity Analyst",
            description="Monitors, audits, and secures network infrastructure, application endpoints, and cloud systems.",
            required_skills=["Cybersecurity", "Linux", "Networking", "Python", "SIEM"],
            preferred_skills=["Ethical Hacking", "Cryptography", "AWS", "Bash"],
            min_experience_years=1.5,
            icon="ShieldCheck"
        )
    ]
    db.add_all(roles)

    # 5. Seed Verified Learning Resources
    resources = [
        models.LearningResource(
            skill_name="FastAPI",
            title="FastAPI Official Documentation & Tutorial",
            platform="Official Docs",
            level="Beginner",
            is_free=True,
            estimated_duration="5 hours",
            url="https://fastapi.tiangolo.com/tutorial/"
        ),
        models.LearningResource(
            skill_name="FastAPI",
            title="Building High-Performance APIs with FastAPI",
            platform="Microsoft Learn",
            level="Intermediate",
            is_free=True,
            estimated_duration="8 hours",
            url="https://learn.microsoft.com/"
        ),
        models.LearningResource(
            skill_name="PyTorch",
            title="PyTorch Deep Learning Fundamentals",
            platform="Official Docs",
            level="Intermediate",
            is_free=True,
            estimated_duration="12 hours",
            url="https://pytorch.org/tutorials/"
        ),
        models.LearningResource(
            skill_name="PyTorch",
            title="Deep Learning Specialization with PyTorch",
            platform="Coursera",
            level="Advanced",
            is_free=False,
            estimated_duration="4 weeks",
            url="https://www.coursera.org/"
        ),
        models.LearningResource(
            skill_name="Docker",
            title="Docker Overview & Containerization Hands-on",
            platform="Official Docs",
            level="Beginner",
            is_free=True,
            estimated_duration="4 hours",
            url="https://docs.docker.com/get-started/"
        ),
        models.LearningResource(
            skill_name="Machine Learning",
            title="Machine Learning Specialization by Andrew Ng",
            platform="Coursera",
            level="Beginner",
            is_free=True,
            estimated_duration="6 weeks",
            url="https://www.coursera.org/specializations/machine-learning-introduction"
        ),
        models.LearningResource(
            skill_name="Deep Learning",
            title="Practical Deep Learning for Coders",
            platform="fast.ai",
            level="Intermediate",
            is_free=True,
            estimated_duration="8 weeks",
            url="https://course.fast.ai/"
        ),
        models.LearningResource(
            skill_name="React",
            title="React Official Interactive Documentation",
            platform="React.dev",
            level="Beginner",
            is_free=True,
            estimated_duration="6 hours",
            url="https://react.dev/learn"
        ),
        models.LearningResource(
            skill_name="SQL",
            title="PostgreSQL & SQL Tutorial for Beginners",
            platform="MDN Web Docs",
            level="Beginner",
            is_free=True,
            estimated_duration="4 hours",
            url="https://developer.mozilla.org/"
        )
    ]
    db.add_all(resources)

    # 6. Seed Sample Jobs
    jobs = [
        models.Job(
            company_id=company.id,
            title="AI/ML Engineer Intern",
            location="San Francisco, CA",
            work_type="Hybrid",
            employment_type="Internship",
            experience_level="Entry Level",
            salary_range="$45 - $60 / hr",
            required_skills=["Python", "Machine Learning", "SQL"],
            preferred_skills=["FastAPI", "Docker", "PyTorch"],
            education_requirement="B.S. or M.S. in Computer Science / Data Science",
            description="Join NovaTech AI to build state-of-the-art LLM pipelines and automated ML evaluation workflows.",
            deadline="2026-11-30",
            last_verified_at=datetime.datetime.utcnow(),
            is_active=True
        ),
        models.Job(
            company_id=company.id,
            title="Backend Python Developer",
            location="Remote",
            work_type="Remote",
            employment_type="Full-time",
            experience_level="Mid Level",
            salary_range="$110,000 - $140,000",
            required_skills=["Python", "FastAPI", "PostgreSQL", "REST API"],
            preferred_skills=["Docker", "Redis", "AWS"],
            education_requirement="B.S. in Computer Science",
            description="Develop scalable REST microservices for high-throughput AI API processing.",
            deadline="2026-12-15",
            last_verified_at=datetime.datetime.utcnow(),
            is_active=True
        )
    ]
    db.add_all(jobs)

    # 7. Seed Default ATS Weight Config
    ats_config = models.ATSWeightConfig(
        structure_weight=20.0,
        keyword_weight=30.0,
        experience_weight=20.0,
        content_weight=15.0,
        compatibility_weight=15.0,
        is_active=True
    )
    db.add(ats_config)

    # 8. Seed Sample Resume & Analysis for Demo Student
    sample_resume_text = """
Alex Mercer
San Francisco, CA | alex.mercer@example.com | (555) 234-5678
LinkedIn: linkedin.com/in/alexmercer | GitHub: github.com/alexmercer

PROFESSIONAL SUMMARY
Motivated Computer Science graduate with strong foundations in Python development, Data Science, and Machine Learning. Proven track record of engineering scalable REST APIs using FastAPI and building predictive ML models.

EDUCATION
Stanford University — B.S. in Computer Science (GPA: 3.8/4.0) | 2020 – 2024
Relevant Coursework: Machine Learning, Artificial Intelligence, Database Systems, Web Architecture.

TECHNICAL SKILLS
Languages: Python, SQL, JavaScript, HTML, CSS
Frameworks & Libraries: FastAPI, Scikit-Learn, Pandas, NumPy, React, Matplotlib
Tools & Databases: Git, GitHub, PostgreSQL, VS Code, Jupyter

PROJECTS
AI Image Classifier & Prediction Pipeline | 2024
• Engineered a convolutional neural network classification pipeline achieving 94% accuracy on standard benchmarks.
• Built a RESTful prediction API using FastAPI serving 1,500+ requests daily with under 120ms response latency.
• Containerized model service for deployment and automated tests using Pytest.

E-Commerce Customer Churn Analytics | 2023
• Processed and cleaned over 100,000 customer transaction records using Pandas and NumPy.
• Trained Random Forest models reducing false churn prediction rate by 18%.
    """.strip()

    sample_resume = models.Resume(
        user_id=student_user.id,
        filename="Alex_Mercer_Resume.pdf",
        file_path="/uploads/alex_mercer_resume.pdf",
        file_type="application/pdf",
        file_size=142800,
        parsed_text=sample_resume_text,
        structured_data={
            "contact_info": {
                "name": "Alex Mercer",
                "email": "alex.mercer@example.com",
                "phone": "(555) 234-5678",
                "linkedin": "linkedin.com/in/alexmercer",
                "github": "github.com/alexmercer"
            },
            "sections_found": ["summary", "education", "skills", "projects"],
            "word_count": 215,
            "character_count": 1420
        },
        is_active=True
    )
    db.add(sample_resume)
    db.commit()

    # Create Initial Analysis for Demo Student
    from services.ats_engine import calculate_ats_score
    from services.resume_parser import parse_resume_structure

    struct_data, sections = parse_resume_structure(sample_resume_text)
    target_role_info = {
        "title": "AI/ML Engineer",
        "required_skills": ["Python", "Machine Learning", "PyTorch", "SQL", "Pandas"],
        "preferred_skills": ["FastAPI", "Docker", "Deep Learning", "NLP"]
    }
    ats_res = calculate_ats_score(
        text=sample_resume_text,
        structured_data=struct_data,
        sections=sections,
        target_role_info=target_role_info
    )

    demo_analysis = models.ResumeAnalysis(
        resume_id=sample_resume.id,
        user_id=student_user.id,
        target_role="AI/ML Engineer",
        ats_score=ats_res["ats_score"],
        structure_score=ats_res["structure_score"],
        keyword_score=ats_res["keyword_score"],
        experience_score=ats_res["experience_score"],
        content_score=ats_res["content_score"],
        compatibility_score=ats_res["compatibility_score"],
        category_breakdown=ats_res["category_breakdown"],
        strengths=ats_res["strengths"],
        problems=ats_res["problems"],
        suggestions=ats_res["suggestions"],
        extracted_skills=ats_res["extracted_skills"],
        matched_keywords=ats_res["matched_keywords"],
        missing_keywords=ats_res["missing_keywords"]
    )
    db.add(demo_analysis)
    db.commit()

    print("Database seeding completed successfully!")
