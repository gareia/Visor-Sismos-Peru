from sqlalchemy.orm import Session
from app.models.earthquake import Earthquake

def get_all_earthquakes(db:Session, limit:int, offset:int):
    return (db.query(Earthquake)
            .order_by(
                Earthquake.occurred_at.desc(),
                Earthquake.id.desc()
            )
            .offset(offset)
            .limit(limit)
            .all())