from flask import Blueprint, jsonify, request
from src.core.services.data_service import DataService
import logging

logger = logging.getLogger(__name__)
data_routes = Blueprint('data_routes', __name__)

@data_routes.route("/api/time-series/<int:indicator_id>")
def get_time_series(indicator_id):
    """Get time series data for visualization"""
    try:
        logger.info(f"API request for time series data: indicator_id={indicator_id}")
        data = DataService.get_time_series_data(indicator_id)
        return jsonify({
            "status": "success",
            "data": data
        })
    except ValueError as e:
        logger.error(f"Value error in time series endpoint: {str(e)}")
        return jsonify({
            "status": "error",
            "message": f"Invalid indicator: {str(e)}"
        }), 404
    except Exception as e:
        logger.error(f"Unexpected error in time series endpoint: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Internal server error occurred while fetching time series data",
            "details": str(e)
        }), 500

@data_routes.route("/api/indicators")
def get_indicators():
    """Get all unique indicators"""
    try:
        indicators = DataService.get_all_indicators()
        return jsonify({
            "status": "success",
            "data": indicators,
            "count": len(indicators)
        })
    except Exception as e:
        logger.error(f"Error in indicators endpoint: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Failed to fetch indicators",
            "details": str(e)
        }), 500

@data_routes.route("/api/related-visualizations/<int:indicator_id>")
def get_related_visualizations(indicator_id):
    """Get all visual entities related to a specific indicator"""
    try:
        visuals = DataService.get_related_visualizations(indicator_id)
        return jsonify({
            "status": "success",
            "data": visuals,
            "count": len(visuals)
        })
    except Exception as e:
        logger.error(f"Error in related visualizations endpoint: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Failed to fetch related visualizations",
            "details": str(e)
        }), 500

@data_routes.route("/api/dashboard-summary")
def get_dashboard_summary():
    """Get dashboard summary statistics"""
    try:
        summary = DataService.get_dashboard_summary()
        return jsonify({
            "status": "success",
            "data": summary
        })
    except Exception as e:
        logger.error(f"Error in dashboard summary endpoint: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Failed to fetch dashboard summary",
            "details": str(e)
        }), 500

@data_routes.route("/api/health")
def health_check():
    """API health check"""
    return jsonify({
        "status": "success",
        "message": "API is running",
        "version": "1.0.0"
    })
