import re
import io
from typing import Dict, Any, Tuple
from pypdf import PdfReader
import docx

def extract_text_from_file(file_bytes: bytes, filename: str) -> str:
    """Extracts raw text from PDF or DOCX file bytes."""
    ext = filename.split(".")[-1].lower()
    text = ""

    if ext == "pdf":
        try:
            pdf_file = io.BytesIO(file_bytes)
            reader = PdfReader(pdf_file)
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
        except Exception as e:
            text = ""
    elif ext in ["docx", "doc"]:
        try:
            docx_file = io.BytesIO(file_bytes)
            doc = docx.Document(docx_file)
            for para in doc.paragraphs:
                text += para.text + "\n"
            for table in doc.tables:
                for row in table.rows:
                    text += " ".join([cell.text for cell in row.cells]) + "\n"
        except Exception as e:
            text = ""

    return text.strip()

def parse_resume_structure(text: str) -> Tuple[Dict[str, Any], Dict[str, str]]:
    """
    Parses resume text into structured components:
    - Contact Information (email, phone, linkedin, github, portfolio)
    - Sections (education, experience, projects, skills, certifications, summary)
    """
    contact_info = {
        "email": None,
        "phone": None,
        "linkedin": None,
        "github": None,
        "portfolio": None,
        "name": None
    }

    # Extract Email
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    if email_match:
        contact_info["email"] = email_match.group(0)

    # Extract Phone
    phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
    if phone_match:
        contact_info["phone"] = phone_match.group(0)

    # Extract LinkedIn / GitHub / Portfolio
    linkedin_match = re.search(r'(https?://)?(www\.)?linkedin\.com/in/[\w-]+', text, re.IGNORECASE)
    if linkedin_match:
        contact_info["linkedin"] = linkedin_match.group(0)

    github_match = re.search(r'(https?://)?(www\.)?github\.com/[\w-]+', text, re.IGNORECASE)
    if github_match:
        contact_info["github"] = github_match.group(0)

    portfolio_match = re.search(r'(https?://)?([\w-]+\.)+(com|io|dev|me|tech)/?', text, re.IGNORECASE)
    if portfolio_match and not linkedin_match and not github_match:
        contact_info["portfolio"] = portfolio_match.group(0)

    # Extract Name (Guessing first non-empty line)
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    if lines:
        contact_info["name"] = lines[0]

    # Section Headers Detection
    section_patterns = {
        "education": r'\b(education|academic|university|degree|qualifications)\b',
        "experience": r'\b(experience|work experience|employment|history|professional experience)\b',
        "projects": r'\b(projects|key projects|personal projects|portfolio projects)\b',
        "skills": r'\b(skills|technical skills|technologies|expertise|core competencies)\b',
        "certifications": r'\b(certifications|certificates|licenses|training)\b',
        "summary": r'\b(summary|objective|profile|about me|professional summary)\b'
    }

    sections = {
        "education": "",
        "experience": "",
        "projects": "",
        "skills": "",
        "certifications": "",
        "summary": ""
    }

    current_section = "summary"
    for line in text.splitlines():
        line_clean = line.strip()
        if not line_clean:
            continue
        
        # Check if line matches a section header
        matched_section = None
        for sec_name, pattern in section_patterns.items():
            if re.search(pattern, line_clean, re.IGNORECASE) and len(line_clean) < 45:
                matched_section = sec_name
                break
        
        if matched_section:
            current_section = matched_section
        else:
            sections[current_section] += line_clean + "\n"

    structured_data = {
        "contact_info": contact_info,
        "sections_found": [k for k, v in sections.items() if len(v.strip()) > 10],
        "word_count": len(text.split()),
        "character_count": len(text)
    }

    return structured_data, sections
