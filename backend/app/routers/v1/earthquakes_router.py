from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.earthquake_service import list_all_earthquakes
from app.schemas.earthquake_list_response import EarthquakeListResponse
from app.schemas.earthquake_filters import EarthquakeFilters

router = APIRouter(prefix="/earthquakes", tags=["Sismos"])

@router.post("/", response_model=EarthquakeListResponse)
def read_earthquakes(
    filters: EarthquakeFilters,
    db: Session = Depends(get_db), #dependency injection mechanism
):

    return list_all_earthquakes(db=db, filters=filters)