from app.database import Base
from sqlalchemy import Column, Integer, String, Float, DateTime, Index
from geoalchemy2 import Geometry

class Earthquake(Base):

    __tablename__ = "earthquakes"

    id = Column(Integer, primary_key=True)
    external_id = Column(String(100), unique=True, nullable=False)

    occurred_at = Column(DateTime(timezone=True), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    depth_km = Column(Float, nullable=False)
    magnitude = Column(Float, nullable=False)

    geom = Column(Geometry("POINT", srid=4326), nullable=False)
