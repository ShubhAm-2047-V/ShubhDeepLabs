import { NextResponse } from "next/server";
import { dbService } from "@/lib/supabase";

const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "default";

// Helper to send message via WhatsApp Cloud API
async function sendWhatsAppMessage(to, text) {
  if (!ACCESS_TOKEN) {
    console.log(`[WhatsApp-Admin-Sim] Manual Outbox to ${to}: "${text}"`);
    return { simulated: true };
  }

  const url = `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: { body: text },
      }),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("[WhatsApp-Admin-API-Error]", error);
    return null;
  }
}

// GET: Fetch all active sessions or messages for a session
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (sessionId) {
      const messages = await dbService.getChatMessages(sessionId);
      return NextResponse.json({ messages });
    }

    const sessions = await dbService.getChatSessions();
    return NextResponse.json({ sessions });
  } catch (err) {
    return NextResponse.json({ error: "Server error: " + err.message }, { status: 500 });
  }
}

// POST: Admin sends a manual message
export async function POST(req) {
  try {
    const { sessionId, messageText } = await req.json();

    if (!sessionId || !messageText) {
      return NextResponse.json({ error: "Missing sessionId or messageText" }, { status: 400 });
    }

    // 1. Fetch the session details to check type
    const sessions = await dbService.getChatSessions();
    const session = sessions.find(s => s.id === sessionId);

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // 2. Save the message to DB as 'admin'
    const savedMessage = await dbService.addChatMessage(sessionId, "admin", messageText);

    // 3. For WhatsApp sessions, forward message to the Meta API
    if (session.session_type === "whatsapp" || session.sessionType === "whatsapp") {
      const recipientNumber = session.session_key || session.sessionKey;
      await sendWhatsAppMessage(recipientNumber, messageText);
    }

    return NextResponse.json({ success: true, message: savedMessage });
  } catch (err) {
    return NextResponse.json({ error: "Server error: " + err.message }, { status: 500 });
  }
}

// PUT: Toggle AI status (AI Bot vs Manual Intervention)
export async function PUT(req) {
  try {
    const { sessionId, status } = await req.json();

    if (!sessionId || !status) {
      return NextResponse.json({ error: "Missing sessionId or status" }, { status: 400 });
    }

    await dbService.updateChatSessionStatus(sessionId, status);
    return NextResponse.json({ success: true, status });
  } catch (err) {
    return NextResponse.json({ error: "Server error: " + err.message }, { status: 500 });
  }
}
