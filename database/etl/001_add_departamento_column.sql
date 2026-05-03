ALTER TABLE sismos 
ADD COLUMN IF NOT EXISTS departamento TEXT;

CREATE INDEX IF NOT EXISTS idx_sismos_departamento ON sismos(departamento);