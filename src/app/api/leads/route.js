import { NextResponse } from "next/server";
import { dbService } from "@/lib/db";
import { notifyAdmin } from "@/lib/gemini";

export async function POST(req) {
  try {
    const body = await req.json();
    
    // Support both client profiles and structured order summaries
    const name = body.name || body.fullName || "Website Visitor";
    const phone = body.phone || body.whatsapp || "WhatsApp Redirect";
    const email = body.email || "";
    
    // Project specifications
    const project = body.project || body.features || "Custom Project";
    const category = body.category || "";
    const stack = body.stack || body.techRequired || "";
    const addons = body.addons || "";
    const deadline = body.deadline || "";
    const budget = body.budget || "";
    const timestamp = body.timestamp || new Date().toISOString();

    const leadData = {
      name,
      phone,
      email,
      project,
      category,
      stack,
      addons,
      deadline,
      budget,
      timestamp,
      createdAt: timestamp // Compatibility field
    };

    const lead = await dbService.addLead(leadData);

    // Alert coordinator desk
    await notifyAdmin("web_lead_form", lead);

    return NextResponse.json({ success: true, lead });
  } catch (err) {
    return NextResponse.json({ error: "Server error: " + err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const leads = await dbService.getLeads();
    return NextResponse.json({ success: true, leads });
  } catch (err) {
    return NextResponse.json({ error: "Server error: " + err.message }, { status: 500 });
  }
}
