"""Refine service — update an existing itinerary based on user chat feedback."""

import os
import json
import google.generativeai as genai


_SYSTEM_INSTRUCTION = """
You are an expert travel planner helping to refine an existing itinerary based on user feedback.

RULES:
1. Return ONLY the complete updated itinerary as valid JSON — same structure as the input.
2. Apply ONLY the changes the user requested — keep everything else identical.
3. Do not add or remove keys from the JSON structure.
4. Category must be one of: Food, History, Adventure, Culture, Nature, Shopping, Relaxation.
""".strip()


def refine_itinerary(itinerary: dict, user_message: str) -> dict:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not set.")

    genai.configure(api_key=api_key)

    prompt = f"""
Current itinerary (JSON):
{json.dumps(itinerary, indent=2)}

User request: "{user_message}"

Apply the requested changes and return the complete updated itinerary as JSON.
""".strip()

    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash-lite",
        system_instruction=_SYSTEM_INSTRUCTION,
        generation_config={
            "response_mime_type": "application/json",
            "temperature": 0.7,
            "max_output_tokens": 8192,
        },
    )

    response = model.generate_content(prompt)
    raw = response.text.strip()
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[-1].rsplit("```", 1)[0].strip()

    return json.loads(raw)
