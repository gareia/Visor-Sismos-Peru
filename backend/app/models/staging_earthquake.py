from app.database import Base
from sqlalchemy import Column, String, Integer

class StagingEarthquake(Base):

    __tablename__ = "staging_earthquakes"

    id = Column(Integer, primary_key=True)
    fecha_utc = Column(String(20))
    hora_utc = Column(String(20))
    latitud = Column(String(30))
    longitud = Column(String(30))
    profundidad_km = Column(String(20))
    magnitud = Column(String(20))
