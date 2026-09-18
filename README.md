# CareerLens — Resume Analyzer & Career Guidance Platform

CareerLens is a full-stack SaaS platform featuring a **100% deterministic ATS scoring engine**, explainable qualitative role recommendations, skill gap analysis, adaptive career roadmaps, verified learning resources, company discovery, and a dedicated recruiter/HR portal.

---

## Key Features

1. **Deterministic ATS Engine (100 Points)**:
   - Evaluates Structure & Parsing (20 pts), Keyword & Skills Optimization (30 pts), Experience Quality (20 pts), Content Quality (15 pts), and ATS Compatibility (15 pts).
   - Backend-configurable weights. The exact same resume + configuration produces the exact same score every single time.
2. **Student & Job Seeker Portal**:
   - PDF / DOCX parsing, contact extraction, section identification.
   - Qualitative Fit role recommendations (Strong Fit, Good Fit, Potential Fit, Needs Development) with evidence-based "Why" explanations.
   - Categorized skill gap analysis (Critical, High Priority, Medium Priority, Nice to Have).
   - 5-phase adaptive career learning roadmap skipping already mastered skills.
   - Verified learning resources library with non-hallucinated course links.
   - Companies hiring for user profile with "Last verified" date badges.
3. **Company & Recruiter Portal**:
   - Job post creation wizard with required/preferred skills.
   - Candidate search with multi-attribute filters.
   - Job-Profile candidate matching engine (transparent job-profile score separate from ATS score).
   - Direct candidate contact requests.
   - Candidate privacy settings (toggle recruiter discovery).
4. **Admin Panel**:
   - System stats dashboard (Users, Resumes, Active Jobs, Contact Requests, Avg ATS score).
   - Live interactive ATS Category Weight Configurator.
5. **1-Click Demo Mode**:
   - Quick-switch demo logins for **Student Demo**, **Recruiter Demo**, and **Admin Demo**.

---

## Project Structure

```
├── backend/
│   ├── main.py                # FastAPI main application
│   ├── database.py            # SQLite / SQLAlchemy connection engine
│   ├── models.py              # Database models
│   ├── schemas.py             # Typed Pydantic schemas
│   ├── auth.py                # JWT authentication & password hashing
│   ├── seed_data.py           # Pre-populated demo data & users
│   ├── services/
│   │   ├── resume_parser.py   # PDF / DOCX text & section parser
│   │   ├── ats_engine.py      # Deterministic 100-point ATS algorithm
│   │   ├── skill_extractor.py # Canonical taxonomy & synonym normalizer
│   │   ├── career_engine.py   # Qualitative fit role recommendations
│   │   ├── roadmap_engine.py  # Adaptive roadmap generator
│   │   └── candidate_matcher.py # Recruiter candidate profile matcher
│   ├── routers/               # API route handlers
│   └── tests/
│       └── test_ats_engine.py # Pytest test suite for ATS engine
├── frontend/
│   ├── app/                   # Next.js 14 App Router pages
│   ├── components/            # Navbar, Footer, UI components
│   └── lib/                   # API client & Auth utilities
└── .env.example
```

---

## Quick Start Guide

### 1. Run Python FastAPI Backend

```bash
cd backend
python -m pip install -r requirements.txt
python main.py
```
Backend API server will run at `http://127.0.0.1:8000`.

### 2. Run Next.js 14 Frontend

```bash
cd frontend
npm install
npm run dev
```
Frontend web application will run at `http://localhost:3000`.

### 3. Run Pytest Test Suite

```bash
cd backend
python -m pytest tests/test_ats_engine.py -v
```

---

## Demo Accounts

- **Student Demo**: `student@careerlens.demo` / `password123`
- **Recruiter Demo**: `recruiter@careerlens.demo` / `password123`
- **Admin Demo**: `admin@careerlens.demo` / `password123`
