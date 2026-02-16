// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import HomeOnlySplats from "@/app/HomeOnlySplats";

export const metadata: Metadata = {
  title: "CurbCraft – Curb Address Painting",
  description: "Curb address designs + custom builder + quick quote.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="cc-stage">
          <div className="cc-underlay" aria-hidden="true" />

          <div className="cc-splats" aria-hidden="true">
            <img className="cc-splat cc-splat-pink" src="/Logos/paint/paint-pink.png" alt="" />
            <img className="cc-splat cc-splat-purple" src="/Logos/paint/paint-purple.png" alt="" />
            <img className="cc-splat cc-splat-yellow" src="/Logos/paint/paint-yellow.png" alt="" />
            <img className="cc-splat cc-splat-green" src="/Logos/paint/paint-green.png" alt="" />
          </div>

          <div className="cc-paper">
            <HomeOnlySplats />

            <header style={styles.header}>
              <div className="cc-container" style={styles.headerInner}>
                <Link href="/" style={styles.brand} aria-label="CurbCraft Home">
                  <img src="/Logos/Curb-Craft-logo.png" alt="CurbCraft" style={styles.brandImg} />
                </Link>

                <nav style={styles.nav} aria-label="Primary">
                  <div style={styles.navLeft}>
                    <Link href="/" style={styles.navLink} className="cc-hover cc-rainbow-hover">
                      Home
                    </Link>
                    <Link href="/gallery" style={styles.navLink} className="cc-hover cc-rainbow-hover">
                      Gallery
                    </Link>
                    <Link href="/pricing" style={styles.navLink} className="cc-hover cc-rainbow-hover">
                      Pricing
                    </Link>
                  </div>

                  <div style={styles.navRight}>
                    <Link href="/faq" style={styles.faqLink} className="cc-hover cc-rainbow-hover" aria-label="FAQ">
                      ★ FAQs ★
                    </Link>

                    <Link href="/quote" style={styles.cta} className="cc-hover">
                      Get a Quote
                    </Link>
                  </div>
                </nav>
              </div>
            </header>

            <main className="cc-shell">{children}</main>

            <footer className="cc-footer-tight">
              <div className="cc-container cc-footer-inner">
                <div className="cc-footer-based">
                  Based in{" "}
                  <span className="cc-flagText" style={{ fontWeight: 950, fontStyle: "italic" }}>
                    San Antonio
                  </span>
                </div>
              </div>

              <div className="cc-footer-bottom">
                © {new Date().getFullYear()} CurbCraft — Created by Daniel Cook
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}

const styles: Record<string, CSSProperties> = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 80,
    background: "#fff",
    borderBottom: "1px solid rgba(0,0,0,0.10)",
  },
  headerInner: {
    position: "relative",
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

    // ✅ NEW: pull nav inward a bit
    padding: "0 14px",
  },

  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  navLeft: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },

  brand: {
    position: "absolute",
    left: "50%",
    top: -15,
    transform: "translateX(-50%)",
    zIndex: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "auto",
  },
  brandImg: {
    width: 180,
    height: "auto",
    filter: "drop-shadow(0 10px 14px rgba(0,0,0,0.25))",
  },

  navLink: {
    fontWeight: 800,
    fontSize: 14,
    padding: "10px 12px",
    borderRadius: 12,
  },

  faqLink: {
    fontWeight: 900,
    fontSize: 14,
    padding: "10px 12px",
    borderRadius: 12,
    letterSpacing: 0.3,
    opacity: 0.95,
  },

  cta: {
    marginLeft: 8,
    background: "linear-gradient(90deg, var(--cc-gold), var(--cc-gold))",
    color: "#111",
    fontWeight: 900,
    padding: "10px 14px",
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.10)",
    boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
  },
};
