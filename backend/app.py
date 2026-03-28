from flask import Flask, jsonify
from flask_cors import CORS
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)

def get_connection():
    return psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT")
    )

@app.route("/sismos")
def get_sismos():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT id_externo, magnitud, profundidad,
                ST_X(geom) as lon, ST_Y(geom) as lat,
                fecha_utc, hora_utc
        FROM sismos
        LIMIT 500;
    """)

    rows = cur.fetchall()

    result = []
    for r in rows:
        result.append({
            "id": r[0],
            "magnitud": r[1],
            "profundidad": r[2],
            "lon": r[3],
            "lat": r[4],
            "fecha": str(r[5]),
            "hora": str(r[6])
        })
    
    cur.close()
    conn.close()

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)