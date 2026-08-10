
from datetime import date as Date
from pydantic import BaseModel, Field
from app.constants import MAX_EARTHQUAKES

class EarthquakeFilters(BaseModel):
    date: Date | None = Field(default=None)
    min_magnitude: float | None = Field(default=None, ge=0)
    max_magnitude: float | None = Field(default=None, ge=0, le=10)
    limit: int = Field(default=MAX_EARTHQUAKES, ge=1, le=MAX_EARTHQUAKES)
    offset: int = Field(default=0, ge=0)
    