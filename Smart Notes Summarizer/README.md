# 📓 Smart Notes Summarizer

> AI-powered study assistant that transforms your notes into structured summaries, core concepts, and interactive flashcards using Gemini 2.5 Flash.

## ✨ Features

- **AI Summarization** — Gemini 2.5 Flash analyzes your notes and generates structured Markdown summaries
- **Core Concepts Extraction** — Bullet-pointed key concepts highlighted from your content
- **Interactive Flashcards** — Flip-to-reveal Q&A study cards for active recall
- **CSV Export** — Export flashcards for import into Anki or any spaced repetition system
- **Live Backend Logs** — Real-time SSE terminal streaming from the FastAPI server
- **Analytics Dashboard** — Track sessions, words processed, and cards created
- **Offline Fallback** — Works without an API key using a local rules-based summarizer

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+ or Bun
- Gemini API key (optional — offline mode works without it)

### 1. Install Dependencies

```bash
# Install frontend dependencies
bun run install:frontend

# Install backend dependencies
bun run install:backend
# (or manually: cd backend && pip install -r requirements.txt)
```

### 2. Configure API Key

```bash
# Copy the example env file
cp backend/.env.example backend/.env

# Edit backend/.env and add your Gemini API key
GEMINI_API_KEY=your_key_here
```

### 3. Start the App

```bash
# Start both frontend and backend concurrently
bun run dev

# Or start separately:
bun run dev:backend   # FastAPI on :8000
bun run dev:frontend  # Vite React on :5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🏗️ Architecture

```
Smart Notes Summarizer/
├── backend/
│   ├── main.py           # FastAPI: /api/summarize, /api/logs (SSE), /api/analytics
│   ├── requirements.txt
│   └── .env              # GEMINI_API_KEY
└── frontend/
    ├── src/
    │   ├── App.jsx       # Main React component
    │   └── index.css     # Notebook paper theme
    ├── vite.config.js    # Proxies /api → :8000
    └── index.html
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check + config status |
| `POST` | `/api/summarize` | Summarize notes (body: `{notesText}`) |
| `GET` | `/api/logs` | SSE stream of backend logs |
| `GET` | `/api/analytics` | Session analytics data |
| `POST` | `/api/reset` | Reset analytics |
