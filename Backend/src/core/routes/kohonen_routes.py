from flask import Blueprint, jsonify, request
from src.core.services.kohonen_service import KohonenService
import logging
import json

logger = logging.getLogger(__name__)
kohonen_routes = Blueprint('kohonen_routes', __name__)

@kohonen_routes.route("/test")
def test_route():
    """Simple test route"""
    return jsonify({"message": "Kohonen routes working!", "status": "success"})

@kohonen_routes.route("/health")
def kohonen_health_check():
    """Kohonen service health check"""
    try:
        # Quick test to see if we can access the database
        df = KohonenService.get_economic_data_for_som()
        data_available = not df.empty
        
        return jsonify({
            "status": "success",
            "message": "Kohonen service is running",
            "data_available": data_available,
            "data_count": len(df) if data_available else 0,
            "version": "1.0.0"
        })
    except Exception as e:
        logger.error(f"Kohonen health check failed: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Kohonen service health check failed",
            "details": str(e)
        }), 500

@kohonen_routes.route("/analysis")
def get_kohonen_analysis():
    """Get complete Kohonen analysis"""
    try:
        logger.info("API request for Kohonen analysis")
        
        result = KohonenService.get_kohonen_analysis()
        
        # Test JSON serialization before returning
        try:
            json_str = json.dumps(result)
            logger.info("JSON serialization successful")
        except Exception as json_error:
            logger.error(f"JSON serialization failed: {json_error}")
            return jsonify({
                "status": "error",
                "message": "JSON serialization failed",
                "details": str(json_error)
            }), 500
        
        return jsonify(result)

    except Exception as e:
        logger.error(f"Kohonen analysis failed: {str(e)}", exc_info=True)
        return jsonify({
            "status": "error",
            "message": "Analysis failed",
            "details": str(e)
        }), 500

@kohonen_routes.route("/clusters")
def get_kohonen_clusters():
    """Get Kohonen cluster analysis"""
    try:
        logger.info("API request for Kohonen clusters")
        
        analysis_result = KohonenService.get_kohonen_analysis()
        if analysis_result['status'] != 'success':
            return jsonify(analysis_result), 400
        
        # Extract cluster-specific data
        cluster_data = {
            'clusters': analysis_result['data'].get('clusters', {}),
            'summary': analysis_result['data'].get('summary_stats', {})
        }
        
        return jsonify({
            "status": "success",
            "data": cluster_data
        })
        
    except Exception as e:
        logger.error(f"Error in Kohonen clusters endpoint: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Failed to fetch Kohonen clusters",
            "details": str(e)
        }), 500

@kohonen_routes.route("/retrain", methods=['POST'])
def retrain_kohonen():
    """Retrain Kohonen SOM with new parameters"""
    try:
        logger.info("API request to retrain Kohonen SOM")
        
        # Get parameters from request
        data = request.get_json() or {}
        map_size = data.get('map_size', [6, 6])
        iterations = data.get('iterations', 500)
        
        # Validate parameters
        if not isinstance(map_size, list) or len(map_size) != 2:
            return jsonify({
                "status": "error",
                "message": "map_size must be a list of two integers"
            }), 400
        
        if not isinstance(iterations, int) or iterations < 100:
            return jsonify({
                "status": "error",
                "message": "iterations must be an integer >= 100"
            }), 400
        
        # Retrain SOM
        result = KohonenService.retrain_som(tuple(map_size), iterations)
        
        return jsonify(result)
            
    except Exception as e:
        logger.error(f"Error in Kohonen retrain endpoint: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Failed to retrain Kohonen SOM",
            "details": str(e)
        }), 500

@kohonen_routes.route("/summary")
def get_kohonen_summary():
    """Get Kohonen analysis summary statistics"""
    try:
        logger.info("API request for Kohonen summary")
        
        analysis_result = KohonenService.get_kohonen_analysis()
        if analysis_result['status'] != 'success':
            return jsonify(analysis_result), 400
        
        # Extract summary data
        summary_data = analysis_result['data'].get('summary_stats', {})
        
        return jsonify({
            "status": "success",
            "data": summary_data
        })
        
    except Exception as e:
        logger.error(f"Error in Kohonen summary endpoint: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Failed to fetch Kohonen summary",
            "details": str(e)
        }), 500
@kohonen_routes.route("/visualization/<map_type>")
def get_visualization(map_type):
    """Generate and return SOM visualization image"""
    try:
        # Validate map_type
        if map_type not in ['distance', 'hit']:
            return jsonify({
                "status": "error",
                "message": "Invalid map type. Use 'distance' or 'hit'"
            }), 400

        # Generate the visualization
        image_data = KohonenService.generate_som_visualization(map_type=map_type)

        if not image_data:
            return jsonify({
                "status": "error",
                "message": "Failed to generate visualization"
            }), 500

        return jsonify({
            "status": "success",
            "image": image_data
        })

    except Exception as e:
        logging.error(f"Visualization error: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Failed to generate visualization",
            "details": str(e)
        }), 500