from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import router
from app.config import FRONTEND_URL

app = FastAPI(title="Visor de Sismos en Perú",
              version="1.0.0",
              description="API del visor de sismos")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
app.include_router(router,prefix="/api")

@app.get("/")
def home():
    return {"mensaje":"Bienvenido al visor de sismos del Perú"}