from fastapi import FastAPI
from app.routers import router

app = FastAPI(title="Visor de Sismos en Perú",
              version="1.0.0",
              description="API del visor de sismos")

app.include_router(router)

@app.get("/")
def home():
    return {"mensaje":"Bienvenido al visor de sismos del Perú"}