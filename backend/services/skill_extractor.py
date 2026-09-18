import re
from typing import Dict, List

# Canonical Taxonomy & Synonyms
SKILL_TAXONOMY = {
    "technical": [
        "Python", "Java", "C++", "C#", "JavaScript", "TypeScript", "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin",
        "React", "Next.js", "Vue.js", "Angular", "Node.js", "Express", "FastAPI", "Django", "Flask", "Spring Boot",
        "HTML", "CSS", "Tailwind CSS", "Bootstrap", "REST API", "GraphQL", "gRPC", "Microservices",
        "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "SQLite", "DynamoDB", "Cassandra",
        "Machine Learning", "Deep Learning", "NLP", "Computer Vision", "PyTorch", "TensorFlow", "Scikit-Learn",
        "Pandas", "NumPy", "Matplotlib", "Seaborn", "OpenCV", "Hugging Face", "LLMs", "RAG", "LangChain",
        "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "CI/CD", "Linux", "Bash", "Shell Scripting"
    ],
    "soft": [
        "Communication", "Leadership", "Teamwork", "Problem Solving", "Critical Thinking", "Time Management",
        "Adaptability", "Collaboration", "Agile", "Scrum", "Mentorship", "Project Management"
    ],
    "tools": [
        "Git", "GitHub", "GitLab", "VS Code", "Jupyter", "Docker", "Postman", "Jira", "Confluence", "Figma",
        "Power BI", "Tableau", "Excel", "Jenkins", "Kubernetes"
    ],
    "domain": [
        "AI/ML", "Cloud Computing", "Cybersecurity", "Web Development", "Data Science", "DevOps",
        "Backend Development", "Frontend Development", "Full Stack Development", "Mobile Development"
    ]
}

SYNONYM_MAP = {
    "js": "JavaScript",
    "ts": "TypeScript",
    "py": "Python",
    "reactjs": "React",
    "react.js": "React",
    "nextjs": "Next.js",
    "next.js": "Next.js",
    "nodejs": "Node.js",
    "node.js": "Node.js",
    "vuejs": "Vue.js",
    "fast api": "FastAPI",
    "postgres": "PostgreSQL",
    "postgresql": "PostgreSQL",
    "mongo": "MongoDB",
    "ml": "Machine Learning",
    "dl": "Deep Learning",
    "nlp": "NLP",
    "k8s": "Kubernetes",
    "aws": "AWS",
    "gcp": "GCP",
    "azure": "Azure",
    "git": "Git",
    "github": "GitHub",
    "powerbi": "Power BI",
    "tableau": "Tableau",
    "scikit learn": "Scikit-Learn",
    "scikitlearn": "Scikit-Learn",
    "tf": "TensorFlow",
    "tensorflow": "TensorFlow",
    "pytorch": "PyTorch"
}

def extract_skills_from_text(text: str) -> Dict[str, List[str]]:
    """
    Scans raw text for canonical skills and normalized synonyms.
    Returns dictionary with categorized lists: technical, soft, tools, domain.
    """
    text_lower = f" {text.lower()} "
    # Normalize punctuation for boundary matching
    clean_text = re.sub(r'[^\w\s\+\#\./-]', ' ', text_lower)

    extracted = {
        "technical": set(),
        "soft": set(),
        "tools": set(),
        "domain": set()
    }

    # Check synonyms first
    for syn, canonical in SYNONYM_MAP.items():
        pattern = r'(?<!\w)' + re.escape(syn) + r'(?!\w)'
        if re.search(pattern, clean_text):
            for cat, skills in SKILL_TAXONOMY.items():
                if canonical in skills:
                    extracted[cat].add(canonical)

    # Check exact canonical names
    for cat, skills in SKILL_TAXONOMY.items():
        for skill in skills:
            pattern = r'(?<!\w)' + re.escape(skill.lower()) + r'(?!\w)'
            if re.search(pattern, clean_text):
                extracted[cat].add(skill)

    return {cat: sorted(list(skills)) for cat, skills in extracted.items()}
