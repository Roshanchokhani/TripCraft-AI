"""
TripCraft AI — FastAPI Backend
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routers import itinerary, weather, email_route
from services.rag_service import initialize_rag

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize RAG vector store on startup."""
    print("[INFO] TripCraft AI starting up...")
    initialize_rag()
    yield
    print("[INFO] TripCraft AI shutting down.")


app = FastAPI(
    title="TripCraft AI API",
    description="Smart Travel Itinerary Generator powered by Google Gemini + RAG",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(itinerary.router, prefix="/api")
app.include_router(weather.router, prefix="/api")
app.include_router(email_route.router, prefix="/api")


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "TripCraft AI API is running"}
