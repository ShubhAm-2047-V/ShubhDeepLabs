require("dotenv").config();
const express = require("express");
const cors = require("cors");
const logger = require("./logger");
const db = require("./database");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Database
db.init();

// SSE Route for Streaming logs
app.get("/api/logs", (req, res) => {
  logger.registerClient(req, res);
});

// Reset database route
app.post("/api/reset", async (req, res) => {
  try {
    await db.reset();
    res.json({ success: true, message: "Database reset to seeds successfully" });
  } catch (error) {
    logger.log(`[Server Error] Database reset failed: ${error.message}`, "error");
    res.status(500).json({ error: error.message });
  }
});

// Analytics Route
app.get("/api/analytics", async (req, res) => {
  try {
    const apts = await db.getAppointments();
    const invs = await db.getInvoices();
    const rxs = await db.getPrescriptions();

    const pendingApts = apts.filter(a => a.status === "Scheduled").length;
    const completedApts = apts.filter(a => a.status === "Completed").length;
    const totalRevenue = invs
      .filter(i => i.status === "Paid")
      .reduce((sum, item) => sum + item.total, 0);

    res.json({
      pendingAppointments: pendingApts,
      completedAppointments: completedApts,
      totalRevenue: totalRevenue,
      prescriptionsCount: rxs.length,
      isMongo: db.isMongoEngine()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- APPOINTMENTS ENDPOINTS ---
app.get("/api/appointments", async (req, res) => {
  try {
    const list = await db.getAppointments();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/appointments", async (req, res) => {
  try {
    const { patientName, doctorName, date, slot, reason } = req.body;
    if (!patientName || !doctorName || !reason) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const aptDate = date || new Date().toLocaleDateString();
    const aptSlot = slot || "10:00 AM";
    const apt = await db.addAppointment({ patientName, doctorName, date: aptDate, slot: aptSlot, reason });
    res.json(apt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/appointments/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const apt = await db.updateAppointment(req.params.id, { status });
    res.json(apt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/appointments/:id", async (req, res) => {
  try {
    const result = await db.deleteAppointment(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- INVOICES ENDPOINTS ---
app.get("/api/invoices", async (req, res) => {
  try {
    const list = await db.getInvoices();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/invoices", async (req, res) => {
  try {
    const { patientName, consultFee, treatmentFee, medFee } = req.body;
    if (!patientName) {
      return res.status(400).json({ error: "Patient name is required" });
    }
    const consult = parseFloat(consultFee) || 0;
    const treat = parseFloat(treatmentFee) || 0;
    const meds = parseFloat(medFee) || 0;
    const total = consult + treat + meds;
    const date = new Date().toLocaleDateString();

    const inv = await db.addInvoice({ patientName, consultFee: consult, treatmentFee: treat, medFee: meds, total, status: "Unpaid", date });
    res.json(inv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/invoices/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const inv = await db.updateInvoice(req.params.id, { status });
    res.json(inv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/invoices/:id", async (req, res) => {
  try {
    const result = await db.deleteInvoice(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- PRESCRIPTIONS ENDPOINTS ---
app.get("/api/prescriptions", async (req, res) => {
  try {
    const list = await db.getPrescriptions();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/prescriptions", async (req, res) => {
  try {
    const { patientName, diagnosis, medicines, notes } = req.body;
    if (!patientName || !diagnosis || !medicines) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const date = new Date().toLocaleDateString();
    const rx = await db.addPrescription({ patientName, diagnosis, medicines, notes: notes || "No extra precautions.", date });
    res.json(rx);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/prescriptions/:id", async (req, res) => {
  try {
    const result = await db.deletePrescription(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- AI CLINICAL DIAGNOSIS ENDPOINT ---
app.post("/api/ai-diagnose", async (req, res) => {
  const { diagnosis } = req.body;
  if (!diagnosis || !diagnosis.trim()) {
    return res.status(400).json({ error: "Diagnosis text is required" });
  }

  logger.log(`[AI Clinical Assistant] Processing request for diagnosis: "${diagnosis}"`, "info");
  
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      logger.log(`[AI Clinical Assistant] Connecting to Gemini API (gemini-2.5-flash)...`, "info");
      const result = await queryGemini(diagnosis, geminiKey);
      res.json(result);
    } catch (error) {
      logger.log(`[AI Clinical Assistant Failed] ${error.message}. Triggering rules-based mock fallback.`, "warn");
      const fallback = mockClinicalAssistant(diagnosis);
      res.json(fallback);
    }
  } else {
    logger.log(`[AI Clinical Assistant] GEMINI_API_KEY not configured. Dispensing local rules-based recommendations.`, "info");
    const result = mockClinicalAssistant(diagnosis);
    // Simulate delay for realism
    await new Promise(resolve => setTimeout(resolve, 800));
    res.json(result);
  }
});

// Native Fetch implementation to call Gemini
async function queryGemini(diagnosis, apiKey) {
  const systemInstruction = `You are a clinical assistant helping a physician construct prescriptions.
Given a diagnosis, suggest:
1. Recommended medicines (concise bullet list with standard mock dosages like "Tab Paracetamol 500mg 1-0-1").
2. General precautions/lifestyle instructions (concise bullet list).

Make the formatting neat and short, using simple plain text. DO NOT write an introduction or conversational text. Return exactly in the format:
MEDICINES:
- Medicine A (Dosage)
- Medicine B (Dosage)
ADVICE:
- Instruction A
- Instruction B`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: `Diagnosis: ${diagnosis}` }] }],
      systemInstruction: { parts: [{ text: systemInstruction }] },
      generationConfig: { temperature: 0.2, maxOutputTokens: 300 }
    })
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message);
  }

  const responseText = data.candidates[0].content.parts[0].text;
  logger.log(`[AI Clinical Assistant] Suggestions generated successfully.`, "success");
  
  return parseGeminiResponse(responseText);
}

// Helper to split Gemini's plaintext output
function parseGeminiResponse(text) {
  let medicines = "";
  let advice = "";

  if (text.includes("MEDICINES:") && text.includes("ADVICE:")) {
    const parts = text.split("ADVICE:");
    medicines = parts[0].replace("MEDICINES:", "").trim();
    advice = parts[1].trim();
  } else {
    medicines = text;
    advice = "Rest, drink warm fluids, and follow up in 3 days.";
  }

  return { medicines, advice };
}

// Local rules-based database for sandbox mock running
function mockClinicalAssistant(diagnosis) {
  const query = diagnosis.toLowerCase();
  let medicines = "";
  let advice = "";

  if (query.includes("sprain") || query.includes("fracture") || query.includes("pain") || query.includes("injury")) {
    medicines = "- Tab Combiflam 1-0-1 (Post meals)\n- Apply Volini Gel 3 times daily";
    advice = "- Elevate the injured area\n- Apply ice packs for 15 minutes 3 times daily\n- Rest and avoid heavy movement";
  } else if (query.includes("fever") || query.includes("flu") || query.includes("cold") || query.includes("cough")) {
    medicines = "- Tab Paracetamol 650mg 1-1-1 (SOS for fever)\n- Cough Syrup Solvin-C 5ml 0-0-1";
    advice = "- Drink plenty of warm water\n- Perform steam inhalation twice daily\n- Complete bed rest for 48 hours";
  } else if (query.includes("stomach") || query.includes("gastritis") || query.includes("acidity") || query.includes("infection")) {
    medicines = "- Tab Pantocid 40mg 1-0-0 (Empty stomach)\n- Tab Digene (Chewable) 1-1-1";
    advice = "- Eat light food (Khichdi, curd-rice)\n- Drink plenty of coconut water\n- Avoid spicy, oily, and processed foods";
  } else {
    medicines = "- Tab Multivitamin (Zinc & C) 0-1-0\n- Tab Paracetamol 500mg 1-0-1 (If pain exists)";
    advice = "- Take adequate rest\n- Keep well hydrated (2.5L+ fluids)\n- Monitor symptoms and visit clinic if pain worsens";
  }

  return { medicines, advice };
}

// Launch Express Server
app.listen(PORT, () => {
  logger.log(`=======================================================`, "info");
  logger.log(`  Hospital Core Desk Server running on Port ${PORT}`, "info");
  logger.log(`  Real-Time SSE Broadcasting Active on /api/logs`, "info");
  logger.log(`=======================================================`, "info");
});
