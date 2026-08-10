from sqlalchemy.orm import Session
from app.repositories.earthquake_repository import get_all_earthquakes
from app.schemas.earthquake_response import EarthquakeResponse
from app.schemas.earthquake_filters import EarthquakeFilters
from app.schemas.earthquake_list_response import EarthquakeListResponse

def list_all_earthquakes(
        db:Session, 
        filters:EarthquakeFilters,
):

    earthquakes = get_all_earthquakes(db=db, filters=filters)

    limit = filters.limit
    has_more = len(earthquakes) > limit
    earthquakes= earthquakes[:limit]

    earthquakes_response = [EarthquakeResponse(
        id=earthquake.id,
        occurred_at=earthquake.occurred_at,
        latitude=earthquake.latitude,
        longitude=earthquake.longitude,
        depth_km=earthquake.depth_km,
        magnitude=earthquake.magnitude,
    ) for earthquake in earthquakes]

    return EarthquakeListResponse(
        data=earthquakes_response,
        count=len(earthquakes),
        has_more=has_more,
        limit=limit
    )