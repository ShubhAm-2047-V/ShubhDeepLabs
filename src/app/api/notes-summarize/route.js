import { NextResponse } from "next/server";

export async function POST(req) {
  const logs = [];
  const addLog = (message, level = "info") => {
    const timestamp = new Date().toISOString();
    logs.push({ timestamp, level, message });
    console.log(`[Next-NotesSummarize] [${level.toUpperCase()}] ${message}`);
  };

  try {
    const { notesText = "" } = await req.json();

    if (!notesText || !notesText.trim()) {
      return NextResponse.json({ error: "Notes content is empty" }, { status: 400 });
    }

    addLog(`Received notes content for analysis (${notesText.length} characters).`, "info");

    const geminiKey = process.env.GEMINI_API_KEY;
    let summary = "";
    let concepts = "";
    let flashcards = [];

    if (geminiKey) {
      addLog("[LLM Gemini] Connecting to Gemini API (gemini-2.5-flash)...", "info");

      const systemInstruction = `You are an expert AI Study Assistant.
Analyze the user's study notes and generate:
1. A structured summary (concise Markdown format).
2. A bulleted list of 4-5 key action items or core concepts.
3. A list of 3-4 interactive study flashcards (Q&A style).

Return the output exactly in this format:
SUMMARY:
[Structured summary markdown]
CONCEPTS:
- Concept A
- Concept B
FLASHCARDS:
Q: Question 1
A: Answer 1
Q: Question 2
A: Answer 2

Make formatting clean, direct, and easy to split. Avoid introductory text.`;

      try {
        const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: `Here are my study notes:\n${notesText}` }] }],
            systemInstruction: { parts: [{ text: systemInstruction }] },
            generationConfig: { temperature: 0.3, maxOutputTokens: 600 }
          })
        });

        const data = await response.json();
        if (data.error || !data.candidates?.[0]?.content?.parts?.[0]?.text) {
          addLog(`[LLM Error] ${data.error ? data.error.message : "No candidates"}`, "error");
          summary = "Failed to query Gemini API.";
        } else {
          const rawText = data.candidates[0].content.parts[0].text;
          addLog("[LLM Gemini] Document analyzed successfully.", "info");
          
          // Parse sections
          const parsed = parseGeminiOutput(rawText);
          summary = parsed.summary;
          concepts = parsed.concepts;
          flashcards = parsed.flashcards;
        }
      } catch (error) {
        addLog(`[LLM Gemini Connection Failed] ${error.message}`, "error");
        summary = "Failed to query Gemini API.";
      }
    } else {
      // Local Intelligent Mock Summarizer
      addLog("[LLM Sandbox] Running in Offline Sandbox Mode. No GEMINI_API_KEY detected.", "warn");
      
      // Artificial Delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const parsed = mockSummarizer(notesText);
      summary = parsed.summary;
      concepts = parsed.concepts;
      flashcards = parsed.flashcards;
      
      addLog("[LLM Sandbox] Successfully resolved local study summaries.", "info");
    }

    return NextResponse.json({
      summary,
      concepts,
      flashcards,
      logs
    });

  } catch (err) {
    addLog(`[LLM Gate Error] Failed to parse request: ${err.message}`, "error");
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Parsing function to split sections
function parseGeminiOutput(text) {
  let summary = "";
  let concepts = "";
  let flashcards = [];

  try {
    const summaryPart = text.split("CONCEPTS:");
    summary = summaryPart[0].replace("SUMMARY:", "").trim();

    if (summaryPart[1]) {
      const conceptsPart = summaryPart[1].split("FLASHCARDS:");
      concepts = conceptsPart[0].trim();

      if (conceptsPart[1]) {
        const cardsRaw = conceptsPart[1].trim().split("Q:");
        cardsRaw.forEach(card => {
          if (card.includes("A:")) {
            const qa = card.split("A:");
            const question = qa[0].trim();
            const answer = qa[1].trim();
            if (question && answer) {
              flashcards.push({ question, answer });
            }
          }
        });
      }
    }
  } catch (e) {
    summary = text;
    concepts = "- Core concepts extraction failed.";
    flashcards = [{ question: "What is the key takeaway?", answer: "Review the generated summary text." }];
  }

  return { summary, concepts, flashcards };
}

// Rules-based local parser
function mockSummarizer(text) {
  const charCount = text.length;
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  
  // Extract first sentence as lead
  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
  const leadSentence = sentences[0] || "General notes uploaded.";
  
  const summary = `## 📝 Study Summary (Offline Mock)
  
This document contains **${wordCount} words** (${charCount} characters) across **${sentences.length} sentences**.

### Core Objective
* ${leadSentence}.

### Structural Analysis
* **Volume:** Low-to-medium study sheet.
* **Density:** High density data.
* **Key Takeaway:** Consistent review is recommended.`;

  const concepts = `- **Core Terms:** Key concepts covered in the text.
- **Syntactical Review:** Analyzing sentence structures.
- **Self-Assessment:** Attempt flashcard exercises to reinforce concepts.`;

  const flashcards = [
    { question: "What is the primary topic of the notes?", answer: leadSentence },
    { question: "How many words are contained in the text?", answer: `${wordCount} words` },
    { question: "How many sentences make up the notes?", answer: `${sentences.length} sentences` }
  ];

  return { summary, concepts, flashcards };
}
