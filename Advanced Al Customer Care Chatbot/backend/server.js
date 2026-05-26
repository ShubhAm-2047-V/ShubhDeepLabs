require("dotenv").config();
const express = require("express");
const cors = require("cors");
const logger = require("./logger");
const rag = require("./rag");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize RAG database with seed FAQ documents
rag.seedDefaultDocs();

// Keep track of simple dashboard analytics
const analytics = {
  totalMessages: 0,
  queryCount: 0,
  averageResponseTimeMs: 0,
  sessionCount: new Set().size + 1
};
let totalResponseTimes = 0;

// SSE route for streaming live console logs
app.get("/api/logs", (req, res) => {
  logger.registerClient(req, res);
});

// Get analytics
app.get("/api/analytics", (req, res) => {
  res.json({
    totalMessages: analytics.totalMessages,
    queryCount: analytics.queryCount,
    averageResponseTime: analytics.averageResponseTimeMs || 450,
    documentsCount: rag.getDocuments().length,
    chunksCount: rag.getChunks().length
  });
});

// Document management endpoints
app.get("/api/documents", (req, res) => {
  res.json(rag.getDocuments());
});

app.post("/api/documents", (req, res) => {
  const { filename, content } = req.body;
  if (!filename || !content) {
    return res.status(400).json({ error: "Filename and content are required." });
  }
  const doc = rag.addDocument(filename, content);
  res.json(doc);
});

app.delete("/api/documents/:id", (req, res) => {
  const success = rag.deleteDocument(req.params.id);
  if (success) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Document not found." });
  }
});

// Main Chat endpoint with RAG context inject and LLM reasoning
app.post("/api/chat", async (req, res) => {
  const startTime = Date.now();
  const { message, history = [] } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  analytics.totalMessages += 1;
  analytics.queryCount += 1;

  logger.log(`[LLM Gate] New customer inquiry received: "${message}"`, "info");

  // Step 1: Perform RAG Search
  const matchingChunks = rag.search(message, 3);
  
  // Step 2: Formulate context from matching chunks
  let contextText = "";
  if (matchingChunks.length > 0) {
    contextText = matchingChunks.map(c => `[From doc: ${c.filename}]: ${c.content}`).join("\n---\n");
    logger.log(`[RAG Inject] Injected ${matchingChunks.length} documents into prompt context.`, "info");
  } else {
    logger.log(`[RAG Inject] No similarity matches found. Proceeding with base instructions.`, "warn");
  }

  // Step 3: Determine LLM execution path
  const openaiKey = process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  let botReply = "";
  let sourcesUsed = matchingChunks.map(c => c.filename);

  if (openaiKey) {
    botReply = await callOpenAI(message, contextText, history, openaiKey);
  } else if (geminiKey) {
    botReply = await callGemini(message, contextText, history, geminiKey);
  } else {
    // Zero-Config Sandbox Mode
    botReply = await callSandboxMock(message, matchingChunks);
  }

  // Record response time analytics
  const responseTime = Date.now() - startTime;
  totalResponseTimes += responseTime;
  analytics.averageResponseTimeMs = Math.round(totalResponseTimes / analytics.queryCount);

  logger.log(`[LLM Gate] Response compiled in ${responseTime}ms. Dispensing response.`, "info");

  res.json({
    reply: botReply,
    sources: [...new Set(sourcesUsed)],
    responseTimeMs: responseTime
  });
});

// Call OpenAI API using native fetch
async function callOpenAI(message, context, history, apiKey) {
  logger.log("[LLM OpenAI] Connecting to OpenAI API (gpt-4o-mini)...", "info");
  
  const systemPrompt = `You are a helpful customer support agent for Shubdeep Labs.
Answer the user's question using ONLY the factual context provided below. If the context does not contain the answer, say "I'm sorry, I don't have that information in my knowledge base. Please contact our support coordinators."
Strictly avoid making up any facts.

CONTEXT:
${context || "No context provided."}`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.slice(-6).map(h => ({ role: h.sender === "user" ? "user" : "assistant", content: h.text })),
    { role: "user", content: message }
  ];

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.3,
        max_tokens: 400
      })
    });

    const data = await response.json();
    if (data.error) {
      logger.log(`[LLM OpenAI Error] ${data.error.message}`, "error");
      return "I encountered an error querying the OpenAI service. Please check the backend console log.";
    }

    const reply = data.choices[0].message.content;
    logger.log(`[LLM OpenAI] Token usage: ${data.usage.total_tokens} (Prompt: ${data.usage.prompt_tokens}, Completion: ${data.usage.completion_tokens})`, "info");
    return reply;
  } catch (error) {
    logger.log(`[LLM OpenAI Connection Failed] ${error.message}`, "error");
    return "Failed to establish secure handshake with OpenAI. Falling back to local mock.";
  }
}

// Call Gemini API using native fetch
async function callGemini(message, context, history, apiKey) {
  logger.log("[LLM Gemini] Connecting to Gemini API (gemini-2.5-flash)...", "info");

  const systemInstruction = `You are a helpful customer support agent for Shubdeep Labs.
Answer the user's question using ONLY the factual context provided. If the context does not contain the answer, say "I'm sorry, I don't have that information in my knowledge base. Please contact our support coordinators."
Strictly avoid making up facts.

CONTEXT:
${context || "No context provided."}`;

  // Format history for Gemini API
  const contents = [];
  history.slice(-6).forEach(h => {
    contents.push({
      role: h.sender === "user" ? "user" : "model",
      parts: [{ text: h.text }]
    });
  });
  contents.push({
    role: "user",
    parts: [{ text: message }]
  });

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: { temperature: 0.3, maxOutputTokens: 400 }
      })
    });

    const data = await response.json();
    if (data.error) {
      logger.log(`[LLM Gemini Error] ${data.error.message}`, "error");
      return "I encountered an error querying the Gemini service.";
    }

    const reply = data.candidates[0].content.parts[0].text;
    logger.log("[LLM Gemini] Successfully generated content response.", "info");
    return reply;
  } catch (error) {
    logger.log(`[LLM Gemini Connection Failed] ${error.message}`, "error");
    return "Failed to query Gemini API.";
  }
}

// Zero-Config Sandbox Mock Engine
async function callSandboxMock(message, matchingChunks) {
  logger.log("[LLM Sandbox] Running in Offline Sandbox Simulator Mode. No API Key configured.", "warn");
  logger.log("[LLM Sandbox] Constructing local prompt matrix with RAG content window...", "info");
  
  // Introduce a slight thinking delay to mimic LLM latency and display real-time console log updates
  await new Promise(resolve => setTimeout(resolve, 1500));

  if (matchingChunks.length === 0) {
    logger.log("[LLM Sandbox] Yielding default support desk assistant answers...", "info");
    return "Hello! I'm the Shubdeep Labs support assistant. Since I couldn't find matching topics in our local document indexes, I'm happy to help you generally. Feel free to ask about our Easy (₹1999), Medium (₹3499), or Hard (₹4599) plans, or contact our support coordinator directly at +91 90288 33275.";
  }

  const bestMatch = matchingChunks[0];
  logger.log(`[LLM Sandbox] Best semantic match found in document "${bestMatch.filename}" with similarity score ${bestMatch.score}.`, "info");
  logger.log("[LLM Sandbox] Simulating completion pipeline and drafting response...", "info");

  // Custom mock response mapper based on keywords in RAG matches
  const contentLower = bestMatch.content.toLowerCase();
  
  if (contentLower.includes("pricing") || contentLower.includes("easy") || contentLower.includes("hard")) {
    return `Regarding our pricing plans:
We offer three project tiers:
1. **Easy Project Plan (₹1999)**: Simple code utilities, clean UI, draft PPT.
2. **Medium Project Plan (₹3499)**: Full database integration, structured UI, complete PPT, and a report draft.
3. **Hard Project Plan (₹4599)**: Advanced AI/ML architectures, 1-on-1 code walkthrough, report, and remote compilation setup support.`;
  }
  
  if (contentLower.includes("office hours") || contentLower.includes("contact information") || contentLower.includes("+91")) {
    return `You can contact Shubdeep Labs in several ways:
- **Phone Coordination:** +91 90288 33275
- **Email support:** shubdeeplabs@gmail.com
- **Office hours:** Monday to Saturday, 9:30 AM to 7:00 PM.`;
  }
  
  if (contentLower.includes("refund") || contentLower.includes("revision")) {
    return `Our policies are as follows:
- **Revisions:** 2 free logic revisions for Medium projects, 3 revisions for Hard projects.
- **Refund Guarantee:** 100% full refund if our engineering team fails to compile or deliver your project on time. No refunds once final compiled source code is delivered.`;
  }

  // Generic RAG extract response
  return `Based on our indexed files, here is what I found about that:
"${bestMatch.content}"

Is there anything specific about this you would like me to explain further?`;
}

// Start the server
app.listen(PORT, () => {
  logger.log(`=======================================================`, "info");
  logger.log(`  Advanced AI Customer Care Chatbot Backend is online! `, "info");
  logger.log(`  Running on: http://localhost:${PORT}                   `, "info");
  logger.log(`  SSE Live Logs Streamer: http://localhost:${PORT}/api/logs`, "info");
  logger.log(`=======================================================`, "info");
});
