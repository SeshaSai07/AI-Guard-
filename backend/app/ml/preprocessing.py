import re

# Common disposable or generic email domains
GENERIC_EMAIL_DOMAINS = {
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
    'protonmail.com', 'mail.com', 'yandex.com', 'gmx.com', 'icloud.com',
    'tempmail.com', 'guerrillamail.com', '10minutemail.com', 'dispostable.com'
}

URL_REGEX = re.compile(
    r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+',
    re.IGNORECASE
)

EMAIL_REGEX = re.compile(
    r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+',
    re.IGNORECASE
)

PHONE_REGEX = re.compile(
    r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}',
    re.IGNORECASE
)

SALARY_PATTERN = re.compile(
    r'(\$\s*\d+(?:,\d{3})*(?:\.\d{2})?\s*(?:-|to|–)\s*\$\s*\d+(?:,\d{3})*(?:\.\d{2})?|\$\s*\d+(?:,\d{3})*(?:\.\d{2})?|\d+k\s*-\s*\d+k|\d+\s*(?:usd|dollars|\$)\s*(?:per|a|\/)\s*(?:hour|hr|day|week|month|year|yr))',
    re.IGNORECASE
)

def preprocess_text(text: str) -> dict:
    """
    Cleans raw job posting text and extracts structural artifacts (URLs, emails, phones, numbers).
    """
    if not text:
        text = ""

    # Raw metrics
    raw_char_count = len(text)
    words = text.split()
    word_count = len(words)
    
    # Extract structural patterns
    urls = URL_REGEX.findall(text)
    emails = EMAIL_REGEX.findall(text)
    phones = PHONE_REGEX.findall(text)
    salary_matches = SALARY_PATTERN.findall(text)

    # Normalize text for NLP/TF-IDF
    cleaned = text.lower()
    # Replace URLs and emails with special tokens
    cleaned = URL_REGEX.sub(' [URL] ', cleaned)
    cleaned = EMAIL_REGEX.sub(' [EMAIL] ', cleaned)
    cleaned = PHONE_REGEX.sub(' [PHONE] ', cleaned)
    
    # Remove excessive whitespace
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()

    # Uppercase analysis (caps ratio before lowercasing)
    letters = [ch for ch in text if ch.isalpha()]
    caps_count = sum(1 for ch in letters if ch.isupper())
    caps_ratio = caps_count / max(len(letters), 1)

    # Exclamation count
    exclamation_count = text.count('!')

    return {
        "cleaned_text": cleaned,
        "raw_char_count": raw_char_count,
        "word_count": word_count,
        "urls": urls,
        "emails": emails,
        "phones": phones,
        "salary_matches": salary_matches,
        "caps_ratio": caps_ratio,
        "exclamation_count": exclamation_count
    }
