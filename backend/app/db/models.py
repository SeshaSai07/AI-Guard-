import uuid
from datetime import datetime, timezone
import json
from sqlalchemy import Column, String, Integer, Float, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.db.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    job_title = Column(String(255), nullable=True)
    company_name = Column(String(255), nullable=True)
    location = Column(String(255), nullable=True)
    employment_type = Column(String(100), nullable=True)
    salary_range = Column(String(100), nullable=True)
    application_url = Column(String(500), nullable=True)
    contact_email = Column(String(255), nullable=True)
    
    safety_score = Column(Integer, nullable=False)
    fraud_probability = Column(Float, nullable=False)
    risk_level = Column(String(50), nullable=False)
    confidence = Column(String(50), nullable=False)
    model_version = Column(String(100), nullable=False)
    
    raw_text = Column(Text, nullable=False)
    structured_metadata_json = Column(Text, nullable=True)

    indicators = relationship("Indicator", back_populates="analysis", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "analysis_id": self.id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "job_title": self.job_title or "Untitled Position",
            "company_name": self.company_name or "Unspecified Company",
            "location": self.location or "Remote / Unspecified",
            "employment_type": self.employment_type or "Not specified",
            "salary_range": self.salary_range or "Not specified",
            "application_url": self.application_url or "",
            "contact_email": self.contact_email or "",
            "safety_score": self.safety_score,
            "fraud_probability": round(self.fraud_probability, 4),
            "risk_level": self.risk_level,
            "confidence": self.confidence,
            "model_version": self.model_version,
            "raw_text": self.raw_text,
            "structured_metadata": json.loads(self.structured_metadata_json) if self.structured_metadata_json else {},
            "indicators": [i.to_dict() for i in self.indicators if i.severity != 'trust'],
            "trust_signals": [i.to_dict() for i in self.indicators if i.severity == 'trust'],
        }

class Indicator(Base):
    __tablename__ = "indicators"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    analysis_id = Column(String(36), ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(100), nullable=False)
    severity = Column(String(20), nullable=False)  # critical, high, medium, low, trust
    title = Column(String(255), nullable=False)
    explanation = Column(Text, nullable=False)
    evidence = Column(Text, nullable=True)
    source = Column(String(50), default="rule")  # rule, ml, metadata

    analysis = relationship("Analysis", back_populates="indicators")

    def to_dict(self):
        return {
            "id": self.id,
            "type": self.type,
            "severity": self.severity,
            "title": self.title,
            "explanation": self.explanation,
            "evidence": self.evidence or "",
            "source": self.source
        }

class ModelVersion(Base):
    __tablename__ = "model_versions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    version = Column(String(100), unique=True, nullable=False)
    algorithm = Column(String(100), nullable=False)
    training_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    accuracy = Column(Float, nullable=False)
    f1_score = Column(Float, nullable=False)
    precision = Column(Float, nullable=False)
    recall = Column(Float, nullable=False)
    artifact_path = Column(String(255), nullable=True)
    active = Column(Boolean, default=True)

    def to_dict(self):
        return {
            "id": self.id,
            "version": self.version,
            "algorithm": self.algorithm,
            "training_date": self.training_date.isoformat() if self.training_date else None,
            "accuracy": round(self.accuracy, 4),
            "f1_score": round(self.f1_score, 4),
            "precision": round(self.precision, 4),
            "recall": round(self.recall, 4),
            "active": self.active
        }
