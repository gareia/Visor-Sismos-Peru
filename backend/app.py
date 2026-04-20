from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
import psycopg2
import os

if os.getenv("ENV") != "production":
    from dotenv import load_dotenv 
    load_dotenv() 

app = Flask(__name__)
CORS(app)

def get_connection():
    return psycopg2.connect(
        #dbname=os.getenv("DB_NAME"),
        #user=os.getenv("DB_USER"),
        #password=os.getenv("DB_PASSWORD"),
        #host=os.getenv("DB_HOST"),
        #port=os.getenv("DB_PORT")
        os.getenv("DATABASE_URL")
    )

def obtener_sismos(inicio=None, fin=None):
    conn = get_connection()
    cur = conn.cursor()

    if inicio and fin:
        cur.execute("""
            SELECT id_externo, magnitud, profundidad,
                    ST_X(geom) as lon, ST_Y(geom) as lat,
                    fecha_utc, hora_utc
            FROM sismos
            WHERE fecha_utc BETWEEN %s AND %s
            LIMIT 500;
        """, (inicio, fin))
    else:
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

    return result

@app.route("/")
def index():

    datos_sismos = obtener_sismos()
    return render_template("index.html", datos_sismos=datos_sismos)

@app.route("/api/sismos")
def get_sismos():
    
    inicio = request.args.get("inicio")
    fin = request.args.get("fin")
    print(inicio, fin)

    datos_sismos = obtener_sismos(inicio=inicio, fin=fin)
    return jsonify(datos_sismos)

if __name__ == "__main__":
    app.run(debug=True)