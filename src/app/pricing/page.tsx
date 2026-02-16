// src/app/pricing/page.tsx
import Link from "next/link";

export default function PricingPage() {
  return (
    <div style={wrap}>
      <h1 style={h1}>Pricing</h1>
      <p style={p}>Simple packages with clear upsells.</p>

      <div style={grid}>
        {/* BASIC */}
        <div style={card} className="cc-hover">
          <div style={cardTop}>
            <div style={cardTitleRow}>
              <h3 style={cardTitle}>Basic</h3>
              <span style={pill}>HOA approved</span>
            </div>
            <div style={price}>$30+</div>
          </div>

          <div style={cardBody}>
            <div style={sectionTitle}>Included</div>
            <ul style={ul}>
              <li>Rectangle base</li>
              <li>White fill</li>
              <li>Black border</li>
              <li>Black address numbers (3–6 digits)</li>
            </ul>

            <div style={sectionTitle}>Add-ons</div>
            <ul style={ul}>
              <li>
                <b>Icons</b> +$10 each
              </li>
              <li>
                <b>Background color</b> +$15 (preset options)
              </li>
              <li>
                <b>U.S. Flag Band</b> +$30
              </li>
            </ul>

            <div style={note}>Background color is a preset palette (no color wheel).</div>
          </div>
        </div>

        {/* TEXAS */}
        <div style={card} className="cc-hover">
          <div style={cardTop}>
            <div style={cardTitleRow}>
              <h3 style={cardTitle}>Texas</h3>
              <span style={{ ...pill, background: "rgba(11,19,32,.06)" }}>State pride</span>
            </div>
            <div style={price}>$40</div>
          </div>

          <div style={cardBody}>
            <div style={sectionTitle}>Included</div>
            <ul style={ul}>
              <li>Texas flag background layout</li>
              <li>High-contrast black numbers</li>
              <li>Clean edges + border treatment</li>
              <li>Weather-ready clear coat option available</li>
            </ul>

            <div style={note}>
              Texas package is a fixed style (best for quick turnarounds + strong visibility).
            </div>
          </div>
        </div>

        {/* SPORTS */}
        <div style={card} className="cc-hover">
          <div style={cardTop}>
            <div style={cardTitleRow}>
              <h3 style={cardTitle}>Sports Team</h3>
              <span style={{ ...pill, background: "rgba(255,194,14,.22)" }}>Fan favorite</span>
            </div>
            <div style={price}>$60+</div>
          </div>

          <div style={cardBody}>
            <div style={helperText}>Don&apos;t see your team? Go to Custom for a request.</div>

            <div style={sectionTitle}>Included</div>
            <ul style={ul}>
              <li>Team-themed layout</li>
              <li>Preset catalog (select a league + team)</li>
              <li>White address box</li>
              <li>Full curb top band options (price may change)</li>
            </ul>

            <div style={sectionTitle}>Add-ons</div>
            <ul style={ul}>
              <li>
                <b>Address Plate</b> box + stripe +$5 or dog tag +$10
              </li>
              <li>
                <b>Top Band</b> US flag or full sports team logo +$30
              </li>
              <li>
                <b>Jersey Texture</b> +$15
              </li>
              <li>
                <b>Gradient</b> +$30
              </li>
            </ul>
          </div>
        </div>

        {/* CUSTOM */}
        <div style={card} className="cc-hover">
          <div style={cardTop}>
            <div style={cardTitleRow}>
              <h3 style={cardTitle}>Custom</h3>
              <span style={{ ...pill, background: "rgba(34,193,200,.18)" }}>Anything goes</span>
            </div>
            <div style={price}>$50+</div>
          </div>

          <div style={cardBody}>
            <div style={sectionTitle}>How it works</div>
            <ul style={ul}>
              <li>Customer-created concept</li>
              <li>Approval required before painting</li>
              <li>Final price confirmed after review</li>
            </ul>

            <div style={note}>
              Great for landscapes, themes, military branches, pets, gradients, and unique layouts.
            </div>
          </div>
        </div>
      </div>

      {/* Button */}
      <div style={actions}>
        <Link href="/gallery" style={btnGhost} className="cc-hover rainbow-btn">
          Browse Styles
        </Link>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const wrap: React.CSSProperties = {
  maxWidth: 1040,
  margin: "0 auto",
  padding: "22px 14px 10px",
  display: "grid",
  gap: 10,
};

const h1: React.CSSProperties = { margin: 0, fontSize: 40, fontWeight: 1000 };
const p: React.CSSProperties = { margin: "2px 0 10px", opacity: 0.8 };

const grid: React.CSSProperties = {
  display: "grid",
  gap: 14,
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  alignItems: "stretch",
};

const card: React.CSSProperties = {
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 18,
  background: "#fff",
  overflow: "hidden",
  boxShadow: "0 18px 40px rgba(0,0,0,0.10)",
  display: "flex",
  flexDirection: "column",
  minHeight: 520,
};

const cardTop: React.CSSProperties = {
  padding: 16,
  borderBottom: "1px solid rgba(0,0,0,0.06)",
  background: "linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0))",
};

const cardBody: React.CSSProperties = {
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 10,
  flex: 1,
};

const cardTitleRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
};

const cardTitle: React.CSSProperties = { margin: 0, fontSize: 18, fontWeight: 950 };

const pill: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 900,
  padding: "6px 10px",
  borderRadius: 999,
  background: "rgba(0,128,198,.12)",
  border: "1px solid rgba(0,0,0,.08)",
  whiteSpace: "nowrap",
};

const price: React.CSSProperties = { fontSize: 34, fontWeight: 1000, marginTop: 10 };

const sectionTitle: React.CSSProperties = {
  marginTop: 2,
  fontWeight: 950,
  fontSize: 12,
  letterSpacing: 0.4,
  textTransform: "uppercase",
  opacity: 0.85,
};

const helperText: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 800,
  opacity: 0.75,
  lineHeight: 1.45,
};

const ul: React.CSSProperties = {
  margin: 0,
  paddingLeft: 18,
  opacity: 0.88,
  lineHeight: 1.55,
};

const note: React.CSSProperties = {
  marginTop: "auto",
  fontSize: 12,
  opacity: 0.78,
  background: "rgba(0,0,0,0.03)",
  border: "1px solid rgba(0,0,0,0.06)",
  borderRadius: 12,
  padding: 10,
};

const actions: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: 12,
};

const btnGhost: React.CSSProperties = {
  // IMPORTANT: no background here (let .rainbow-btn supply it)
  color: "#fff",
  padding: "14px 22px",
  borderRadius: 14,
  fontWeight: 950,
  textDecoration: "none",
  border: "1px solid rgba(0,0,0,0.12)",
  boxShadow: "0 16px 36px rgba(0,0,0,0.18)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
};
