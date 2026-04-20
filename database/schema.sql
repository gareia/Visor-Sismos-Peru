
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE staging_sismos(
	id TEXT,
	fecha_utc TEXT,
	hora_utc TEXT,
	lat TEXT,
	lon TEXT,
	profundidad TEXT,
	magnitud TEXT,
	fecha_corte TEXT
);

CREATE TABLE sismos(
	id SERIAL PRIMARY KEY,
	id_externo TEXT,
	fecha_utc DATE,
	hora_utc TIME,
	lat DOUBLE PRECISION,
	lon DOUBLE PRECISION,
	profundidad DOUBLE PRECISION, 
	magnitud DOUBLE PRECISION,
	fecha_corte DATE,
	geom GEOMETRY(Point, 4326)
);

CREATE INDEX idx_sismos_geom ON sismos USING GIST (geom);