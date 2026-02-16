import { NextResponse } from "next/server";

type AnyObj = Record<string, any>;

function isValidEmail(v: unknown) {
  return typeof v === "string" && v.includes("@") && v.includes(".");
}

function normalizePhone(v: unknown) {
  if (typeof v !== "string") return "";
  return v.replace(/[^0-9]/g, "");
}

function mmddyyyy(d: Date) {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = String(d.getFullYear());
  return `${mm}/${dd}/${yyyy}`;
}

function getClientIp(req: Request) {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AnyObj;

    const name = String(body?.name ?? "").trim();
    const phoneRaw = String(body?.phone ?? "").trim();
    const email = String(body?.email ?? "").trim();
    const comments = String(body?.comments ?? "").trim();

    const design = body?.design ?? null;
    const displayLayout = Array.isArray(body?.summaryLines) ? body.summaryLines : [];

    const phoneDigits = normalizePhone(phoneRaw);

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

    const rawSize = JSON.stringify(body).length;
    if (rawSize > 150_000) {
      return NextResponse.json({ error: "Payload too large." }, { status: 413 });
    }

    const now = new Date();

    // ✅ This is the ONLY thing you log (exactly like your desired output)
    const receipt = {
      createdDate: mmddyyyy(now),
      contact: {
        name,
        phone: phoneRaw,
        email,
      },
      comments,
      displayLayout,
      meta: {
        ip: getClientIp(req),
        userAgent: req.headers.get("user-agent") ?? "",
      },
    };

    console.log("NEW QUOTE REQUEST:", JSON.stringify(receipt, null, 2));

    // OPTIONAL: keep the full payload for later (email/DB) but DO NOT log it
    // const fullPayload = { ...receipt, createdAt: now.toISOString(), design };
    // await saveToDb(fullPayload) or sendEmail(fullPayload)

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Invalid request" },
      { status: 400 }
    );
  }
}
