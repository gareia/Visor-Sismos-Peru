
INSERT INTO earthquakes(external_id, occurred_at, latitude, longitude, 
	depth_km, magnitude, geom)
SELECT 
	/*fecha_utc::DATE, 
	hora_utc::TIME,*/
	id,
    --TO_TIMESTAMP( fecha_utc || LPAD(hora_utc, 6, '0'), 'YYYYMMDDHH24MISS'),
    TO_TIMESTAMP( fecha_utc || ' ' || hora_utc, 'YYYY-MM-DD HH24:MI:SS') AT TIME ZONE 'UTC',
	REPLACE(latitud, ',', '.')::DOUBLE PRECISION,
	REPLACE(longitud, ',', '.')::DOUBLE PRECISION,
	profundidad_km::DOUBLE PRECISION,
	magnitud::DOUBLE PRECISION,
	ST_SetSRID( 
		ST_MAKEPOINT(
			REPLACE(longitud, ',', '.')::DOUBLE PRECISION, 
			REPLACE(latitud, ',', '.')::DOUBLE PRECISION
		) 
	, 4326 )
FROM staging_earthquakes;