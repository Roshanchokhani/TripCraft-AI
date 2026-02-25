"""
RAG Service — Retrieval-Augmented Generation using Gemini Embeddings + NumPy.

How it works:
  1. On startup, every document in the travel knowledge base is sent to
     Google's embedding-001 model and stored as a NumPy vector.
  2. When a user requests an itinerary, their query (destination + interests)
     is embedded with the same model.
  3. Cosine similarity is computed between the query vector and every stored
     document vector. The top-k most similar documents are returned.
  4. Those documents are injected into the Gemini prompt as grounding context,
     reducing hallucinations and improving recommendation quality.

This implementation intentionally avoids external vector-database dependencies
to make the RAG mechanics transparent and easy to understand.
"""

import os
import numpy as np
import google.generativeai as genai

from data.travel_knowledge import TRAVEL_DOCUMENTS

_doc_embeddings: list[np.ndarray] = []
_doc_texts: list[str] = []


def _embed(text: str) -> np.ndarray:
    result = genai.embed_content(
        model="models/gemini-embedding-001",
        content=text,
    )
    return np.array(result["embedding"], dtype=np.float32)


def _cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-10))


def initialize_rag() -> None:
    """Embed all travel knowledge documents and cache them in memory."""
    global _doc_embeddings, _doc_texts

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("[WARN]  GEMINI_API_KEY not set - RAG will be disabled.")
        return

    genai.configure(api_key=api_key)

    try:
        print(f"[INFO]  Indexing {len(TRAVEL_DOCUMENTS)} knowledge documents for RAG...")
        _doc_texts = [doc["content"] for doc in TRAVEL_DOCUMENTS]
        _doc_embeddings = []

        for content in _doc_texts:
            _doc_embeddings.append(_embed(content))

        print(f"[OK]    RAG ready - {len(_doc_embeddings)} document vectors cached.")
    except Exception as exc:
        print(f"[WARN]  RAG initialization failed: {exc}")
        _doc_embeddings = []
        _doc_texts = []


def retrieve_context(destination: str, interests: list[str], k: int = 4) -> str:
    """
    Embed the user's query and return the top-k most relevant knowledge chunks
    as a newline-separated string ready for prompt injection.
    """
    if not _doc_embeddings:
        return ""

    query = f"{destination} travel guide. Interests: {', '.join(interests)}"

    try:
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        query_vec = _embed(query)

        scores = [_cosine_similarity(query_vec, doc_vec) for doc_vec in _doc_embeddings]
        top_indices = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)[:k]

        return "\n\n".join(_doc_texts[i] for i in top_indices)
    except Exception as exc:
        print(f"[WARN]  RAG retrieval error: {exc}")
        return ""
