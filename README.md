# 🛡️ JobShield AI — Fake Job Posting Detection & Safety Dashboard

JobShield AI is a full-stack decision-support platform that analyzes job postings and estimates how likely a listing is to be fraudulent, suspicious, or legitimate. The system combines Machine Learning (scikit-learn TF-IDF + Logistic Regression) with an explainable 12-signal Rule Engine to generate a calibrated **0–100 Safety Score**, warning evidence cards, trust factors, and actionable verification steps.

---

## 📐 System Architecture

```
[ React + Vite UI ]  ──( REST API )──>  [ Flask API Server (backend/app/main.py) ]
       │                                                      │
       ├── Dashboard Overview Stats                           ├── Text Preprocessing (app/ml/preprocessing.py)
       ├── Job Scanner Form + Presets                         ├── Feature Extraction (app/ml/features.py)
       ├── Safety Score Gauge (SVG)                           ├── Rule Engine (app/ml/rules.py)
       ├── Evidence Cards & Trust Factors                     ├── ML Classifier (scikit-learn TF-IDF + LogReg)
       └── History Table & Modal Reports                      ├── Scoring Engine (app/ml/scoring.py)
                                                              └── SQLite Database (jobshield.db)
```

---

## 🧰 Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Recharts, Lucide Icons (Strictly `.jsx` components).
- **Backend**: Python 3.12, Flask, Flask-CORS, SQLAlchemy, SQLite.
- **Machine Learning & NLP**: scikit-learn (TF-IDF Vectorizer, Logistic Regression), pandas, NumPy, joblib.
- **Testing**: `pytest` for backend ML pipelines and REST API routes.
- **Containerization**: Docker & Docker Compose.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**

---

### 1. Backend Setup (Flask Server)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Train baseline ML model artifacts
python train_model.py

# Run Flask backend server (default port 5000)
python -m app.main
```

The Flask API will start running at `http://127.0.0.1:5000`.

---

### 2. Frontend Setup (React + Vite)

In a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server (default port 3000)
npm run dev
```

Open your browser at `http://localhost:3000` to launch the **JobShield AI** dashboard.

---

### 3. Running Automated Tests

```bash
cd backend
python -m pytest tests/test_pipeline.py
```

---

### 4. Running via Docker Compose

```bash
docker-compose up --build
```

Access the frontend at `http://localhost:3000` and API at `http://localhost:5000`.

---

## 🔌 API Endpoints Reference

All endpoints are versioned under `/api/v1`:

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/v1/health` | `GET` | API health check & active model version |
| `/api/v1/model/info` | `GET` | Active ML model metadata, algorithm & cross-validation metrics |
| `/api/v1/analyze` | `POST` | Analyze job posting text + metadata and return safety diagnostic |
| `/api/v1/analyses` | `GET` | List all historical scan entries (supports `search` & `risk_level` filters) |
| `/api/v1/analyses/<id>` | `GET` | Retrieve detailed analysis record by UUID |
| `/api/v1/analyses/<id>` | `DELETE` | Delete analysis record from database |
| `/api/v1/dashboard/stats` | `GET` | Aggregated dashboard stats (totals, risk distributions, score trends) |

---

## 📊 Safety Score Methodology

JobShield AI calculates a **0–100 Safety Score** where higher scores indicate safer postings:

- **Base Score**: Computed from the scikit-learn TF-IDF model fraud probability: `(1.0 - fraud_probability) * 100`.
- **Rule Penalties**: Deductions applied for triggered scam indicators:
  - **Critical Risk (-40 pts)**: Upfront fees, check-cashing schemes, gift card purchases, reshipping tasks.
  - **High Risk (-20 pts)**: Requesting SSN/bank details early, Telegram/WhatsApp interview instructions, $5,000/week no-experience claims.
  - **Medium Risk (-10 pts)**: Generic email domains (Gmail/Yahoo), urgent pressure language, vague employer profile, suspicious shortened links.
  - **Low Risk (-4 pts)**: Extremely short description (< 45 words), excessive ALL-CAPS formatting.
- **Trust Boosts (+5 to +15 pts)**: Verified employer name, transparent salary range, comprehensive responsibilities.

### Risk Category Boundaries
- `80 – 100`: **Low Risk** (Generally Safer)
- `60 – 79`: **Moderate Risk** (Proceed With Standard Verification)
- `40 – 59`: **High Caution** (Suspicious Indicators Present)
- `0 – 39`: **Very High Risk** (High Probability of Fraud)

---

## ⚠️ AI Advisory Disclaimer

JobShield AI is a **decision-support tool** designed to assist job seekers in identifying suspicious hiring patterns. High risk flags indicate elevated likelihood of fraud based on statistical signals, but do not constitute mathematical certainty. Always verify employer credentials independently via official corporate registries or corporate phone numbers before sharing confidential personal information.
