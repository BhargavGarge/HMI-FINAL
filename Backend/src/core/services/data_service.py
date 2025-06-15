from typing import List, Dict, Optional
from src.core.db import db
from sqlalchemy import text
import logging
import re

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DataService:
    @staticmethod
    def is_numeric(value):
        """Check if a value can be converted to float"""
        if value is None or value == '':
            return False
        
        # Convert to string and clean
        str_value = str(value).strip()
        
        # Handle common non-numeric values
        non_numeric_patterns = [
            r'^other$', r'^n/a$', r'^na$', r'^null$', r'^none$',
            r'^unknown$', r'^not available$', r'^not applicable$',
            r'^[a-zA-Z]+$'  # Any alphabetic string
        ]
        
        for pattern in non_numeric_patterns:
            if re.match(pattern, str_value, re.IGNORECASE):
                return False
        
        try:
            float(str_value)
            return True
        except (ValueError, TypeError):
            return False

    @staticmethod
    def safe_float_convert(value, default=0.0):
        """Safely convert value to float with fallback"""
        if DataService.is_numeric(value):
            try:
                return float(value)
            except (ValueError, TypeError):
                return default
        return default

    @staticmethod
    def get_all_indicators() -> List[Dict]:
        """Get unique indicators without duplicates"""
        try:
            query = """
            SELECT DISTINCT id, name, unit, category, tags 
            FROM indicators 
            ORDER BY id;
            """
            with db.engine.connect() as connection:
                result = connection.execute(text(query))
                indicators = []
                seen_names = set()
                
                for row in result:
                    row_dict = dict(row._mapping)
                    # Remove duplicates based on name
                    if row_dict['name'] not in seen_names:
                        seen_names.add(row_dict['name'])
                        # Parse tags if they're stored as a string
                        if 'tags' in row_dict and isinstance(row_dict['tags'], str):
                            try:
                                tags_str = row_dict['tags'].strip()
                                if tags_str.startswith('[') and tags_str.endswith(']'):
                                    row_dict['tags'] = eval(tags_str)
                                else:
                                    row_dict['tags'] = [tags_str] if tags_str else []
                            except:
                                row_dict['tags'] = [row_dict['tags']] if row_dict['tags'] else []
                        indicators.append(row_dict)
                
                logger.info(f"Retrieved {len(indicators)} unique indicators")
                return indicators
        except Exception as e:
            logger.error(f"Error fetching indicators: {str(e)}")
            raise

    @staticmethod
    def get_time_series_data(indicator_id: int) -> Dict:
        """Get time series data for specific indicator with enhanced error handling"""
        try:
            logger.info(f"Fetching time series data for indicator {indicator_id}")
            
            # First, check if the indicator exists
            indicator_query = "SELECT id, name, unit, category FROM indicators WHERE id = :indicator_id"
            
            with db.engine.connect() as connection:
                indicator_result = connection.execute(text(indicator_query), {'indicator_id': indicator_id})
                indicator_row = indicator_result.fetchone()
                
                if not indicator_row:
                    raise ValueError(f"Indicator with ID {indicator_id} not found")
                
                indicator_info = dict(indicator_row._mapping)
                logger.info(f"Found indicator: {indicator_info['name']}")
                
                # Get observations data WITHOUT casting to float in SQL
                query = """
                SELECT 
                    o.id, o.visual_entity_id, o.indicator_id, o.country, o.year, 
                    o.value, o.notes,
                    i.name as indicator_name, i.unit, i.category,
                    ve.title as visual_title, ve.fig_number, ve.type as visual_type,
                    d.doc_id, d.title as document_title, d.domain
                FROM observations o
                JOIN indicators i ON o.indicator_id = i.id
                LEFT JOIN visual_entities ve ON o.visual_entity_id = ve.id
                LEFT JOIN documents d ON ve.document_id = d.id
                WHERE o.indicator_id = :indicator_id
                AND o.value IS NOT NULL 
                AND o.value != ''
                ORDER BY o.year, o.country
                """
                
                result = connection.execute(text(query), {'indicator_id': indicator_id})
                data = []
                skipped_values = []
                
                for row in result:
                    try:
                        row_dict = dict(row._mapping)
                        
                        # Safely convert value to float
                        original_value = row_dict['value']
                        if DataService.is_numeric(original_value):
                            row_dict['value'] = DataService.safe_float_convert(original_value)
                            row_dict['original_value'] = str(original_value)
                            data.append(row_dict)
                        else:
                            skipped_values.append(str(original_value))
                            logger.info(f"Skipped non-numeric value: {original_value}")
                            
                    except Exception as row_error:
                        logger.warning(f"Error processing row: {row_error}")
                        continue
                
                logger.info(f"Retrieved {len(data)} valid numeric observations")
                if skipped_values:
                    logger.info(f"Skipped {len(skipped_values)} non-numeric values: {set(skipped_values)}")
                
                if not data:
                    return {
                        'line_data': [],
                        'bar_data': [],
                        'pie_data': [],
                        'raw_data': [],
                        'years': [],
                        'countries': [],
                        'context': [],
                        'indicator_info': indicator_info,
                        'skipped_values': list(set(skipped_values))
                    }
                
                # Transform for different chart types
                years = sorted(list(set([d['year'] for d in data if d['year']])))
                countries = sorted(list(set([d['country'] for d in data if d['country']])))
                
                logger.info(f"Data spans {len(years)} years and {len(countries)} countries")
                
                # Line chart data - by year
                line_data = []
                for year in years:
                    year_data = {'year': year}
                    year_observations = [d for d in data if d['year'] == year]
                    
                    for obs in year_observations:
                        if obs['country']:
                            # Handle multiple observations per country/year by taking the average
                            if obs['country'] in year_data:
                                year_data[obs['country']] = (year_data[obs['country']] + obs['value']) / 2
                            else:
                                year_data[obs['country']] = obs['value']
                    
                    if len(year_data) > 1:  # Only add if there's data beyond just the year
                        line_data.append(year_data)
                
                # Bar chart data - aggregate by country
                country_totals = {}
                country_counts = {}
                
                for item in data:
                    if item['country'] and item['value'] is not None:
                        if item['country'] not in country_totals:
                            country_totals[item['country']] = 0
                            country_counts[item['country']] = 0
                        country_totals[item['country']] += item['value']
                        country_counts[item['country']] += 1
                
                bar_data = []
                for country in countries:
                    if country in country_totals and country_counts[country] > 0:
                        avg_value = country_totals[country] / country_counts[country]
                        bar_data.append({
                            'country': country,
                            'value': round(avg_value, 2),
                            'name': country  # Add name for charts
                        })
                
                # Pie chart data - use latest year data
                pie_data = []
                if years and bar_data:
                    # Use top 10 countries by value for pie chart
                    sorted_bar_data = sorted(bar_data, key=lambda x: abs(x['value']), reverse=True)[:10]
                    
                    for item in sorted_bar_data:
                        if item['value'] != 0:  # Only include non-zero values
                            pie_data.append({
                                'name': item['country'],
                                'value': abs(item['value'])  # Use absolute value for pie charts
                            })
                
                # Get document and visual entity context
                context = {}
                for item in data:
                    if item['visual_entity_id'] and item['visual_entity_id'] not in context:
                        context[item['visual_entity_id']] = {
                            'visual_title': item['visual_title'],
                            'fig_number': item['fig_number'],
                            'visual_type': item['visual_type'],
                            'document_title': item['document_title'],
                            'doc_id': item['doc_id'],
                            'domain': item['domain']
                        }
                
                result_data = {
                    'line_data': line_data,
                    'bar_data': bar_data,
                    'pie_data': pie_data,
                    'raw_data': data,
                    'years': years,
                    'countries': countries,
                    'context': list(context.values()),
                    'indicator_info': indicator_info,
                    'skipped_values': list(set(skipped_values))
                }
                
                logger.info(f"Successfully processed time series data: {len(line_data)} line points, {len(bar_data)} bar points, {len(pie_data)} pie points")
                return result_data
                
        except Exception as e:
            logger.error(f"Error fetching time series data for indicator {indicator_id}: {str(e)}")
            raise

    @staticmethod
    def get_dashboard_summary() -> Dict:
        """Get summary statistics for dashboard"""
        try:
            queries = {
                'total_indicators': "SELECT COUNT(DISTINCT name) as count FROM indicators",
                'total_documents': "SELECT COUNT(*) as count FROM documents",
                'total_visual_entities': "SELECT COUNT(*) as count FROM visual_entities",
                'total_observations': "SELECT COUNT(*) as count FROM observations WHERE value IS NOT NULL AND value != ''",
                'latest_year': "SELECT MAX(year) as year FROM observations",
                'domains': "SELECT domain, COUNT(*) as count FROM documents GROUP BY domain ORDER BY count DESC",
                'categories': "SELECT category, COUNT(*) as count FROM indicators GROUP BY category ORDER BY count DESC"
            }
            
            summary = {}
            
            with db.engine.connect() as connection:
                for key, query in queries.items():
                    try:
                        result = connection.execute(text(query))
                        if key in ['domains', 'categories']:
                            summary[key] = [dict(row._mapping) for row in result]
                        else:
                            row = result.fetchone()
                            summary[key] = dict(row._mapping) if row else {'count': 0}
                    except Exception as e:
                        logger.warning(f"Error executing query for {key}: {e}")
                        summary[key] = {'count': 0} if key not in ['domains', 'categories'] else []
                        
            return summary
        except Exception as e:
            logger.error(f"Error fetching dashboard summary: {str(e)}")
            raise

    @staticmethod
    def get_related_visualizations(indicator_id: int) -> List[Dict]:
        """Get all visual entities related to a specific indicator"""
        try:
            query = """
            SELECT DISTINCT
                ve.id, ve.document_id, ve.fig_number, ve.type, ve.title, ve.description, ve.tags,
                d.doc_id, d.title as document_title, d.domain, d.year as document_year,
                COUNT(o.id) as observation_count
            FROM visual_entities ve
            JOIN observations o ON ve.id = o.visual_entity_id
            JOIN documents d ON ve.document_id = d.id
            WHERE o.indicator_id = :indicator_id
            GROUP BY ve.id, ve.document_id, ve.fig_number, ve.type, ve.title, ve.description, ve.tags,
                     d.doc_id, d.title, d.domain, d.year
            ORDER BY d.year DESC, ve.id
            """
            
            with db.engine.connect() as connection:
                result = connection.execute(text(query), {'indicator_id': indicator_id})
                visuals = []
                for row in result:
                    row_dict = dict(row._mapping)
                    # Parse tags if they're stored as a string
                    if 'tags' in row_dict and isinstance(row_dict['tags'], str):
                        try:
                            tags_str = row_dict['tags'].strip()
                            if tags_str.startswith('[') and tags_str.endswith(']'):
                                row_dict['tags'] = eval(tags_str)
                            else:
                                row_dict['tags'] = [tags_str] if tags_str else []
                        except:
                            row_dict['tags'] = [row_dict['tags']] if row_dict['tags'] else []
                    visuals.append(row_dict)
                return visuals
        except Exception as e:
            logger.error(f"Error fetching related visualizations for indicator {indicator_id}: {str(e)}")
            raise
