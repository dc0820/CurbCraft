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

function makeRequestId() {
  // Works in Node + Edge runtimes that support crypto.randomUUID()
  // Fallback kept simple.
  // @ts-ignore
  return (globalThis.crypto?.randomUUID?.() as string) ?? `req_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function log(event: string, data: Record<string, unknown>) {
  // One-line JSON log = easiest to scan/filter in Vercel
  console.log(
    JSON.stringify({
      ts: new Date().toISOString(),
      level: "info",
      event,
      ...data,
    })
  );
}

export async function POST(req: Request) {
  const requestId = makeRequestId();

  try {
    const body = (await req.json()) as AnyObj;

    // OPTIONAL: basic size guard so someone can't spam a massive payload
    const rawSize = JSON.stringify(body).length;
    if (rawSize > 150_000) {
      log("quote_rejected", { requestId, reason: "payload_too_large", rawSize });
      return NextResponse.json({ error: "Payload too large." }, { status: 413 });
    }

    const name = String(body?.name ?? "").trim();
    const phoneRaw = String(body?.phone ?? "").trim();
    const email = String(body?.email ?? "").trim();
    const comments = String(body?.comments ?? "").trim();

    const design = body?.design ?? null;
    const summaryLines = Array.isArray(body?.summaryLines) ? body.summaryLines : [];

    const phoneDigits = normalizePhone(phoneRaw);

    // Minimal validation (same rule as UI)
    if (name.length < 2) {
      log("quote_rejected", { requestId, reason: "missing_name" });
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    if (!(phoneDigits.length >= 7 || isValidEmail(email))) {
      log("quote_rejected", {
        requestId,
        reason: "missing_contact",
        phoneDigitsLen: phoneDigits.length,
        hasEmail: Boolean(email),
      });
      return NextResponse.json(
        { error: "Provide a valid phone number or email." },
        { status: 400 }
      );
    }

    if (!design) {
      log("quote_rejected", { requestId, reason: "missing_design" });
      return NextResponse.json({ error: "Missing design data." }, { status: 400 });
    }

    const ip =
      req.headers.get("x-forwarded-for") ??
      req.headers.get("x-real-ip") ??
      "";

    const userAgent = req.headers.get("user-agent") ?? "";

    // Full payload (what you’ll email/store later)
    const payload = {
      createdAt: new Date().toISOString(),
      requestId,
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
        userAgent,
        ip,
      },
    };

    // Log a *summary* that is easy to scan (keep the full payload for DB/email)
    const tier =
      typeof design?.tier === "string" ? (design.tier as string) : undefined;

    log("quote_received", {
      requestId,
      tier,
      address: typeof design?.address === "string" ? design.address : undefined,
      price: typeof design?.price === "number" ? design.price : undefined,
      summaryLinesCount: summaryLines.length,
      hasComments: comments.length > 0,
      phoneLast4: phoneDigits.length >= 4 ? phoneDigits.slice(-4) : "",
      hasEmail: Boolean(email),
    });

    // If you still want the full thing in logs sometimes, do it behind a flag:
    // log("quote_payload", { requestId, payload });

    return NextResponse.json({ ok: true, requestId });
  } catch (e: any) {
    log("quote_error", {
      requestId,
      message: e?.message ?? "Invalid request",
    });

    return NextResponse.json(
      { error: e?.message ?? "Invalid request", requestId },
      { status: 400 }
    );
  }
}
