
from datetime import date as Date
from pydantic import BaseModel, Field
from typing import Literal
from app.constants import MAX_EARTHQUAKES

class CircleSpatialFilter(BaseModel):
    type: Literal["circle"]
    latitude: float
    longitude: float
    radius_km: float=Field(gt=0)

class PolygonSpatialFilter(BaseModel):
    type: Literal["polygon"]
    coordinates: list[tuple[float, float]]

SpatialFilter = CircleSpatialFilter | PolygonSpatialFilter

class EarthquakeFilters(BaseModel):
    date: Date | None = Field(default=None)
    min_magnitude: float | None = Field(default=None, ge=0)
    max_magnitude: float | None = Field(default=None, ge=0, le=10)
    limit: int = Field(default=MAX_EARTHQUAKES, ge=1, le=MAX_EARTHQUAKES)
    offset: int = Field(default=0, ge=0)
    spatial_filter: SpatialFilter | None = Field(default=None)
    