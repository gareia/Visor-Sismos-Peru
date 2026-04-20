
INSERT INTO sismos(id_externo, fecha_utc, hora_utc, lat, lon, 
	profundidad, magnitud, fecha_corte, geom)
SELECT id, 
	fecha_utc::DATE, 
	hora_utc::TIME,
	REPLACE(lat, ',', '.')::DOUBLE PRECISION,
	REPLACE(lon, ',', '.')::DOUBLE PRECISION,
	profundidad::DOUBLE PRECISION,
	magnitud::DOUBLE PRECISION,
	fecha_corte::DATE,
	ST_SetSRID( 
		ST_MAKEPOINT(
			REPLACE(lon, ',', '.')::DOUBLE PRECISION, 
			REPLACE(lat, ',', '.')::DOUBLE PRECISION
		) 
	, 4326 )
FROM staging_sismos;