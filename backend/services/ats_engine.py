import re
from typing import Dict, Any, List, Optional
from services.skill_extractor import extract_skills_from_text

# Action Verbs & Impact Metrics Regex
ACTION_VERBS = [
    "built", "developed", "engineered", "implemented", "designed", "architected", "created",
    "launched", "optimized", "increased", "reduced", "led", "managed", "deployed", "scaled",
    "integrated", "refactored", "automated", "mentored", "orchestrated", "transformed"
]

VAGUE_PHRASES = [
    "hardworking", "team player", "detail-oriented", "passionate", "self-starter",
    "think outside the box", "go-getter", "results-driven", "synergy", "dynamic"
]

DEFAULT_WEIGHTS = {
    "structure_weight": 20.0,
    "keyword_weight": 30.0,
    "experience_weight": 20.0,
    "content_weight": 15.0,
    "compatibility_weight": 15.0
}

def calculate_ats_score(
    text: str,
    structured_data: Dict[str, Any],
    sections: Dict[str, str],
    target_role_info: Optional[Dict[str, Any]] = None,
    job_description: Optional[str] = None,
    weights: Optional[Dict[str, float]] = None
) -> Dict[str, Any]:
    """
    Deterministic 100-point ATS Scoring Engine.
    Guarantees exact same output given identical text, target role, and weights configuration.
    """
    w = weights if weights else DEFAULT_WEIGHTS
    contact_info = structured_data.get("contact_info", {})
    extracted_skills_dict = extract_skills_from_text(text)
    all_extracted_skills = set()
    for cat_skills in extracted_skills_dict.values():
        all_extracted_skills.update(cat_skills)

    strengths: List[str] = []
    problems: List[str] = []
    suggestions: List[str] = []

    # -------------------------------------------------------------
    # 1. Resume Structure & Parsing (Default Max: 20 pts)
    # -------------------------------------------------------------
    max_struct = w["structure_weight"]
    struct_pts = 0.0

    # Contact Details Checks
    if contact_info.get("name"):
        struct_pts += max_struct * 0.10
    else:
        problems.append("Candidate name could not be detected at the top of the resume.")
        suggestions.append("Ensure your full name is clearly stated in large font at the top of the document.")

    if contact_info.get("email"):
        struct_pts += max_struct * 0.15
        strengths.append("Proper contact email detected.")
    else:
        problems.append("Missing email address.")
        suggestions.append("Include a professional email address near your contact header.")

    if contact_info.get("phone"):
        struct_pts += max_struct * 0.10
        strengths.append("Valid phone number included.")
    else:
        problems.append("Missing phone number.")

    if contact_info.get("linkedin") or contact_info.get("github") or contact_info.get("portfolio"):
        struct_pts += max_struct * 0.15
        strengths.append("Includes online professional links (LinkedIn/GitHub/Portfolio).")
    else:
        problems.append("No LinkedIn or GitHub links detected.")
        suggestions.append("Add your LinkedIn profile URL and GitHub repository link.")

    # Section Headers Checks (50% of Structure score)
    sections_found = structured_data.get("sections_found", [])
    expected_sections = ["education", "experience", "skills", "projects"]
    found_expected = [s for s in expected_sections if s in sections_found]
    section_ratio = len(found_expected) / len(expected_sections)
    struct_pts += (max_struct * 0.50) * section_ratio

    if "education" in sections_found:
        strengths.append("Clear education section detected.")
    else:
        problems.append("Missing standard 'Education' section heading.")
        suggestions.append("Add a standard heading named 'Education' for ATS parsers.")

    if "skills" in sections_found:
        strengths.append("Dedicated technical skills section detected.")

    struct_score = min(max_struct, round(struct_pts, 1))

    # -------------------------------------------------------------
    # 2. Keyword & Skills Optimization (Default Max: 30 pts)
    # -------------------------------------------------------------
    max_kw = w["keyword_weight"]
    matched_keywords: List[str] = []
    missing_keywords: List[str] = []
    kw_pts = 0.0

    if target_role_info or job_description:
        req_skills = target_role_info.get("required_skills", []) if target_role_info else []
        pref_skills = target_role_info.get("preferred_skills", []) if target_role_info else []

        if job_description:
            jd_skills_dict = extract_skills_from_text(job_description)
            for s_list in jd_skills_dict.values():
                for s in s_list:
                    if s not in req_skills:
                        req_skills.append(s)

        total_req = len(req_skills) if req_skills else 1
        for s in req_skills:
            if s.lower() in text.lower() or any(s.lower() == ext.lower() for ext in all_extracted_skills):
                matched_keywords.append(s)
            else:
                missing_keywords.append(s)

        match_ratio = len(matched_keywords) / total_req
        kw_pts = max_kw * match_ratio

        if match_ratio >= 0.7:
            strengths.append(f"Strong keyword alignment with target role ({len(matched_keywords)} matched skills).")
        elif match_ratio >= 0.4:
            problems.append(f"Missing several key skills for target role ({len(missing_keywords)} missing).")
            suggestions.append(f"Incorporate missing core skills into your resume: {', '.join(missing_keywords[:4])}.")
        else:
            problems.append("Significant keyword gap compared to target role requirements.")
            suggestions.append("Tailor your skills section to explicitly match the target job description.")
    else:
        # General skill quality calculation if no target role
        tech_count = len(extracted_skills_dict.get("technical", []))
        tool_count = len(extracted_skills_dict.get("tools", []))
        total_found = len(all_extracted_skills)

        if total_found >= 10:
            kw_pts = max_kw * 0.90
            strengths.append(f"Rich technical skill section ({total_found} skills extracted).")
        elif total_found >= 5:
            kw_pts = max_kw * 0.70
            suggestions.append("Add more specific tools, frameworks, and technologies you have used.")
        else:
            kw_pts = max_kw * 0.45
            problems.append("Low technical skill density detected.")
            suggestions.append("List explicit technical skills, languages, and tools rather than general summaries.")

    keyword_score = min(max_kw, round(kw_pts, 1))

    # -------------------------------------------------------------
    # 3. Experience & Achievement Quality (Default Max: 20 pts)
    # -------------------------------------------------------------
    max_exp = w["experience_weight"]
    exp_pts = 0.0

    # Action Verbs check
    verbs_found = [v for v in ACTION_VERBS if re.search(r'\b' + v + r'\b', text, re.IGNORECASE)]
    verb_count = len(verbs_found)
    if verb_count >= 6:
        exp_pts += max_exp * 0.40
        strengths.append(f"Strong use of action verbs ({verb_count} distinct action verbs detected).")
    elif verb_count >= 3:
        exp_pts += max_exp * 0.25
    else:
        problems.append("Lack of strong action verbs in bullet points.")
        suggestions.append("Start bullet points with strong action verbs like 'Engineered', 'Optimized', 'Architected'.")

    # Quantified Metrics check (% or $ or numbers)
    metrics_matches = re.findall(r'(\d+%\s*|\$\d+|\b\d+x\b|\b\d+\s*(users|clients|percent|reduction|growth|increase)\b)', text, re.IGNORECASE)
    metric_count = len(metrics_matches)

    if metric_count >= 3:
        exp_pts += max_exp * 0.40
        strengths.append(f"Good presence of quantified achievements and measurable metrics.")
    elif metric_count >= 1:
        exp_pts += max_exp * 0.25
        suggestions.append("Quantify more achievements (e.g., 'Improved API latency by 35%', 'Served 10k+ users').")
    else:
        problems.append("Missing measurable impact and quantified results.")
        suggestions.append("Add specific metrics, percentage improvements, or dollar numbers to demonstrate impact.")

    # Project Description check
    if "projects" in sections_found or len(sections.get("projects", "").strip()) > 30:
        exp_pts += max_exp * 0.20
        strengths.append("Project descriptions present.")

    experience_score = min(max_exp, round(exp_pts, 1))

    # -------------------------------------------------------------
    # 4. Content Quality (Default Max: 15 pts)
    # -------------------------------------------------------------
    max_cnt = w["content_weight"]
    cnt_pts = max_cnt

    word_count = structured_data.get("word_count", 0)
    if word_count < 250:
        cnt_pts -= max_cnt * 0.4
        problems.append("Resume content is too brief (under 250 words).")
        suggestions.append("Expand on your technical projects, responsibilities, and achievements.")
    elif word_count > 1200:
        cnt_pts -= max_cnt * 0.3
        problems.append("Resume is overly verbose (over 1,200 words).")
        suggestions.append("Condense content to 1-2 pages focused on relevant experience.")
    else:
        strengths.append("Optimal document word count length.")

    vague_found = [vp for vp in VAGUE_PHRASES if vp.lower() in text.lower()]
    if vague_found:
        cnt_pts -= min(max_cnt * 0.3, len(vague_found) * 1.5)
        problems.append(f"Contains generic/vague buzzwords: {', '.join(vague_found[:3])}.")
        suggestions.append("Replace generic claims with tangible technical achievements.")

    content_score = max(0.0, min(max_cnt, round(cnt_pts, 1)))

    # -------------------------------------------------------------
    # 5. ATS Compatibility (Default Max: 15 pts)
    # -------------------------------------------------------------
    max_comp = w["compatibility_weight"]
    comp_pts = max_comp

    if word_count < 50:
        comp_pts -= max_comp * 0.8
        problems.append("Parsing failure or non-readable text format.")

    # Check for date consistency (YYYY format)
    years_found = re.findall(r'\b(19|20)\d{2}\b', text)
    if len(years_found) >= 2:
        strengths.append("Standard timeline/date structure detected.")
    else:
        suggestions.append("Use consistent date formats (e.g. 'Jan 2023 – Present') for ATS parser indexing.")

    # Check non-ascii character ratio (detect broken encodings)
    non_ascii = [c for c in text if ord(c) > 127]
    if len(non_ascii) / max(1, len(text)) > 0.05:
        comp_pts -= max_comp * 0.4
        problems.append("High ratio of non-standard symbols detected.")
        suggestions.append("Avoid complex graphics, unusual icons, or non-standard fonts that disrupt parsing.")

    compatibility_score = max(0.0, min(max_comp, round(comp_pts, 1)))

    # Total Score Calculation
    total_ats = round(struct_score + keyword_score + experience_score + content_score + compatibility_score, 1)

    # Health status rating
    if total_ats >= 85:
        status_label = "Excellent"
    elif total_ats >= 70:
        status_label = "Good"
    elif total_ats >= 55:
        status_label = "Needs Improvement"
    else:
        status_label = "Poor"

    return {
        "ats_score": total_ats,
        "status_label": status_label,
        "structure_score": struct_score,
        "keyword_score": keyword_score,
        "experience_score": experience_score,
        "content_score": content_score,
        "compatibility_score": compatibility_score,
        "category_breakdown": {
            "Structure & Parsing": {"earned": struct_score, "max": max_struct},
            "Keyword & Skills Optimization": {"earned": keyword_score, "max": max_kw},
            "Experience & Achievement Quality": {"earned": experience_score, "max": max_exp},
            "Content Quality": {"earned": content_score, "max": max_cnt},
            "ATS Compatibility": {"earned": compatibility_score, "max": max_comp}
        },
        "strengths": list(dict.fromkeys(strengths)),
        "problems": list(dict.fromkeys(problems)),
        "suggestions": list(dict.fromkeys(suggestions)),
        "extracted_skills": extracted_skills_dict,
        "matched_keywords": matched_keywords,
        "missing_keywords": missing_keywords
    }
