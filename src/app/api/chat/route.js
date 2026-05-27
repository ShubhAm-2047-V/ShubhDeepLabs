import { NextResponse } from "next/server";

export async function POST(req) {
  const logs = [];
  const addLog = (message, level = "info") => {
    const timestamp = new Date().toISOString();
    logs.push({ timestamp, level, message });
    console.log(`[Next-Chatbot] [${level.toUpperCase()}] ${message}`);
  };

  try {
    const { message, history = [], context = "", apiKey } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    addLog(`[LLM Gate] New customer inquiry received: "${message}"`, "info");

    if (context) {
      addLog(`[RAG Context] Loaded context chunks into prompt matrix.`, "info");
    } else {
      addLog(`[RAG Context] No matching document context found. Using baseline knowledge.`, "warn");
    }

    const geminiKey = apiKey || process.env.GEMINI_API_KEY;
    let reply = "";

    if (geminiKey) {
      addLog("[LLM Gemini] Handshaking with Gemini API...", "info");

      const systemInstruction = `You are a helpful customer support agent for Shubdeep Labs.
Answer the user's question using ONLY the factual context provided. If the context does not contain the answer, say "I'm sorry, I don't have that information in my knowledge base. Please contact our support coordinators."
Strictly avoid making up facts.

CONTEXT:
${context || "No context provided."}`;

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
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;
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
          addLog(`[LLM Gemini Error] ${data.error.message}`, "error");
          reply = "I encountered an error querying the Gemini service.";
        } else {
          reply = data.candidates[0].content.parts[0].text;
          addLog("[LLM Gemini] Response received and parsed successfully.", "info");
        }
      } catch (error) {
        addLog(`[LLM Gemini Connection Failed] ${error.message}`, "error");
        reply = "Failed to query Gemini API.";
      }
    } else {
      // Sandbox Simulator Mode
      addLog("[LLM Sandbox] Running in Offline Sandbox Simulator Mode. No GEMINI_API_KEY configured.", "warn");
      addLog("[LLM Sandbox] Simulating reasoning and prompt compilation steps...", "info");

      // Artificial Delay
      await new Promise(resolve => setTimeout(resolve, 1200));

      if (!context) {
        addLog("[LLM Sandbox] Yielding baseline support assistant responses...", "info");
        reply = "Hello! I'm the Shubdeep Labs support assistant. Since I couldn't find matching topics in our local document indexes, I'm happy to help you generally. Feel free to ask about our Easy (₹1999), Medium (₹3499), or Hard (₹4599) plans, or contact our support coordinator directly at +91 90288 33275.";
      } else {
        addLog("[LLM Sandbox] Resolving keywords from matched RAG context...", "info");
        const contextLower = context.toLowerCase();
        
        if (contextLower.includes("pricing") || contextLower.includes("easy") || contextLower.includes("hard")) {
          reply = `Regarding our pricing plans:
We offer three project tiers:
1. **Easy Project Plan (₹1999)**: Simple code utilities, clean UI, draft PPT.
2. **Medium Project Plan (₹3499)**: Full database integration, structured UI, complete PPT, and a report draft.
3. **Hard Project Plan (₹4599)**: Advanced AI/ML architectures, 1-on-1 code walkthrough, report, and remote compilation setup support.`;
        } else if (contextLower.includes("office hours") || contextLower.includes("contact information") || contextLower.includes("+91")) {
          reply = `You can contact Shubdeep Labs in several ways:
- **Phone Coordination:** +91 90288 33275
- **Email support:** shubdeeplabs@gmail.com
- **Office hours:** Monday to Saturday, 9:30 AM to 7:00 PM.`;
        } else if (contextLower.includes("refund") || contextLower.includes("revision")) {
          reply = `Our policies are as follows:
- **Revisions:** 2 free logic revisions for Medium projects, 3 revisions for Hard projects.
- **Refund Guarantee:** 100% full refund if our engineering team fails to compile or deliver your project on time. No refunds once final compiled source code is delivered.`;
        } else {
          // Extract matching fragment
          reply = `Based on our indexed files, here is what I found about that:
${context.split('\n---')[0]}

Is there anything specific about this you would like me to explain further?`;
        }
        addLog("[LLM Sandbox] Successfully generated simulated response matching context.", "info");
      }
    }

    addLog(`[LLM Gate] Dispatching response back to chat canvas.`, "info");

    return NextResponse.json({
      reply,
      logs,
      responseTimeMs: 0
    });

  } catch (err) {
    addLog(`[LLM Gate Error] Failed to parse request: ${err.message}`, "error");
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
