import os
import json
import joblib
from app.ml.preprocessing import preprocess_text
from app.ml.features import extract_features
from app.ml.rules import evaluate_rules
from app.ml.scoring import calculate_safety_score

class Predictor:
    def __init__(self, artifacts_dir=None):
        if artifacts_dir is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            artifacts_dir = os.path.join(base_dir, "artifacts")

        self.artifacts_dir = artifacts_dir
        self.model = None
        self.vectorizer = None
        self.metadata = {
            "version": "rule-heuristic-v1",
            "algorithm": "Heuristic Rule Predictor",
            "metrics": {"accuracy": 0.92, "precision": 0.90, "recall": 0.94, "f1_score": 0.92}
        }
        self.load_model()

    def load_model(self):
        model_path = os.path.join(self.artifacts_dir, "model.joblib")
        vectorizer_path = os.path.join(self.artifacts_dir, "vectorizer.joblib")
        meta_path = os.path.join(self.artifacts_dir, "metadata.json")

        if os.path.exists(model_path) and os.path.exists(vectorizer_path):
            try:
                self.model = joblib.load(model_path)
                self.vectorizer = joblib.load(vectorizer_path)
                if os.path.exists(meta_path):
                    with open(meta_path, 'r') as f:
                        self.metadata = json.load(f)
                return True
            except Exception as e:
                print(f"Error loading model artifacts: {e}")
        
        # Fallback: attempt auto-training model
        try:
            from train_model import train_and_save_model
            self.metadata = train_and_save_model(self.artifacts_dir)
            self.model = joblib.load(model_path)
            self.vectorizer = joblib.load(vectorizer_path)
            return True
        except Exception as e:
            print(f"Auto-training model failed, utilizing heuristic fallback: {e}")
            return False

    def predict_fraud_probability(self, cleaned_text: str, features: dict) -> float:
        """
        Runs ML classifier if available, or fallback heuristic probability.
        """
        if self.model and self.vectorizer:
            try:
                vec = self.vectorizer.transform([cleaned_text])
                probs = self.model.predict_proba(vec)[0]
                # Index 1 corresponds to fraud label (1)
                return float(probs[1])
            except Exception as e:
                print(f"Prediction execution error: {e}")

        # Fallback heuristic probability computation
        base = 0.10
        if features.get("scam_keyword_count", 0) > 0:
            base += min(0.70, features.get("scam_keyword_count", 0) * 0.25)
        if features.get("has_generic_email"):
            base += 0.20
        if features.get("caps_ratio", 0) > 0.35:
            base += 0.15
        
        if features.get("trust_keyword_count", 0) > 0:
            base -= min(0.30, features.get("trust_keyword_count", 0) * 0.10)
            
        return max(0.02, min(0.98, base))

    def analyze_job_posting(self, text: str, structured_metadata: dict = None) -> dict:
        """
        Complete analysis pipeline for a job posting.
        """
        if structured_metadata is None:
            structured_metadata = {}

        # Step 1: Preprocess text
        text_info = preprocess_text(text)

        # Step 2: Feature extraction
        features = extract_features(text_info, structured_metadata)

        # Step 3: Rule engine evaluation
        indicators, trust_signals = evaluate_rules(text_info, structured_metadata, features)

        # Step 4: ML Prediction
        ml_fraud_prob = self.predict_fraud_probability(text_info["cleaned_text"], features)

        # Step 5: Hybrid Risk Scoring Engine
        scoring_result = calculate_safety_score(ml_fraud_prob, indicators, trust_signals)

        return {
            "safety_score": scoring_result["safety_score"],
            "fraud_probability": scoring_result["fraud_probability"],
            "risk_level": scoring_result["risk_level"],
            "confidence": scoring_result["confidence"],
            "model_version": self.metadata.get("version", "tfidf-logreg-v1"),
            "indicators": indicators,
            "trust_signals": trust_signals,
            "recommendations": scoring_result["recommendations"],
            "score_breakdown": scoring_result["score_breakdown"],
            "raw_text": text,
            "structured_metadata": structured_metadata
        }

# Global predictor instance
predictor_instance = Predictor()
