import psycopg2
from psycopg2.extras import execute_batch
import pandas as pd
from backend.app.config import settings

PATH_CSV_DATA = "data/datos_copia_2006-01-01_2026-07-31.csv"
PATH_SQL_FILE = "scripts/sql/populate_earthquakes.sql"

try:
    print(f"[AMBIENTE {settings.ENV}]")
    conn = psycopg2.connect(settings.DATABASE_URL, sslmode=settings.db_sslmode)
    cursor = conn.cursor()

    print(">> Conexión realizada")

    df = pd.read_csv(PATH_CSV_DATA, sep=";")
    df_original = df.copy()
    print(">> Filas originales: ", len(df))

    df["latitud"] = pd.to_numeric(df["latitud"].astype(str).str.replace(",", "."), errors="coerce")
    df["longitud"] = pd.to_numeric(df["longitud"].astype(str).str.replace(",", "."), errors="coerce")

    df["fecha_utc"] = pd.to_datetime(df["fecha_utc"], format="%Y-%m-%d", errors="coerce").dt.date

    df["hora_utc"] = (df["hora_utc"].astype(str).str.strip().str.split(".").str[0])
    df["hora_utc"] = pd.to_datetime(df["hora_utc"].astype(str).str.zfill(6), format="%H:%M:%S", errors="coerce").dt.time

    invalid = df[
        df[["latitud", "longitud", "fecha_utc", "hora_utc"]]
        .isna()
        .any(axis=1)
    ]
    invalid_original = df_original.loc[invalid.index]

    if not invalid_original.empty:
        print(">> Filas inválidas:")
        print(invalid_original[
            ["latitud", "longitud", "fecha_utc", "hora_utc"]
        ].head(5))

    df = df.dropna(subset=["latitud", "longitud", "fecha_utc", "hora_utc"])

    print(">> Filas válidas: ", len(df))

    query = """
        INSERT INTO staging_earthquakes (
            fecha_utc, hora_utc, latitud, longitud,
            profundidad_km, magnitud
        ) VALUES (%s, %s, %s, %s, %s, %s)
        """

    valores = [
        (
            row["fecha_utc"],
            row["hora_utc"],
            row["latitud"],
            row["longitud"],
            row["profundidad_km"],
            row["magnitud"],
        ) for _, row in df.iterrows()
    ]

    execute_batch(cursor, query, valores)

    with open(PATH_SQL_FILE, "r", encoding="utf-8") as f:
        cursor.execute(f.read())

    conn.commit()
    print(f">> ETL completada con exito")
    
except Exception as e:
    conn.rollback()
    print(f">> ETL falló: {e}")
    raise
finally:
    cursor.close()
    conn.close()

print(">> Datos cargados correctamente")