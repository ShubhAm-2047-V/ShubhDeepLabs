import { NextResponse } from "next/server";
import { dbService } from "@/lib/db";
import { localRAGLookup } from "@/lib/chatbotCore";
import { classifyIntent, generateReply } from "@/lib/gemini";

export async function POST(req) {
  const logs = [];
  const addLog = (message, level = "info") => {
    const timestamp = new Date().toISOString();
    logs.push({ timestamp, level, message });
    console.log(`[Next-Chatbot] [${level.toUpperCase()}] ${message}`);
  };

  try {
    const { message, sessionId = "web-anon-default", contactName = "Website Visitor" } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    addLog(`[Web-Chat] Incoming message from session ${sessionId}: "${message}"`, "info");

    // 1. Get or create website chat session
    const session = await dbService.getOrCreateChatSession("website", sessionId, contactName);

    // Save user's message in the ledger
    await dbService.addChatMessage(session.id, "user", message);

    // 2. Respect manual intervention takeover
    if (session.status === "Manual Intervention") {
      addLog(`[Web-Chat] Chat session ${sessionId} is in Manual Intervention. AI reply suppressed.`, "info");
      return NextResponse.json({
        reply: "Developer will contact you shortly.",
        isManualIntervention: true,
        logs
      });
    }

    // 3. Retrieve active pricing config for dynamic RAG lookup
    let prices = {};
    try {
      prices = await dbService.getCustomizerPrices();
    } catch (e) {
      addLog(`Failed to fetch customizer prices for RAG lookup: ${e.message}`, "error");
    }

    // Perform local RAG context matching with dynamic prices
    const matchedContext = localRAGLookup(message, prices);

    // 4. Retrieve historical messages for context
    const history = await dbService.getChatMessages(session.id);

    // 5. Classify Intent
    const intent = await classifyIntent(message, history.slice(0, -1));
    addLog(`[Web-Chat] Classified intent: "${intent}"`, "info");

    // 6. Generate Reply using Intent Engine
    const result = await generateReply(
      message, 
      history.slice(0, -1), // Exclude the user message we just saved
      matchedContext, 
      intent, 
      session.id
    );

    // Save bot reply in database
    await dbService.addChatMessage(session.id, "bot", result.replyText);

    return NextResponse.json({
      reply: result.replyText,
      selections: result.selections,
      lead: result.lead,
      isManualIntervention: result.escalated || false,
      logs,
      responseTimeMs: 0
    });

  } catch (err) {
    addLog(`[Web-Chat-Error] Failed to process message: ${err.message}`, "error");
    return NextResponse.json({ error: "Server error: " + err.message }, { status: 500 });
  }
}

// GET endpoint to fetch chat history for a session
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId parameter is required." }, { status: 400 });
    }

    const session = await dbService.getOrCreateChatSession("website", sessionId, "Website Visitor");
    const messages = await dbService.getChatMessages(session.id);

    return NextResponse.json({
      session,
      messages
    });
  } catch (err) {
    return NextResponse.json({ error: "Server error: " + err.message }, { status: 500 });
  }
}
