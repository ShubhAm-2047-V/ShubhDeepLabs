import os
import json
import asyncio
import time
from datetime import datetime
from typing import AsyncGenerator

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

load_dotenv()

app = FastAPI(title="Smart Notes Summarizer API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"

# In-memory analytics store
analytics = {
    "total_summaries": 0,
    "total_words_processed": 0,
    "total_flashcards_created": 0,
    "sessions": [],
}

# SSE log queue for real-time streaming
log_queue: asyncio.Queue = asyncio.Queue()

def push_log(message: str, level: str = "info"):
    """Push a log entry to the SSE queue."""
    entry = {
        "timestamp": datetime.now().strftime("%H:%M:%S"),
        "level": level,
        "message": message
    }
    try:
        log_queue.put_nowait(entry)
    except asyncio.QueueFull:
        pass
    print(f"[{level.upper()}] {message}")


# ─────────────────────────────────────────────
# Models
# ─────────────────────────────────────────────

class SummarizeRequest(BaseModel):
    notesText: str


# ─────────────────────────────────────────────
# Utility: Gemini NLP Summarization
# ─────────────────────────────────────────────

async def call_gemini(notes_text: str) -> dict:
    """Call the Gemini API to analyze notes."""
    system_prompt = """You are an expert AI Study Assistant.
Analyze the user's study notes and generate:
1. A structured summary in Markdown format.
2. A bulleted list of 4-6 key core concepts extracted from the notes.
3. A list of 4-5 interactive study flashcards (Q&A style).

Return EXACTLY in this format (no intro text, no markdown code blocks):
SUMMARY:
[Structured markdown summary here]
CONCEPTS:
- Concept A: Brief description
- Concept B: Brief description
FLASHCARDS:
Q: Question text
A: Answer text
Q: Question text 2
A: Answer text 2

Be precise, educational, and easy to understand."""

    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": f"Study Notes:\n\n{notes_text}"}]
            }
        ],
        "systemInstruction": {
            "parts": [{"text": system_prompt}]
        },
        "generationConfig": {
            "temperature": 0.25,
            "maxOutputTokens": 1024,
        }
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(GEMINI_URL, json=payload)
        response.raise_for_status()
        data = response.json()

    raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
    return parse_gemini_output(raw_text)


def parse_gemini_output(text: str) -> dict:
    """Parse Gemini output into structured sections."""
    summary = ""
    concepts = ""
    flashcards = []

    try:
        parts = text.split("CONCEPTS:")
        summary = parts[0].replace("SUMMARY:", "").strip()

        if len(parts) > 1:
            concept_flash = parts[1].split("FLASHCARDS:")
            concepts = concept_flash[0].strip()

            if len(concept_flash) > 1:
                cards_raw = concept_flash[1].strip().split("Q:")
                for card in cards_raw:
                    card = card.strip()
                    if "A:" in card:
                        qa = card.split("A:", 1)
                        question = qa[0].strip()
                        answer = qa[1].strip()
                        if question and answer:
                            flashcards.append({"question": question, "answer": answer})
    except Exception as e:
        push_log(f"[Parser] Failed to parse Gemini output: {e}", "warn")
        summary = text
        concepts = "- Core concepts could not be extracted."
        flashcards = [{"question": "What is the main topic?", "answer": "Review the summary above."}]

    return {"summary": summary, "concepts": concepts, "flashcards": flashcards}


def mock_summarizer(text: str) -> dict:
    """Local rules-based fallback when no API key is available."""
    word_count = len(text.split())
    sentences = [s.strip() for s in text.replace("!", ".").replace("?", ".").split(".") if s.strip()]
    lead = sentences[0] if sentences else "Notes uploaded."

    summary = f"""## 📝 AI Study Summary (Offline Mode)

> *Running in local sandbox — connect a Gemini API key for enhanced analysis.*

This document contains **{word_count} words** across **{len(sentences)} sentences**.

### Core Objective
- {lead}

### Key Insights
- **Volume Assessment:** {'Brief note' if word_count < 100 else 'Detailed study content'} detected ({word_count} words).
- **Depth Score:** {'Surface-level' if len(sentences) < 5 else 'In-depth'} material.
- **Recommendation:** Review each flashcard 3x for best retention.

### Study Strategy
> Use the Pomodoro technique: 25 minutes study, 5 minutes review of these flashcards."""

    concepts = f"""- **Primary Subject:** {lead[:60]}{'...' if len(lead) > 60 else ''}
- **Word Density:** {word_count} words across {len(sentences)} sentences
- **Study Mode:** Active recall via flashcard review
- **Retention Method:** Spaced repetition recommended
- **Focus Area:** Identify key terms and review definitions"""

    flashcards = [
        {"question": "What is the primary topic of these notes?", "answer": lead},
        {"question": "How many words does this study set contain?", "answer": f"{word_count} words"},
        {"question": "What study technique maximizes retention from notes?", "answer": "Active recall + spaced repetition — review flashcards 3 times at increasing intervals."},
        {"question": "How many sentences were analyzed?", "answer": f"{len(sentences)} sentences were identified in the notes."},
    ]

    return {"summary": summary, "concepts": concepts, "flashcards": flashcards}


# ─────────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────────

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Smart Notes Summarizer",
        "gemini_configured": bool(GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here"),
        "timestamp": datetime.now().isoformat()
    }


@app.post("/api/summarize")
async def summarize_notes(request: SummarizeRequest):
    """Main summarization endpoint."""
    notes_text = request.notesText.strip()
    if not notes_text:
        raise HTTPException(status_code=400, detail="Notes content cannot be empty.")

    word_count = len(notes_text.split())
    push_log(f"📥 Received notes for analysis ({word_count} words, {len(notes_text)} chars)", "info")

    start_time = time.time()

    if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here":
        push_log("🤖 Connecting to Gemini 2.5 Flash NLP engine...", "info")
        try:
            result = await call_gemini(notes_text)
            push_log("✅ Gemini analysis complete. Parsing structured output...", "success")
            mode = "gemini"
        except Exception as e:
            push_log(f"⚠️ Gemini API error: {str(e)[:80]}. Falling back to offline mode.", "warn")
            result = mock_summarizer(notes_text)
            mode = "offline_fallback"
    else:
        push_log("🔵 No Gemini API key found. Running in Offline Sandbox Mode.", "warn")
        await asyncio.sleep(0.8)  # Simulated processing delay
        result = mock_summarizer(notes_text)
        mode = "offline"

    elapsed = round(time.time() - start_time, 2)
    push_log(f"📊 Generated {len(result['flashcards'])} flashcards in {elapsed}s", "info")

    # Update analytics
    analytics["total_summaries"] += 1
    analytics["total_words_processed"] += word_count
    analytics["total_flashcards_created"] += len(result["flashcards"])
    analytics["sessions"].append({
        "timestamp": datetime.now().isoformat(),
        "words": word_count,
        "flashcards": len(result["flashcards"]),
        "mode": mode,
        "elapsed_s": elapsed
    })
    # Keep only last 50 sessions
    analytics["sessions"] = analytics["sessions"][-50:]

    push_log(f"🎉 Session complete! Total summaries generated: {analytics['total_summaries']}", "success")

    return {
        "summary": result["summary"],
        "concepts": result["concepts"],
        "flashcards": result["flashcards"],
        "meta": {
            "word_count": word_count,
            "flashcard_count": len(result["flashcards"]),
            "mode": mode,
            "elapsed_s": elapsed
        }
    }


@app.get("/api/logs")
async def stream_logs():
    """SSE endpoint that streams live backend logs to the frontend terminal."""
    async def log_generator() -> AsyncGenerator[str, None]:
        # Send a heartbeat first
        yield f"data: {json.dumps({'timestamp': datetime.now().strftime('%H:%M:%S'), 'level': 'info', 'message': '🟢 Notes Summarizer backend connected. Ready for analysis.'})}\n\n"
        
        while True:
            try:
                log_entry = await asyncio.wait_for(log_queue.get(), timeout=20.0)
                yield f"data: {json.dumps(log_entry)}\n\n"
            except asyncio.TimeoutError:
                # Send keepalive comment
                yield ": keepalive\n\n"

    return StreamingResponse(
        log_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )


@app.get("/api/analytics")
async def get_analytics():
    """Return current analytics data."""
    return {
        "total_summaries": analytics["total_summaries"],
        "total_words_processed": analytics["total_words_processed"],
        "total_flashcards_created": analytics["total_flashcards_created"],
        "avg_words_per_session": round(
            analytics["total_words_processed"] / max(analytics["total_summaries"], 1)
        ),
        "recent_sessions": analytics["sessions"][-10:]
    }


@app.post("/api/reset")
async def reset_analytics():
    """Reset all analytics data."""
    analytics["total_summaries"] = 0
    analytics["total_words_processed"] = 0
    analytics["total_flashcards_created"] = 0
    analytics["sessions"] = []
    push_log("🔄 Analytics data reset by user.", "info")
    return {"status": "reset", "message": "All analytics have been cleared."}
