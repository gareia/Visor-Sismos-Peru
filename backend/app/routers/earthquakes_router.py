from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.earthquake_service import list_all_earthquakes

router = APIRouter(prefix="/earthquakes", tags=["Sismos"])

@router.get("/")
def get_all(db: Session=Depends(get_db)):
    return list_all_earthquakes(db)