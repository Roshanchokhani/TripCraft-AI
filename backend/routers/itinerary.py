"""Itinerary router — generation, city image, packing list, and refinement."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from services.ai_service import generate_itinerary
from services.unsplash_service import get_city_image
from services.packing_service import generate_packing_list
from services.refine_service import refine_itinerary

router = APIRouter(tags=["Itinerary"])


class ItineraryRequest(BaseModel):
    destination: str = Field(..., min_length=2, max_length=100)
    duration: int = Field(..., ge=1, le=14)
    interests: list[str] = Field(default_factory=list)


class PackingListRequest(BaseModel):
    itinerary: dict


class RefineRequest(BaseModel):
    itinerary: dict
    message: str = Field(..., min_length=3, max_length=500)


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
    return get_city_image(destination)


@router.post("/packing-list")
async def packing_list(req: PackingListRequest):
    try:
        result = generate_packing_list(req.itinerary)
        return result
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Packing list generation failed: {exc}")


@router.post("/refine")
async def refine(req: RefineRequest):
    try:
        updated = refine_itinerary(req.itinerary, req.message)
        return {"success": True, "itinerary": updated}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Refinement failed: {exc}")
