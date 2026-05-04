import os
import psycopg2
import json

if os.getenv("ENV") != "production":
    from dotenv import load_dotenv 
    load_dotenv() 

DATABASE_URL = os.getenv("DATABASE_URL")
BASE_DIR = "backend/static"
OUTPUT_FILE = f"{BASE_DIR}/departamentos.geojson"

def main():
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
    
    print("Conexión realizada")
    
    cursor.execute("""
        SELECT jsonb_build_object(
            'type', 'FeatureCollection',
            'features', jsonb_agg(
                jsonb_build_object(
                    'type', 'Feature',
                    'geometry', ST_AsGeoJSON(geom)::jsonb,
                    'properties', jsonb_build_object(
                        'id', gid,
                        'nombre', departamen
                    )
                )
            )
        )
        FROM departamentos;
    """)
    data = cursor.fetchone()[0]
    os.makedirs(BASE_DIR, exist_ok=True)

    with open(OUTPUT_FILE, 'w') as f:
        json.dump(data, f, indent=2)

    cursor.close()
    conn.close()

    print(f"GeoJSON generado y guardado en {OUTPUT_FILE}")

if __name__ == "__main__":
    main()