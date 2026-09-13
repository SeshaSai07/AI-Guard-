import os

# Render sets the PORT env variable automatically (default 10000)
port = os.environ.get("PORT", "10000")
bind = f"0.0.0.0:{port}"

# Production worker settings
workers = 2
threads = 2
timeout = 120
accesslog = "-"
errorlog = "-"
loglevel = "info"
