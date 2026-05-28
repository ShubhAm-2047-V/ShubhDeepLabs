import { NextResponse } from "next/server";
import { dbService } from "@/lib/db";
import { localRAGLookup } from "@/lib/chatbotCore";
import { classifyIntent, generateReply } from "@/lib/gemini";

// Meta webhook verification token
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "shubhdeeplabs_token_123";
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

// Helper to send message via WhatsApp Cloud API
async function sendWhatsAppMessage(phoneNumberId, to, payload) {
  if (!ACCESS_TOKEN) {
    console.log(`[WhatsApp-API-Sim] Outbox to ${to}:`, JSON.stringify(payload, null, 2));
    return { simulated: true };
  }

  const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;
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
        ...payload,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("[WhatsApp-API-Error]", data);
    }
    return data;
  } catch (error) {
    console.error("[WhatsApp-API-Connection-Failed]", error);
    return null;
  }
}

// GET request for Webhook verification from Meta
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("[WhatsApp-Webhook] Verification successful");
      return new Response(challenge, { status: 200 });
    }
    console.warn("[WhatsApp-Webhook] Verification failed: token mismatch");
    return new Response("Forbidden", { status: 403 });
  }

  return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
}

// POST request for handling incoming messages
export async function POST(req) {
  try {
    const body = await req.json();

    // Check if it's a WhatsApp message webhook
    if (body.object !== "whatsapp_business_account") {
      return NextResponse.json({ error: "Not a WhatsApp webhook" }, { status: 400 });
    }

    const entry = body.entry?.[0];
    const change = entry?.changes?.[0]?.value;
    const metadata = change?.metadata;
    const phone_number_id = metadata?.phone_number_id;
    const contact = change?.contacts?.[0];
    const contactName = contact?.profile?.name || "WhatsApp Client";
    const message = change?.messages?.[0];

    if (!message) {
      return NextResponse.json({ status: "ignored" });
    }

    const from = message.from; // User's WhatsApp number
    let query = "";

    // 1. Parse incoming message type (text vs interactive reply)
    if (message.type === "text") {
      query = message.text?.body || "";
    } else if (message.type === "interactive") {
      const interactive = message.interactive;
      if (interactive?.button_reply) {
        query = interactive.button_reply.title || "";
      } else if (interactive?.list_reply) {
        query = interactive.list_reply.title || "";
      }
    }

    if (!query.trim()) {
      return NextResponse.json({ status: "empty query ignored" });
    }

    console.log(`[WhatsApp-Webhook] Incoming message from ${from} (${contactName}): "${query}"`);

    // 2. Get or create session in database
    const session = await dbService.getOrCreateChatSession("whatsapp", from, contactName);

    // Save user's message in the ledger
    await dbService.addChatMessage(session.id, "user", query);

    // 3. Handle manual takeover state
    if (session.status === "Manual Intervention") {
      console.log(`[WhatsApp-Webhook] Chat is in Manual Intervention. AI response suppressed for ${from}.`);
      return NextResponse.json({ status: "delegated to human agent" });
    }

    let payload = {};

    // 4. Custom Flow: Handle structured greetings and selections
    const queryLower = query.toLowerCase().trim();

    if (queryLower === "hi" || queryLower === "hello" || queryLower === "hey" || queryLower.includes("start")) {
      // Send greeting with 3 quick reply buttons (Meta button limits)
      payload = {
        type: "interactive",
        interactive: {
          type: "button",
          body: {
            text: "Hi 👋 Welcome to Shubh Deep Labs. \n\nNeed help selecting your project or finding pricing details?"
          },
          action: {
            buttons: [
              { type: "reply", reply: { id: "get_pricing", title: "Get Pricing" } },
              { type: "reply", reply: { id: "ai_projects", title: "AI Projects" } },
              { type: "reply", reply: { id: "talk_developer", title: "Talk to Developer" } }
            ]
          }
        }
      };
    } else if (queryLower === "get pricing" || queryLower === "pricing" || queryLower === "1") {
      // Send List selector for levels
      payload = {
        type: "interactive",
        interactive: {
          type: "list",
          header: { type: "text", text: "Project Level Selector" },
          body: { text: "What type of project do you need? Click below to select:" },
          footer: { text: "Shubh Deep Labs Pricing" },
          action: {
            button: "Select Level",
            sections: [
              {
                title: "Academic Levels",
                rows: [
                  { id: "cat_diploma", title: "Diploma" },
                  { id: "cat_engineering", title: "Engineering (B.Tech)" },
                  { id: "cat_mtech", title: "M.Tech" },
                  { id: "cat_bca_mca", title: "BCA/MCA" },
                  { id: "cat_ai_ml", title: "AI/ML Specialized" },
                  { id: "cat_android", title: "Android App" }
                ]
              }
            ]
          }
        }
      };
    } else if (queryLower === "ai projects" || queryLower === "2") {
      // Send interactive recommendation list
      payload = {
        type: "text",
        text: {
          body: "🤖 *Shubh Deep Labs AI Recommendations*\n\nEasy Stacks:\n• AI Resume Analyzer\n• Smart Notes Summarizer\n• Expense Tracker\n\nAdvanced Stacks:\n• AI Plant Disease Detector\n• Face Recognition Attendance\n• AI Customer Care Chatbot\n\n_What type of stack interests you?_"
        }
      };
    } else if (queryLower === "talk to developer" || queryLower === "talk to coordinator" || queryLower === "3") {
      // Flag session and notify coordinates
      await dbService.updateChatSessionStatus(session.id, "Manual Intervention");
      
      // Send developer details
      payload = {
        type: "text",
        text: {
          body: "📞 *Developer Connection*\n\nI have paused my AI replies and notified the coordinator. The main developer will reach back to you shortly.\n\nYou can also ring directly at *+91 90288 33275* or email shubdeeplabs@gmail.com."
        }
      };
    } else {
      // 5. Fallback to Gemini AI + RAG core
      const history = await dbService.getChatMessages(session.id);
      const context = localRAGLookup(query);
      const intent = await classifyIntent(query, history.slice(0, -1));

      const aiResponse = await generateReply(
        query,
        history.slice(0, -1), // Exclude the message we just saved to avoid duplicates
        context,
        intent,
        session.id
      );

      payload = {
        type: "text",
        text: { body: aiResponse.replyText }
      };

      // If user asks for urgent compilation or classified as urgent
      if (queryLower.includes("urgent") || queryLower.includes("emergency") || queryLower.includes("asap") || intent === "urgent_delivery") {
        payload.text.body = `⚡ *URGENT COMPILATION DETECTED* ⚡\n\n${payload.text.body}\n\nOur team has been alerted of your tight deadline. Contact coordinates: +91 90288 33275 to lock slot instantly.`;
      }
    }

    // Send the response back to user
    await sendWhatsAppMessage(phone_number_id, from, payload);

    // Save bot's reply in the ledger
    const botReplyText = payload.text?.body || payload.interactive?.body?.text || "[Interactive Option Sent]";
    await dbService.addChatMessage(session.id, "bot", botReplyText);

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("[WhatsApp-Webhook-Post-Failed]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
