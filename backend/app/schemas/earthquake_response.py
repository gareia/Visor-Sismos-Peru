from pydantic import BaseModel, ConfigDict
from datetime import datetime

class EarthquakeResponse(BaseModel):

    id: int
    occurred_at: datetime
    latitude: float
    longitude: float
    depth_km: float
    magnitude: float
    
    model_config = ConfigDict(
        from_attributes=True
    )