"""Unsplash service — fetch a high-quality destination photo."""

import os
import requests


def get_city_image(destination: str) -> dict:
    access_key = os.getenv("UNSPLASH_ACCESS_KEY")
    if not access_key:
        return {"url": None, "error": "UNSPLASH_ACCESS_KEY not configured"}

    url = "https://api.unsplash.com/search/photos"
    params = {
        "query": f"{destination} city travel landmark",
        "per_page": 1,
        "orientation": "landscape",
        "client_id": access_key,
    }

    try:
        resp = requests.get(url, params=params, timeout=8)
        resp.raise_for_status()
        results = resp.json().get("results", [])

        if not results:
            return {"url": None, "error": "No image found"}

        photo = results[0]
        return {
            "url": photo["urls"]["regular"],
            "thumb": photo["urls"]["thumb"],
            "alt": photo.get("alt_description", destination),
            "photographer": photo["user"]["name"],
            "photographer_url": photo["user"]["links"]["html"],
        }
    except Exception as exc:
        return {"url": None, "error": str(exc)}
