from flask import Blueprint, jsonify
from core.services.enhanced_data_service import EnhancedDataService
import logging; logger = logging.getLogger(__name__)

enhanced_routes = Blueprint("enhanced_routes", __name__)

@enhanced_routes.route("/api/timeline-series/<indicator_id>")
def timeline_series(indicator_id):
    try:
        data = EnhancedDataService.get_timeline_data(indicator_id)
        return jsonify({"status": "success", "data": data})
    except Exception as exc:
        logger.error(exc, exc_info=True)
        return jsonify({"status": "error", "message": str(exc)}), 500
