import os
from flask import Flask, jsonify
from flask_cors import CORS
from app.db.database import init_db
from app.api.routes import api_bp
from app.ml.predictor import predictor_instance

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Initialize Database tables
    init_db()

    # Register API blueprint
    app.register_blueprint(api_bp)

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Endpoint not found"}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"error": "Internal server error"}), 500

    return app

app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting JobShield AI Flask Server on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=True)
