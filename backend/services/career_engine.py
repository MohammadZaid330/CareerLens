from typing import List, Dict, Any

def evaluate_role_recommendations(
    extracted_skills_dict: Dict[str, List[str]],
    user_experience_years: float = 0.0,
    all_roles: List[Dict[str, Any]] = None
) -> List[Dict[str, Any]]:
    """
    Evaluates candidate's extracted skills against available roles.
    Returns qualitative fit recommendations with evidence-based "Why" explanations.
    Does NOT return fake percentage scores.
    """
    user_skills = set()
    for s_list in extracted_skills_dict.values():
        for s in s_list:
            user_skills.add(s.lower())

    recommendations = []

    for r in (all_roles or []):
        req_skills = r.get("required_skills", [])
        pref_skills = r.get("preferred_skills", [])
        all_role_skills = set([s.lower() for s in req_skills + pref_skills])

        matched_req = [s for s in req_skills if s.lower() in user_skills]
        matched_pref = [s for s in pref_skills if s.lower() in user_skills]
        missing_req = [s for s in req_skills if s.lower() not in user_skills]

        req_match_ratio = len(matched_req) / max(1, len(req_skills))
        total_match_count = len(matched_req) + len(matched_pref)

        # Determine Qualitative Fit Category
        if req_match_ratio >= 0.7:
            fit_category = "Strong Fit"
            fit_label = "High Alignment"
        elif req_match_ratio >= 0.45 or total_match_count >= 3:
            fit_category = "Good Fit"
            fit_label = "Solid Foundation"
        elif total_match_count >= 1:
            fit_category = "Potential Fit"
            fit_label = "Transferable Skills"
        else:
            fit_category = "Needs Development"
            fit_label = "Requires Training"

        # Evidence-Based "Why" Explanations
        why_reasons = []
        if matched_req:
            why_reasons.append(f"Core technical skills detected: {', '.join(matched_req[:4])}.")
        if matched_pref:
            why_reasons.append(f"Additional relevant tools present: {', '.join(matched_pref[:3])}.")
        if not matched_req and not matched_pref:
            why_reasons.append("Profile has basic foundational skills that can be leveraged with focused study.")

        recommendations.append({
            "role_id": r.get("id"),
            "title": r.get("title"),
            "qualitative_fit": fit_category,
            "fit_score_estimate": fit_label,
            "why_reasons": why_reasons,
            "next_focus_skills": missing_req[:4],
            "icon": r.get("icon", "Briefcase"),
            "matched_skills_count": len(matched_req) + len(matched_pref),
            "total_role_skills_count": len(req_skills) + len(pref_skills)
        })

    # Sort recommendations: Strong Fit > Good Fit > Potential Fit > Needs Development
    fit_priority = {"Strong Fit": 1, "Good Fit": 2, "Potential Fit": 3, "Needs Development": 4}
    recommendations.sort(key=lambda x: (fit_priority[x["qualitative_fit"]], -x["matched_skills_count"]))

    return recommendations
