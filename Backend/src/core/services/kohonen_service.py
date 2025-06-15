from typing import List, Dict, Optional, Tuple
from src.core.db import db
from sqlalchemy import text
import logging
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from minisom import MiniSom
import json
import base64
from io import BytesIO
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
import seaborn as sns
from collections import defaultdict

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def convert_for_json(obj):
    """
    Convert NumPy and Pandas types to JSON-serializable types
    """
    if obj is None:
        return None
    elif isinstance(obj, (np.integer, np.int64, np.int32)):
        return int(obj)
    elif isinstance(obj, (np.floating, np.float64, np.float32)):
        if np.isnan(obj) or np.isinf(obj):
            return None
        return float(obj)
    elif isinstance(obj, np.bool_):
        return bool(obj)
    elif isinstance(obj, np.ndarray):
        return [convert_for_json(item) for item in obj.tolist()]
    elif isinstance(obj, (pd.Series, pd.Index)):
        return [convert_for_json(item) for item in obj.tolist()]
    elif isinstance(obj, pd.DataFrame):
        return [convert_for_json(row) for row in obj.to_dict('records')]
    elif isinstance(obj, dict):
        return {str(key): convert_for_json(value) for key, value in obj.items()}
    elif isinstance(obj, (list, tuple)):
        return [convert_for_json(item) for item in obj]
    elif pd.isna(obj):
        return None
    else:
        return obj

class KohonenService:
    @staticmethod
    def generate_som_visualization(map_type: str = 'distance') -> Optional[str]:
        """Generate SOM visualization as base64 encoded image"""
        try:
            # Get fresh data and train SOM
            df = KohonenService.get_economic_data_for_som()
            if df.empty:
                return None

            normalized_data, countries, indicators, pivot_df = KohonenService.prepare_som_matrix(df)
            if normalized_data.size == 0:
                return None

            som = KohonenService.train_som(normalized_data)

            plt.figure(figsize=(8, 6))

            if map_type == 'distance':
                plt.imshow(som.distance_map().T, cmap='viridis', origin='lower')
                plt.colorbar(label='Distance')
                plt.title('SOM Distance Map (U-Matrix)')
            elif map_type == 'hit':
                hit_map = np.zeros((som._weights.shape[0], som._weights.shape[1]))
                win_map = som.win_map(normalized_data)
                for position, vectors in win_map.items():
                    i, j = position
                    hit_map[i, j] = len(vectors)
                plt.imshow(hit_map.T, cmap='Blues', origin='lower')
                plt.colorbar(label='Hit Frequency')
                plt.title('SOM Hit Frequency Map')

            # Convert to base64
            buffer = BytesIO()
            plt.savefig(buffer, format='png', dpi=150, bbox_inches='tight')
            buffer.seek(0)
            image_base64 = base64.b64encode(buffer.getvalue()).decode()
            plt.close()

            return f"data:image/png;base64,{image_base64}"

        except Exception as e:
            logging.error(f"Visualization generation failed: {str(e)}")
            return None
    """
    Service class for Kohonen Self-Organizing Maps using existing data infrastructure
    """
    
    @staticmethod
    def get_economic_data_for_som() -> pd.DataFrame:
        """
        Get economic data from the database for SOM analysis
        Uses the same data access patterns as DataService
        """
        try:
            logger.info("Fetching economic data for Kohonen SOM analysis")
            
            # Query to get all numeric observations with their indicators
            query = """
            SELECT 
                o.country,
                i.name as indicator_name,
                i.category,
                o.value,
                o.year,
                i.unit
            FROM observations o
            JOIN indicators i ON o.indicator_id = i.id
            WHERE o.value IS NOT NULL 
            AND o.value != ''
            AND o.country IS NOT NULL
            AND o.country != ''
            AND o.year >= 2018  -- Focus on recent data
            ORDER BY o.country, i.name, o.year DESC
            LIMIT 1000  -- Limit for testing
            """
            
            with db.engine.connect() as connection:
                result = connection.execute(text(query))
                data = []
                
                for row in result:
                    row_dict = dict(row._mapping)
                    
                    # Use DataService's numeric validation
                    from src.core.services.data_service import DataService
                    if DataService.is_numeric(row_dict['value']):
                        row_dict['value'] = DataService.safe_float_convert(row_dict['value'])
                        data.append(row_dict)
                
                logger.info(f"Retrieved {len(data)} valid economic observations")
                
                if not data:
                    logger.warning("No valid economic data found for SOM analysis")
                    return pd.DataFrame()
                
                df = pd.DataFrame(data)
                
                # Take the most recent value for each country-indicator combination
                df_latest = df.sort_values('year').groupby(['country', 'indicator_name']).tail(1)
                
                logger.info(f"Processed data: {len(df_latest)} country-indicator combinations")
                logger.info(f"Countries: {df_latest['country'].nunique()}")
                logger.info(f"Indicators: {df_latest['indicator_name'].nunique()}")
                
                return df_latest
                
        except Exception as e:
            logger.error(f"Error fetching economic data for SOM: {str(e)}")
            raise

    @staticmethod
    def prepare_som_matrix(df: pd.DataFrame) -> Tuple[np.ndarray, List[str], List[str], pd.DataFrame]:
        """
        Prepare data matrix for SOM training
        Returns: (normalized_data, countries, indicators, pivot_df)
        """
        try:
            if df.empty:
                logger.warning("Empty dataframe provided for SOM matrix preparation")
                return np.array([]), [], [], pd.DataFrame()
            
            # Create pivot table: countries as rows, indicators as columns
            pivot_df = df.pivot_table(
                index='country',
                columns='indicator_name', 
                values='value',
                aggfunc='mean'  # Average if multiple values
            )
            
            # Fill missing values with column means
            pivot_df = pivot_df.fillna(pivot_df.mean())
            
            # Remove countries or indicators with too many missing values
            # Keep only countries with at least 50% data coverage
            country_coverage = pivot_df.notna().sum(axis=1) / len(pivot_df.columns)
            valid_countries = country_coverage[country_coverage >= 0.5].index
            pivot_df = pivot_df.loc[valid_countries]
            
            # Keep only indicators with at least 50% data coverage
            indicator_coverage = pivot_df.notna().sum(axis=0) / len(pivot_df.index)
            valid_indicators = indicator_coverage[indicator_coverage >= 0.5].index
            pivot_df = pivot_df[valid_indicators]
            
            # Final fill of any remaining NaN values
            pivot_df = pivot_df.fillna(pivot_df.mean())
            
            logger.info(f"SOM matrix prepared: {pivot_df.shape[0]} countries × {pivot_df.shape[1]} indicators")
            
            if pivot_df.empty:
                return np.array([]), [], [], pd.DataFrame()
            
            # Normalize the data
            scaler = StandardScaler()
            normalized_data = scaler.fit_transform(pivot_df.values)
            
            countries = list(pivot_df.index)
            indicators = list(pivot_df.columns)
            
            logger.info(f"Data normalized for SOM training")
            
            return normalized_data, countries, indicators, pivot_df
            
        except Exception as e:
            logger.error(f"Error preparing SOM matrix: {str(e)}")
            raise

    @staticmethod
    def train_som(normalized_data: np.ndarray, map_size: Tuple[int, int] = (6, 6), 
                  iterations: int = 500) -> MiniSom:
        """
        Train the Self-Organizing Map
        """
        try:
            if normalized_data.size == 0:
                logger.warning("Empty data provided for SOM training")
                return None
            
            logger.info(f"Training SOM with map size {map_size} for {iterations} iterations")
            
            # Create SOM
            som = MiniSom(
                map_size[0], map_size[1], 
                normalized_data.shape[1],
                sigma=1.0, 
                learning_rate=0.5,
                random_seed=42
            )
            
            # Train SOM
            som.train(normalized_data, iterations)
            
            logger.info("SOM training completed successfully")
            return som
            
        except Exception as e:
            logger.error(f"Error training SOM: {str(e)}")
            raise

    @staticmethod
    def calculate_som_quality_metrics(som: MiniSom, normalized_data: np.ndarray) -> Dict:
        """
        Calculate SOM quality metrics
        """
        try:
            if som is None or normalized_data.size == 0:
                return {
                    'quantization_error': 0.0,
                    'topographic_error': 0.0,
                    'training_quality': 'poor'
                }
            
            # Calculate quantization error
            quantization_error = som.quantization_error(normalized_data)
            
            # Calculate topographic error (simplified version)
            topographic_error = 0.0
            for data_point in normalized_data:
                winner = som.winner(data_point)
                # Find second best matching unit
                distances = []
                for i in range(som._weights.shape[0]):
                    for j in range(som._weights.shape[1]):
                        if (i, j) != winner:
                            dist = np.linalg.norm(data_point - som._weights[i, j])
                            distances.append(((i, j), dist))
                
                if distances:
                    second_winner = min(distances, key=lambda x: x[1])[0]
                    # Check if winner and second winner are neighbors
                    if abs(winner[0] - second_winner[0]) + abs(winner[1] - second_winner[1]) > 1:
                        topographic_error += 1
            
            topographic_error /= len(normalized_data)
            
            # Determine training quality
            if quantization_error < 0.5 and topographic_error < 0.1:
                quality = 'excellent'
            elif quantization_error < 1.0 and topographic_error < 0.2:
                quality = 'good'
            elif quantization_error < 2.0 and topographic_error < 0.3:
                quality = 'fair'
            else:
                quality = 'poor'
            
            return {
                'quantization_error': float(quantization_error),
                'topographic_error': float(topographic_error),
                'training_quality': quality
            }
            
        except Exception as e:
            logger.error(f"Error calculating SOM quality metrics: {str(e)}")
            return {
                'quantization_error': 0.0,
                'topographic_error': 0.0,
                'training_quality': 'unknown'
            }

    @staticmethod
    def perform_cluster_analysis(som: MiniSom, normalized_data: np.ndarray, 
                                countries: List[str], indicators: List[str], 
                                pivot_df: pd.DataFrame) -> Dict:
        """
        Perform cluster analysis on SOM results
        """
        try:
            if som is None or normalized_data.size == 0:
                return {'clusters': {}, 'regional_data': [], 'cluster_stats': {}}
            
            # Get SOM positions for each country
            regional_data = []
            position_to_countries = defaultdict(list)
            
            for i, data_point in enumerate(normalized_data):
                winner = som.winner(data_point)
                country = countries[i]
                
                # Get indicator values for this country
                country_indicators = {}
                if country in pivot_df.index:
                    for indicator in indicators:
                        if indicator in pivot_df.columns:
                            value = pivot_df.loc[country, indicator]
                            country_indicators[indicator] = float(value) if not pd.isna(value) else 0.0
                
                regional_data.append({
                    'country': str(country),
                    'som_position': [int(winner[0]), int(winner[1])],
                    'cluster_id': int(winner[0] * som._weights.shape[1] + winner[1]),
                    'indicators': country_indicators
                })
                
                position_key = f"{int(winner[0])}_{int(winner[1])}"
                position_to_countries[position_key].append({
                    'country': str(country),
                    'position': [int(winner[0]), int(winner[1])],
                    'indicators': country_indicators
                })
            
            # Create clusters based on SOM positions
            clusters = {}
            for position_key, countries_in_position in position_to_countries.items():
                if len(countries_in_position) > 0:  # Only include non-empty clusters
                    clusters[position_key] = countries_in_position
            
            # Calculate cluster statistics
            cluster_stats = {}
            for cluster_id, cluster_countries in clusters.items():
                if cluster_countries:
                    cluster_stats[cluster_id] = {
                        'size': len(cluster_countries),
                        'countries': [c['country'] for c in cluster_countries],
                        'avg_indicators': {}
                    }
                    
                    # Calculate average indicators for this cluster
                    for indicator in indicators:
                        values = [c['indicators'].get(indicator, 0) for c in cluster_countries]
                        cluster_stats[cluster_id]['avg_indicators'][indicator] = float(np.mean(values))
            
            return {
                'clusters': clusters,
                'regional_data': regional_data,
                'cluster_stats': cluster_stats
            }
            
        except Exception as e:
            logger.error(f"Error in cluster analysis: {str(e)}")
            return {'clusters': {}, 'regional_data': [], 'cluster_stats': {}}

    @staticmethod
    def get_kohonen_analysis() -> Dict:
        """
        Main method to get complete Kohonen analysis with proper data structure
        """
        try:
            logger.info("Starting Kohonen analysis")
            
            # Step 1: Get economic data
            df = KohonenService.get_economic_data_for_som()
            if df.empty:
                return {
                    'status': 'error',
                    'message': 'No economic data available for analysis'
                }
            
            # Step 2: Prepare SOM matrix
            normalized_data, countries, indicators, pivot_df = KohonenService.prepare_som_matrix(df)
            if normalized_data.size == 0:
                return {
                    'status': 'error',
                    'message': 'Insufficient data for SOM analysis'
                }
            
            # Step 3: Train SOM
            map_size = (6, 6)
            iterations = 500
            som = KohonenService.train_som(normalized_data, map_size, iterations)
            if som is None:
                return {
                    'status': 'error',
                    'message': 'Failed to train SOM'
                }
            
            # Step 4: Generate SOM visualizations
            distance_map = som.distance_map().T.tolist()
            
            # Hit map
            hit_map = np.zeros((som._weights.shape[0], som._weights.shape[1]))
            for data_point in normalized_data:
                winner = som.winner(data_point)
                hit_map[winner] += 1
            hit_map = hit_map.T.tolist()
            
            # Step 5: Calculate quality metrics
            quality_metrics = KohonenService.calculate_som_quality_metrics(som, normalized_data)
            
            # Step 6: Perform cluster analysis
            cluster_analysis = KohonenService.perform_cluster_analysis(
                som, normalized_data, countries, indicators, pivot_df
            )
            
            # Step 7: Create the response data structure that matches frontend expectations
            result_data = {
                'som_analysis': {
                    'distance_map': distance_map,
                    'hit_map': hit_map,
                    'map_size': [int(som._weights.shape[0]), int(som._weights.shape[1])],
                    'training_iterations': int(iterations),
                    'quantization_error': quality_metrics['quantization_error'],
                    'topographic_error': quality_metrics['topographic_error']
                },
                'regional_data': cluster_analysis['regional_data'],
                'clusters': cluster_analysis['clusters'],
                'indicators': [str(ind) for ind in indicators],
                'summary': {
                    'total_countries': len(countries),
                    'total_indicators': len(indicators),
                    'data_coverage': len(countries) * len(indicators),
                    'training_quality': quality_metrics['training_quality']
                }
            }
            
            # Step 8: Convert all data to JSON-safe types
            clean_data = convert_for_json(result_data)
            
            result = {
                'status': 'success',
                'data': clean_data
            }
            
            # Test JSON serialization
            json.dumps(result)
            logger.info("Kohonen analysis completed successfully")
            
            return result
            
        except Exception as e:
            logger.error(f"Error in Kohonen analysis: {str(e)}")
            return {
                'status': 'error',
                'message': f'Analysis failed: {str(e)}'
            }

    @staticmethod
    def retrain_som(map_size: Tuple[int, int] = (6, 6), iterations: int = 500) -> Dict:
        """
        Retrain SOM with new parameters
        """
        try:
            logger.info(f"Retraining SOM with map_size={map_size}, iterations={iterations}")
            
            # Get fresh data
            df = KohonenService.get_economic_data_for_som()
            if df.empty:
                return {
                    'status': 'error',
                    'message': 'No data available for retraining'
                }
            
            # Prepare data
            normalized_data, countries, indicators, pivot_df = KohonenService.prepare_som_matrix(df)
            if normalized_data.size == 0:
                return {
                    'status': 'error',
                    'message': 'Insufficient data for retraining'
                }
            
            # Train with new parameters
            som = KohonenService.train_som(normalized_data, map_size, iterations)
            if som is None:
                return {
                    'status': 'error',
                    'message': 'Failed to retrain SOM'
                }
            
            logger.info("SOM retrained successfully")
            
            result = {
                'status': 'success',
                'message': 'SOM retrained successfully',
                'new_parameters': {
                    'map_size': [int(map_size[0]), int(map_size[1])],
                    'iterations': int(iterations)
                }
            }
            
            return convert_for_json(result)
            
        except Exception as e:
            logger.error(f"Error retraining SOM: {str(e)}")
            return {
                'status': 'error',
                'message': f'Retraining failed: {str(e)}'
            }

