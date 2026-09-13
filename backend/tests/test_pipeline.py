import pytest
from app.ml.preprocessing import preprocess_text
from app.ml.features import extract_features
from app.ml.rules import evaluate_rules
from app.ml.scoring import calculate_safety_score
from app.ml.predictor import predictor_instance
from app.main import app

def test_preprocessing():
    text = "Apply NOW at http://fakejob.com or email hr@gmail.com! Earn $5000/week!"
    res = preprocess_text(text)
    assert "[URL]" in res["cleaned_text"]
    assert "[EMAIL]" in res["cleaned_text"]
    assert len(res["urls"]) == 1
    assert len(res["emails"]) == 1
    assert res["exclamation_count"] >= 2

def test_rule_engine_scam_detection():
    text = "URGENT WORK FROM HOME! Earn $5000 a week. Pay application fee of $50 via gift card. Contact on Telegram @fakejob."
    text_info = preprocess_text(text)
    features = extract_features(text_info, {"contact_email": "fake@gmail.com"})
    indicators, trust_signals = evaluate_rules(text_info, {"contact_email": "fake@gmail.com"}, features)
    
    types = [i["type"] for i in indicators]
    assert "upfront_payment" in types
    assert "suspicious_contact" in types

def test_scoring_engine():
    # High fraud probability + critical indicators
    result = calculate_safety_score(
        ml_fraud_prob=0.85,
        indicators=[{
            "type": "upfront_payment",
            "severity": "critical",
            "title": "Upfront Fee Required",
            "explanation": "Pay fee",
            "evidence": "Pay $50",
            "source": "rule"
        }],
        trust_signals=[]
    )
    assert result["safety_score"] <= 35
    assert result["risk_level"] in ["high", "very_high"]

def test_api_endpoints():
    client = app.test_client()
    
    # Test health check
    res_health = client.get("/api/v1/health")
    assert res_health.status_code == 200
    assert res_health.json["status"] == "healthy"

    # Test model info
    res_model = client.get("/api/v1/model/info")
    assert res_model.status_code == 200
    assert "model_version" in res_model.json

    # Test analyze endpoint
    res_analyze = client.post("/api/v1/analyze", json={
        "job_description": "We are seeking a Senior Data Engineer with 5+ years experience in Python, Spark, and SQL. Responsible for key responsibilities, building data pipelines, cloud architecture. Equal opportunity employer offering comprehensive health insurance, 401k matching, paid time off, and competitive salary range $140,000 - $170,000.",
        "job_title": "Senior Data Engineer",
        "company_name": "DataScale Tech",
        "location": "Boston, MA",
        "salary_range": "$140,000 - $170,000"
    })
    assert res_analyze.status_code == 200
    data = res_analyze.json
    assert "safety_score" in data
    assert data["safety_score"] >= 60

    # Test dashboard stats
    res_stats = client.get("/api/v1/dashboard/stats")
    assert res_stats.status_code == 200
    assert res_stats.json["total_analyses"] >= 1
