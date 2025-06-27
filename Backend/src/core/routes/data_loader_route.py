
from flask import Blueprint, jsonify
from src.util.data_loader import load_csv_data

data_loader_bp = Blueprint("data_loader_bp", __name__)

@data_loader_bp.route("/api/load-data", methods=["GET", "POST"])
def load_data_route():
    try:
        load_csv_data()
        return jsonify({"message": "✅ Data loaded successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500