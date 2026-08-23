from sqlalchemy.orm import Session
from sqlalchemy import func, select, text
from app.models.earthquake import Earthquake
from app.schemas.earthquake_filters import EarthquakeFilters
from datetime import datetime, time, timedelta
from app.constants import PERU_TIMEZONE
import logging
import json
from geoalchemy2 import Geography
from sqlalchemy import cast

logger = logging.getLogger(__name__)

def get_all_earthquakes(
        db:Session, 
        filters: EarthquakeFilters,
):

    logger.debug(">> System local time: %s", datetime.now().astimezone())
    result = db.execute(text("SHOW timezone"))
    logger.debug(">> Database timezone: %s", result.scalar())

    query = select(Earthquake) #db.query(Earthquake)

    #---------------------------------------------
    # DATE
    #---------------------------------------------

    date_value = filters.date
    print(f">>> fecha {date_value}")

    if date_value is not None:
        
        start_datetime = datetime.combine(date_value, time.min, tzinfo=PERU_TIMEZONE)
        end_datetime = start_datetime+timedelta(days=1)

        query = query.where( #filter(
            Earthquake.occurred_at >= start_datetime,
            Earthquake.occurred_at < end_datetime
            #func.date(Earthquake.occurred_at) == date_value
        )

    #---------------------------------------------
    # MAGNITUDE
    #---------------------------------------------
    
    min_magnitude_value = filters.min_magnitude
    if min_magnitude_value is not None:
        query = query.where(
            Earthquake.magnitude >= min_magnitude_value
        )
        
    max_magnitude_value = filters.max_magnitude
    if max_magnitude_value is not None:
        query = query.where(
            Earthquake.magnitude <= max_magnitude_value
        )

    #---------------------------------------------
    # SPATIAL FILTER
    #---------------------------------------------
    spatial_filter = filters.spatial_filter
    print(f">>> filtro espacial: {spatial_filter}")

    if spatial_filter is not None:

        print(f"spatial_filter.type {spatial_filter.type}")
        if spatial_filter.type == "circle":

            point = func.ST_SetSRID(
                func.ST_MakePoint(
                    spatial_filter.longitude,
                    spatial_filter.latitude 
                ), 4326)

            radius_meters = spatial_filter.radius_km*1000

            query = query.where(
                func.ST_DWithin(
                    cast(Earthquake.geom, Geography),
                    cast(point, Geography),
                    radius_meters
                )
            )

        elif spatial_filter.type == "polygon":

            polygon_geojson = {
                "type": "Polygon",
                "coordinates": [
                    spatial_filter.coordinates
                ]
            }

            polygon = func.ST_SetSRID(
                func.ST_GeomFromGeoJSON(
                    json.dumps(polygon_geojson)
                ), 4326
            )

            query = query.where(
                func.ST_Within(
                    Earthquake.geom,
                    polygon
                )
            )

    offset = filters.offset
    limit = filters.limit+1 

    query = (
        query.
            order_by(
                Earthquake.occurred_at.desc(),
                Earthquake.id.desc()
            )
        .offset(offset)
        .limit(limit))
    
    return db.scalars(query).all()