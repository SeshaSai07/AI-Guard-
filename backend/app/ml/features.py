import re
from app.ml.preprocessing import GENERIC_EMAIL_DOMAINS

SCAM_KEYWORDS = [
    'wire transfer', 'western union', 'moneygram', 'gift card', 'bitcoin', 'crypto',
    'upfront fee', 'application fee', 'equipment fee', 'check cashing', 'cashier check',
    'bank account details', 'social security number', 'ssn', 'telegram', 'whatsapp',
    'no experience required', 'earn $', 'make $5000', 'guaranteed income', 'work 1 hour',
    'reshipping', 'package handler', 'mystery shopper', 'secret shopper', 'immediate start',
    'urgent hiring', 'act fast', 'kindly contact', 'dear applicant', 'flexible hours high pay'
]

TRUST_KEYWORDS = [
    'benefits package', '401k', 'health insurance', 'equal opportunity employer',
    'key responsibilities', 'qualifications', 'bachelor', 'master', 'years of experience',
    'interview process', 'on-site', 'hybrid', 'equity options', 'paid time off', 'pto'
]

def extract_features(text_info: dict, metadata: dict = None) -> dict:
    """
    Extracts numerical & categorical feature signals used by rules & ML predictors.
    """
    if metadata is None:
        metadata = {}

    cleaned = text_info.get("cleaned_text", "")
    words = cleaned.split()
    word_count = text_info.get("word_count", 0)
    caps_ratio = text_info.get("caps_ratio", 0.0)
    exclamation_count = text_info.get("exclamation_count", 0)
    
    urls = text_info.get("urls", [])
    emails = text_info.get("emails", [])

    # Count scam keyword occurrences
    scam_keyword_count = sum(1 for kw in SCAM_KEYWORDS if kw in cleaned)
    trust_keyword_count = sum(1 for kw in TRUST_KEYWORDS if kw in cleaned)

    # Check contact emails
    contact_email = metadata.get("contact_email", "") or ""
    all_emails = set(emails)
    if contact_email:
        all_emails.add(contact_email)

    has_generic_email = False
    for email in all_emails:
        domain = email.split('@')[-1].lower() if '@' in email else ''
        if domain in GENERIC_EMAIL_DOMAINS:
            has_generic_email = True
            break

    # Structured metadata checks
    has_company = bool(metadata.get("company_name", "").strip())
    has_title = bool(metadata.get("job_title", "").strip())
    has_location = bool(metadata.get("location", "").strip())
    has_salary = bool(metadata.get("salary_range", "").strip()) or len(text_info.get("salary_matches", [])) > 0

    return {
        "word_count": word_count,
        "caps_ratio": caps_ratio,
        "exclamation_count": exclamation_count,
        "url_count": len(urls),
        "email_count": len(all_emails),
        "has_generic_email": has_generic_email,
        "scam_keyword_count": scam_keyword_count,
        "trust_keyword_count": trust_keyword_count,
        "has_company": has_company,
        "has_title": has_title,
        "has_location": has_location,
        "has_salary": has_salary,
    }
