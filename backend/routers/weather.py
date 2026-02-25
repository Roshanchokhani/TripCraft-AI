"""Weather router — current weather for a destination."""

from fastapi import APIRouter
from services.weather_service import get_weather

router = APIRouter(tags=["Weather"])


@router.get("/weather")
async def weather(destination: str):
    return get_weather(destination)
