import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

type ContactPayload = {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  location: string;
  enquiryType?: string;
  message: string;
};

const requiredKeys: Array<keyof ContactPayload> = ["fullName", "email", "phone", "location"];

export async function POST(request: NextRequest) {
  const requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  console.log(`[api/contact:${requestId}] Incoming POST request`);

  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  console.log(`[api/contact:${requestId}] Webhook configured: ${Boolean(webhookUrl)}`);

  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
    console.log(`[api/contact:${requestId}] Payload parsed`, {
      fullName: body?.fullName,
      email: body?.email,
      phone: body?.phone,
      company: body?.company,
      location: body?.location,
      messageLength: String(body?.message ?? "").length,
    });
  } catch {
    console.error(`[api/contact:${requestId}] Invalid JSON body`);
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const missingRequired = requiredKeys.find((key) => !String(body?.[key] ?? "").trim());
  if (missingRequired) {
    console.error(`[api/contact:${requestId}] Missing required field: ${missingRequired}`);
    return NextResponse.json(
      { error: `Missing required field: ${missingRequired}` },
      { status: 400 }
    );
  }

  const leadRecord = {
    ...body,
    source: "mayaakars-contact-page",
    submittedAt: new Date().toISOString(),
  };

  if (webhookUrl) {
    try {
      console.log(`[api/contact:${requestId}] Posting to webhook...`);
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leadRecord),
        cache: "no-store",
      });

      console.log(`[api/contact:${requestId}] Webhook response status: ${response.status}`);

      if (response.ok) {
        let webhookResult: { ok?: boolean; error?: string } | null = null;
        try {
          webhookResult = (await response.json()) as { ok?: boolean; error?: string };
          console.log(`[api/contact:${requestId}] Webhook response body`, webhookResult);
        } catch {
          webhookResult = null;
          console.warn(`[api/contact:${requestId}] Webhook returned non-JSON body`);
        }

        if (!webhookResult) {
          return NextResponse.json(
            { error: "Webhook returned non-JSON response" },
            { status: 502 }
          );
        }

        if (webhookResult.ok === false) {
          console.error(`[api/contact:${requestId}] Webhook app returned ok:false`, webhookResult);
          return NextResponse.json(
            { error: webhookResult.error ?? "Webhook script returned ok:false" },
            { status: 502 }
          );
        }

        if (webhookResult.ok !== true) {
          return NextResponse.json(
            { error: "Webhook response missing ok:true" },
            { status: 502 }
          );
        }

        console.log(`[api/contact:${requestId}] Webhook accepted lead`);
        return NextResponse.json({ ok: true, destination: "webhook" });
      }

      const responseText = await response.text().catch(() => "<unable to read response text>");
      console.error(`[api/contact:${requestId}] Webhook rejected with non-200`, {
        status: response.status,
        body: responseText,
      });
    } catch {
      console.error(`[api/contact:${requestId}] Webhook request threw an exception`);
      // Fall through to local storage fallback.
    }
  }

  try {
    const fallbackPath = path.join(process.cwd(), "data", "contact-leads.jsonl");
    await fs.mkdir(path.dirname(fallbackPath), { recursive: true });
    await fs.appendFile(fallbackPath, `${JSON.stringify(leadRecord)}\n`, "utf8");
    console.warn(`[api/contact:${requestId}] Saved lead to local fallback`, { fallbackPath });
    return NextResponse.json({ ok: true, destination: "local-file" });
  } catch {
    console.error(`[api/contact:${requestId}] Failed to store contact lead in fallback`);
    return NextResponse.json(
      { error: "Failed to store contact lead" },
      { status: 502 }
    );
  }
}
