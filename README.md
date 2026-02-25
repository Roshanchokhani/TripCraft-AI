# TripCraft AI — Smart Travel Itinerary Generator

> **Hackathon Submission** | AI / Generative AI Engineer Intern

An intelligent travel planning application that generates personalised, day-by-day travel itineraries using **Google Gemini 2.5 Flash Lite** and **Retrieval-Augmented Generation (RAG)**.

---

## Architecture

```
TripCraft-AI/
├── backend/           # Python FastAPI
│   ├── main.py
│   ├── routers/       # itinerary, weather, email endpoints
│   ├── services/      # AI, RAG, weather, email, Unsplash, packing, refine
│   └── data/          # Travel knowledge base (RAG corpus)
└── frontend/          # React + Vite + Tailwind CSS
    └── src/
        ├── pages/     # HomePage, ItineraryPage
        ├── components/ # Navbar, Timeline, ActivityCard, WeatherWidget,
        │               # EmailModal, PackingListModal, ChatPanel
        ├── utils/     # exportPdf (jsPDF)
        ├── context/   # Google OAuth AuthContext
        └── api/       # Axios API client
```

## How RAG Works in This App

1. **Indexing** — On startup, 19 curated travel knowledge documents (destination guides, cultural tips, interest-based guides) are embedded using Google's `gemini-embedding-001` model and cached as NumPy vectors in memory.
2. **Retrieval** — When a user submits a destination + interests, we embed their query with the same model and compute cosine similarity against all stored vectors to retrieve the top 4 most relevant knowledge chunks.
3. **Augmented Generation** — The retrieved context is injected into the Gemini prompt, grounding the model's output with real, accurate travel knowledge and reducing hallucinations.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| AI Model | Google Gemini 2.5 Flash Lite |
| RAG Vector Store | NumPy cosine similarity + Google `gemini-embedding-001` |
| Backend | Python FastAPI |
| Frontend | React + Vite + Tailwind CSS |
| Auth | Google OAuth 2.0 (`@react-oauth/google`) |
| Email | Gmail SMTP |
| Weather | OpenWeatherMap API |
| Images | Unsplash API |
| PDF Export | jsPDF (client-side) |

---

## Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- API keys (see below)

### API Keys Required

| Key | Where to Get |
|-----|-------------|
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `OPENWEATHER_API_KEY` | [OpenWeatherMap](https://openweathermap.org/api) (free tier) |
| `UNSPLASH_ACCESS_KEY` | [Unsplash Developers](https://unsplash.com/developers) (free) |
| `SMTP_EMAIL` | Your Gmail address |
| `SMTP_PASSWORD` | Gmail App Password (Account → Security → 2-Step → App Passwords) |
| `VITE_GOOGLE_CLIENT_ID` | [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials → OAuth 2.0 |

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and fill in your API keys

# Run the server
uvicorn main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your VITE_GOOGLE_CLIENT_ID

# Run dev server
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Features

### Core Features
- **AI Itinerary Generation** — Day-by-day plans with 4–6 activities per day, including meals
- **RAG Enhancement** — Real travel knowledge injected into every AI prompt
- **Weather Widget** — Live weather for the destination (OpenWeatherMap)
- **City Background** — Beautiful hero images from Unsplash
- **Timeline UI** — Clean, interactive day-by-day timeline with activity cards
- **Email Export** — Beautifully formatted HTML itinerary sent to your inbox
- **Google Sign-In** — Secure SSO with Google OAuth 2.0
- **Responsive Design** — Fully mobile-friendly

### Bonus Features
- **AI Packing List** — One click generates a categorized, interactive packing list tailored to your destination and activities; tick items off with a live progress bar
- **PDF Export** — Download a beautifully branded, multi-page PDF of the full itinerary instantly (client-side, no extra API call)
- **Refine with AI** — Floating chat panel that lets you modify the itinerary in natural language (e.g. *"Make Day 2 more budget-friendly"*); Gemini updates the timeline live

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/generate` | Generate AI itinerary |
| GET | `/api/weather?destination=` | Get current weather |
| GET | `/api/city-image?destination=` | Get Unsplash city photo |
| POST | `/api/send-email` | Email the itinerary |
| POST | `/api/packing-list` | Generate AI packing list |
| POST | `/api/refine` | Refine itinerary via natural language |

Interactive docs: **http://localhost:8000/docs**
