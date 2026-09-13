FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Pre-train scikit-learn model artifacts
RUN python train_model.py

EXPOSE 5000

CMD ["python", "-m", "app.main"]
