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

      const systemInstruction = `You are the official Customer Support AI Assistant for Shubdeep Labs, an academic project consultation desk.
Your goals are to answer visitor questions regarding projects, pricing, and deadlines, suggest suitable project recommendations, and naturally collect client leads.

CHATBOT RULES:
1. ONLY answer academic project-related or Shubdeep Labs-related questions. Strictly avoid answering unrelated general knowledge questions.
2. Suggest suitable projects based on user academic level:
   - Easy Project Recommendations: AI Resume Analyzer, Smart Notes Summarizer, AI Background Remover, Expense Tracker, AI Color Palette Generator, Portfolio Builder, Mock Interview AI.
   - Advanced Project Recommendations: AI Plant Disease Detector, Face Recognition Attendance System, AI Customer Support Chatbot, Hospital Management System, RFID Attendance Portal, Blockchain Voting System.
3. Recommend add-ons (PPT presentation, Thesis report, Viva guidance sheet, remote Setup on Zoom, Cloud deployment, Code walkthrough) when useful.
4. Keep your answers crisp, short, friendly, and extremely clear.
5. Conversational Lead Collection: Ask lead collection questions NATURALLY in a conversational flow, one at a time when appropriate:
   - What type of project do you need?
   - What is your course?
   - What features do you need?
   - What is your deadline?
   - What is your approximate budget?
   - Do you need PPT or report?
   - Share your WhatsApp number for detailed discussion.
6. Highly Complex/Out-of-Scope Requests: If a user asks for an extremely complex project that goes far beyond a standard academic project (e.g., creating a complete multiplayer game like BGMI, high-end 3D MMOs, or full enterprise systems), do not just say it is too complex or refuse repeatedly. Politely explain that it exceeds a standard academic project scope/budget, and immediately tell the user to contact the OWNER/COORDINATOR directly at +91 90288 33275 (or via WhatsApp: https://wa.me/919028833275) to discuss custom feasibility, specifications, and special custom high-end costing!
7. Project Pricing & Customizer Integrations: When a user asks about pricing, costing, or details of a project:
   a. Analyze the project: Determine the academic level/category, the likely tech stack needed, and any useful add-ons or timelines.
   b. Provide a clean estimated pricing breakdown (using the exact rates above: e.g. Diploma starting at ₹2499, React is +₹1499, Python+Flask +₹999, ML Model +₹3499, OpenCV +₹2999, etc.). Show the sum total estimate clearly!
   c. ALWAYS append a structured customizer tag at the absolute end of your response in the EXACT format below. Keep it strictly on a single line at the very end of your response, replacing options with the matched ids:
      [CUSTOMIZER: {"category":"<category_id>","tech":["<tech_id_1>","<tech_id_2>"],"addons":["<addon_id_1>"],"timeline":"<timeline_id>"}]
      Match the option IDs exactly:
      - category: "diploma", "engineering", "mtech", "bca-mca", "ai-ml", "android"
      - tech: "html", "python-flask", "react", "nextjs", "mern", "android-dev", "firebase", "db", "ai-integration", "ml-model", "opencv", "fullstack", "blockchain"
      - addons: "ppt", "report", "viva", "remote", "deployment", "docs"
      - timeline: "urgent", "normal", "relaxed", "flexible"

CONTEXT DATABASE (RAG MATCHES):
${context || "No matching context found. Rely on the factual details of Shubdeep Labs: Diploma starts from ₹2499, B.E./B.Tech from ₹4999, BCA/MCA from ₹3999, AI/ML from ₹6999, Android from ₹5499. Easy stack add-ons like HTML/CSS/JS are ₹0. PPT is ₹499, thesis report ₹999. Customization is always supported."}`;

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
            generationConfig: { temperature: 0.3, maxOutputTokens: 800 }
          })
        });

        const data = await response.json();
        if (data.error) {
          addLog(`[LLM Gemini Error] ${data.error.message}`, "error");
          reply = `I encountered an error querying the Gemini service: ${data.error.message}`;
        } else {
          reply = data.candidates[0].content.parts[0].text;
          addLog("[LLM Gemini] Response received and parsed successfully.", "info");
        }
      } catch (error) {
        addLog(`[LLM Gemini Connection Failed] ${error.message}`, "error");
        reply = `Failed to query Gemini API: ${error.message}`;
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
