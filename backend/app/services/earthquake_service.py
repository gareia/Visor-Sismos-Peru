from sqlalchemy.orm import Session
from app.repositories.earthquake_repository import get_all_earthquakes
from app.schemas.earthquake_response import EarthquakeResponse

def list_all_earthquakes(db:Session):

    earthquakes = get_all_earthquakes(db)

    return [
        EarthquakeResponse(
            id=earthquake.id,
            occurred_at=earthquake.occurred_at,
            latitude=earthquake.latitude,
            longitude=earthquake.longitude,
            depth_km=earthquake.depth_km,
            magnitude=earthquake.magnitude,
        ) for earthquake in earthquakes
    ]