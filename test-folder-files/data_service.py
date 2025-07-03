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
        
        str_value = str(value).strip()
        non_numeric_patterns = [
            r'^other$', r'^n/a$', r'^na$', r'^null$', r'^none$',
            r'^unknown$', r'^not available$', r'^not applicable$',
            r'^[a-zA-Z]+$'
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
SELECT DISTINCT indicator_id, name, unit, document_id FROM indicators ORDER BY name;

"""
            with db.engine.connect() as connection:
                result = connection.execute(text(query))
                indicators = []
                seen_names = set()
                
                for row in result:
                    row_dict = dict(row._mapping)
                    if row_dict['name'] not in seen_names:
                        seen_names.add(row_dict['name'])
                        indicators.append(row_dict)
                
                logger.info(f"Retrieved {len(indicators)} unique indicators")
                return indicators
        except Exception as e:
            logger.error(f"Error fetching indicators: {str(e)}")
            raise

    @staticmethod
    def get_time_series_data(indicator_id: str) -> Dict:
        """Get time series data for specific indicator"""
        try:
            logger.info(f"Fetching time series data for indicator {indicator_id}")
            
            # Check if the indicator exists
            indicator_query = """
            SELECT i.indicator_id, i.name, i.unit, d.title as document_title
            FROM indicators i
            LEFT JOIN documents d ON i.document_id = d.document_id
            WHERE i.indicator_id = :indicator_id
            """
            
            with db.engine.connect() as connection:
                indicator_result = connection.execute(text(indicator_query), {'indicator_id': indicator_id})
                indicator_row = indicator_result.fetchone()
                
                if not indicator_row:
                    raise ValueError(f"Indicator with ID {indicator_id} not found")
                
                indicator_info = dict(indicator_row._mapping)
                
                # Get observations data - using period instead of year
                query = """
                SELECT 
                    o.observation_id, o.indicator_id, o.visual_id, 
                    o.value, o.period, o.country, o.unit,
                    o.metric_type, o.name as observation_name,
                    i.name as indicator_name, i.unit as indicator_unit,
                    ve.type as visual_type,
                    d.title as document_title, d.domain
                FROM observations o
                JOIN indicators i ON o.indicator_id = i.indicator_id
                LEFT JOIN visual_entities ve ON o.visual_id = ve.visual_id
                LEFT JOIN documents d ON o.document_id = d.document_id
                WHERE o.indicator_id = :indicator_id
                AND o.value IS NOT NULL 
                AND o.value != ''
                ORDER BY o.period, o.country
                """
                
                result = connection.execute(text(query), {'indicator_id': indicator_id})
                data = []
                skipped_values = []
                
                for row in result:
                    try:
                        row_dict = dict(row._mapping)
                        original_value = row_dict['value']
                        if DataService.is_numeric(original_value):
                            row_dict['value'] = DataService.safe_float_convert(original_value)
                            row_dict['original_value'] = str(original_value)
                            # Map period to year for compatibility with existing code
                            row_dict['year'] = row_dict['period']
                            data.append(row_dict)
                        else:
                            skipped_values.append(str(original_value))
                    except Exception as row_error:
                        logger.warning(f"Error processing row: {row_error}")
                        continue
                
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
                
                # Transform data for visualization - now using period mapped to year
                years = sorted(list(set([d['period'] for d in data if d['period']])))
                countries = sorted(list(set([d['country'] for d in data if d['country']])))
                
                # Line chart data
                line_data = []
                for year in years:
                    year_data = {'year': year}
                    year_observations = [d for d in data if d['period'] == year]
                    
                    for obs in year_observations:
                        if obs['country']:
                            if obs['country'] in year_data:
                                year_data[obs['country']] = (year_data[obs['country']] + obs['value']) / 2
                            else:
                                year_data[obs['country']] = obs['value']
                    
                    if len(year_data) > 1:
                        line_data.append(year_data)
                
                # Bar chart data
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
                            'name': country
                        })
                
                # Pie chart data
                pie_data = []
                if years and bar_data:
                    sorted_bar_data = sorted(bar_data, key=lambda x: abs(x['value']), reverse=True)[:10]
                    for item in sorted_bar_data:
                        if item['value'] != 0:
                            pie_data.append({
                                'name': item['country'],
                                'value': abs(item['value'])
                            })
                
                # Get context
                context = {}
                for item in data:
                    if item['visual_id'] and item['visual_id'] not in context:
                        context[item['visual_id']] = {
                            'visual_type': item['visual_type'],
                            'document_title': item['document_title'],
                            'domain': item['domain']
                        }
                
                return {
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
                
        except Exception as e:
            logger.error(f"Error fetching time series data: {str(e)}")
            raise

    @staticmethod
    def get_dashboard_summary() -> Dict:
        """Get summary statistics for dashboard"""
        try:
            queries = {
                'total_indicators': "SELECT COUNT(DISTINCT indicator_id) as count FROM indicators",
                'total_documents': "SELECT COUNT(DISTINCT document_id) as count FROM documents",
                'total_visuals': "SELECT COUNT(DISTINCT visual_id) as count FROM visual_entities",
                'total_observations': "SELECT COUNT(DISTINCT observation_id) as count FROM observations",
                'domains': "SELECT domain, COUNT(*) as count FROM documents GROUP BY domain",
                'visual_types': "SELECT type, COUNT(*) as count FROM visual_entities GROUP BY type"
            }
            
            summary = {}
            
            with db.engine.connect() as connection:
                for key, query in queries.items():
                    try:
                        result = connection.execute(text(query))
                        if key in ['domains', 'visual_types']:
                            summary[key] = [dict(row._mapping) for row in result]
                        else:
                            row = result.fetchone()
                            summary[key] = dict(row._mapping) if row else {'count': 0}
                    except Exception as e:
                        logger.warning(f"Error executing query for {key}: {e}")
                        summary[key] = {'count': 0} if key not in ['domains', 'visual_types'] else []
                        
            return summary
        except Exception as e:
            logger.error(f"Error fetching dashboard summary: {str(e)}")
            raise

    @staticmethod
    def get_related_visualizations(indicator_id: str) -> List[Dict]:
        """Get visual entities related to an indicator"""
        try:
            query = """
            SELECT DISTINCT
                ve.visual_id, ve.type, ve.document_id,
                d.title as document_title, d.domain,
                COUNT(o.observation_id) as observation_count
            FROM visual_entities ve
            JOIN observations o ON ve.visual_id = o.visual_id
            JOIN documents d ON ve.document_id = d.document_id
            WHERE o.indicator_id = :indicator_id
            GROUP BY ve.visual_id, ve.type, ve.document_id, d.title, d.domain
            """
            
            with db.engine.connect() as connection:
                result = connection.execute(text(query), {'indicator_id': indicator_id})
                return [dict(row._mapping) for row in result]
        except Exception as e:
            logger.error(f"Error fetching related visuals: {str(e)}")
            raise
    @staticmethod
    def get_indicators_by_documents(document_ids: List[str]) -> List[Dict]:
        """Fetch all indicator IDs for a list of document_ids"""
        try:
            # List of allowed indicator IDs
            allowed_indicators = {
                'ind01040', 
                'ind10001',
                'ind10002',
                'ind10003',
                'ind10004'
            }
            
            query = """
            SELECT indicator_id, name, unit, document_id
            FROM indicators
            WHERE document_id IN :doc_ids
            ORDER BY document_id, name
            """
            with db.engine.connect() as connection:
                # Convert single item list to tuple properly
                params = {'doc_ids': tuple(document_ids) if len(document_ids) > 1 else (document_ids[0],)}
                result = connection.execute(text(query), params)
                # Filter results to only include allowed indicators
                return [
                    dict(row._mapping) 
                    for row in result 
                    if dict(row._mapping)['indicator_id'] in allowed_indicators
                ]
        except Exception as e:
            logger.error(f"Error fetching indicators by documents: {str(e)}")
            raise
    @staticmethod
    def get_timeline_series_by_indicator(indicator_id: str) -> List[Dict]:
        """Get timeline or scenario series for a specific indicator"""
        try:
            query = """
            SELECT 
                o.period as year, 
                o.value, 
                o.name as observation_name,
                o.country
            FROM observations o
            WHERE o.indicator_id = :indicator_id
            AND o.value IS NOT NULL
            ORDER BY o.period
            """

            with db.engine.connect() as connection:
                result = connection.execute(text(query), {'indicator_id': indicator_id})
                rows = result.fetchall()

                def classify_group(obs_name: str, country: str) -> str:
                    text = f"{obs_name or ''} {country or ''}".lower()
                    if "without" in text or "no dividend" in text:
                        return "past"
                    elif "with" in text and "full" in text:
                        return "present"
                    elif "partial" in text or "0.5" in text or "reduced" in text:
                        return "future"
                    else:
                        return "unknown"

                timeline_series = []
                for row in rows:
                    year_or_label = row.year or row.country or row.observation_name
                    label = classify_group(row.observation_name, row.country)
                    if DataService.is_numeric(row.value):
                        timeline_series.append({
                            "year": year_or_label,
                            "value": float(row.value),
                            "year_category": label
                        })

                return timeline_series

        except Exception as e:
            logger.error(f"Error fetching timeline series: {str(e)}")
            raise



 

    @staticmethod
    def get_scenario_series_by_document(document_id: str) -> Dict[str, List[Dict]]:
        """Get scenario-series grouped by past, present, future based on country label"""
        try:
            query = """
            SELECT 
                o.value::numeric AS value,
                o.country AS scenario,  -- label like 'with_dividend'
                i.name AS indicator_name,
                o.visual_id
            FROM observations o
            JOIN indicators i ON o.indicator_id = i.indicator_id
            WHERE i.document_id = :document_id
            ORDER BY o.visual_id, scenario;
            """
            
            with db.engine.connect() as connection:
                result = connection.execute(text(query), {"document_id": document_id})
                rows = result.fetchall()

            def classify_scenario(scenario_label: str) -> str:
                label = scenario_label.lower()
                if "without" in label:
                    return "past"
                elif "0.5" in label or "partial" in label or "reduced" in label:
                    return "future"
                elif "with" in label or "full" in label:
                    return "present"
                return "unknown"

            scenario_series = {"past": [], "present": [], "future": []}

            for row in rows:
                category = classify_scenario(row.scenario)
                if category in scenario_series:
                    scenario_series[category].append({
                        "scenario": row.scenario,
                        "value": float(row.value),
                        "indicator_name": row.indicator_name,
                        "visual_id": row.visual_id
                    })

            return scenario_series

        except Exception as e:
            logger.error(f"Error fetching scenario series: {str(e)}")
            raise
