// src/app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import HomeOnlySplats from "@/app/HomeOnlySplats";

export const metadata: Metadata = {
  title: "CurbCraft – Curb Address Painting",
  description: "Curb address designs + custom builder + quick quote.",
};

// ✅ ensures mobile renders at correct scale
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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

            <header className="cc-header">
              <div className="cc-headerInner cc-container">
                <nav className="cc-navLeft" aria-label="Primary">
                  <Link href="/" className="cc-navLink cc-hover cc-rainbow-hover">
                    Home
                  </Link>
                  <Link href="/gallery" className="cc-navLink cc-hover cc-rainbow-hover">
                    Gallery
                  </Link>
                  <Link href="/pricing" className="cc-navLink cc-hover cc-rainbow-hover">
                    Pricing
                  </Link>
                </nav>

                <Link href="/" className="cc-brand" aria-label="CurbCraft Home">
                  <img
                    src="/Logos/Curb-Craft-logo.png"
                    alt="CurbCraft"
                    className="cc-brandImg"
                  />
                </Link>

                <div className="cc-navRight">
                  <Link href="/faq" className="cc-faqLink cc-hover cc-rainbow-hover" aria-label="FAQ">
                    ★ FAQs ★
                  </Link>

                  <Link href="/quote" className="cc-cta cc-hover">
                    Get a Quote
                  </Link>
                </div>
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
