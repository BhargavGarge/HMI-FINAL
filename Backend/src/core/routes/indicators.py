from flask import Blueprint, jsonify
from src.core.services.indicator_service import IndicatorService

# Blueprint without url_prefix
indicator_routes = Blueprint('indicator_routes', __name__)

@indicator_routes.route("/indicators")
def get_indicators():
    try:
        indicators = IndicatorService.get_all_indicators()
        return jsonify({
            "status": "success",
            "data": indicators
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@indicator_routes.route("/observations/<int:indicator_id>")
def get_observations(indicator_id):
    try:
        observations = IndicatorService.get_observations(indicator_id)
        return jsonify({
            "status": "success",
            "data": observations
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500