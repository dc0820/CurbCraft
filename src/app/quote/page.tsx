"use client";

import { Suspense, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import CurbDesigner from "@/components/CurbDesigner";

type AnyObj = Record<string, any>;

const CC_GOLD = "#ffc20e";
const CC_GOLD_TEXT = "#111";

export default function QuotePage() {
  return (
    <Suspense fallback={null}>
      <QuotePageInner />
    </Suspense>
  );
}

function QuotePageInner() {
  const searchParams = useSearchParams();
  const raw = searchParams.get("design");

  const parsed = useMemo(() => {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AnyObj;
    } catch {
      return null;
    }
  }, [raw]);

  const design = parsed ?? null;

  // Comments + contact
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [comments, setComments] = useState("");

  // Submit state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitOk, setSubmitOk] = useState(false);
  const [submitErr, setSubmitErr] = useState<string>("");

  const priceLabel = design?.price?.label ?? "";

  // ✅ Display tier: prefer uiTier -> texasMode -> tier
  const displayTier =
    (design?.uiTier as string | undefined) ??
    (design?.texasMode ? "texas" : undefined) ??
    ((design?.tier ?? "basic") as string);

  const isCustom = displayTier === "custom";

  // Build a clean summary string
  const summaryLines = useMemo(() => {
    if (!design) return [];

    const cfg = design as AnyObj;
    const p = cfg.price ?? {};

    const uiTier =
      (cfg.uiTier as string | undefined) ??
      (cfg.texasMode ? "texas" : undefined) ??
      (cfg.tier as string | undefined) ??
      "";

    const lines: string[] = [];
    lines.push(`Tier: ${uiTier}`);
    lines.push(`Address: ${String(cfg.address ?? "")}`);
    if (p?.label) lines.push(`Price: ${String(p.label)}`);

    // Sports specifics
    if (cfg.tier === "sports" || uiTier === "sports") {
      if (cfg.team) lines.push(`Team: ${String(cfg.team)}`);
      if (cfg.sportsTrim) lines.push(`Curb style: ${String(cfg.sportsTrim)}`);
      if (cfg.plateStyle) lines.push(`Plate: ${String(cfg.plateStyle)}`);
      if (cfg.logoSide) lines.push(`Logo side: ${String(cfg.logoSide)}`);
      if (cfg.topBandStyle) lines.push(`Top band: ${String(cfg.topBandStyle)}`);
      if (cfg.teamBannerBorderStyle)
        lines.push(`Banner border: ${String(cfg.teamBannerBorderStyle)}`);
      lines.push(`Tint: ${cfg.tintEnabled ? "ON" : "OFF"}`);
      if (cfg.tintEnabled && cfg.tintStyle) lines.push(`Tint style: ${String(cfg.tintStyle)}`);
      lines.push(`Jersey texture: ${cfg.jerseyTexture ? "ON" : "OFF"}`);
    }

    // Basic specifics
    if (uiTier === "basic") {
      if (Array.isArray(cfg.addOns) && cfg.addOns.length)
        lines.push(`Add-ons: ${cfg.addOns.join(", ")}`);
      if (cfg.basicBgColor) lines.push(`Background preset: ${String(cfg.basicBgColor)}`);
      if (typeof cfg.basicWhiteBox !== "undefined")
        lines.push(`White address box: ${cfg.basicWhiteBox ? "ON" : "OFF"}`);
      if (cfg.basicLogoLeft) lines.push(`Logo left: ${String(cfg.basicLogoLeft)}`);
      if (cfg.basicLogoRight) lines.push(`Logo right: ${String(cfg.basicLogoRight)}`);
    }

    // Custom specifics
    if (uiTier === "custom" || cfg.tier === "custom") {
      if (cfg.colors?.bg) lines.push(`Custom BG: ${cfg.colors.bg}`);
      if (cfg.colors?.text) lines.push(`Custom Text: ${cfg.colors.text}`);
      if (cfg.colors?.border) lines.push(`Custom Border: ${cfg.colors.border}`);
    }

    return lines;
  }, [design]);

  const canSubmit = useMemo(() => {
    return (
      name.trim().length >= 2 &&
      (phone.trim().length >= 7 || email.trim().includes("@")) &&
      !!design
    );
  }, [name, phone, email, design]);

  async function submitQuote() {
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitOk(false);
    setSubmitErr("");

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          comments: comments.trim(),
          summaryLines,
          design,
        }),
      });

      const data = await res.json().catch(() => ({} as AnyObj));
      if (!res.ok) throw new Error(String(data?.error ?? "Failed to submit quote request."));

      setSubmitOk(true);
      setComments("");
    } catch (e: any) {
      setSubmitErr(e?.message ?? "Failed to submit quote request.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={page}>
      <div style={headerRow}>
        <div>
          <h1 style={title}>Get a Quote</h1>
          <p style={subtitle}>
            Review your design, then tell us any details. We’ll respond with a final quote and
            scheduling options.
          </p>
        </div>

        <div style={pricePill}>
          <div style={{ fontSize: 12, opacity: 0.75 }}>Estimated price</div>
          <div style={{ fontSize: 20, fontWeight: 900 }}>{priceLabel || "—"}</div>
        </div>
      </div>

      {!design ? (
        <div style={errorBox}>
          <div style={{ fontWeight: 900, marginBottom: 6 }}>No design data found.</div>
          <div style={{ opacity: 0.8 }}>
            Go back to Create, configure a design, then click “Get Quote for This”.
          </div>
          <div style={{ marginTop: 12 }}>
            <Link href="/create" className="cc-hover rainbow-btn" style={btnRainbow}>
              Back to Create
            </Link>
          </div>
        </div>
      ) : (
        <div style={isCustom ? singleColWrap : grid}>
          {/* Preview (HIDE ONLY FOR CUSTOM) */}
          {!isCustom && (
            <div style={card}>
              <div style={cardTitle}>Preview</div>

              <div style={previewFrame}>
                <CurbDesigner config={design as any} />
              </div>

              <div style={miniNote}>This preview matches your selection from the Create page.</div>
            </div>
          )}

          {/* Details + form (ALWAYS) */}
          <div style={card}>
            <div style={cardTitle}>Details</div>

            <div style={summaryBox}>
              <div style={{ fontWeight: 900, marginBottom: 8 }}>Selection summary</div>
              <ul style={ul}>
                {summaryLines.map((l) => (
                  <li key={l} style={li}>
                    {l}
                  </li>
                ))}
              </ul>
            </div>

            {isCustom && (
              <div style={yellowTip}>
                <strong>Custom request:</strong> describe the theme, colors, logos, and anything
                special (college / international / multiple teams, etc.). The more detail, the more
                accurate the quote.
              </div>
            )}

            <div style={{ display: "grid", gap: 10 }}>
              <div>
                <div style={label}>Your name</div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={input}
                  autoComplete="name"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <div style={label}>Phone</div>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={input}
                    inputMode="tel"
                    placeholder="(210) 555-1234"
                    autoComplete="tel"
                  />
                </div>
                <div>
                  <div style={label}>Email</div>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={input}
                    inputMode="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <div style={label}>Comments / special instructions</div>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  style={textarea}
                  placeholder={
                    isCustom
                      ? "Describe what you want (logos, colors, theme, multiple teams, etc.)"
                      : "Anything you want adjusted? (placement, sizing, notes, etc.)"
                  }
                />
              </div>
            </div>

            <div style={actions}>
              <button
                onClick={submitQuote}
                disabled={!canSubmit || isSubmitting}
                style={{
                  ...btnGold,
                  opacity: !canSubmit || isSubmitting ? 0.55 : 1,
                  cursor: !canSubmit || isSubmitting ? "not-allowed" : "pointer",
                }}
                type="button"
              >
                {isSubmitting ? "Sending..." : "Send Quote Request →"}
              </button>

              {/* ✅ Rainbow BACKGROUND button */}
              <Link href="/create" className="cc-hover rainbow-btn" style={btnRainbow}>
                Back to Create
              </Link>
            </div>

            {!canSubmit && !submitOk && !submitErr && (
              <div style={miniWarn}>Enter your name and either a phone number or email.</div>
            )}

            {submitOk && <div style={successBox}>✅ Quote request sent! We’ll reach out soon.</div>}

            {submitErr && <div style={errorInline}>❌ {submitErr}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

/* styles */
const page: CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "0 24px",
};

const headerRow: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  flexWrap: "wrap",
  alignItems: "flex-start",
  marginTop: 8,
  marginBottom: 14,
};

const title: CSSProperties = {
  margin: 0,
  fontSize: 42,
  fontWeight: 900,
  letterSpacing: -0.5,
};

const subtitle: CSSProperties = {
  marginTop: 10,
  marginBottom: 0,
  opacity: 0.75,
  fontSize: 16,
  maxWidth: 720,
};

const pricePill: CSSProperties = {
  border: "1px solid #eee",
  borderRadius: 16,
  padding: "10px 14px",
  background: "#fff",
  minWidth: 160,
  textAlign: "right",
};

const grid: CSSProperties = {
  display: "grid",
  gap: 12,
  gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
  alignItems: "start",
};

const singleColWrap: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 12,
};

const card: CSSProperties = {
  border: "1px solid #eee",
  borderRadius: 18,
  padding: 16,
  background: "#fff",
};

const cardTitle: CSSProperties = {
  fontWeight: 900,
  fontSize: 14,
  opacity: 0.8,
  marginBottom: 10,
};

const previewFrame: CSSProperties = {
  borderRadius: 16,
  overflow: "hidden",
  border: "1px solid rgba(0,0,0,0.08)",
  background: "#fafafa",
};

const summaryBox: CSSProperties = {
  background: "#fafafa",
  border: "1px solid #eee",
  borderRadius: 14,
  padding: 12,
  marginBottom: 12,
};

const ul: CSSProperties = {
  margin: 0,
  paddingLeft: 18,
  display: "grid",
  gap: 6,
};

const li: CSSProperties = {
  opacity: 0.9,
  fontSize: 14,
  lineHeight: 1.35,
};

const label: CSSProperties = { fontSize: 13, fontWeight: 900, opacity: 0.85 };

const input: CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #e7e7e7",
  outline: "none",
};

const textarea: CSSProperties = {
  width: "100%",
  minHeight: 120,
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #e7e7e7",
  outline: "none",
  resize: "vertical",
  fontFamily: "inherit",
};

const actions: CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  marginTop: 14,
};

const btnGold: CSSProperties = {
  background: CC_GOLD,
  color: CC_GOLD_TEXT,
  padding: "10px 12px",
  borderRadius: 12,
  fontWeight: 900,
  textDecoration: "none",
  display: "inline-block",
  border: "1px solid rgba(0,0,0,0.15)",
};

const miniNote: CSSProperties = {
  marginTop: 10,
  fontSize: 13,
  opacity: 0.75,
};

const miniWarn: CSSProperties = {
  marginTop: 10,
  fontSize: 13,
  opacity: 0.8,
  background: "#fff7d6",
  border: "1px solid rgba(0,0,0,0.12)",
  borderRadius: 12,
  padding: 10,
};

const yellowTip: CSSProperties = {
  background: "#fff7d6",
  border: "1px solid rgba(0,0,0,0.12)",
  borderRadius: 14,
  padding: "12px 12px",
  marginBottom: 12,
  fontSize: 14,
  lineHeight: 1.4,
};

const successBox: CSSProperties = {
  marginTop: 10,
  fontSize: 13,
  background: "#eaffea",
  border: "1px solid rgba(0,0,0,0.12)",
  borderRadius: 12,
  padding: 10,
};

const errorInline: CSSProperties = {
  marginTop: 10,
  fontSize: 13,
  background: "#ffecec",
  border: "1px solid rgba(0,0,0,0.12)",
  borderRadius: 12,
  padding: 10,
};

const errorBox: CSSProperties = {
  border: "1px solid rgba(0,0,0,0.12)",
  borderRadius: 18,
  padding: 16,
  background: "#fff",
};

const btnRainbow: CSSProperties = {
  padding: "10px 12px",
  borderRadius: 12,
  fontWeight: 900,
  textDecoration: "none",
  display: "inline-block",
  color: "#111",
  border: "1px solid rgba(0,0,0,0.12)",
};
