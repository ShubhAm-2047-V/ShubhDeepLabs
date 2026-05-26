import { NextResponse } from "next/server";

// In-memory global store to keep track of active sessions
global.demoRequests = global.demoRequests || {};

export async function POST(req) {
  try {
    const requestId = "req_" + Math.random().toString(36).substring(2, 10);
    
    // Store request in global state
    global.demoRequests[requestId] = {
      status: "pending",
      createdAt: Date.now(),
      approvedAt: null
    };

    console.log(`[Demo API] Created new request ID: ${requestId}`);

    return NextResponse.json({ requestId });
  } catch (err) {
    return NextResponse.json({ error: "Failed to initialize request" }, { status: 500 });
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Missing request ID", { status: 400 });
  }

  const session = global.demoRequests[id];

  // Action: CHECK STATUS
  if (action === "status") {
    if (!session) {
      return NextResponse.json({ status: "expired" });
    }

    // Check for 10 minutes session expiration
    if (session.status === "approved" && session.approvedAt) {
      const tenMinutes = 10 * 60 * 1000;
      if (Date.now() - session.approvedAt > tenMinutes) {
        session.status = "expired";
        console.log(`[Demo API] Request ID ${id} has expired (10 minutes elapsed).`);
      }
    }

    return NextResponse.json({ 
      status: session.status,
      approvedAt: session.approvedAt 
    });
  }

  // Action: APPROVE (HTML Response for Admin phone browser)
  if (action === "approve") {
    if (!session) {
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Session Expired</title>
          <style>
            body { background: #070A13; color: #EF4444; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .card { background: #111726; border: 1px solid rgba(255, 255, 255, 0.05); padding: 30px; border-radius: 12px; text-align: center; max-width: 400px; }
            h1 { font-size: 22px; margin-top: 0; }
            p { color: #94A3B8; font-size: 14px; line-height: 1.5; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>✗ Request Invalid or Expired</h1>
            <p>The request token is invalid, or the student has closed the registration session.</p>
          </div>
        </body>
        </html>
      `, {
        headers: { "Content-Type": "text/html" }
      });
    }

    // Approve the session and record timestamp
    session.status = "approved";
    session.approvedAt = Date.now();
    console.log(`[Demo API] Request ID ${id} APPROVED by admin.`);

    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Demo Approved</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { background: #070A13; color: #F8FAFC; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; padding: 16px; box-sizing: border-box; }
          .card { background: #111726; border: 1px solid rgba(255, 255, 255, 0.05); padding: 40px 30px; border-radius: 16px; text-align: center; max-width: 420px; width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.6); }
          h1 { color: #10B981; font-size: 24px; margin-top: 0; font-weight: 700; }
          p { color: #94A3B8; font-size: 14px; line-height: 1.6; margin: 12px 0; }
          .token-box { background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255,255,255,0.08); padding: 8px 16px; border-radius: 8px; font-family: monospace; font-size: 15px; color: #06B6D4; display: inline-block; margin: 10px 0; }
          .btn { background: linear-gradient(135deg, #8B5CF6, #6D28D9); color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; text-decoration: none; display: inline-block; margin-top: 20px; transition: opacity 0.2s; }
          .btn:hover { opacity: 0.9; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>✓ Request Approved</h1>
          <p>Access has been successfully unlocked for request:</p>
          <div class="token-box">${id}</div>
          <p>The student's browser will automatically redirect to the workspace for the next 10 minutes.</p>
          <button onclick="window.close()" class="btn">Done</button>
        </div>
      </body>
      </html>
    `, {
      headers: { "Content-Type": "text/html" }
    });
  }

  return new Response("Invalid action", { status: 400 });
}
