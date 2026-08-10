from pydantic import BaseModel
from app.schemas.earthquake_response import EarthquakeResponse

class EarthquakeListResponse(BaseModel):

    data: list[EarthquakeResponse]
    count: int
    has_more: bool
    limit: int