from flask import Blueprint, jsonify, request
from src.core.services.kohonen_service import KohonenService
import logging
import json
import traceback

logger = logging.getLogger(__name__)
kohonen_routes = Blueprint('kohonen_routes', __name__)

def find_problematic_data(obj, path="root"):
    """
    Recursively find the exact location of non-JSON-serializable data
    """
    try:
        json.dumps(obj)
        return None  # This object is fine
    except TypeError as e:
        if isinstance(obj, dict):
            for key, value in obj.items():
                try:
                    json.dumps(value)
                except TypeError:
                    problem = find_problematic_data(value, f"{path}.{key}")
                    if problem:
                        return problem
                    return f"Problem at {path}.{key}: {type(value)} = {str(value)[:100]}"
        elif isinstance(obj, (list, tuple)):
            for i, item in enumerate(obj):
                try:
                    json.dumps(item)
                except TypeError:
                    problem = find_problematic_data(item, f"{path}[{i}]")
                    if problem:
                        return problem
                    return f"Problem at {path}[{i}]: {type(item)} = {str(item)[:100]}"
        else:
            return f"Problem at {path}: {type(obj)} = {str(obj)[:100]}"
    return None

@kohonen_routes.route("/test-simple")
def test_simple():
    """Test with minimal data"""
    try:
        return jsonify({
            "status": "success",
            "message": "Simple test works",
            "data": {
                "test_int": 42,
                "test_float": 3.14,
                "test_string": "hello",
                "test_list": [1, 2, 3]
            }
        })
    except Exception as e:
        logger.error(f"Simple test failed: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@kohonen_routes.route("/test-data-fetch")
def test_data_fetch():
    """Test just the data fetching without SOM"""
    try:
        df = KohonenService.get_economic_data_for_som()
        
        if df.empty:
            return jsonify({
                "status": "success",
                "message": "No data found",
                "data": {}
            })
        
        # Convert to basic Python types manually
        sample_data = []
        for i, row in df.head(5).iterrows():
            row_dict = {}
            for col, val in row.items():
                if val is None or str(val).lower() in ['nan', 'none', 'null']:
                    row_dict[str(col)] = None
                elif isinstance(val, (int, float)):
                    row_dict[str(col)] = float(val)
                else:
                    row_dict[str(col)] = str(val)
            sample_data.append(row_dict)
        
        result = {
            "status": "success",
            "message": "Data fetch successful",
            "data": {
                "shape": [int(df.shape[0]), int(df.shape[1])],
                "columns": [str(col) for col in df.columns],
                "sample": sample_data
            }
        }
        
        # Test JSON serialization
        json.dumps(result)
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Data fetch test failed: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            "status": "error",
            "message": str(e),
            "traceback": traceback.format_exc()
        }), 500

@kohonen_routes.route("/test-som-step-by-step")
def test_som_step_by_step():
    """Test SOM analysis step by step"""
    try:
        logger.info("Step 1: Fetching data")
        df = KohonenService.get_economic_data_for_som()
        
        if df.empty:
            return jsonify({
                "status": "error",
                "message": "No data available"
            })
        
        logger.info("Step 2: Preparing SOM matrix")
        normalized_data, countries, indicators, pivot_df = KohonenService.prepare_som_matrix(df)
        
        if normalized_data.size == 0:
            return jsonify({
                "status": "error",
                "message": "Failed to prepare SOM matrix"
            })
        
        # Test basic data structures
        test_result = {
            "status": "success",
            "data": {
                "countries_count": len(countries),
                "indicators_count": len(indicators),
                "matrix_shape": [int(normalized_data.shape[0]), int(normalized_data.shape[1])],
                "sample_countries": [str(c) for c in countries[:3]],
                "sample_indicators": [str(i) for i in indicators[:3]]
            }
        }
        
        # Test JSON serialization
        json.dumps(test_result)
        logger.info("Step 2 JSON test passed")
        
        logger.info("Step 3: Training SOM")
        som = KohonenService.train_som(normalized_data, (4, 4), 100)  # Small SOM for testing
        
        if som is None:
            return jsonify({
                "status": "error",
                "message": "Failed to train SOM"
            })
        
        # Test SOM basic properties
        test_result["data"]["som_trained"] = True
        test_result["data"]["som_shape"] = [int(som._weights.shape[0]), int(som._weights.shape[1])]
        
        # Test JSON serialization again
        json.dumps(test_result)
        logger.info("Step 3 JSON test passed")
        
        return jsonify(test_result)
        
    except Exception as e:
        logger.error(f"Step-by-step test failed: {str(e)}")
        logger.error(traceback.format_exc())
        
        # Try to find the exact problematic data
        try:
            problem_location = find_problematic_data(test_result if 'test_result' in locals() else {})
            if problem_location:
                logger.error(f"Problematic data found: {problem_location}")
        except:
            pass
        
        return jsonify({
            "status": "error",
            "message": str(e),
            "traceback": traceback.format_exc()
        }), 500

@kohonen_routes.route("/analysis")
def get_kohonen_analysis():
    """Get complete Kohonen SOM analysis with detailed debugging"""
    try:
        logger.info("Starting Kohonen analysis with debugging")
        
        # Step 1: Get economic data
        logger.info("Fetching economic data...")
        df = KohonenService.get_economic_data_for_som()
        if df.empty:
            return jsonify({
                'status': 'error',
                'message': 'No economic data available for analysis'
            })
        
        # Step 2: Prepare SOM matrix
        logger.info("Preparing SOM matrix...")
        normalized_data, countries, indicators, pivot_df = KohonenService.prepare_som_matrix(df)
        if normalized_data.size == 0:
            return jsonify({
                'status': 'error',
                'message': 'Insufficient data for SOM analysis'
            })
        
        # Step 3: Train SOM (use smaller parameters for testing)
        logger.info("Training SOM...")
        som = KohonenService.train_som(normalized_data, (4, 4), 100)
        if som is None:
            return jsonify({
                'status': 'error',
                'message': 'Failed to train SOM'
            })
        
        # Step 4: Create minimal result with explicit type conversion
        logger.info("Creating result data...")
        
        # Create a minimal, safe result
        result = {
            'status': 'success',
            'data': {
                'summary_stats': {
                    'total_countries': len(countries),
                    'total_indicators': len(indicators),
                    'data_coverage': f"{len(countries)} countries × {len(indicators)} indicators",
                    'som_size': [som._weights.shape[0], som._weights.shape[1]],
                    'clusters_found': 0
                },
                'countries': countries[:10],  # Limit to first 10 for testing
                'indicators': indicators[:10],  # Limit to first 10 for testing
                'map_size': [som._weights.shape[0], som._weights.shape[1]]
            }
        }
        
        # Convert everything to basic Python types
        def clean_for_json(obj):
            import numpy as np
            import pandas as pd
            
            if isinstance(obj, (np.integer, np.int64, np.int32)):
                return int(obj)
            elif isinstance(obj, (np.floating, np.float64, np.float32)):
                return float(obj)
            elif isinstance(obj, np.ndarray):
                return [clean_for_json(x) for x in obj.tolist()]
            elif isinstance(obj, dict):
                return {str(k): clean_for_json(v) for k, v in obj.items()}
            elif isinstance(obj, (list, tuple)):
                return [clean_for_json(x) for x in obj]
            elif pd.isna(obj):
                return None
            else:
                return obj
        
        clean_result = clean_for_json(result)
        
        # Test JSON serialization before returning
        logger.info("Testing JSON serialization...")
        json_str = json.dumps(clean_result)
        logger.info("JSON serialization successful")
        
        return jsonify(clean_result)
        
    except Exception as e:
        logger.error(f"Kohonen analysis failed: {str(e)}")
        logger.error(traceback.format_exc())
        
        # Try to identify the problematic data
        try:
            if 'result' in locals():
                problem = find_problematic_data(result)
                if problem:
                    logger.error(f"Problematic data: {problem}")
        except:
            pass
        
        return jsonify({
            "status": "error",
            "message": "Analysis failed",
            "details": str(e),
            "traceback": traceback.format_exc()
        }), 500

@kohonen_routes.route("/health")
def kohonen_health_check():
    """Simple health check"""
    return jsonify({
        "status": "success",
        "message": "Kohonen service is running",
        "version": "1.0.0"
    })

@kohonen_routes.route("/test")
def test_route():
    return jsonify({"message": "Blueprint is working!"})
