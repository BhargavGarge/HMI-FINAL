from typing import List, Dict, Optional, Tuple
from src.core.db import db
from sqlalchemy import text
import logging
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from minisom import MiniSom
import json

logger = logging.getLogger(__name__)

class KohonenService:
    """Minimal version for debugging"""
    
    @staticmethod
    def get_economic_data_for_som() -> pd.DataFrame:
        """Get economic data from the database for SOM analysis"""
        try:
            logger.info("Fetching economic data for Kohonen SOM analysis")
            
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
            AND o.year >= 2020  -- More recent data
            LIMIT 100  -- Limit for debugging
            ORDER BY o.country, i.name, o.year DESC
            """
            
            with db.engine.connect() as connection:
                result = connection.execute(text(query))
                data = []
                
                for row in result:
                    row_dict = dict(row._mapping)
                    
                    # Simple numeric check
                    try:
                        value = float(row_dict['value'])
                        if not (np.isnan(value) or np.isinf(value)):
                            row_dict['value'] = value
                            data.append(row_dict)
                    except (ValueError, TypeError):
                        continue
                
                logger.info(f"Retrieved {len(data)} valid observations")
                
                if not data:
                    return pd.DataFrame()
                
                df = pd.DataFrame(data)
                return df
                
        except Exception as e:
            logger.error(f"Error fetching economic data: {str(e)}")
            raise

    @staticmethod
    def prepare_som_matrix(df: pd.DataFrame) -> Tuple[np.ndarray, List[str], List[str], pd.DataFrame]:
        """Prepare data matrix for SOM training"""
        try:
            if df.empty:
                return np.array([]), [], [], pd.DataFrame()
            
            # Take only the most recent value per country-indicator
            df_latest = df.sort_values('year').groupby(['country', 'indicator_name']).tail(1)
            
            # Create pivot table
            pivot_df = df_latest.pivot_table(
                index='country',
                columns='indicator_name', 
                values='value',
                aggfunc='mean'
            )
            
            # Fill missing values with column means
            pivot_df = pivot_df.fillna(pivot_df.mean())
            
            # Keep only complete cases for simplicity
            pivot_df = pivot_df.dropna()
            
            if pivot_df.empty:
                return np.array([]), [], [], pd.DataFrame()
            
            # Normalize the data
            scaler = StandardScaler()
            normalized_data = scaler.fit_transform(pivot_df.values)
            
            countries = list(pivot_df.index)
            indicators = list(pivot_df.columns)
            
            logger.info(f"Matrix: {len(countries)} countries × {len(indicators)} indicators")
            
            return normalized_data, countries, indicators, pivot_df
            
        except Exception as e:
            logger.error(f"Error preparing SOM matrix: {str(e)}")
            raise

    @staticmethod
    def train_som(normalized_data: np.ndarray, map_size: Tuple[int, int] = (4, 4), 
                  iterations: int = 100) -> MiniSom:
        """Train a simple SOM"""
        try:
            if normalized_data.size == 0:
                return None
            
            logger.info(f"Training SOM {map_size} for {iterations} iterations")
            
            som = MiniSom(
                map_size[0], map_size[1], 
                normalized_data.shape[1],
                sigma=1.0, 
                learning_rate=0.5,
                random_seed=42
            )
            
            som.train(normalized_data, iterations)
            
            logger.info("SOM training completed")
            return som
            
        except Exception as e:
            logger.error(f"Error training SOM: {str(e)}")
            raise
