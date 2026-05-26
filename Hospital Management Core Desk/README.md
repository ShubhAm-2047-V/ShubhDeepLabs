# Hospital Management Core Desk

A unified, interactive Clinical EHR Intake, Doctor Scheduling, and Billing Administration workspace. Styled in a custom retro paper-ruled classroom notebook aesthetic, the application supports digital patient recording, active billing tallies, and prescription vaults.

---

## 🚀 Key Features

1. **Patient Intake & Scheduling:** Book appointments with specific doctor selections, slot times, and reasons for consult.
2. **Billing Ledger:** Auto-compile treatment fees, consult charges, and medication costs into dynamic ledger tallies.
3. **Digital Rx Prescription Vault:** Store clinic diagnosis details, medicine lists, and physician precautions securely.
4. **SSE Live Log Broadcaster:** A retro terminal console monitors all backend operations (DB writes, state transitions, AI checks) in real-time using Server-Sent Events.
5. **Zero-Config Database Fallback:** Connects to MongoDB via Mongoose. If MongoDB is offline or the configuration is missing, the backend automatically transitions to local JSON-based file storage (`database.json`), ensuring it runs perfectly in mock mode.
6. **Gemini AI Diagnosis Auditing:** An AI assistant analyzes patient diagnosis data to audit billing structures or suggest matching clinical prescriptions.

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
MONGODB_URI=mongodb://localhost:27017/hospital_core_desk
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
