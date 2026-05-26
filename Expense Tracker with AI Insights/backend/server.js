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

// --- TRANSACTIONS ENDPOINTS ---
app.get("/api/transactions", async (req, res) => {
  try {
    const list = await db.getTransactions();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/transactions", async (req, res) => {
  try {
    const { description, amount, category, type } = req.body;
    if (!description || !amount || !category || !type) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const date = new Date().toLocaleDateString();
    const tx = await db.addTransaction({ description, amount, category, type, date });
    res.json(tx);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/transactions/:id", async (req, res) => {
  try {
    const result = await db.deleteTransaction(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- BUDGET ENDPOINTS ---
app.get("/api/budget", async (req, res) => {
  try {
    const limit = await db.getBudget();
    res.json({ limit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/budget", async (req, res) => {
  try {
    const { limit } = req.body;
    if (limit === undefined) {
      return res.status(400).json({ error: "Limit is required" });
    }
    const updatedLimit = await db.updateBudget(limit);
    res.json({ limit: updatedLimit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- AI FINANCIAL INSIGHTS REPORT ENDPOINT ---
app.post("/api/expense-insights", async (req, res) => {
  try {
    const { expenses = [], monthlyBudget = 15000 } = req.body;
    
    logger.log(`[LLM Gate] Analyzing balance sheet. Transactions: ${expenses.length}, Budget: ₹${monthlyBudget}`, "info");

    const totalSpent = expenses
      .filter(e => e.type === "Expense")
      .reduce((sum, e) => sum + Number(e.amount), 0);
      
    const totalIncome = expenses
      .filter(e => e.type === "Income")
      .reduce((sum, e) => sum + Number(e.amount), 0);
      
    const netBalance = totalIncome - totalSpent;
    const geminiKey = process.env.GEMINI_API_KEY;
    let reply = "";

    if (geminiKey) {
      logger.log(`[LLM Gemini] Requesting budget report from Gemini API (gemini-2.5-flash)...`, "info");

      const systemInstruction = `You are a professional, helpful AI Financial Advisor. 
Analyze the user's monthly income, expenses, and budget limit. Provide a structured, engaging, and professional markdown report that includes:
1. **Financial Health Review**: Brief review of their current spending compared to income.
2. **Budget Pacing Analysis**: Check if they are within or exceeding their monthly budget of ₹${monthlyBudget}.
3. **Category Breakdown**: Call out the highest spending category and how much is spent.
4. **3 Actionable Suggestions**: Give 3 specific, practical money-saving recommendations based on their actual expenses (e.g. food/travel/rent/utilities).
Ensure the tone is supportive, clear, and professional. Format with clean markdown headers and bullet points.`;

      const promptText = `Here is my monthly financial log:
- Monthly Budget Limit: ₹${monthlyBudget}
- Total Income: ₹${totalIncome}
- Total Expenses: ₹${totalSpent}
- Net Balance: ₹${netBalance}

Transactions Log:
${expenses.map(e => `- ${e.date}: ${e.description} (${e.category}) - ₹${e.amount} [${e.type}]`).join("\n")}

Please review and provide my financial report.`;

      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: promptText }] }],
            systemInstruction: { parts: [{ text: systemInstruction }] },
            generationConfig: { temperature: 0.3, maxOutputTokens: 600 }
          })
        });

        const data = await response.json();
        if (data.error) {
          logger.log(`[LLM Gemini Error] ${data.error.message}`, "error");
          reply = "I encountered an error querying the Gemini service.";
        } else {
          reply = data.candidates[0].content.parts[0].text;
          logger.log(`[LLM Gemini] Financial report generated successfully.`, "success");
        }
      } catch (error) {
        logger.log(`[LLM Gemini Connection Failed] ${error.message}`, "error");
        reply = "Failed to query Gemini API.";
      }
    } else {
      // Local Intelligent Mock Report Parser
      logger.log(`[LLM Sandbox] Running in Offline Sandbox Mode. No GEMINI_API_KEY detected.`, "warn");
      logger.log(`[LLM Sandbox] Compiling rules-based category heuristics...`, "info");

      // Artificial Delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Calculate category totals
      const catTotals = {};
      expenses.forEach(e => {
        if (e.type === "Expense") {
          catTotals[e.category] = (catTotals[e.category] || 0) + Number(e.amount);
        }
      });

      let highestCat = "None";
      let highestAmt = 0;
      Object.entries(catTotals).forEach(([cat, amt]) => {
        if (amt > highestAmt) {
          highestAmt = amt;
          highestCat = cat;
        }
      });

      const budgetStatus = totalSpent > monthlyBudget
        ? `⚠️ **Alert:** You have exceeded your monthly budget of **₹${monthlyBudget}** by **₹${totalSpent - monthlyBudget}**.`
        : `✅ **On Track:** You have spent **₹${totalSpent}** out of your **₹${monthlyBudget}** budget. You have **₹${monthlyBudget - totalSpent}** remaining.`;

      let recommendations = [];
      if (highestCat === "Food") {
        recommendations = [
          "**Consolidate Dining Expenses:** Your food bills (₹" + highestAmt + ") represent your highest outlay. Try planning home-cooked meals 3 times a week to save up to 40% on restaurant deliveries.",
          "**Track Coffee & Snacks:** Small daily purchases add up quickly. Try setting a weekly limit of ₹300 for snacking.",
          "**Audit Subscription Services:** Review any recurring grocery or food delivery subscriptions you aren't using frequently."
        ];
      } else if (highestCat === "Travel") {
        recommendations = [
          "**Optimize Commuting Costs:** Travel expenses (₹" + highestAmt + ") are currently your highest expense. Consider carpooling or using public transit options on regular routes.",
          "**Ride-Sharing Auditing:** Limit ride-shares to emergencies or bad weather. Committing to subways or buses can yield immediate savings.",
          "**Group Errands:** Group shopping and errands in a single weekly loop to cut down overall transit costs."
        ];
      } else if (highestCat === "Entertainment") {
        recommendations = [
          "**Audit Video & Gaming Subscriptions:** Entertainment costs (₹" + highestAmt + ") are your top expense category. Review active streaming subscriptions and pause those not used in the last 30 days.",
          "**Look for Free Alternatives:** Try looking for local community events, public parks, or free museum passes for weekend leisure.",
          "**Share Family Plans:** Consolidate standalone media/cloud subscriptions into family packages to split costs."
        ];
      } else {
        recommendations = [
          "**Establish Spending Gates:** Your highest spending is currently in **" + highestCat + "** (₹" + highestAmt + "). Try implementing a '24-hour rule' before making non-essential purchases.",
          "**Set Category Caps:** Establish weekly targets specifically for " + highestCat + " to control budget pacing.",
          "**Automate Savings:** Setup an auto-transfer of 10% of your salary directly to a savings account on payday."
        ];
      }

      reply = `## 📊 AI Financial Insights Report (Offline Mock)

### 1. Financial Health Review
Your total monthly income is **₹${totalIncome}** and your expenses total **₹${totalSpent}**. This leaves you with a net balance of **₹${netBalance}**. 

### 2. Budget Pacing Analysis
${budgetStatus}
* Current savings rate: **${totalIncome > 0 ? ((netBalance / totalIncome) * 100).toFixed(1) : 0}%** of total income.

### 3. Category Breakdown
* **Highest Expense Category:** **${highestCat}**
* **Total Spent in Category:** **₹${highestAmt}** (${totalSpent > 0 ? ((highestAmt / totalSpent) * 100).toFixed(1) : 0}% of overall monthly expenses)

### 4. Actionable Savings Recommendations
1. ${recommendations[0]}
2. ${recommendations[1]}
3. ${recommendations[2]}

---
*Report generated in sandbox mode. Add a valid \`GEMINI_API_KEY\` to enable live Gemini AI models.*`;

      logger.log(`[LLM Sandbox] Successfully compiled financial insights report.`, "success");
    }

    res.json({ reply });
  } catch (error) {
    logger.log(`[Server Error] AI analysis failed: ${error.message}`, "error");
    res.status(500).json({ error: error.message });
  }
});

// Launch Express Server
app.listen(PORT, () => {
  logger.log(`=======================================================`, "info");
  logger.log(`  Expense Tracker Server running on Port ${PORT}`, "info");
  logger.log(`  Real-Time SSE Broadcasting Active on /api/logs`, "info");
  logger.log(`=======================================================`, "info");
});
