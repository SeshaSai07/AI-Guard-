import os

# Bind to 0.0.0.0 on the port specified by Render (via PORT env var)
port = os.environ.get("PORT", "5000")
bind = f"0.0.0.0:{port}"

# Production worker settings
workers = 2
threads = 2
timeout = 120
accesslog = "-"
errorlog = "-"
loglevel = "info"
