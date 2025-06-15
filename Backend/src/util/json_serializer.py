import json
import numpy as np
import pandas as pd
from decimal import Decimal
from datetime import datetime, date
import logging

logger = logging.getLogger(__name__)

class CustomJSONEncoder(json.JSONEncoder):
    """
    Custom JSON encoder that handles NumPy, Pandas, and other non-serializable types
    """
    def default(self, obj):
        try:
            # Handle NumPy types
            if isinstance(obj, np.integer):
                return int(obj)
            elif isinstance(obj, np.floating):
                if np.isnan(obj) or np.isinf(obj):
                    return None
                return float(obj)
            elif isinstance(obj, np.ndarray):
                return obj.tolist()
            elif isinstance(obj, np.bool_):
                return bool(obj)
            
            # Handle Pandas types
            elif isinstance(obj, pd.Series):
                return obj.tolist()
            elif isinstance(obj, pd.DataFrame):
                return obj.to_dict('records')
            elif isinstance(obj, pd.Timestamp):
                return obj.isoformat()
            elif pd.isna(obj):
                return None
            
            # Handle Python types that might cause issues
            elif isinstance(obj, Decimal):
                return float(obj)
            elif isinstance(obj, (datetime, date)):
                return obj.isoformat()
            elif isinstance(obj, set):
                return list(obj)
            elif isinstance(obj, bytes):
                return obj.decode('utf-8', errors='ignore')
            
            # If all else fails, try to convert to string
            else:
                logger.warning(f"Unknown type {type(obj)} for object {obj}, converting to string")
                return str(obj)
                
        except Exception as e:
            logger.error(f"Error serializing object {obj} of type {type(obj)}: {e}")
            return str(obj)

def safe_json_serialize(data):
    """
    Safely serialize data to JSON, handling all problematic types
    """
    try:
        # First pass: recursively clean the data
        cleaned_data = deep_clean_for_json(data)
        
        # Second pass: use custom encoder
        json_str = json.dumps(cleaned_data, cls=CustomJSONEncoder, ensure_ascii=False)
        
        # Verify it can be loaded back
        json.loads(json_str)
        
        return cleaned_data
    except Exception as e:
        logger.error(f"JSON serialization failed: {e}")
        logger.error(f"Problematic data type: {type(data)}")
        logger.error(f"Problematic data: {str(data)[:500]}...")
        raise

def deep_clean_for_json(obj):
    """
    Recursively clean data structures for JSON serialization
    """
    if obj is None:
        return None
    
    # Handle NumPy types
    elif isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        if np.isnan(obj) or np.isinf(obj):
            return None
        return float(obj)
    elif isinstance(obj, np.bool_):
        return bool(obj)
    elif isinstance(obj, np.ndarray):
        return [deep_clean_for_json(item) for item in obj.tolist()]
    
    # Handle Pandas types
    elif isinstance(obj, pd.Series):
        return [deep_clean_for_json(item) for item in obj.tolist()]
    elif isinstance(obj, pd.DataFrame):
        return [deep_clean_for_json(row) for row in obj.to_dict('records')]
    elif isinstance(obj, pd.Timestamp):
        return obj.isoformat()
    elif pd.isna(obj):
        return None
    
    # Handle collections
    elif isinstance(obj, dict):
        return {str(key): deep_clean_for_json(value) for key, value in obj.items()}
    elif isinstance(obj, (list, tuple)):
        return [deep_clean_for_json(item) for item in obj]
    elif isinstance(obj, set):
        return [deep_clean_for_json(item) for item in obj]
    
    # Handle other types
    elif isinstance(obj, Decimal):
        return float(obj)
    elif isinstance(obj, (datetime, date)):
        return obj.isoformat()
    elif isinstance(obj, bytes):
        return obj.decode('utf-8', errors='ignore')
    
    # Basic types that should be JSON serializable
    elif isinstance(obj, (str, int, float, bool)):
        return obj
    
    # Last resort: convert to string
    else:
        logger.warning(f"Converting unknown type {type(obj)} to string: {obj}")
        return str(obj)
