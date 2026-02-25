"""
AI Service — Itinerary generation using Google Gemini 1.5 Flash.

Prompt engineering strategy:
  • System instruction: sets the model's persona as an expert travel planner
    and mandates pure JSON output (no markdown/code-fences).
  • User prompt: provides destination, duration, interests, and RAG context
    with an explicit JSON schema the model must conform to.
  • response_mime_type="application/json": Gemini-native JSON mode ensures
    the response is always parseable without post-processing.
"""

import os
import json
import google.generativeai as genai
from services.rag_service import retrieve_context

# ── System instruction ────────────────────────────────────────────────────────
_SYSTEM_INSTRUCTION = """
You are an expert travel planner and cultural guide with decades of experience
designing personalised, day-by-day travel itineraries for travellers worldwide.

CRITICAL RULES:
1. Return ONLY valid JSON — no markdown, no code fences, no prose outside the JSON.
2. Follow the exact schema provided in the user message — do not add or remove keys.
3. Include 4–6 activities per day, always covering breakfast, lunch, and dinner.
4. Activity times must be realistic (don't schedule two 3-hour visits back-to-back
   without a meal break).
5. Use specific, real place names — not generic descriptions.
6. Category must be one of: Food, History, Adventure, Culture, Nature, Shopping, Relaxation.
""".strip()

# ── JSON schema ───────────────────────────────────────────────────────────────
_SCHEMA = """
{
  "destination": "string — city name",
  "country": "string",
  "duration": number,
  "summary": "string — 2–3 engaging sentences about the trip",
  "highlights": ["string", "string", "string"],
  "practical_info": {
    "best_time": "string",
    "currency": "string",
    "language": "string",
    "timezone": "string"
  },
  "tips": ["string", "string", "string"],
  "days": [
    {
      "day": number,
      "theme": "string — catchy theme for this day",
      "activities": [
        {
          "time": "string — e.g. 9:00 AM",
          "title": "string",
          "description": "string — 2 sentences",
          "location": "string — specific venue or neighbourhood",
          "duration": "string — e.g. 2 hours",
          "category": "string",
          "cost": "string — e.g. Free / $5–10 / $$",
          "tip": "string — one practical tip"
        }
      ]
    }
  ]
}
""".strip()


def generate_itinerary(destination: str, duration: int, interests: list[str]) -> dict:
    """
    Generate a structured travel itinerary.

    Steps:
      1. Retrieve relevant knowledge from RAG vector store.
      2. Build the Gemini prompt with RAG context injected.
      3. Call Gemini 1.5 Flash in JSON mode.
      4. Parse and return the JSON response.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not set.")

    genai.configure(api_key=api_key)

    # Step 1 — RAG retrieval
    rag_context = retrieve_context(destination, interests)

    # Step 2 — Build prompt
    interests_str = ", ".join(interests) if interests else "General sightseeing"
    rag_section = (
        f"\n\n### Relevant Travel Knowledge (use this to enhance recommendations):\n{rag_context}"
        if rag_context
        else ""
    )

    user_prompt = f"""
Create a {duration}-day travel itinerary for {destination}.
Traveller interests: {interests_str}
{rag_section}

Return a JSON object that conforms EXACTLY to this schema:
{_SCHEMA}

Ensure:
- "duration" field equals {duration}
- "days" array has exactly {duration} objects
- Each day has 4–6 activities including meals
- Activities reflect the traveller's interests: {interests_str}
""".strip()

    # Step 3 — Call Gemini
    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash-lite",
        system_instruction=_SYSTEM_INSTRUCTION,
        generation_config={
            "response_mime_type": "application/json",
            "temperature": 0.7,
            "max_output_tokens": 8192,
        },
    )

    response = model.generate_content(user_prompt)

    # Step 4 — Parse and return JSON
    # Strip any accidental markdown fences before parsing
    raw = response.text.strip()
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[-1].rsplit("```", 1)[0].strip()

    itinerary = json.loads(raw)
    return itinerary
