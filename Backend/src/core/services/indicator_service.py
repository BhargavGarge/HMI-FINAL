from typing import List, Dict
from src.core.db import db
from sqlalchemy import text

class IndicatorService:
    @staticmethod
    def get_all_indicators() -> List[Dict]:
        """Get all indicators"""
        query = "SELECT id, name, unit, category, tags FROM indicators;"
        with db.engine.connect() as connection:
            result = connection.execute(text(query))
            return [dict(row._mapping) for row in result]

    @staticmethod
    def get_observations(indicator_id: int) -> List[Dict]:
        """Get observations for specific indicator"""
        query = """
        SELECT o.*, i.name as indicator_name, i.unit
        FROM observations o
        JOIN indicators i ON o.indicator_id = i.id
        WHERE o.indicator_id = :indicator_id;
        """
        with db.engine.connect() as connection:
            result = connection.execute(text(query), {'indicator_id': indicator_id})
            return [dict(row._mapping) for row in result]