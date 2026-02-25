"""Packing list service — AI-generated packing list based on the itinerary."""

import os
import json
import google.generativeai as genai


def generate_packing_list(itinerary: dict) -> dict:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not set.")

    genai.configure(api_key=api_key)

    destination = itinerary.get("destination", "")
    duration = itinerary.get("duration", 3)
    days = itinerary.get("days", [])

    # Collect unique activity categories from the itinerary
    categories = sorted({
        act.get("category", "")
        for day in days
        for act in day.get("activities", [])
        if act.get("category")
    })

    prompt = f"""
Create a comprehensive packing list for a {duration}-day trip to {destination}.
The trip includes these activity types: {', '.join(categories)}.

Return ONLY valid JSON with this exact structure:
{{
  "destination": "{destination}",
  "duration": {duration},
  "categories": [
    {{
      "name": "Category Name",
      "icon": "single emoji",
      "items": ["item 1", "item 2", "item 3"]
    }}
  ]
}}

Always include these categories: Clothing, Documents & Money, Electronics, Toiletries, Health & Safety.
Add activity-specific categories based on: {', '.join(categories)}.
Keep each item concise (2-4 words). Include 6-10 items per category.
""".strip()

    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash-lite",
        generation_config={
            "response_mime_type": "application/json",
            "temperature": 0.5,
        },
    )

    response = model.generate_content(prompt)
    raw = response.text.strip()
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[-1].rsplit("```", 1)[0].strip()

    return json.loads(raw)
