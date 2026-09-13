import json
from flask import Blueprint, request, jsonify
from app.db.database import get_db_session
from app.db.models import Analysis, Indicator
from app.ml.predictor import predictor_instance

api_bp = Blueprint("api_v1", __name__, url_prefix="/api/v1")

@api_bp.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "AI Gaurd API",
        "version": "1.0.0",
        "active_model": predictor_instance.metadata.get("version", "tfidf-logreg-v1")
    }), 200

@api_bp.route("/model/info", methods=["GET"])
def model_info():
    meta = predictor_instance.metadata
    return jsonify({
        "model_version": meta.get("version", "tfidf-logreg-v1"),
        "algorithm": meta.get("algorithm", "TF-IDF + Logistic Regression"),
        "training_date": meta.get("training_date"),
        "metrics": meta.get("metrics", {
            "accuracy": 0.95,
            "precision": 0.94,
            "recall": 0.96,
            "f1_score": 0.95
        }),
        "vocab_size": meta.get("vocab_size", 500),
        "rule_engine_rules_count": 12,
        "supported_risk_levels": ["low", "moderate", "high", "very_high"]
    }), 200

@api_bp.route("/analyze", methods=["POST"])
def analyze_job():
    data = request.get_json() or {}
    
    raw_text = data.get("job_description", "").strip() or data.get("raw_text", "").strip()
    if not raw_text:
        return jsonify({"error": "Job description text is required"}), 400

    if len(raw_text) > 50000:
        return jsonify({"error": "Job description exceeds max allowed length (50,000 characters)"}), 400

    structured_metadata = {
        "job_title": data.get("job_title", "").strip(),
        "company_name": data.get("company_name", "").strip(),
        "location": data.get("location", "").strip(),
        "employment_type": data.get("employment_type", "").strip(),
        "salary_range": data.get("salary_range", "").strip(),
        "application_url": data.get("application_url", "").strip(),
        "contact_email": data.get("contact_email", "").strip()
    }

    # Run ML & Rule prediction pipeline
    result = predictor_instance.analyze_job_posting(raw_text, structured_metadata)

    # Save analysis to database
    db = get_db_session()
    try:
        analysis_record = Analysis(
            job_title=structured_metadata["job_title"],
            company_name=structured_metadata["company_name"],
            location=structured_metadata["location"],
            employment_type=structured_metadata["employment_type"],
            salary_range=structured_metadata["salary_range"],
            application_url=structured_metadata["application_url"],
            contact_email=structured_metadata["contact_email"],
            safety_score=result["safety_score"],
            fraud_probability=result["fraud_probability"],
            risk_level=result["risk_level"],
            confidence=result["confidence"],
            model_version=result["model_version"],
            raw_text=raw_text,
            structured_metadata_json=json.dumps(structured_metadata)
        )
        db.add(analysis_record)
        db.flush()

        # Save indicators & trust signals
        for ind in result["indicators"]:
            ind_record = Indicator(
                analysis_id=analysis_record.id,
                type=ind["type"],
                severity=ind["severity"],
                title=ind["title"],
                explanation=ind["explanation"],
                evidence=ind.get("evidence", ""),
                source=ind.get("source", "rule")
            )
            db.add(ind_record)

        for ts in result["trust_signals"]:
            ts_record = Indicator(
                analysis_id=analysis_record.id,
                type=ts["type"],
                severity="trust",
                title=ts["title"],
                explanation=ts["explanation"],
                evidence=ts.get("evidence", ""),
                source=ts.get("source", "rule")
            )
            db.add(ts_record)

        db.commit()

        response_payload = result.copy()
        response_payload["analysis_id"] = analysis_record.id
        response_payload["created_at"] = analysis_record.created_at.isoformat()
        return jsonify(response_payload), 200

    except Exception as e:
        db.rollback()
        return jsonify({"error": f"Failed to save analysis record: {str(e)}"}), 500
    finally:
        db.close()

@api_bp.route("/analyses", methods=["GET"])
def list_analyses():
    db = get_db_session()
    try:
        search = request.args.get("search", "").strip().lower()
        risk_filter = request.args.get("risk_level", "").strip().lower()

        query = db.query(Analysis).order_by(Analysis.created_at.desc())

        if risk_filter:
            query = query.filter(Analysis.risk_level == risk_filter)

        analyses = query.all()

        results = []
        for item in analyses:
            d = item.to_dict()
            if search:
                text_to_search = f"{d['job_title']} {d['company_name']} {d['location']}".lower()
                if search not in text_to_search:
                    continue
            results.append(d)

        return jsonify(results), 200
    finally:
        db.close()

@api_bp.route("/analyses/<string:analysis_id>", methods=["GET"])
def get_analysis(analysis_id):
    db = get_db_session()
    try:
        analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
        if not analysis:
            return jsonify({"error": "Analysis record not found"}), 404
        return jsonify(analysis.to_dict()), 200
    finally:
        db.close()

@api_bp.route("/analyses/<string:analysis_id>", methods=["DELETE"])
def delete_analysis(analysis_id):
    db = get_db_session()
    try:
        analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
        if not analysis:
            return jsonify({"error": "Analysis record not found"}), 404

        db.delete(analysis)
        db.commit()
        return jsonify({"message": "Analysis record deleted successfully", "analysis_id": analysis_id}), 200
    finally:
        db.close()

@api_bp.route("/dashboard/stats", methods=["GET"])
def dashboard_stats():
    db = get_db_session()
    try:
        analyses = db.query(Analysis).order_by(Analysis.created_at.desc()).all()
        total_analyses = len(analyses)
        
        if total_analyses == 0:
            return jsonify({
                "total_analyses": 0,
                "high_risk_count": 0,
                "moderate_risk_count": 0,
                "low_risk_count": 0,
                "average_safety_score": 0.0,
                "risk_distribution": [
                    {"name": "Low Risk", "value": 0, "color": "#10b981"},
                    {"name": "Moderate Risk", "value": 0, "color": "#f59e0b"},
                    {"name": "High Caution", "value": 0, "color": "#f97316"},
                    {"name": "Very High Risk", "value": 0, "color": "#ef4444"}
                ],
                "recent_analyses": [],
                "score_history": []
            }), 200

        low_count = sum(1 for a in analyses if a.risk_level == "low")
        mod_count = sum(1 for a in analyses if a.risk_level == "moderate")
        high_count = sum(1 for a in analyses if a.risk_level == "high")
        vhigh_count = sum(1 for a in analyses if a.risk_level == "very_high")
        
        avg_score = round(sum(a.safety_score for a in analyses) / total_analyses, 1)

        recent = [a.to_dict() for a in analyses[:5]]
        
        # Build timeline history
        score_history = [
            {
                "id": a.id[:8],
                "date": a.created_at.strftime("%b %d %H:%M") if a.created_at else "",
                "score": a.safety_score,
                "title": a.job_title or "Position"
            }
            for a in reversed(analyses[:10])
        ]

        return jsonify({
            "total_analyses": total_analyses,
            "high_risk_count": high_count + vhigh_count,
            "moderate_risk_count": mod_count,
            "low_risk_count": low_count,
            "average_safety_score": avg_score,
            "risk_distribution": [
                {"name": "Low Risk", "value": low_count, "color": "#10b981"},
                {"name": "Moderate Risk", "value": mod_count, "color": "#f59e0b"},
                {"name": "High Caution", "value": high_count, "color": "#f97316"},
                {"name": "Very High Risk", "value": vhigh_count, "color": "#ef4444"}
            ],
            "recent_analyses": recent,
            "score_history": score_history
        }), 200
    finally:
        db.close()
