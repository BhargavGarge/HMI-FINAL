from flask import Blueprint, jsonify, request
from src.core.services.data_service import DataService
from sqlalchemy import text
import logging
import random
from src.core.db import db
logger = logging.getLogger(__name__)
data_routes = Blueprint('data_routes', __name__)

@data_routes.route("/api/time-series/<string:indicator_id>")
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

@data_routes.route("/api/related-visualizations/<string:indicator_id>")
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

@data_routes.route("/api/documents")
def get_documents():
    """Get all documents"""
    try:
        query = """
        SELECT document_id, title, domain, source 
        FROM documents
        ORDER BY title
        """
        with db.engine.connect() as connection:
            result = connection.execute(text(query))
            documents = [dict(row._mapping) for row in result]
            return jsonify({
                "status": "success",
                "data": documents,
                "count": len(documents)
            })
    except Exception as e:
        logger.error(f"Error fetching documents: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Failed to fetch documents",
            "details": str(e)
        }), 500

@data_routes.route("/api/visual-entities")
def get_visual_entities():
    """Get all visual entities"""
    try:
        query = """
        SELECT v.visual_id, v.type, v.document_id, d.title as document_title
        FROM visual_entities v
        JOIN documents d ON v.document_id = d.document_id
        ORDER BY v.type
        """
        with db.engine.connect() as connection:
            result = connection.execute(text(query))
            visuals = [dict(row._mapping) for row in result]
            return jsonify({
                "status": "success",
                "data": visuals,
                "count": len(visuals)
            })
    except Exception as e:
        logger.error(f"Error fetching visual entities: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Failed to fetch visual entities",
            "details": str(e)
        }), 500
@data_routes.route("/api/story-data/<story>", methods=["GET"])
def get_story_data(story):
    try:
        story_documents = {
            # "labour-after-lockdowns": ["dwr-24-08", "dwr-24-43"],
            "strategic-reserves": [ "dwr-24-10","dwr-24-01"],
            "climate-dividend": ["dwr-24-43"],
            # Add other stories here...
        }

        if story not in story_documents:
            return jsonify({"status": "error", "message": "Unknown story"}), 404

        doc_ids = story_documents[story]
        indicators = DataService.get_indicators_by_documents(doc_ids)

        return jsonify({
            "status": "success",
            "story": story,
            "document_ids": doc_ids,
            "indicators": indicators,
        })

    except Exception as e:
        print(f"[ERROR] Failed to fetch story data: {e}")
        return jsonify({"status": "error", "message": "Failed to fetch story data", "details": str(e)}), 500
    

@data_routes.route("/api/timeline-series/<indicator_id>", methods=["GET"])
def get_timeline_series(indicator_id):
    try:
        series = DataService.get_timeline_series_by_indicator(indicator_id)
        return jsonify({
            "status": "success",
            "indicator_id": indicator_id,
            "timeline_series": series
        })
    except Exception as e:
        logger.error(f"Error in timeline series endpoint: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Failed to fetch timeline series",
            "details": str(e)
        }), 500
@data_routes.route("/api/scenario-series", methods=["GET"])
def get_scenario_series():
    try:
        document_id = request.args.get("document_id")
        if not document_id:
            return jsonify({"status": "error", "message": "Missing document_id"}), 400

        scenario_series = DataService.get_scenario_series_by_document(document_id)

        return jsonify({
            "document_id": document_id,
            "scenario_series": scenario_series,
            "status": "success"
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
