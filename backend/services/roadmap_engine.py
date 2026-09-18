from typing import Dict, Any, List

def analyze_skill_gaps(
    user_skills_dict: Dict[str, List[str]],
    target_role_info: Dict[str, Any],
    resource_db_list: List[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Compares user skills against target role required and preferred skills.
    Categorizes missing skills into Critical, High Priority, Medium Priority, and Nice to Have.
    """
    user_skills_set = set()
    for s_list in user_skills_dict.values():
        for s in s_list:
            user_skills_set.add(s.lower())

    req_skills = target_role_info.get("required_skills", [])
    pref_skills = target_role_info.get("preferred_skills", [])

    already_have = []
    missing_items = []

    for s in req_skills:
        if s.lower() in user_skills_set:
            already_have.append(s)
        else:
            # Check resource count
            r_count = sum(1 for r in (resource_db_list or []) if r.get("skill_name", "").lower() == s.lower())
            missing_items.append({
                "skill_name": s,
                "category": "Critical",
                "importance_reason": f"Essential core requirement for target role '{target_role_info.get('title')}'.",
                "resources_count": max(1, r_count)
            })

    for s in pref_skills:
        if s.lower() in user_skills_set:
            already_have.append(s)
        else:
            r_count = sum(1 for r in (resource_db_list or []) if r.get("skill_name", "").lower() == s.lower())
            missing_items.append({
                "skill_name": s,
                "category": "High Priority",
                "importance_reason": f"Highly valued skill that differentiates strong candidates for '{target_role_info.get('title')}'.",
                "resources_count": max(1, r_count)
            })

    return {
        "target_role": target_role_info.get("title", "Target Role"),
        "already_have": list(dict.fromkeys(already_have)),
        "missing_skills": missing_items
    }

def generate_personalized_roadmap(
    user_skills_dict: Dict[str, List[str]],
    target_role_info: Dict[str, Any]
) -> List[Dict[str, Any]]:
    """
    Generates an adaptive 5-phase personalized roadmap based on target role & missing skills.
    Skips topics candidate has already mastered!
    """
    gap_analysis = analyze_skill_gaps(user_skills_dict, target_role_info)
    missing_skill_names = [m["skill_name"] for m in gap_analysis["missing_skills"]]

    # Standard adaptive phases template
    phases = [
        {
            "phase_number": 1,
            "phase_title": "Foundations & Core Prerequisites",
            "duration": "2–3 weeks",
            "default_skills": ["Python", "SQL", "Git", "HTML/CSS", "JavaScript"],
            "description": "Master foundational concepts, core syntax, data structures, and version control."
        },
        {
            "phase_number": 2,
            "phase_title": "Core Technical Competencies",
            "duration": "4–6 weeks",
            "default_skills": ["Machine Learning", "FastAPI", "React", "PostgreSQL", "Pandas"],
            "description": "Build solid proficiency in core frameworks and backend/data workflows essential for your role."
        },
        {
            "phase_number": 3,
            "phase_title": "Advanced Engineering & Domain Specialization",
            "duration": "4–6 weeks",
            "default_skills": ["Deep Learning", "PyTorch", "Next.js", "Docker", "NLP"],
            "description": "Deep dive into specialized architecture, advanced libraries, and industry standards."
        },
        {
            "phase_number": 4,
            "phase_title": "Hands-On Capstone Projects",
            "duration": "3–4 weeks",
            "default_skills": ["End-to-End Project", "REST API Integration", "ML Deployment"],
            "description": "Construct 2 production-ready portfolio projects demonstrating real-world problem solving."
        },
        {
            "phase_number": 5,
            "phase_title": "Cloud, DevOps & Production Readiness",
            "duration": "2–3 weeks",
            "default_skills": ["AWS", "Docker", "CI/CD", "Kubernetes", "Testing"],
            "description": "Learn containerization, automated deployment pipelines, and production deployment."
        }
    ]

    roadmap = []
    for p in phases:
        # Filter phase skills to include missing skills pertinent to this phase or target role
        phase_missing = [s for s in p["default_skills"] if s in missing_skill_names]
        if not phase_missing:
            # Pick from missing_skill_names for this phase
            phase_missing = missing_skill_names[:2]
            missing_skill_names = missing_skill_names[2:]

        if not phase_missing:
            phase_missing = ["Advanced Best Practices & Code Refactoring"]

        roadmap.append({
            "phase_number": p["phase_number"],
            "phase_title": p["phase_title"],
            "duration": p["duration"],
            "skills_to_learn": phase_missing,
            "description": p["description"],
            "is_completed": False
        })

    return roadmap
