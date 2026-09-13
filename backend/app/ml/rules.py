import re
from app.ml.preprocessing import GENERIC_EMAIL_DOMAINS

def evaluate_rules(text_info: dict, metadata: dict = None, features: dict = None) -> tuple:
    """
    Evaluates rule-based detectors and returns (indicators, trust_signals).
    Each indicator has type, severity, title, explanation, evidence, source.
    """
    if metadata is None:
        metadata = {}
    if features is None:
        features = {}

    cleaned = text_info.get("cleaned_text", "")
    raw_text = text_info.get("cleaned_text", "")
    word_count = text_info.get("word_count", 0)
    caps_ratio = text_info.get("caps_ratio", 0.0)

    indicators = []
    trust_signals = []

    # Rule 1: Upfront Payment / Financial Demands (CRITICAL)
    upfront_keywords = ['gift card', 'upfront fee', 'application fee', 'equipment fee', 'training fee', 'pay for equipment', 'buy software', 'purchase crypto', 'bitcoin deposit']
    found_upfront = [kw for kw in upfront_keywords if kw in cleaned]
    if found_upfront:
        indicators.append({
            "type": "upfront_payment",
            "severity": "critical",
            "title": "Upfront Payment or Fee Required",
            "explanation": "Legitimate employers never require candidates to pay application fees, buy equipment out-of-pocket, or purchase gift cards.",
            "evidence": f"Detected payment references: '{', '.join(found_upfront)}'",
            "source": "rule"
        })

    # Rule 2: Money Transfer / Check Cashing / Reshipping (CRITICAL)
    money_transfer_kws = ['wire transfer', 'check cashing', 'cashier check', 'western union', 'moneygram', 'reshipping', 'package handler', 'receive payments', 'transfer funds']
    found_money_transfer = [kw for kw in money_transfer_kws if kw in cleaned]
    if found_money_transfer:
        indicators.append({
            "type": "money_transfer_scam",
            "severity": "critical",
            "title": "Wire Transfer or Check-Cashing Pattern",
            "explanation": "Requesting candidates to cash checks, forward funds, or process wire transfers is a hallmark sign of fake job scams.",
            "evidence": f"Found suspicious financial activity terms: '{', '.join(found_money_transfer)}'",
            "source": "rule"
        })

    # Rule 3: Sensitive Information Early (HIGH)
    sensitive_kws = ['social security number', 'ssn', 'bank account details', 'driver license photo', 'credit score report', 'passport copy']
    found_sensitive = [kw for kw in sensitive_kws if kw in cleaned]
    if found_sensitive:
        indicators.append({
            "type": "sensitive_info_request",
            "severity": "high",
            "title": "Early Request for Sensitive Personal Data",
            "explanation": "Asking for SSNs, bank accounts, or identity documents before a formal offer is suspicious and exposes candidates to identity theft.",
            "evidence": f"Requested sensitive fields: '{', '.join(found_sensitive)}'",
            "source": "rule"
        })

    # Rule 4: Suspicious Interview Channel / Generic Email (HIGH / MEDIUM)
    chat_apps = ['telegram', 'whatsapp', 'signal', 'google hangouts', 'skype interview']
    found_chat = [kw for kw in chat_apps if kw in cleaned]
    contact_email = metadata.get("contact_email", "")
    all_emails = text_info.get("emails", [])
    if contact_email:
        all_emails.append(contact_email)
    
    generic_emails = []
    for email in all_emails:
        domain = email.split('@')[-1].lower() if '@' in email else ''
        if domain in GENERIC_EMAIL_DOMAINS:
            generic_emails.append(email)

    if found_chat or generic_emails:
        ev_parts = []
        if found_chat:
            ev_parts.append(f"Chat platforms mentioned: {', '.join(found_chat)}")
        if generic_emails:
            ev_parts.append(f"Generic contact email: {', '.join(generic_emails)}")

        indicators.append({
            "type": "suspicious_contact",
            "severity": "high" if (found_chat and generic_emails) else "medium",
            "title": "Unprofessional Contact or Messaging Channel",
            "explanation": "Reputable companies use corporate email domains and formal interview scheduling rather than generic emails or anonymous chat apps.",
            "evidence": "; ".join(ev_parts),
            "source": "rule"
        })

    # Rule 5: Unrealistic Earning Claims (HIGH)
    unrealistic_patterns = [
        r'\$\s*[3-9]\d{3,}\s*(?:per|\/)\s*(?:week|wk|day)',
        r'earn\s*\$\s*\d{3,}\s*daily',
        r'make\s*\$\s*10,000',
        r'no experience\s*.*\$[5-9]\d\/hr',
        r'work\s*1\s*hour\s*a\s*day'
    ]
    unrealistic_matches = []
    for pat in unrealistic_patterns:
        m = re.search(pat, cleaned)
        if m:
            unrealistic_matches.append(m.group(0))

    if unrealistic_matches:
        indicators.append({
            "type": "unrealistic_earnings",
            "severity": "high",
            "title": "Unrealistically High Earning Claims",
            "explanation": "Promising excessive compensation for minimal work or no experience is a common bait tactic used in fraudulent listings.",
            "evidence": f"Found claims: '{', '.join(unrealistic_matches)}'",
            "source": "rule"
        })

    # Rule 6: Urgency & High-Pressure Language (MEDIUM)
    urgency_kws = ['act fast', 'immediate start', 'apply now before it fills', 'urgent hiring', 'limited positions', 'dont miss out', 'kindly reply asap']
    found_urgency = [kw for kw in urgency_kws if kw in cleaned]
    if found_urgency:
        indicators.append({
            "type": "urgency_tactics",
            "severity": "medium",
            "title": "Urgency & High-Pressure Phrasing",
            "explanation": "Creating artificial urgency attempts to push job seekers into acting rashly without performing standard due diligence.",
            "evidence": f"Urgent phrases detected: '{', '.join(found_urgency)}'",
            "source": "rule"
        })

    # Rule 7: Vague Employer Identity (MEDIUM)
    company_name = metadata.get("company_name", "").strip()
    if not company_name or company_name.lower() in ['unknown', 'confidential', 'n/a', 'stealth startup', 'reputable company']:
        indicators.append({
            "type": "vague_employer",
            "severity": "medium",
            "title": "Anonymous or Undisclosed Employer Identity",
            "explanation": "The posting fails to name a verified hiring organization, making background verification difficult.",
            "evidence": f"Company field value: '{company_name if company_name else 'Empty'}'",
            "source": "rule"
        })

    # Rule 8: Poorly Structured / Exceptionally Short Description (LOW)
    if word_count < 45:
        indicators.append({
            "type": "poor_structure",
            "severity": "low",
            "title": "Extremely Short Job Description",
            "explanation": "The job description is vague and brief (under 45 words), lacking crucial details about responsibilities, qualifications, and role scope.",
            "evidence": f"Word count: {word_count} words",
            "source": "rule"
        })
    elif caps_ratio > 0.30 and word_count > 20:
        indicators.append({
            "type": "excessive_capitalization",
            "severity": "low",
            "title": "Excessive ALL-CAPS Text Formatting",
            "explanation": "Over 30% of characters are capitalized, which is typical of spam listings attempting to grab attention.",
            "evidence": f"Capitalization ratio: {int(caps_ratio * 100)}%",
            "source": "rule"
        })

    # Rule 9: Suspicious IP / Obfuscated Links (MEDIUM)
    urls = text_info.get("urls", [])
    suspicious_urls = [u for u in urls if re.search(r'http[s]?://\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', u) or 'bit.ly' in u or 'tinyurl' in u]
    if suspicious_urls:
        indicators.append({
            "type": "suspicious_url",
            "severity": "medium",
            "title": "Shortened or Raw IP Address Link",
            "explanation": "Links pointing to raw IP addresses or link shorteners disguise the true destination domain.",
            "evidence": f"Suspicious link format: {', '.join(suspicious_urls)}",
            "source": "rule"
        })

    # POSITIVE TRUST SIGNALS
    if company_name and company_name.lower() not in ['unknown', 'confidential', 'n/a']:
        trust_signals.append({
            "type": "verified_company_specified",
            "severity": "trust",
            "title": "Employer Identity Specified",
            "explanation": f"Posting lists an explicit employer name: '{company_name}'.",
            "evidence": company_name,
            "source": "rule"
        })

    if word_count >= 150 and features.get("trust_keyword_count", 0) >= 2:
        trust_signals.append({
            "type": "comprehensive_job_spec",
            "severity": "trust",
            "title": "Detailed Job Requirements & Scope",
            "explanation": f"Contains extensive documentation of duties and qualifications ({word_count} words).",
            "evidence": f"{word_count} words with structured requirements.",
            "source": "rule"
        })

    if metadata.get("salary_range") and ("$" in metadata["salary_range"] or "k" in metadata["salary_range"].lower()):
        trust_signals.append({
            "type": "transparent_compensation",
            "severity": "trust",
            "title": "Transparent Salary Range Provided",
            "explanation": "Provides structured compensation details upfront.",
            "evidence": metadata["salary_range"],
            "source": "rule"
        })

    return indicators, trust_signals
