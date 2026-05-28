import { NextResponse } from "next/server";
import { dbService } from "@/lib/db";
import { notifyAdmin } from "@/lib/gemini";

export async function POST(req) {
  try {
    const body = await req.json();
    // Support both camelCase and snake_case or standard fields
    const name = body.name || body.fullName;
    const phone = body.phone || body.whatsapp;
    const email = body.email || "";
    const category = body.category || "";
    const features = body.features || body.techRequired || "";
    const budget = body.budget || "";
    const deadline = body.deadline || "";

    if (!name || !phone) {
      return NextResponse.json({ error: "Name and phone number are required." }, { status: 400 });
    }

    const leadData = {
      name,
      phone,
      email,
      category,
      features,
      budget,
      deadline
    };

    const lead = await dbService.addLead(leadData);

    // Alert coordinates of new lead form entry
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
