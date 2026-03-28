
-- EL USUARIO DEBE CAMBIAR LA RUTA DEL ARCHIVO CSV
COPY staging_sismos(id, fecha_utc, hora_utc, lat, lon, 
	profundidad, magnitud, fecha_corte)
FROM 'E:\PostgreProjects\CatalogoSismos1960_2023.csv' CSV 
	DELIMITER ';' HEADER


INSERT INTO sismos(id_externo, fecha_utc, hora_utc, lat, lon, 
	profundidad, magnitud, fecha_corte, geom)
SELECT id, 
	TO_DATE(fecha_utc, 'YYYYMMDD'), 
	hora_utc::TIME,
	REPLACE(lat, ',', '.')::DOUBLE PRECISION,
	REPLACE(lon, ',', '.')::DOUBLE PRECISION,
	profundidad::DOUBLE PRECISION,
	magnitud::DOUBLE PRECISION,
	TO_DATE(fecha_corte, 'YYYYDDMM'),
	ST_SetSRID( 
		ST_MAKEPOINT(
			REPLACE(lon, ',', '.')::DOUBLE PRECISION, 
			REPLACE(lat, ',', '.')::DOUBLE PRECISION
		) 
	, 4326 )
FROM staging_sismos;