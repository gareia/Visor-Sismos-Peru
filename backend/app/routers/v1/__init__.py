from fastapi import APIRouter

from . import earthquakes_router

router = APIRouter()

router.include_router(earthquakes_router.router)