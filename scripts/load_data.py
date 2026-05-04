import pandas as pd
import psycopg2
import os
from psycopg2.extras import execute_batch

if os.getenv("ENV") != "production":
    from dotenv import load_dotenv 
    load_dotenv() 

isProduction = os.getenv("ENV") == "production"

if os.getenv("ENV") == "production":
    conn = psycopg2.connect(os.getenv("DATABASE_URL"), sslmode="require")
else:
    conn = psycopg2.connect(os.getenv("DATABASE_URL"))

cursor = conn.cursor()
print("Conexión realizada")

df = pd.read_csv(
    "data/CatalogoSismos1960_2023.csv",
    delimiter=";"
)

# limpiar datos
print("Filas originales: ", len(df))

df["LATITUD"] = pd.to_numeric(df["LATITUD"].astype(str).str.replace(",", "."), errors="coerce")
df["LONGITUD"] = pd.to_numeric(df["LONGITUD"].astype(str).str.replace(",", "."), errors="coerce")

df["FECHA_UTC"] = pd.to_datetime(df["FECHA_UTC"], format="%Y%m%d", errors="coerce").dt.date
df["FECHA_CORTE"] = pd.to_datetime(df["FECHA_CORTE"], format="%Y%d%m", errors="coerce").dt.date

df["HORA_UTC"] = pd.to_datetime(df["HORA_UTC"].astype(str).str.zfill(6), format="%H%M%S", errors="coerce").dt.time

df = df.dropna(subset=["LATITUD", "LONGITUD", "FECHA_UTC"])

print("Filas limpias: ", len(df))

# insertar a tabla staging_sismos
query = """
    INSERT INTO staging_sismos (
        id, fecha_utc, hora_utc, lat, lon,
        profundidad, magnitud, fecha_corte
    )
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """

valores = [
    (
        row["ID"],
        row["FECHA_UTC"],
        row["HORA_UTC"],
        row["LATITUD"],
        row["LONGITUD"],
        row["PROFUNDIDAD"],
        row["MAGNITUD"],
        row["FECHA_CORTE"]
    ) for _, row in df.iterrows() ]

execute_batch(cursor, query, valores)

# insertar a tabla sismos
with open("database/load.sql", "r") as f:
    cursor.execute(f.read())

conn.commit()
cursor.close()
conn.close()

print("Datos cargados correctamente")