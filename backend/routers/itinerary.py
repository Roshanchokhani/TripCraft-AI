"""Itinerary router — handles itinerary generation and city image fetching."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from services.ai_service import generate_itinerary
from services.unsplash_service import get_city_image

router = APIRouter(tags=["Itinerary"])


class ItineraryRequest(BaseModel):
    destination: str = Field(..., min_length=2, max_length=100)
    duration: int = Field(..., ge=1, le=14)
    interests: list[str] = Field(default_factory=list)


@router.post("/generate")
async def generate(req: ItineraryRequest):
    try:
        itinerary = generate_itinerary(
            destination=req.destination.strip(),
            duration=req.duration,
            interests=req.interests,
        )
        return {"success": True, "itinerary": itinerary}
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {exc}")


@router.get("/city-image")
async def city_image(destination: str):
    result = get_city_image(destination)
    return result
