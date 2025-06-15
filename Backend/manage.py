from flask import Flask
from flask_cors import CORS
from src.core.db import db
from src.core.routes.views import core_bp
from src.core.routes.indicators import indicator_routes
from src.core.routes.data_routes import data_routes
from src.core.routes.kohonen_routes import kohonen_routes
def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:db123@localhost:5432/HMI'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize CORS with specific configuration
    CORS(app, origins=["http://localhost:3000"], supports_credentials=True)
    
    # Initialize extensions
    db.init_app(app)
    
    # Register all blueprints
    app.register_blueprint(core_bp)
    app.register_blueprint(indicator_routes)
    app.register_blueprint(data_routes)
    app.register_blueprint(kohonen_routes, url_prefix='/api/kohonen')
    
    
    
    @app.route("/")
    def home():
        return "Enhanced Flask backend with comprehensive data visualization APIs! 🚀📊"
    
  
    
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, host='127.0.0.1', port=5000)
