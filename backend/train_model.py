import os
import json
from datetime import datetime, timezone
import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

def generate_synthetic_dataset():
    """
    Generates a representative training dataset containing both legitimate and fraudulent job postings.
    """
    legitimate_jobs = [
        "Senior Software Engineer needed for cloud computing architecture. Require 5+ years experience in Python, AWS, Docker, and Kubernetes. Excellent health benefits, 401k matching, competitive salary $140,000 - $170,000.",
        "Marketing Manager at TechCorp. Responsible for digital campaigns, SEO, content strategy, and market research. Bachelor degree in Business or Marketing required. On-site in New York or hybrid remote.",
        "Data Analyst - Healthcare Insights. Analyze patient health outcomes using SQL, Tableau, and Python. Full-time position with comprehensive medical insurance and paid time off.",
        "Full Stack React Developer. Build modern customer-facing web applications using React, Node.js, and TypeScript. Minimum 3 years experience required. Equal opportunity employer.",
        "Financial Controller for growing retail business. Manage budgeting, auditing, SEC compliance, and financial reporting. CPA certification preferred.",
        "Human Resources Specialist. Overseational hiring, employee onboarding, benefits administration, and workplace compliance. Competitive compensation and dental plan.",
        "Customer Support Specialist. Handle client inquiries via chat and email. Paid 4-week training provided on-site. Hourly wage $22 - $26/hr plus overtime.",
        "Product Manager - Mobile Apps. Lead cross-functional design and engineering teams to deliver iOS and Android features. Agile experience required.",
        "UX/UI Designer. Create wireframes, user journeys, and high-fidelity prototypes in Figma. Portfolio required with application.",
        "DevOps Infrastructure Engineer. Manage CI/CD pipelines, Terraform infrastructure, and automated monitoring tools."
    ]

    fraudulent_jobs = [
        "URGENT WORK FROM HOME! Earn $5000 a week with no experience required! Act fast! Contact hiring manager immediately on Telegram @scamjob or WhatsApp.",
        "Package Reshipping Associate needed. Receive electronics packages at your home address and reship to international buyers. Keep 10% cash bonus per package.",
        "Mystery Shopper / Secret Shopper wanted immediately! We send you a cashier check for $2500. Cash check at your bank, buy gift cards at Walmart, and send codes to us.",
        "Data Entry Clerk $50/hr No experience needed. Work 1 hour a day. Pay application fee of $49 for training software package via Western Union.",
        "Payment Processing Assistant. Process wire transfers using your personal bank account. Earn 5% commission per completed wire transfer transaction.",
        "Immediate Opening: Assistant Financial Representative. Must provide Social Security Number, bank account details, and driver license photo upfront for background verification before interview.",
        "Work from home posting envelope letters! Earn $3000 monthly guaranteed income. Small $35 registration deposit required for starter kit.",
        "Crypto Trader Assistant. Receive Bitcoin into your personal wallet and transfer to external accounts. High daily earnings guaranteed!",
        "Urgent Hiring! Customer service rep wanted. Send upfront equipment deposit for laptop and printer setup via Zelle or gift card.",
        "Work 2 hours a day and earn $800 daily! Kindly reply to johnsmithfake1234@gmail.com with your bank details to get started immediately."
    ]

    # Create dataset dataframe
    df_legit = pd.DataFrame({'text': legitimate_jobs, 'label': 0})
    df_fraud = pd.DataFrame({'text': fraudulent_jobs, 'label': 1})
    
    df = pd.concat([df_legit, df_fraud], ignore_index=True)
    return df

def train_and_save_model(output_dir="artifacts"):
    os.makedirs(output_dir, exist_ok=True)

    df = generate_synthetic_dataset()
    X = df['text']
    y = df['label']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42, stratify=y)

    vectorizer = TfidfVectorizer(max_features=500, stop_words='english', ngram_range=(1, 2))
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    model = LogisticRegression(class_weight='balanced', random_state=42)
    model.fit(X_train_vec, y_train)

    y_pred = model.predict(X_test_vec)

    accuracy = float(accuracy_score(y_test, y_pred))
    precision = float(precision_score(y_test, y_pred, zero_division=0))
    recall = float(recall_score(y_test, y_pred, zero_division=0))
    f1 = float(f1_score(y_test, y_pred, zero_division=0))

    model_path = os.path.join(output_dir, "model.joblib")
    vectorizer_path = os.path.join(output_dir, "vectorizer.joblib")
    metadata_path = os.path.join(output_dir, "metadata.json")

    joblib.dump(model, model_path)
    joblib.dump(vectorizer, vectorizer_path)

    metadata = {
        "version": "tfidf-logreg-v1",
        "algorithm": "TF-IDF + Logistic Regression",
        "training_date": datetime.now(timezone.utc).isoformat(),
        "metrics": {
            "accuracy": accuracy,
            "precision": precision,
            "recall": recall,
            "f1_score": f1
        },
        "vocab_size": len(vectorizer.vocabulary_),
        "sample_count": len(df)
    }

    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2)

    print(f"Model successfully trained and saved to '{output_dir}/'. Accuracy: {accuracy:.2f}, F1: {f1:.2f}")
    return metadata

if __name__ == "__main__":
    train_and_save_model()
