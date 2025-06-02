from flask import Flask
from flask_cors import CORS
from src.core.routes.views import core_bp
from src.core.db import db

app = Flask(__name__)
CORS(app)

# ✅ PostgreSQL connection string
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:db123@localhost:5432/HMI'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)  # <-- Initialize the DB

# Register the blueprint
app.register_blueprint(core_bp)

@app.route("/")
def home():
    return "Flask backend is running! with PostgreSQL connection.🚀🚀"

if __name__ == "__main__":
    app.run(debug=True)