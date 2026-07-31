// Gemini response engine for Shubh Deep Labs
import { dbService } from "./db";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Simulate Admin Telegram/Email Notification
export async function notifyAdmin(type, data) {
  const timestamp = new Date().toLocaleString();
  const alertMsg = `
🛎️ [ADMIN NOTIFICATION ALERT] - ${timestamp}
Type: ${type.toUpperCase()}
Details:
${JSON.stringify(data, null, 2)}
--------------------------------------------------
`;
  console.log(alertMsg);
  // Optionally store in a local audit log or system simulation
  return true;
}

// 1. Classify user intent
export async function classifyIntent(message, history = []) {
  if (!GEMINI_API_KEY) {
    // Local Keyword Fallback
    const msg = message.toLowerCase();
    if (msg.includes("developer") || msg.includes("human") || msg.includes("coordinator") || msg.includes("talk to") || msg.includes("call me") || msg.includes("contact me")) {
      return "human_support";
    }
    if (msg.includes("custom") || msg.includes("my own") || msg.includes("make a new") || msg.includes("different features")) {
      return "custom_project";
    }
    if (msg.includes("urgent") || msg.includes("emergency") || msg.includes("asap") || msg.includes("1 day") || msg.includes("2 days") || msg.includes("3 days")) {
      return "urgent_delivery";
    }
    if (msg.includes("price") || msg.includes("cost") || msg.includes("budget") || msg.includes("how much") || msg.includes("fees") || msg.includes("tier")) {
      return "pricing";
    }
    if (msg.includes("recommend") || msg.includes("suggest") || msg.includes("ideas") || msg.includes("topic") || msg.includes("options")) {
      return "project_recommendation";
    }
    if (msg.includes("faq") || msg.includes("source code") || msg.includes("run on my laptop") || msg.includes("viva") || msg.includes("setup")) {
      return "FAQ";
    }
    
    // Check if it is unrelated (general knowledge, math, coding questions outside Shubh Deep Labs)
    const keywords = ["price", "project", "code", "run", "laptop", "viva", "ppt", "report", "setup", "deployment", "ml", "ai", "android", "web", "react", "next", "flask", "django", "java", "python", "php", "node", "mern", "diploma", "engineering", "bca", "mca", "mtech", "hello", "hi", "hey", "help", "thanks", "thank you", "ok", "yes", "no"];
    const hasProjectKeywords = keywords.some(kw => msg.includes(kw));
    if (!hasProjectKeywords && msg.length > 10) {
      return "unrelated";
    }
    return "general_conversation";
  }

  // Gemini API Classification
  const systemInstruction = `You are a classification assistant. Classify the user's message into exactly ONE of the following categories:
- pricing (asking about pricing, base plans, add-ons, or custom quotes)
- project_recommendation (asking for suggestions, topic recommendations, easy/advanced projects)
- FAQ (asking about source code delivery, laptop setup, customizability, uniqueness, support)
- urgent_delivery (requesting delivery in 1-3 days, tight deadlines, extra rush charges)
- custom_project (asking for features not in standard list, custom specifications, unique design)
- human_support (asking to speak with a human, developer, coordinator, phone call, or customer care)
- unrelated (asking about general knowledge, history, code snippets not related to the consultation desk, general maths, weather, or other completely out-of-scope topics)
- general_conversation (greetings like hi, hello, thanking, general conversation within project scope)

Reply with ONLY the category name in lowercase.`;

  const contents = [];
  history.slice(-4).forEach(h => {
    contents.push({
      role: h.sender === "user" ? "user" : "model",
      parts: [{ text: h.message_text || h.messageText || h.text || "" }]
    });
  });
  contents.push({
    role: "user",
    parts: [{ text: message }]
  });

  try {
    const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: { temperature: 0.0, maxOutputTokens: 10 }
      })
    });
    const data = await response.json();
    if (data.error || !data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error("Gemini classification API returned error:", data.error || "No candidates found");
      return "general_conversation";
    }
    const result = data.candidates[0].content.parts[0].text.trim().toLowerCase();
    return result;
  } catch (error) {
    console.error("Gemini classification failed, falling back:", error);
    return "general_conversation";
  }
}

// 2. Recommend Projects
export function recommendProjects(level) {
  const easy = [
    "AI Resume Analyzer",
    "Smart Notes Summarizer",
    "AI Background Remover",
    "Expense Tracker with AI Insights",
    "AI Color Palette Generator",
    "Portfolio Builder",
    "Mock Interview AI"
  ];
  const advanced = [
    "AI Plant Disease Detector",
    "Face Recognition Attendance System",
    "AI Customer Support Chatbot",
    "Hospital Management System",
    "RFID Attendance Portal",
    "Blockchain Voting System"
  ];

  if (level === "diploma" || level === "bca-mca" || level === "easy") {
    return easy;
  }
  return [...easy, ...advanced];
}

// 3. Generate Reply
export async function generateReply(message, history = [], context = "", intent = "general_conversation", chatSessionId = null) {
  const msgLower = message.toLowerCase();

  // Rule: Polite refusal for unrelated topics
  if (intent === "unrelated") {
    return {
      replyText: "I’m designed specifically for project recommendations, pricing, and development services.",
      selections: null,
      lead: null,
      escalated: false
    };
  }

  // Determine pricing context
  let prices = {};
  try {
    prices = await dbService.getCustomizerPrices();
  } catch (e) {
    console.error("Error loading prices in Gemini helper:", e);
  }

  const getVal = (id, def) => (prices[id] !== undefined ? prices[id] : def);

  // Check for Human Escalation Trigger
  let shouldEscalate = (intent === "human_support");
  let escalationReason = "";

  // Check budget > 10000
  const budgetMatch = message.match(/\b(1\d{4}|[2-9]\d{4}|\d{6,})\b/); // Matches 10000+
  if (budgetMatch) {
    const budgetValue = parseInt(budgetMatch[0]);
    if (budgetValue > 10000) {
      shouldEscalate = true;
      escalationReason = `High budget requested: ₹${budgetValue}`;
    }
  }

  // Check custom project request - DO NOT ESCALATE so Gemini can auto-build the customizer stack for them
  if (msgLower.includes("my own specs") || msgLower.includes("my own requirements")) {
    // We only escalate if they explicitly mention needing very specific out-of-band specs.
    // Let the AI handle "custom_project" intent to build the base stack first.
  }

  // Check confused customer signs
  const confusionKeywords = ["confused", "don't understand", "not working", "stuck", "error compiling", "failed to run"];
  if (confusionKeywords.some(kw => msgLower.includes(kw))) {
    shouldEscalate = true;
    escalationReason = escalationReason || "Customer expresses confusion/errors.";
  }

  if (shouldEscalate) {
    // Notify admin
    await notifyAdmin("human_escalation", {
      message,
      sessionId: chatSessionId,
      reason: escalationReason || "Direct support request",
      history: history.slice(-3)
    });

    // Update session status in DB
    if (chatSessionId) {
      await dbService.updateChatSessionStatus(chatSessionId, "Manual Intervention");
    }

    return {
      replyText: "Developer will contact you shortly.",
      selections: null,
      lead: null,
      escalated: true
    };
  }

  if (!GEMINI_API_KEY) {
    // Rule-based simulation if API key is not configured
    let reply = "";
    if (intent === "pricing" || msgLower.includes("price") || msgLower.includes("cost")) {
      reply = `Here is our pricing structure:
Diploma (Easy) = ₹${getVal("diploma", "Free 🌿")}
Diploma (Medium) = ₹${getVal("diploma_medium", 1999)}
Diploma (Hard) = ₹${getVal("diploma_hard", 2999)}
Engineering (B.Tech) = ₹${getVal("engineering", 3999)}
M.Tech = ₹${getVal("mtech", 7499)}
BCA/MCA = ₹${getVal("bca-mca", 2999)}
AI/ML Specialized = ₹${getVal("ai-ml", 5999)}
Android App = ₹${getVal("android", 4999)}

Optional Stack Add-ons:
Python + Flask = +₹${getVal("python-flask", 1999)}
React.js = +₹${getVal("react", 2499)}
Next.js = +₹${getVal("nextjs", 2999)}
MERN Stack = +₹${getVal("mern", 4499)}
Firebase = +₹${getVal("firebase", 1499)}
Database = +₹${getVal("db", 1499)}
AI Integration = +₹${getVal("ai-integration", 2499)}
ML Model = +₹${getVal("ml-model", 3499)}
OpenCV = +₹${getVal("opencv", 2999)}`;
    } else if (intent === "project_recommendation" || msgLower.includes("recommend") || msgLower.includes("ideas")) {
      reply = `We recommend the following:
Easy: AI Resume Analyzer, Smart Notes Summarizer, AI Background Remover.
Advanced: AI Plant Disease Detector, Face Recognition Attendance System, Blockchain Voting.
What stack or topic interests you?`;
    } else if (intent === "FAQ" || msgLower.includes("faq") || msgLower.includes("laptop")) {
      reply = `FAQs:
- Source code included? Yes, fully provided.
- Run on your laptop? Yes, setup guidance included.
- Customized? Yes, features and UI can be customized.
- Support? Basic support is provided after delivery.`;
    } else if (intent === "urgent_delivery" || msgLower.includes("deadline")) {
      reply = `Our standard timeline is 8-14 days (no extra charge). 4-7 days standard rush adds ₹${getVal("normal", 999)}, and 1-3 days express adds ₹${getVal("urgent", 1999)}. Let us know your deadline.`;
    } else {
      reply = "Welcome to Shubh Deep Labs! We assist with academic projects, custom software development, pricing, and viva guidance. Let us know how we can help.";
    }

    return {
      replyText: reply,
      selections: null,
      lead: null,
      escalated: false
    };
  }

  // Query Gemini for contextual response
  const systemInstruction = `You are the official Senior Software Consultant AI for ShubDeep Labs, a premier global software development company.
Your goal is to assist clients, business owners, and startups with inquiries regarding website development, custom software engineering, mobile app development, e-commerce platforms, and custom AI solutions.

AGENCY CONSULTATION RULES:
1. Provide helpful, professional, friendly estimates and technical guidance for any business software or web project (e.g. coffee shop / cafe website, restaurant portal, SaaS platform, corporate site, mobile app).
2. For business website requests (e.g. cafe, small business, corporate site):
   - Standard business website / landing page starts at ₹3,999 - ₹9,999 ($50 - $120 USD).
   - Custom web application / e-commerce platform with online ordering, admin dashboard, and payment gateways ranges from ₹9,999 - ₹24,999 ($120 - $300 USD).
   - Enterprise custom software & AI integrations are quoted based on module scope.
3. Keep your answers crisp, clear, friendly, and structured. Highlight key deliverables (responsive design, fast Next.js speed, SEO optimization, admin panel, source code ownership).
4. Conversational Lead Collection: Naturally ask relevant scope questions:
   - What key features do you need (e.g., online menu, reservation, online payment, admin panel)?
   - What is your expected timeline?
   - What is your target budget?
   - Ask for their WhatsApp or email to send a detailed proposal blueprint.
5. CRITICAL REQUIREMENT: You MUST ALWAYS append a JSON configuration tag at the VERY END of your response.
   Format EXACTLY like this:
   [CUSTOMIZER: {"category":"<id>","tech":["<id>"],"addons":["<id>"],"timeline":"<id>"}]
   - Infer category ("engineering" for web/software apps, "android" for mobile apps, "ai-ml" for AI).
   - Valid category IDs: "diploma", "engineering", "mtech", "bca-mca", "ai-ml", "android".
   - Valid tech IDs: "html", "python-flask", "react", "nextjs", "mern", "android-dev", "firebase", "db", "ai-integration", "ml-model", "opencv", "fullstack", "blockchain".
   - Valid addons IDs: "ppt", "report", "viva", "remote", "deployment", "docs".
   - Valid timeline IDs: "urgent", "normal", "relaxed", "flexible".

FACTUAL BASE PRICING:
Standard Business Website / Portal = ₹3,999
Full-Stack Web App / E-commerce = ₹9,999
Enterprise Custom Software = ₹14,999+
AI & Machine Learning Systems = ₹9,999+
Mobile Applications (iOS/Android) = ₹8,999+

CONTEXT DATABASE:
${context || "No specific database match found. Provide crisp, professional agency estimation."}`;

  const contents = [];
  history.slice(-8).forEach(h => {
    contents.push({
      role: h.sender === "user" ? "user" : "model",
      parts: [{ text: h.message_text || h.messageText || h.text || "" }]
    });
  });
  contents.push({
    role: "user",
    parts: [{ text: message }]
  });

  try {
    const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;
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
    if (data.error || !data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error("Gemini generateReply API error:", data.error || "No candidates returned");
      return {
        replyText: `Thank you for reaching out to ShubDeep Labs! For custom website development (such as a cafe website with online menu and reservations), our packages start at ₹3,999 - ₹9,999 ($50-$120 USD). Please share your WhatsApp number or email, and our engineering team will send you a tailored blueprint and proposal!`,
        selections: { category: "engineering", tech: ["nextjs", "react"], addons: ["deployment"], timeline: "normal" },
        lead: null,
        escalated: false
      };
    }
    let reply = data.candidates[0].content.parts[0].text;

    // Parse structured tags
    const customizerMatch = reply.match(/\[CUSTOMIZER:\s*({[\s\S]*?})\s*\]/);
    let selections = null;
    let cleanReplyText = reply;

    if (customizerMatch) {
      try {
        let jsonString = customizerMatch[1];
        // Fix common LLM JSON mistakes (single quotes to double quotes, trailing commas)
        jsonString = jsonString.replace(/'/g, '"').replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
        selections = JSON.parse(jsonString);
        cleanReplyText = cleanReplyText.replace(/\[CUSTOMIZER:\s*({[\s\S]*?})\s*\]/, "").trim();
        if (chatSessionId) {
          await dbService.updateChatSessionCustomizer(chatSessionId, selections);
        }
      } catch (e) {
        console.error("Failed to parse customizer selections:", e, "Raw string:", customizerMatch[1]);
      }
    }

    const leadMatch = cleanReplyText.match(/\[LEAD:\s*({[\s\S]*?})\s*\]/);
    let lead = null;

    if (leadMatch) {
      try {
        lead = JSON.parse(leadMatch[1]);
        cleanReplyText = cleanReplyText.replace(/\[LEAD:\s*({[\s\S]*?})\s*\]/, "").trim();
        
        // Save lead in database as an order
        const orderData = {
          fullName: lead.fullName,
          collegeName: lead.collegeName || "N/A",
          branch: lead.branch || "N/A",
          year: lead.year || "Final Year",
          projectTitle: lead.projectTitle || "Custom Project Inquiry",
          techRequired: lead.techRequired || "Custom",
          deadline: lead.deadline || "8-14 Days",
          budget: lead.budget || "5000",
          description: `Lead collected automatically via AI Chatbot. Phone: ${lead.whatsapp || lead.phone || "N/A"}.`,
          needPPT: lead.needPPT || false,
          needReport: lead.needReport || false,
          needVivaGuidance: lead.needViva || false,
        };
        await dbService.addOrder(orderData);

        // Notify Admin of lead
        await notifyAdmin("new_lead_captured", orderData);
      } catch (e) {
        console.error("Failed to parse lead information:", e);
      }
    }

    return {
      replyText: cleanReplyText,
      selections,
      lead,
      escalated: false
    };

  } catch (error) {
    console.error("Gemini generation failed, falling back:", error);
    return {
      replyText: "I'm having trouble connecting to my brain right now. Please message us on WhatsApp at +91 90288 33275 for immediate response!",
      selections: null,
      lead: null,
      escalated: false
    };
  }
}
