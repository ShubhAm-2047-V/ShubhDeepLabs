import { NextResponse } from "next/server";

export async function POST(req) {
  const logs = [];
  const addLog = (message, level = "info") => {
    const timestamp = new Date().toISOString();
    logs.push({ timestamp, level, message });
    console.log(`[Next-ExpenseInsights] [${level.toUpperCase()}] ${message}`);
  };

  try {
    const { expenses = [], monthlyBudget = 20000 } = await req.json();

    addLog(`Received ${expenses.length} transaction entries for analysis. Monthly Budget: ₹${monthlyBudget}`, "info");

    const totalSpent = expenses.reduce((sum, e) => sum + (e.type === "Expense" ? e.amount : 0), 0);
    const totalIncome = expenses.reduce((sum, e) => sum + (e.type === "Income" ? e.amount : 0), 0);
    const netBalance = totalIncome - totalSpent;

    addLog(`Financial Summary: Income: ₹${totalIncome}, Expenses: ₹${totalSpent}, Balance: ₹${netBalance}`, "info");

    const geminiKey = process.env.GEMINI_API_KEY;
    let reply = "";

    if (geminiKey) {
      addLog("[LLM Gemini] Requesting budget report from Gemini API (gemini-2.5-flash)...", "info");

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
        const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`;
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
        if (data.error || !data.candidates?.[0]?.content?.parts?.[0]?.text) {
          addLog(`[LLM Error] ${data.error ? data.error.message : "No candidates"}`, "error");
          reply = "Failed to query Gemini API.";
        } else {
          reply = data.candidates[0].content.parts[0].text;
          addLog("[LLM Gemini] Financial report received and parsed successfully.", "info");
        }
      } catch (error) {
        addLog(`[LLM Gemini Connection Failed] ${error.message}`, "error");
        reply = "Failed to query Gemini API.";
      }
    } else {
      // Local Intelligent Mock Report Parser
      addLog("[LLM Sandbox] Running in Offline Sandbox Mode. No GEMINI_API_KEY detected.", "warn");
      addLog("[LLM Sandbox] Compiling rules-based category heuristics...", "info");

      // Artificial Delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Calculate category totals
      const catTotals = {};
      expenses.forEach(e => {
        if (e.type === "Expense") {
          catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
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

      // Structure recommendations based on highest category
      let recommendations = [];
      if (highestCat === "Food") {
        recommendations = [
          "**Consolidate Dining Expenses:** Your food bills (₹" + highestAmt + ") represent your highest outlay. Try planning home-cooked meals 3 times a week to save up to 40% on restaurant deliveries.",
          "**Track Coffee & Snacks:** Small daily purchases add up quickly. Try setting a weekly limit of ₹300 for snacking.",
          "**Audit Subscription Services:** Review any recurring grocery or food delivery subscriptions you aren't using frequently."
        ];
      } else if (highestCat === "Travel" || highestCat === "Fuel") {
        recommendations = [
          "**Optimize Commuting Costs:** Travel expenses (₹" + highestAmt + ") are currently your highest expense. Consider carpooling or using public transit options on regular routes.",
          "**Ride-Sharing Auditing:** Limit ride-shares to emergencies or bad weather. Committing to subways or buses can yield immediate savings.",
          "**Plan Trips in Batches:** Group errands together in a single loop to reduce fuel consumption and toll costs."
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

      addLog("[LLM Sandbox] Successfully resolved mock financial insights report.", "info");
    }

    addLog("[LLM Gate] Dispatching reports back to dashboard.", "info");

    return NextResponse.json({
      reply,
      logs
    });

  } catch (err) {
    addLog(`[LLM Gate Error] Failed to parse request: ${err.message}`, "error");
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
