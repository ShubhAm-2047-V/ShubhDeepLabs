# Expense Tracker with AI Insights

A personal finance portal offering automated category tagging, monthly budget forecasting, and AI-driven spending recommendations. Styled in a custom retro paper-ruled classroom notebook aesthetic, the application supports detailed transaction logging, budget progress gauges, category breakdowns, and a real-time terminal console broadcasting reasoning logs.

---

## 🚀 Key Features

1. **Transaction Intake:** Log description, amount, category tags, and incomes vs expenses.
2. **Auto-Category Tagging:** Auto-detects keywords (like "pizza" -> Food, "uber" -> Travel) to auto-select matching categories.
3. **Utilization Progress Bar:** A visual gauge check comparing total spent against budget thresholds with status trigger colors.
4. **SSE Live Log Broadcaster:** A retro terminal console monitors all backend operations (DB writes, state transitions, AI checks) in real-time using Server-Sent Events.
5. **Zero-Config Database Fallback:** Connects to MongoDB via Mongoose. If MongoDB is offline or the configuration is missing, the backend automatically transitions to local JSON-based file storage (`database.json`), ensuring it runs perfectly in mock mode.
6. **Gemini AI Spending Reports:** Queries the insights API to render financial saving advisories with live console monitors.

---

## 🛠️ Tech Stack

* **Frontend:** React, Vite, Lucide Icons, Vanilla CSS
* **Backend:** Node.js, Express, Server-Sent Events (SSE)
* **Database:** MongoDB (via Mongoose) with a local JSON storage engine fallback
* **AI Engine:** Gemini 2.5 Flash API via native fetch

---

## ⚡ Setup & Run

### 1. Backend Configuration
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense_tracker
GEMINI_API_KEY=your_gemini_api_key_here
```
*Note: If no database or AI key is provided, the server runs in offline fallback mode using `database.json` and a diagnostic mock assistant.*

### 2. Install & Run
From the root directory, run:
```bash
# Install dependencies for all folders
npm run install:all

# Start both frontend & backend concurrently
npm start
```
Open [http://localhost:5173](http://localhost:5173) in your browser to inspect the application dashboard.
