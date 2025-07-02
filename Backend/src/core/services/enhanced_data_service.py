from datetime import datetime
import logging
from core.services.data_service import DataService

logger = logging.getLogger(__name__)

PAST_CUTOFF   = 2023        # ⬅️  everything **before** 2023
PRESENT_END   = 2025        # ⬅️  2023-2025 inclusive are “present”

class EnhancedDataService:
    """
    Wraps DataService and re-maps the line-series into
    Past / Present / Future buckets with *static* year limits.
    """

    @staticmethod
    def get_timeline_data(indicator_id: str) -> dict:
        base = DataService.get_time_series_data(indicator_id)

        timeline = {"past": [], "present": [], "future": []}
        for entry in base.get("line_data", []):
            yr = entry.get("year")
            if yr is None:
                continue

            if yr < PAST_CUTOFF:            # ← PAST
                timeline["past"].append(entry)
            elif PAST_CUTOFF <= yr <= PRESENT_END:   # ← PRESENT
                timeline["present"].append(entry)
            else:                           # ← FUTURE
                timeline["future"].append(entry)

        base["timeline_data"] = timeline
        base["timeline_metadata"] = {
            "past_period":    f"Before {PAST_CUTOFF}",
            "present_period": f"{PAST_CUTOFF}-{PRESENT_END}",
            "future_period":  f"After {PRESENT_END}",
        }
        return base
