// src/app/gallery/page.tsx
"use client";

import Link from "next/link";
import CurbDesigner from "@/components/CurbDesigner";
import HomePreviewRotator from "@/app/HomePreviewRotator";
import { computePrice, type Tier, type DesignConfig } from "@/lib/templates";

const CARDS: {
  tier: Tier | "texas";
  title: string;
  desc: string;
  href: string;
  priceLabel: string;
  config: Omit<DesignConfig, "address"> & { address?: string };
}[] = [
  {
    tier: "basic",
    title: "Basic",
    desc: "Clean rectangle. Black border, white fill, black numbers. Great for HOA-friendly curb appeal.",
    href: "/create",
    priceLabel: "$30",
    config: {
      tier: "basic",
      colors: { bg: "#FFFFFF", text: "#000000", border: "#000000" },
      addOns: [],
      placedIcons: [],
      address: "12345",
    },
  },
  {
    tier: "texas",
    title: "Texas",
    desc: "Texas flag-inspired style with strong contrast for visibility. Quick turnaround and bold street presence.",
    href: "/create?tier=texas",
    priceLabel: "$40",
    config: {
      tier: "basic",
      colors: { bg: "#FFFFFF", text: "#000000", border: "#000000" },
      addOns: [],
      placedIcons: [],
      address: "12345",

      // ✅ add these:
      texasMode: true,
    } as any,
  },

  {
    tier: "sports",
    title: "Sports Team",
    desc: "Pick a team and we place logos on the plate (from your /public/logos folder).",
    href: "/create?tier=sports",
    priceLabel: "$60",
    config: {
      tier: "sports",
      team: "Eagles",
      colors: { bg: "#0B0B0B", text: "#FFFFFF", border: "#FFFFFF" },
      addOns: [],
      placedIcons: [],
      address: "12345",
    },
  },
  {
    tier: "custom",
    title: "Custom",
    desc: "We’ll design it with you. Any stencil-safe theme, layout, and color plan. Final price confirmed after review.",
    href: "/create?tier=custom",
    priceLabel: "$50+",
    config: {
      tier: "custom",
      colors: { bg: "#ffffff", text: "#FFFFFF", border: "#e45555" },
      addOns: [],
      placedIcons: [],
      address: "12345",
    },
  },
];

export default function GalleryPage() {
  return (
    <div style={wrap}>
      <div style={top}>
        <h1 style={h1}>Choose a style</h1>
        <p style={subtitle}>
          Pick a package — preview it — then customize your address and options.
        </p>
      </div>

      <div style={grid}>
        {CARDS.map((c) => {
          const computed =
            c.tier === "custom" || c.tier === "texas"
              ? null
              : computePrice(c.tier as Tier, []);
          const priceText = c.priceLabel ?? (computed ? computed.label : "");

          const config: DesignConfig = {
            tier: c.config.tier,
            address: c.config.address ?? "12345",
            colors: c.config.colors,
            addOns: c.config.addOns,
            placedIcons: c.config.placedIcons,
            team: (c.config as any).team,
            activeIcon: (c.config as any).activeIcon,
            activeIconScale: (c.config as any).activeIconScale,

            // ✅ forward these:
            texasMode: (c.config as any).texasMode,
            texasNumberPlacement: (c.config as any).texasNumberPlacement,
          } as any;

          return (
            <div key={c.title} style={card} className="cc-hover">
              <div style={cardHeader}>
                <div style={cardTitle}>{c.title}</div>
                <div style={cardPrice}>{priceText}</div>
              </div>

              <div style={cardDesc}>{c.desc}</div>

              {/* PREVIEW */}
              <div style={previewWrap} aria-hidden="true">
                {c.tier === "custom" ? (
                  // ✅ use the same rotating custom preview images as the Home page
                  <div style={rotatorFrame}>
                    <HomePreviewRotator category="custom" intervalMs={2200} />
                  </div>
                ) : (
                  // default previews
                  <CurbDesigner config={config} />
                )}
              </div>

              <div style={actions}>
                <Link href={c.href} style={btnPrimary} className="cc-hover cc-btn-rainbow">
                  <span className="cc-btn-rainbow-text">Customize</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const wrap: React.CSSProperties = {
  display: "grid",
  gap: 18,
  paddingTop: 28,
  paddingLeft: 14,
  paddingRight: 14,
};

const top: React.CSSProperties = {
  paddingTop: 8,
};

const h1: React.CSSProperties = {
  margin: 0,
  fontSize: 44,
  fontWeight: 1000,
  letterSpacing: -0.4,
};

const subtitle: React.CSSProperties = {
  marginTop: 12,
  marginBottom: 0,
  opacity: 0.8,
  lineHeight: 1.4,
};

const grid: React.CSSProperties = {
  display: "grid",
  gap: 16,
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  alignItems: "start",
};

const card: React.CSSProperties = {
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 18,
  background: "#fff",
  overflow: "hidden",
  boxShadow: "0 18px 40px rgba(0,0,0,0.10)",
  display: "grid",
  gap: 0,
};

const cardHeader: React.CSSProperties = {
  padding: "16px 16px 10px",
  display: "flex",
  justifyContent: "space-between",
  gap: 10,
  alignItems: "baseline",
};

const cardTitle: React.CSSProperties = { fontWeight: 950, fontSize: 18 };
const cardPrice: React.CSSProperties = { fontWeight: 950, fontSize: 16, opacity: 0.95 };

const cardDesc: React.CSSProperties = {
  padding: "0 16px 12px",
  fontSize: 13,
  opacity: 0.78,
  lineHeight: 1.4,
  minHeight: 42,
};

const previewWrap: React.CSSProperties = {
  pointerEvents: "none",
  padding: "0 16px 12px",
};

// ✅ same “card image” feel as Home page
const rotatorFrame: React.CSSProperties = {
  width: "100%",
  height: 155,
  borderRadius: 14,
  overflow: "hidden",
  background: "#f2f2f2",
};

const actions: React.CSSProperties = {
  padding: "12px 16px 16px",
  display: "flex",
};

const btnPrimary: React.CSSProperties = {
  background: "#111",
  color: "#fff",
  padding: "12px 14px",
  borderRadius: 14,
  fontWeight: 950,
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  boxShadow: "0 14px 30px rgba(0,0,0,0.16)",
};
