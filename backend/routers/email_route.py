"""Email router — send itinerary to the user's inbox."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from services.email_service import send_itinerary_email

router = APIRouter(tags=["Email"])


class EmailRequest(BaseModel):
    recipient: EmailStr
    itinerary: dict


@router.post("/send-email")
async def send_email(req: EmailRequest):
    result = send_itinerary_email(req.recipient, req.itinerary)
    if not result.get("success"):
        raise HTTPException(status_code=500, detail=result.get("error", "Failed to send email"))
    return result
