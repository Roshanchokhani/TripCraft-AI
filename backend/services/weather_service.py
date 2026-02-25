"""Weather service — current conditions from OpenWeatherMap."""

import os
import requests


def get_weather(destination: str) -> dict:
    api_key = os.getenv("OPENWEATHER_API_KEY")
    if not api_key:
        return {"error": "OPENWEATHER_API_KEY not configured"}

    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {"q": destination, "appid": api_key, "units": "metric"}

    try:
        resp = requests.get(url, params=params, timeout=8)
        resp.raise_for_status()
        data = resp.json()

        return {
            "city": data["name"],
            "country": data["sys"]["country"],
            "temperature": round(data["main"]["temp"]),
            "feels_like": round(data["main"]["feels_like"]),
            "description": data["weather"][0]["description"].title(),
            "icon": data["weather"][0]["icon"],
            "humidity": data["main"]["humidity"],
            "wind_speed": round(data["wind"]["speed"] * 3.6, 1),  # m/s → km/h
        }
    except requests.HTTPError as exc:
        if exc.response.status_code == 404:
            return {"error": f"City '{destination}' not found."}
        return {"error": f"Weather API error: {exc}"}
    except Exception as exc:
        return {"error": str(exc)}
