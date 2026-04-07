import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

type CareerPayload = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  position: string;
  experience: string;
  availability: string;
  qualification: string;
  organization: string;
  portfolioLink: string;
  resumeLink: string;
  coverLetterLink: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REQUIRED_FIELDS: Array<keyof CareerPayload> = [
  "fullName",
  "email",
  "phone",
  "city",
  "position",
  "resumeLink",
];
const WEBHOOK_TIMEOUT_MS = 10000;

const MAX_LENGTH: Record<keyof CareerPayload, number> = {
  fullName: 120,
  email: 160,
  phone: 40,
  city: 120,
  position: 120,
  experience: 80,
  availability: 80,
  qualification: 160,
  organization: 160,
  portfolioLink: 500,
  resumeLink: 500,
  coverLetterLink: 500,
};

function toCleanString(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

function normalizePayload(formData: FormData): CareerPayload {
  return {
    fullName: toCleanString(formData.get("fullName")),
    email: toCleanString(formData.get("email")),
    phone: toCleanString(formData.get("phone")),
    city: toCleanString(formData.get("city")),
    position: toCleanString(formData.get("position")),
    experience: toCleanString(formData.get("experience")),
    availability: toCleanString(formData.get("availability")),
    qualification: toCleanString(formData.get("qualification")),
    organization: toCleanString(formData.get("organization")),
    portfolioLink: toCleanString(formData.get("portfolioLink")),
    resumeLink: toCleanString(formData.get("resumeLink")),
    coverLetterLink: toCleanString(formData.get("coverLetterLink")),
  };
}

function isValidUrl(value: string) {
  if (!value) return true;

  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function validatePayload(payload: CareerPayload) {
  const missingField = REQUIRED_FIELDS.find((field) => !payload[field]);
  if (missingField) {
    return `Missing required field: ${missingField}`;
  }

  if (!EMAIL_PATTERN.test(payload.email)) {
    return "Please enter a valid email address.";
  }

  const oversizedField = (Object.keys(MAX_LENGTH) as Array<keyof CareerPayload>).find(
    (field) => payload[field].length > MAX_LENGTH[field]
  );
  if (oversizedField) {
    return `${oversizedField} is too long.`;
  }

  if (!isValidUrl(payload.resumeLink)) {
    return "Resume link must be a valid URL.";
  }

  if (!isValidUrl(payload.portfolioLink)) {
    return "Portfolio link must be a valid URL.";
  }

  if (!isValidUrl(payload.coverLetterLink)) {
    return "Cover letter link must be a valid URL.";
  }

  return null;
}

async function appendFallbackRecord(fileName: string, record: unknown) {
  const fallbackPath = path.join(process.cwd(), "data", fileName);
  await fs.mkdir(path.dirname(fallbackPath), { recursive: true });
  await fs.appendFile(fallbackPath, `${JSON.stringify(record)}\n`, "utf8");
  return fallbackPath;
}

export async function POST(req: NextRequest) {
  const requestId = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

  try {
    const formData = await req.formData();
    const payload = normalizePayload(formData);
    const validationError = validatePayload(payload);

    if (validationError) {
      console.error(`[api/careers:${requestId}] ${validationError}`);
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const record = {
      ...payload,
      submittedAt: new Date().toISOString(),
      source: "mayaakars-careers-page",
    };

    const webhookUrl = process.env.GOOGLE_CAREERS_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        const webhookResponse = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(record),
          signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
        });

        const webhookData = (await webhookResponse.json().catch(() => null)) as
          | { ok?: boolean; error?: string; rowWritten?: number }
          | null;

        if (webhookResponse.ok && webhookData?.ok === true) {
          return NextResponse.json({
            ok: true,
            destination: "webhook",
            rowWritten: webhookData.rowWritten,
          });
        }

        if (webhookData?.error) {
          console.error(`[api/careers:${requestId}] Webhook returned an error`, webhookData);
        } else {
          console.error(`[api/careers:${requestId}] Webhook did not confirm success`);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown webhook error";
        console.error(`[api/careers:${requestId}] Webhook request failed: ${message}`);
      }
    } else {
      console.warn(`[api/careers:${requestId}] GOOGLE_CAREERS_WEBHOOK_URL not configured`);
    }

    const fallbackPath = await appendFallbackRecord("career-applications.jsonl", record);
    console.warn(`[api/careers:${requestId}] Saved application to local fallback`, {
      fallbackPath,
    });
    return NextResponse.json({ ok: true, destination: "local-file" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[api/careers:${requestId}] Error: ${message}`);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
