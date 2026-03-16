import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const requestId = Date.now().toString(36) + Math.random().toString(36).substr(2);

  try {
    console.log(`[api/careers:${requestId}] Starting careers application submission`);

    // Parse multipart form data
    const formData = await req.formData();
    
    // Extract form fields
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const city = formData.get("city") as string;
    const position = formData.get("position") as string;
    const experience = formData.get("experience") as string;
    const availability = formData.get("availability") as string;
    const qualification = formData.get("qualification") as string;
    const organization = formData.get("organization") as string;
    const portfolioLink = formData.get("portfolioLink") as string;
    const resumeLink = formData.get("resumeLink") as string;
    const coverLetterLink = formData.get("coverLetterLink") as string;

    // Validate required fields
    if (!fullName || !email || !phone || !city || !position) {
      console.log(`[api/careers:${requestId}] Validation failed: missing required fields`);
      return NextResponse.json(
        { error: "Missing required fields: name, email, phone, city, position" },
        { status: 400 }
      );
    }

    console.log(`[api/careers:${requestId}] Form fields validated`);
    console.log(`[api/careers:${requestId}] Resume link provided: ${resumeLink ? "yes" : "no"}`);
    console.log(`[api/careers:${requestId}] Cover letter link provided: ${coverLetterLink ? "yes" : "no"}`);
    console.log(`[api/careers:${requestId}] Portfolio link provided: ${portfolioLink ? "yes" : "no"}`);

    // Prepare payload for Apps Script
    const payload = {
      fullName,
      email,
      phone,
      city,
      position,
      experience,
      availability,
      qualification,
      organization,
      portfolioLink,
      resumeLink,
      coverLetterLink,
      submittedAt: new Date().toISOString(),
      source: "mayaakars-careers-page"
    };

    console.log(`[api/careers:${requestId}] Payload prepared`);

    // Send to Apps Script webhook
    const webhookUrl = process.env.GOOGLE_CAREERS_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error(`[api/careers:${requestId}] GOOGLE_CAREERS_WEBHOOK_URL not configured`);
      return NextResponse.json(
        { error: "Webhook URL not configured" },
        { status: 500 }
      );
    }

    console.log(`[api/careers:${requestId}] Attempting webhook POST to: ${webhookUrl}`);

    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const webhookBody = await webhookResponse.text();
    console.log(`[api/careers:${requestId}] Webhook response status: ${webhookResponse.status}`);
    console.log(`[api/careers:${requestId}] Webhook response body (first 500 chars): ${webhookBody.substring(0, 500)}`);

    // Validate webhook response
    if (!webhookResponse.ok) {
      console.error(`[api/careers:${requestId}] Webhook failed with status ${webhookResponse.status}`);
      console.error(`[api/careers:${requestId}] Full webhook body: ${webhookBody}`);
      return NextResponse.json(
        { error: "Failed to submit application. Please try again." },
        { status: 500 }
      );
    }

    // Parse webhook response
    let webhookData;
    try {
      webhookData = JSON.parse(webhookBody);
      console.log(`[api/careers:${requestId}] Webhook JSON parsed successfully`);
      console.log(`[api/careers:${requestId}] Webhook response ok flag: ${webhookData.ok}`);
    } catch {
      console.error(`[api/careers:${requestId}] Failed to parse webhook JSON`);
      console.error(`[api/careers:${requestId}] Webhook returned raw: ${webhookBody}`);
      return NextResponse.json(
        { error: "Invalid response from server" },
        { status: 500 }
      );
    }

    // Check if webhook succeeded
    if (!webhookData.ok) {
      console.error(`[api/careers:${requestId}] Webhook returned error: ${webhookData.error}`);
      return NextResponse.json(
        { error: webhookData.error || "Application submission failed" },
        { status: 500 }
      );
    }

    console.log(`[api/careers:${requestId}] Application submitted successfully - row ${webhookData.rowWritten}`);

    return NextResponse.json({
      ok: true,
      message: "Application submitted successfully",
      rowWritten: webhookData.rowWritten
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : "";
    console.error(`[api/careers:${requestId}] Error: ${errorMessage}`);
    if (errorStack) {
      console.error(`[api/careers:${requestId}] Stack: ${errorStack}`);
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
