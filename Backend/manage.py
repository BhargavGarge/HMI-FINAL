from flask import Flask
from flask_cors import CORS
from src.core.db import db
from src.core.routes.views import core_bp
from src.core.routes.indicators import indicator_routes
from src.core.routes.data_routes import data_routes

from src.core.routes.data_loader_route import data_loader_bp  # 👈 Added

def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:db123@localhost:5432/test_hmi'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

    db.init_app(app)

    app.register_blueprint(core_bp)
    app.register_blueprint(indicator_routes)
    app.register_blueprint(data_routes)

    app.register_blueprint(data_loader_bp)  # 👈 Added route

    @app.route("/")
    def home():
        return "Enhanced Flask backend with comprehensive data visualization APIs! 🚀📊"

    return app
