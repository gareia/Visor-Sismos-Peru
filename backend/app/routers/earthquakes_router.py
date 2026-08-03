from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.earthquake_service import list_all_earthquakes

router = APIRouter(prefix="/earthquakes", tags=["Sismos"])

@router.get("/")
def get_all(
    db: Session=Depends(get_db),
    limit: int = Query(default=3000, ge=1, le=5000),
    offset: int = Query(default=0, ge=0)
):
    return list_all_earthquakes(db, limit, offset)