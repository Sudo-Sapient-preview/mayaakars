import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

type ContactPayload = {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  location: string;
  enquiryType?: string;
  message: string;
};

const REQUIRED_KEYS: Array<keyof ContactPayload> = ["fullName", "email", "phone", "location"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WEBHOOK_TIMEOUT_MS = 10000;

const MAX_LENGTH: Record<keyof ContactPayload, number> = {
  fullName: 120,
  email: 160,
  phone: 40,
  company: 120,
  location: 120,
  enquiryType: 120,
  message: 4000,
};

function toCleanString(value: FormDataEntryValue | string | null | undefined) {
  return String(value ?? "").trim();
}

function normalizePayload(input: Partial<ContactPayload>): ContactPayload {
  return {
    fullName: toCleanString(input.fullName),
    email: toCleanString(input.email),
    phone: toCleanString(input.phone),
    company: toCleanString(input.company),
    location: toCleanString(input.location),
    enquiryType: toCleanString(input.enquiryType),
    message: toCleanString(input.message),
  };
}

function validatePayload(payload: ContactPayload) {
  const missingRequired = REQUIRED_KEYS.find((key) => !payload[key]);
  if (missingRequired) {
    return `Missing required field: ${missingRequired}`;
  }

  if (!EMAIL_PATTERN.test(payload.email)) {
    return "Please enter a valid email address.";
  }

  const oversizedField = (Object.keys(MAX_LENGTH) as Array<keyof ContactPayload>).find(
    (key) => (payload[key] ?? "").length > MAX_LENGTH[key]
  );

  if (oversizedField) {
    return `${oversizedField} is too long.`;
  }

  return null;
}

async function appendFallbackRecord(fileName: string, record: unknown) {
  const fallbackPath = path.join(process.cwd(), "data", fileName);
  await fs.mkdir(path.dirname(fallbackPath), { recursive: true });
  await fs.appendFile(fallbackPath, `${JSON.stringify(record)}\n`, "utf8");
  return fallbackPath;
}

export async function POST(request: NextRequest) {
  const requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  let body: ContactPayload;
  try {
    body = normalizePayload((await request.json()) as Partial<ContactPayload>);
  } catch {
    console.error(`[api/contact:${requestId}] Invalid JSON body`);
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const validationError = validatePayload(body);
  if (validationError) {
    console.error(`[api/contact:${requestId}] ${validationError}`);
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const leadRecord = {
    ...body,
    source: "mayaakars-contact-page",
    submittedAt: new Date().toISOString(),
  };

  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leadRecord),
        cache: "no-store",
        signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
      });

      if (response.ok) {
        const webhookResult = (await response.json().catch(() => null)) as
          | { ok?: boolean; error?: string }
          | null;

        if (webhookResult?.ok === true) {
          return NextResponse.json({ ok: true, destination: "webhook" });
        }

        if (webhookResult?.ok === false) {
          console.error(
            `[api/contact:${requestId}] Webhook responded with ok:false`,
            webhookResult
          );
        } else {
          console.error(
            `[api/contact:${requestId}] Webhook returned an unexpected response body`
          );
        }
      } else {
        const responseText = await response.text().catch(() => "<unreadable>");
        console.error(`[api/contact:${requestId}] Webhook rejected submission`, {
          status: response.status,
          body: responseText,
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown webhook error";
      console.error(`[api/contact:${requestId}] Webhook request failed: ${message}`);
    }
  }

  try {
    const fallbackPath = await appendFallbackRecord("contact-leads.jsonl", leadRecord);
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
