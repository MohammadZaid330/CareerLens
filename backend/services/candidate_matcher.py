from typing import Dict, Any, List

def calculate_job_candidate_match(
    job_info: Dict[str, Any],
    candidate_profile: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Calculates deterministic Job-Profile Match score for recruiters.
    Compares job required/preferred skills against candidate's verified profile skills.
    Outputs matched skills, missing skills, and relevant experience note.
    """
    req_skills = job_info.get("required_skills", [])
    pref_skills = job_info.get("preferred_skills", [])
    candidate_skills = set([s.lower() for s in candidate_profile.get("skills", [])])

    matched_req = [s for s in req_skills if s.lower() in candidate_skills]
    missing_req = [s for s in req_skills if s.lower() not in candidate_skills]
    matched_pref = [s for s in pref_skills if s.lower() in candidate_skills]
    missing_pref = [s for s in pref_skills if s.lower() not in candidate_skills]

    # Weights: Required skills (70%), Preferred skills (30%)
    req_score = (len(matched_req) / max(1, len(req_skills))) * 70.0
    pref_score = (len(matched_pref) / max(1, len(pref_skills))) * 30.0 if pref_skills else 30.0

    total_match = round(req_score + pref_score, 1)

    exp_years = candidate_profile.get("experience_years", 0.0)
    exp_note = f"Candidate has {exp_years} year(s) of practical hands-on experience."
    if matched_req:
        exp_note += f" Verified proficiency in {', '.join(matched_req[:3])}."

    return {
        "candidate_id": candidate_profile.get("user_id"),
        "match_score": total_match,
        "matched_skills": matched_req + matched_pref,
        "missing_skills": missing_req + missing_pref,
        "relevant_experience_note": exp_note
    }
