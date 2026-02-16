// src/app/faq/page.tsx
import type { CSSProperties } from "react";
import Link from "next/link";

type FAQ = {
  q: string;
  a: string;
};

const FAQS: FAQ[] = [
   {
    q: "When will you offer sports and custom designs?",
    a: "My stencil machine is currently broken and I am waiting on a replacement. At the moment, available options include the Basic design, Upper Flag option, and Texas plaque. Sports and full custom designs will return once the equipment is restored.",
  },
  {
    q: "Do you travel outside of San Antonio?",
    a: "For now, I’m only serving the local Bexar County area. Trips to Austin require a travel fee, and anything further will depend on distance.",
  },
  {
    q: "How long will my curb painting last?",
    a: "My curb paintings typically last 2+ years. I add a clear coat for extra protection and longevity. For that fresh “shine” again, a clear coat every 6 months is recommended.",
  },
  {
    q: "Is curb painting legal?",
    a: "Curb painting is legal in San Antonio, but it’s subject to local regulations. Property owners should follow the San Antonio Property Maintenance Code guidelines and check with their HOA for any additional rules or restrictions.",
  },
  {
    q: "I customized and requested a quote—what if I haven’t heard back yet?",
    a: "If you sent a request through the “Get a Quote” link with all your information, I’ll get back to you via text or phone call as soon as I can.",
  },
];

export default function FAQPage() {
  return (
    <div style={wrap}>
      <div style={top}>
        <h1 style={h1}>FAQs</h1>
        <p style={subtitle}>
          Quick answers about service area, durability, rules, and quoting.
        </p>
      </div>

      <div style={grid}>
        {FAQS.map((f) => (
          <div key={f.q} style={card} className="cc-hover">
            <div style={qRow}>
              <div style={qIcon}>★</div>
              <div style={qText}>{f.q}</div>
            </div>
            <div style={aText}>{f.a}</div>
          </div>
        ))}
      </div>

      <div style={ctaRow}>
        <Link href="/quote" style={cta} className="cc-hover">
          Get a Quote
        </Link>
        <Link href="/gallery" style={ghost} className="cc-hover cc-rainbow-hover">
          Browse Styles
        </Link>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const wrap: CSSProperties = {
  maxWidth: 1040,
  margin: "0 auto",
  padding: "18px 14px 10px",
  display: "grid",
  gap: 16,
};

const top: CSSProperties = {
  paddingTop: 10, // gives breathing room under the header strip
};

const h1: CSSProperties = {
  margin: 0,
  fontSize: 44,
  fontWeight: 1000,
  letterSpacing: -0.4,
};

const subtitle: CSSProperties = {
  marginTop: 10,
  marginBottom: 0,
  opacity: 0.8,
  lineHeight: 1.45,
  maxWidth: 760,
};

const grid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: 14,
  alignItems: "start",
};

const card: CSSProperties = {
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 18,
  background: "#fff",
  boxShadow: "0 18px 40px rgba(0,0,0,0.10)",
  padding: 16,
  display: "grid",
  gap: 10,
};

const qRow: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 10,
};

const qIcon: CSSProperties = {
  width: 26,
  height: 26,
  borderRadius: 10,
  display: "grid",
  placeItems: "center",
  fontWeight: 1000,
  background: "rgba(255,194,14,.22)",
  border: "1px solid rgba(0,0,0,0.08)",
  flex: "0 0 auto",
  marginTop: 1,
};

const qText: CSSProperties = {
  fontWeight: 950,
  fontSize: 15,
  lineHeight: 1.35,
};

const aText: CSSProperties = {
  fontSize: 13,
  opacity: 0.82,
  lineHeight: 1.55,
};

const ctaRow: CSSProperties = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
  paddingTop: 6,
};

const cta: CSSProperties = {
  background: "#111",
  color: "#fff",
  padding: "12px 14px",
  borderRadius: 14,
  fontWeight: 950,
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 14px 30px rgba(0,0,0,0.16)",
};

const ghost: CSSProperties = {
  background: "rgba(0,0,0,0.04)",
  padding: "12px 14px",
  borderRadius: 14,
  fontWeight: 950,
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid rgba(0,0,0,0.08)",
};
