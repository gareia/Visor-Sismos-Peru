UPDATE sismos s
SET departamento = d.departamen
FROM departamentos d
WHERE ST_INTERSECTS(s.geom, d.geom);