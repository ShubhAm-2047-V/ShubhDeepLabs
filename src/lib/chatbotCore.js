import { dbService } from "./supabase";

// Shared RAG context for Shubdeep Labs
export const SUPPORT_CONTEXT = [
  {
    keywords: ["price", "pricing", "cost", "budget", "fees", "tier", "plan", "easy", "medium", "hard", "mtech", "diploma", "engineering", "bca", "mca", "ai", "ml", "android", "category", "categories"],
    content: (prices) => {
      const getVal = (id, def) => (prices[id] !== undefined ? prices[id] : def);
      return `PROJECT CATEGORIES BASE PRICING:
- Diploma: Starting from ₹${getVal("diploma", 1999)}
- Engineering (B.E/B.Tech): Starting from ₹${getVal("engineering", 4999)}
- M.Tech / Research: Starting from ₹${getVal("mtech", 8999)}
- BCA / MCA: Starting from ₹${getVal("bca-mca", 3999)}
- AI / ML: Starting from ₹${getVal("ai-ml", 6999)}
- Android App: Starting from ₹${getVal("android", 5499)}

TECH STACK PRICING (Optional Add-ons):
- HTML / CSS / JavaScript: + ₹${getVal("html", 0)}
- Python + Flask: + ₹${getVal("python-flask", 999)}
- React.js: + ₹${getVal("react", 1499)}
- Next.js: + ₹${getVal("nextjs", 1999)}
- MERN Stack: + ₹${getVal("mern", 2999)}
- Android (Java/Kotlin): + ₹${getVal("android-dev", 3499)}
- Firebase Integration: + ₹${getVal("firebase", 999)}
- MySQL / MongoDB: + ₹${getVal("db", 799)}
- AI Integration (Gemini/OpenAI): + ₹${getVal("ai-integration", 2499)}
- Machine Learning Model: + ₹${getVal("ml-model", 3499)}
- OpenCV / Face Detection: + ₹${getVal("opencv", 2999)}
- Full Stack + Deployment: + ₹${getVal("fullstack", 4499)}
- Blockchain / Web3: + ₹${getVal("blockchain", 5999)}`;
    }
  },
  {
    keywords: ["deliver", "deliverable", "include", "provide", "get", "ppt", "report", "slides", "viva", "setup", "remote", "what do i receive", "receive"],
    content: (prices) => {
      const getVal = (id, def) => (prices[id] !== undefined ? prices[id] : def);
      return `WHAT STUDENTS WILL RECEIVE:
- Complete Source Code & Project Files
- Thesis Report & PPT Presentation Slides (Available separately as add-ons)
- Detailed Documentation & Setup Guidance
- Support & Basic Customization Support

ADD-ONS PRICING SHEET:
- PPT Presentation: + ₹${getVal("ppt", 499)}
- Thesis Report: + ₹${getVal("report", 999)}
- Viva Guidance Sheet: + ₹${getVal("viva", 399)}
- Remote Setup (Zoom): + ₹${getVal("remote", 699)}
- Cloud Deployment: + ₹${getVal("deployment", 1499)}
- Code Walkthrough Doc: + ₹${getVal("docs", 599)}`;
    }
  },
  {
    keywords: ["deadline", "timeline", "charge", "days", "urgent", "standard", "relaxed", "flexible", "rush"],
    content: (prices) => {
      const getVal = (id, def) => (prices[id] !== undefined ? prices[id] : def);
      return `DEADLINE CHARGES:
- 1–3 Days (Urgent): + ₹${getVal("urgent", 2499)}
- 4–7 Days (Standard): + ₹${getVal("normal", 999)}
- 8–14 Days (Relaxed): + ₹0
- Flexible / No Rush: + ₹0`;
    }
  },
  {
    keywords: ["recommend", "suggestion", "ideas", "topic", "easy", "advanced", "list", "options", "suitable", "outline"],
    content: () => `EASY PROJECT RECOMMENDATIONS:
- AI Resume Analyzer
- Smart Notes Summarizer
- AI Background Remover
- Expense Tracker
- AI Color Palette Generator
- Portfolio Builder
- Mock Interview AI

ADVANCED PROJECT RECOMMENDATIONS:
- AI Plant Disease Detector
- Face Recognition Attendance System
- AI Customer Support Chatbot
- Hospital Management System
- RFID Attendance Portal
- Blockchain Voting System`
  },
  {
    keywords: ["faq", "viva", "source", "laptop", "run", "custom", "deploy", "unique", "support"],
    content: () => `COMMON FAQS:
- Q: Will source code be provided?
  A: Yes, complete source code is included.
- Q: Will the project run on my laptop?
  A: Yes, setup guidance will be provided.
- Q: Can the project be customized?
  A: Yes, features and UI can be customized.
- Q: Is deployment included?
  A: Deployment is optional and available as an add-on.
- Q: Will PPT and report be included?
  A: Available separately as add-ons.
- Q: Can I get urgent delivery?
  A: Yes, urgent delivery is available with additional charges.
- Q: Which technologies are used?
  A: Technologies depend on project requirements and selected stack.
- Q: Is this project unique?
  A: Yes, projects are customized based on requirements.
- Q: Will support be provided after delivery?
  A: Basic support and setup help will be provided.`
  }
];

export function localRAGLookup(query, prices = {}) {
  const qLower = query.toLowerCase();
  let bestMatch = "";
  let highestScore = 0;

  SUPPORT_CONTEXT.forEach((item) => {
    let score = 0;
    item.keywords.forEach((word) => {
      if (qLower.includes(word)) score += 1;
    });

    if (score > highestScore) {
      highestScore = score;
      bestMatch = typeof item.content === "function" ? item.content(prices) : item.content;
    }
  });

  return bestMatch;
}

export async function runChatbotAgent({ message, history = [], context = "", chatSessionId }) {
  const logs = [];
  const addLog = (msg, level = "info") => {
    const timestamp = new Date().toISOString();
    logs.push({ timestamp, level, message: msg });
    console.log(`[Chatbot-Core] [${level.toUpperCase()}] ${msg}`);
  };

  addLog(`New inquiry: "${message}"`);

  let prices = {};
  try {
    prices = await dbService.getCustomizerPrices();
  } catch (e) {
    addLog(`Pricing DB Load Failed: ${e.message}`, "error");
  }

  const getVal = (id, def) => (prices[id] !== undefined ? prices[id] : def);

  const geminiKey = process.env.GEMINI_API_KEY;
  let reply = "";

  if (geminiKey) {
    addLog("Querying Gemini API...");

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
   - What type of project do you need? (Diploma, Engineering, M.Tech, BCA/MCA, AI/ML, Android)
   - What is your course?
   - What features do you need?
   - What is your deadline?
   - What is your approximate budget?
   - Do you need PPT or report?
   - Share your WhatsApp number for detailed discussion.
6. Highly Complex/Out-of-Scope Requests: If a user asks for an extremely complex project that goes far beyond a standard academic project (e.g., creating a complete multiplayer game like BGMI, high-end 3D MMOs, or full enterprise systems), do NOT refuse or simply redirect. Instead:
   a. Analyze the project concept and identify a simplified, feasible academic version or prototype (e.g., for a game like BGMI, suggest an Android game lobby app, a 2D clone prototype, or a game admin management dashboard).
   b. Determine the academic category based on their input (e.g., "diploma" or "engineering") and the necessary tech stack modules (e.g., "android-dev" for native Android app, "firebase" or "db" for database, or "mern" for full-stack web system).
   c. Provide a clean estimated pricing breakdown (using the exact rates above: e.g. Diploma starting at ₹${getVal("diploma", 1999)}, Android stack +₹${getVal("android-dev", 3499)}, Firebase +₹${getVal("firebase", 999)}, MERN stack +₹${getVal("mern", 2999)}, etc.). Show the sum total estimate clearly!
   d. Recommend that they contact the OWNER/COORDINATOR directly at +91 90288 33275 (or click WhatsApp: https://wa.me/919028833275) to discuss detailed custom specifications and custom high-end pricing.
   e. ALWAYS append a structured customizer tag at the absolute end of your response in the EXACT format below on a single line so it automatically opens the customizer side-by-side with these options pre-selected:
      [CUSTOMIZER: {"category":"<category_id>","tech":["<tech_id_1>","<tech_id_2>"],"addons":["<addon_id_1>"],"timeline":"<timeline_id>"}]
7. Project Pricing & Customizer Integrations: When a user asks about pricing, costing, or details of a project:
   a. Analyze the project: Determine the academic level/category, the likely tech stack needed, and any useful add-ons or timelines.
   b. Provide a clean estimated pricing breakdown (using the exact rates: e.g. Diploma starting at ₹${getVal("diploma", 1999)}, React is +₹${getVal("react", 1499)}, Python+Flask +₹${getVal("python-flask", 999)}, ML Model +₹${getVal("ml-model", 3499)}, OpenCV +₹${getVal("opencv", 2999)}, etc.). Show the sum total estimate clearly!
   c. ALWAYS append a structured customizer tag at the absolute end of your response in the EXACT format below. Keep it strictly on a single line at the very end of your response, replacing options with the matched ids:
      [CUSTOMIZER: {"category":"<category_id>","tech":["<tech_id_1>","<tech_id_2>"],"addons":["<addon_id_1>"],"timeline":"<timeline_id>"}]
      - category: "diploma", "engineering", "mtech", "bca-mca", "ai-ml", "android"
      - tech: "html", "python-flask", "react", "nextjs", "mern", "android-dev", "firebase", "db", "ai-integration", "ml-model", "opencv", "fullstack", "blockchain"
      - addons: "ppt", "report", "viva", "remote", "deployment", "docs"
      - timeline: "urgent", "normal", "relaxed", "flexible"
8. Automated Lead Qualification: If you have successfully collected the customer's:
   - Full Name
   - WhatsApp Number
   - Email
   - Approximate Budget
   - Deadline
   You MUST append a lead tag on a single line at the very end of your response (after any customizer tag if present) in the EXACT format below:
   [LEAD: {"fullName":"<name>","whatsapp":"<whatsapp>","email":"<email>","budget":"<budget>","deadline":"<deadline>","projectTitle":"<projectTitle>","techRequired":"<techRequired>"}]
   Do NOT output this tag until all fields are collected.

CONTEXT DATABASE (RAG MATCHES):
${context || `No matching context found. Rely on the factual details of Shubdeep Labs: Diploma starts from ₹${getVal("diploma", 1999)}, B.E./B.Tech from ₹${getVal("engineering", 4999)}, BCA/MCA from ₹${getVal("bca-mca", 3999)}, AI/ML from ₹${getVal("ai-ml", 6999)}, Android from ₹${getVal("android", 5499)}. Easy stack add-ons like HTML/CSS/JS are ₹${getVal("html", 0)}. PPT is ₹${getVal("ppt", 499)}, thesis report ₹${getVal("report", 999)}. Customization is always supported.`}`;

    const contents = [];
    history.slice(-8).forEach(h => {
      contents.push({
        role: h.sender === "user" ? "user" : "model",
        parts: [{ text: h.text || h.message_text }]
      });
    });
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: { temperature: 0.2, maxOutputTokens: 4096 }
        })
      });

      const data = await response.json();
      if (data.error) {
        addLog(`Gemini Error: ${data.error.message}`, "error");
        reply = `I encountered an error querying the Gemini service: ${data.error.message}`;
      } else {
        reply = data.candidates[0].content.parts[0].text;
        addLog("Response received successfully.");
      }
    } catch (error) {
      addLog(`Gemini Connection Failed: ${error.message}`, "error");
      reply = `Failed to query Gemini API: ${error.message}`;
    }
  } else {
    // Sandbox Mock Mode
    addLog("Sandbox Mock Mode: No API key configured.", "warn");
    await new Promise(resolve => setTimeout(resolve, 800));

    if (!context) {
      reply = "Hello! I'm the Shubdeep Labs support assistant. Ask me anything about our academic projects, pricing, and deadlines, or connect on WhatsApp at +91 90288 33275!";
    } else {
      const contextLower = context.toLowerCase();
      if (contextLower.includes("pricing") || contextLower.includes("diploma")) {
        reply = `We support projects from Diploma (starting at ₹${getVal("diploma", 1999)}), B.E/B.Tech (starting at ₹${getVal("engineering", 4999)}), and M.Tech (starting at ₹${getVal("mtech", 8999)}). Let me know which level you need!`;
      } else if (contextLower.includes("recommend") || contextLower.includes("ideas")) {
        reply = "I recommend our AI Resume Analyzer or Smart Notes Summarizer for easy projects. For advanced projects, check out our AI Plant Disease Detector or Face Recognition Attendance System.";
      } else {
        reply = "That details our standard academic support. Let me know if you would like to proceed with pricing calculator or talk to the coordinator directly at +91 90288 33275.";
      }
    }
  }

  // Parse structured customizer tag
  const customizerMatch = reply.match(/\[CUSTOMIZER:\s*({[\s\S]*?})\s*\]/);
  let selections = null;
  let cleanReplyText = reply;

  if (customizerMatch) {
    try {
      selections = JSON.parse(customizerMatch[1]);
      cleanReplyText = cleanReplyText.replace(/\[CUSTOMIZER:\s*({[\s\S]*?})\s*\]/, "").trim();
      if (chatSessionId) {
        await dbService.updateChatSessionCustomizer(chatSessionId, selections);
      }
    } catch (e) {
      addLog(`Failed to parse customizer selections: ${e.message}`, "error");
    }
  }

  // Parse structured lead tag
  const leadMatch = cleanReplyText.match(/\[LEAD:\s*({[\s\S]*?})\s*\]/);
  let lead = null;

  if (leadMatch) {
    try {
      lead = JSON.parse(leadMatch[1]);
      cleanReplyText = cleanReplyText.replace(/\[LEAD:\s*({[\s\S]*?})\s*\]/, "").trim();
      addLog(`Lead captured automatically: ${JSON.stringify(lead)}`);
      
      // Save order in database
      const orderData = {
        fullName: lead.fullName,
        collegeName: lead.collegeName || "N/A",
        branch: lead.branch || "N/A",
        year: lead.year || "Final Year",
        projectTitle: lead.projectTitle || "Custom Project Inquiry",
        techRequired: lead.techRequired || "Custom",
        deadline: lead.deadline || "8-14 Days",
        budget: lead.budget || "5000",
        description: `Lead collected automatically via AI Chatbot. Course: ${lead.course || "N/A"}.`,
        needPPT: lead.needPPT || false,
        needReport: lead.needReport || false,
        needVivaGuidance: lead.needViva || false,
      };

      await dbService.addOrder(orderData);
    } catch (e) {
      addLog(`Failed to parse lead information: ${e.message}`, "error");
    }
  }

  return {
    replyText: cleanReplyText,
    selections,
    lead,
    logs
  };
}
