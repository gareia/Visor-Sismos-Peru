from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
import psycopg2
import os

if os.getenv("ENV") != "production":
    from dotenv import load_dotenv 
    load_dotenv() 

isProduction = os.getenv("ENV") == "production"
port = int(os.environ.get("PORT", 5000))

app = Flask(__name__)
CORS(app)

MAX_RESULTS = 500

def get_connection():
    return psycopg2.connect(
        #dbname=os.getenv("DB_NAME"),
        #user=os.getenv("DB_USER"),
        #password=os.getenv("DB_PASSWORD"),
        #host=os.getenv("DB_HOST"),
        #port=os.getenv("DB_PORT")
        os.getenv("DATABASE_URL")
    )

def obtener_sismos(inicio=None, fin=None, departamento=None):
    conn = get_connection()
    cur = conn.cursor()

    filters = []
    params = []

    query_total = "SELECT COUNT(*) FROM sismos"

    query_base = """
                SELECT id_externo, magnitud, profundidad,
                        ST_X(geom) as lon, ST_Y(geom) as lat,
                        fecha_utc, hora_utc
                FROM sismos"""
            
    if inicio and fin:
        filters.append("fecha_utc BETWEEN %s AND %s")
        params.extend([inicio, fin])

    if filters:
        query_base += " WHERE "+ " AND ".join(filters)
        query_total += " WHERE "+ " AND ".join(filters)


    print(query_total)
    cur.execute(query_total, tuple(params))
    total = cur.fetchone()[0]

    query_base += " LIMIT %s;"
    params.append(MAX_RESULTS)

    print(query_base)
    cur.execute(query_base, tuple(params))
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

    return result, total

def build_response(data, total):
    return {"data": data, "limit":MAX_RESULTS, "total":total}

@app.route("/")
def index():

    datos_sismos, total = obtener_sismos()
    return render_template("index.html", initial_data=build_response(datos_sismos, total))

@app.route("/api/sismos")
def get_sismos():
    
    inicio = request.args.get("inicio")
    fin = request.args.get("fin")
    departamento = request.args.get("departamento")
    print(inicio, fin, departamento)

    datos_sismos, total = obtener_sismos(inicio=inicio, fin=fin, departamento=departamento)
    return jsonify(build_response(datos_sismos, total))

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=(not isProduction), port=port)