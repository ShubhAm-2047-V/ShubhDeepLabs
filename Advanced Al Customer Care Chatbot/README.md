# Advanced AI Customer Care Chatbot with RAG

An intelligent customer support messaging workspace featuring **Customizable Document Indexing (RAG)** and a **Real-Time Interactive Console Log Viewer**. 

This system allows businesses to upload unstructured text documents (FAQs, guidelines, support articles), instantly index them locally using a lightweight vector similarity engine, and query them using generative AI with complete transparency over the prompt construction and search process.

---

## 🚀 Key Features

1. **Intelligent Messaging Canvas:** Interactive conversation console with status indicators, visual message bubbles, and quick-reply triggers.
2. **Custom Document Indexer (RAG):** Upload and parse custom text guides. Splices documents into chunks and calculates relevance scores during user queries.
3. **Retro Terminal Log Console:** Streams real-time backend reasoning logs via Server-Sent Events (SSE). View the exact search criteria, cosine similarity scores, context construction, and LLM API parameters for every interaction.
4. **Offline Mock Reasoner:** Runs out-of-the-box in sandbox mode with zero configurations or API keys required, making it highly testable and presentation-friendly.

---

## 🛠️ Tech Stack

* **Frontend:** React, Vite, Tailwind CSS, Lucide Icons, Framer Motion
* **Backend:** Node.js, Express.js, SSE (Server-Sent Events) log broadcaster
* **AI/RAG:** In-memory TF-IDF / Cosine Similarity string indexer, integration with OpenAI & Gemini APIs

---

## ⚡ Setup & Run

### 1. Configure API Keys (Optional)
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
OPENAI_API_KEY=your_openai_api_key
# OR
GEMINI_API_KEY=your_gemini_api_key
```
*Note: If no API keys are provided, the chatbot falls back to a sandbox simulator that outputs realistic, step-by-step reasoning logs and response templates.*

### 2. Install & Run
From this directory, run:
```bash
# Install dependencies for all folders
npm run install:all

# Start both frontend & backend concurrently
npm start
```
Open [http://localhost:5173](http://localhost:5173) in your browser to inspect the application dashboard.
