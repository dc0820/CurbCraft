import { NextResponse } from "next/server";

type AnyObj = Record<string, any>;

function isValidEmail(v: unknown) {
  if (typeof v !== "string") return false;
  return v.includes("@") && v.includes(".");
}

function normalizePhone(v: unknown) {
  if (typeof v !== "string") return "";
  return v.replace(/[^0-9]/g, "");
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AnyObj;

    const name = String(body?.name ?? "").trim();
    const phoneRaw = String(body?.phone ?? "").trim();
    const email = String(body?.email ?? "").trim();
    const comments = String(body?.comments ?? "").trim();

    const design = body?.design ?? null;
    const summaryLines = Array.isArray(body?.summaryLines) ? body.summaryLines : [];

    const phoneDigits = normalizePhone(phoneRaw);

    // Minimal validation (same rule as UI)
    if (name.length < 2) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    if (!(phoneDigits.length >= 7 || isValidEmail(email))) {
      return NextResponse.json(
        { error: "Provide a valid phone number or email." },
        { status: 400 }
      );
    }

    if (!design) {
      return NextResponse.json({ error: "Missing design data." }, { status: 400 });
    }

    // OPTIONAL: basic size guard so someone can't spam a massive payload
    const rawSize = JSON.stringify(body).length;
    if (rawSize > 150_000) {
      return NextResponse.json({ error: "Payload too large." }, { status: 413 });
    }

    const payload = {
      createdAt: new Date().toISOString(),
      contact: {
        name,
        phone: phoneRaw,
        phoneDigits,
        email,
      },
      comments,
      summaryLines,
      design,
      meta: {
        userAgent: req.headers.get("user-agent") ?? "",
        ip:
          req.headers.get("x-forwarded-for") ??
          req.headers.get("x-real-ip") ??
          "",
      },
    };

    // For now: log it (works locally + on server logs).
    console.log("NEW QUOTE REQUEST:", JSON.stringify(payload, null, 2));

    // Later: send email (Resend) or save to DB (Supabase) here.

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Invalid request" },
      { status: 400 }
    );
  }
}
