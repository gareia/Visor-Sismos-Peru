from sqlalchemy.orm import Session
from app.models.earthquake import Earthquake

def get_all_earthquakes(db: Session):
    return db.query(Earthquake).all()