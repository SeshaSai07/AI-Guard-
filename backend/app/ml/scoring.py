def calculate_safety_score(ml_fraud_prob: float, indicators: list, trust_signals: list) -> dict:
    """
    Combines ML model fraud probability (0-1) and rule-based indicators into a calibrated 0-100 Safety Score.
    Higher score = Safer listing.
    """
    # 1. Base safety score from ML model (0-100)
    # ML fraud probability ranges from 0.0 (safe) to 1.0 (fraud).
    base_safety = (1.0 - ml_fraud_prob) * 100.0

    # 2. Compute rule penalties based on indicator severities
    penalty = 0.0
    critical_count = 0
    high_count = 0
    medium_count = 0
    low_count = 0

    for ind in indicators:
        sev = ind.get("severity", "low")
        if sev == "critical":
            penalty += 40.0
            critical_count += 1
        elif sev == "high":
            penalty += 20.0
            high_count += 1
        elif sev == "medium":
            penalty += 10.0
            medium_count += 1
        elif sev == "low":
            penalty += 4.0
            low_count += 1

    # 3. Compute trust boosts
    boost = len(trust_signals) * 5.0
    boost = min(boost, 15.0)  # Max 15 points boost

    # 4. Final raw safety score calculation
    raw_safety = base_safety - penalty + boost
    
    # Cap safety score hard ceiling if critical scam patterns exist
    if critical_count >= 1:
        raw_safety = min(raw_safety, 35.0)
    elif high_count >= 1:
        raw_safety = min(raw_safety, 55.0)

    # Clamp between 0 and 100
    final_safety_score = int(round(max(0.0, min(100.0, raw_safety))))

    # Re-calculate overall combined fraud probability for consistency
    calibrated_fraud_prob = max(0.0, min(1.0, (100.0 - final_safety_score) / 100.0))

    # 5. Determine Risk Level
    if final_safety_score >= 80:
        risk_level = "low"
    elif final_safety_score >= 60:
        risk_level = "moderate"
    elif final_safety_score >= 40:
        risk_level = "high"
    else:
        risk_level = "very_high"

    # 6. Determine Confidence level based on evidence density & agreement
    total_signals = len(indicators) + len(trust_signals)
    if total_signals >= 3 or critical_count >= 1:
        confidence = "high"
    elif total_signals >= 1:
        confidence = "moderate"
    else:
        confidence = "low"

    # 7. Generate actionable recommendations
    recommendations = generate_recommendations(risk_level, indicators)

    return {
        "safety_score": final_safety_score,
        "fraud_probability": round(calibrated_fraud_prob, 4),
        "risk_level": risk_level,
        "confidence": confidence,
        "recommendations": recommendations,
        "score_breakdown": {
            "ml_base_safety": round(base_safety, 1),
            "rule_penalties": round(penalty, 1),
            "trust_boosts": round(boost, 1),
            "indicator_counts": {
                "critical": critical_count,
                "high": high_count,
                "medium": medium_count,
                "low": low_count,
                "trust": len(trust_signals)
            }
        }
    }

def generate_recommendations(risk_level: str, indicators: list) -> list:
    recs = []
    
    # Check specific indicator types
    types = {ind.get("type") for ind in indicators}
    
    if "upfront_payment" in types or "money_transfer_scam" in types:
        recs.append("NEVER send money, purchase gift cards, or cash checks on behalf of an employer.")
    
    if "sensitive_info_request" in types:
        recs.append("Do not provide Social Security Numbers, banking details, or passport copies until a formal contract is executed.")
    
    if "suspicious_contact" in types:
        recs.append("Verify the hiring recruiter by looking them up directly on LinkedIn or contacting the company's official corporate HR line.")
    
    if "vague_employer" in types:
        recs.append("Search official corporate registries (e.g. Secretary of State, Companies House) to confirm the hiring company exists.")

    # Generic advice by risk level
    if risk_level == "very_high":
        recs.append("Exercise EXTREME caution. This listing exhibits multiple high-confidence fraudulent patterns.")
    elif risk_level == "high":
        recs.append("Proceed with caution. Perform independent verification before sharing personal details or accepting interviews.")
    elif risk_level == "moderate":
        recs.append("Verify employer credentials and confirm job terms directly on the official company website.")
    else:
        recs.append("Listing appears consistent with legitimate job postings. Always practice basic online career safety.")

    # Always add general disclaimer recommendation
    recs.append("Verify job openings independently on the company's official career page before applying.")
    
    return recs
