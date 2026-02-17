// curb-craft/src/app/page.tsx
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import HomePreviewRotator from "@/app/HomePreviewRotator";
import HomeOnlySplats from "@/app/HomeOnlySplats";

const HERO_IMAGE = "/Logos/Curb-welcome-page.png";

// folder has a SPACE => %20
const SPLOTCH = {
  babyBlue: "/Logos/Splotch%20Paint/splotch-baby-blue.png",
  babyBlue2Small: "/Logos/Splotch%20Paint/splotch-baby-blue-2-small.png",
  babyBlue3: "/Logos/Splotch%20Paint/splotch-baby-blue-3.png",
  big: "/Logos/Splotch%20Paint/splotch-big.png",
  blue: "/Logos/Splotch%20Paint/splotch-blue.png",
  burntOrange: "/Logos/Splotch%20Paint/splotch-burnt-orange.png",
  burntOrange2: "/Logos/Splotch%20Paint/splotch-burnt-orange-2.png",
  darkPink: "/Logos/Splotch%20Paint/splotch-dark-pink.png",
  gold: "/Logos/Splotch%20Paint/splotch-gold.png",
  gold2: "/Logos/Splotch%20Paint/splotch-gold-2.png",
  hotPink: "/Logos/Splotch%20Paint/splotch-hot-pink.png",
  hotPink2: "/Logos/Splotch%20Paint/splotch-hot-pink-2.png",
  lightBabyBlue: "/Logos/Splotch%20Paint/splotch-light-baby-blue.png",
  lightGreen: "/Logos/Splotch%20Paint/splotch-light-green.png",
  lightRed: "/Logos/Splotch%20Paint/splotch-light-red.png",
  limeGreen: "/Logos/Splotch%20Paint/splotch-lime-green.png",
  navyBlue: "/Logos/Splotch%20Paint/splotch-navy-blue.png",
  orange: "/Logos/Splotch%20Paint/splotch-orange.png",
  orange2: "/Logos/Splotch%20Paint/splotch-orange-2.png",
  red: "/Logos/Splotch%20Paint/splotch-red.png",
  yellowLimeGreen: "/Logos/Splotch%20Paint/splotch-yellow-lime-green.png",
} as const;

// seam must match teal plate left/right
const SEAM_LEFT = "22%";
const SEAM_RIGHT = "22%";

// “sticker” sizing
const SPLAT_SM = 210;
const SPLAT_MD = 260;
const SPLAT_LG = 320;

type SplatItem = {
  src: string;
  w: number;
  h: number;
  style: CSSProperties;
};

function RainbowText({
  text,
  colors,
  className,
}: {
  text: string;
  colors: string[];
  className?: string;
}) {
  const chars = text.split("");
  return (
    <span className={className} style={{ display: "inline-block" }}>
      {chars.map((ch, i) => {
        const isSpace = ch === " ";
        const color = colors[i % colors.length];
        return (
          <span
            key={`${ch}-${i}`}
            style={{
              color: isSpace ? "transparent" : color,
              display: "inline-block",
              width: isSpace ? 14 : undefined,
            }}
          >
            {isSpace ? " " : ch}
          </span>
        );
      })}
    </span>
  );
}

export default function HomePage() {
  // HERO: “sticker-like” splats spread out
  const heroSplats: SplatItem[] = [
    // left side cluster (spread)
    {
      src: SPLOTCH.blue,
      w: SPLAT_LG,
      h: SPLAT_LG,
      style: { left: -40, top: 60, opacity: 0.25, transform: "rotate(-6deg)" },
    },
    {
      src: SPLOTCH.gold,
      w: SPLAT_MD,
      h: SPLAT_MD,
      style: { left: -45, top: 145, opacity: 0.65, transform: "rotate(8deg)" },
    },
    {
      src: SPLOTCH.darkPink,
      w: SPLAT_MD,
      h: SPLAT_MD,
      style: { left: 155, top: -40, opacity: 0.95, transform: "rotate(10deg)" },
    },

    // right side cluster
    {
      src: SPLOTCH.hotPink,
      w: SPLAT_LG,
      h: SPLAT_LG,
      style: { right: 50, top: 170, opacity: 0.55, transform: "rotate(6deg)" },
    },
    {
      src: SPLOTCH.limeGreen,
      w: SPLAT_MD,
      h: SPLAT_MD,
      style: { right: 240, top: 210, opacity: 0.9, transform: "rotate(-8deg)" },
    },
    {
      src: SPLOTCH.lightBabyBlue,
      w: SPLAT_MD,
      h: SPLAT_MD,
      style: { right: 20, top: -55, opacity: 0.18, transform: "rotate(40deg)" },
    },

    // extra “filler” splats spread (not centered)
    {
      src: SPLOTCH.orange,
      w: SPLAT_MD,
      h: SPLAT_MD,
      style: { left: 430, top: -20, opacity: 0.3, transform: "rotate(-12deg)" },
    },
    {
      src: SPLOTCH.red,
      w: SPLAT_MD,
      h: SPLAT_MD,
      style: { right: 630, top: 185, opacity: 0.77, transform: "rotate(-1deg)" },
    },

    // BIG splat: use lightly, off to a side
    {
      src: SPLOTCH.big,
      w: 520,
      h: 510,
      style: { left: 380, top: 120, opacity: 0.19, transform: "rotate(-4deg)" },
    },
  ];

  // GALLERY: splats “cover the whole area” but still behind cards
  const gallerySplats: SplatItem[] = [
    // top edges
    {
      src: SPLOTCH.babyBlue3,
      w: SPLAT_MD,
      h: SPLAT_MD,
      style: { left: 40, top: -40, opacity: 0.7, transform: "rotate(-10deg)" },
    },
    {
      src: SPLOTCH.gold2,
      w: SPLAT_MD,
      h: SPLAT_MD,
      style: { left: 260, top: 20, opacity: 0.55, transform: "rotate(8deg)" },
    },
    {
      src: SPLOTCH.navyBlue,
      w: SPLAT_MD,
      h: SPLAT_MD,
      style: { right: 240, top: -30, opacity: 0.55, transform: "rotate(-6deg)" },
    },
    {
      src: SPLOTCH.hotPink2,
      w: SPLAT_MD,
      h: SPLAT_MD,
      style: { right: 40, top: 30, opacity: 0.55, transform: "rotate(12deg)" },
    },

    // mid edges
    {
      src: SPLOTCH.yellowLimeGreen,
      w: SPLAT_MD,
      h: SPLAT_MD,
      style: { left: -10, top: 60, opacity: 0.94, transform: "rotate(4deg)" },
    },
    {
      src: SPLOTCH.orange2,
      w: SPLAT_MD,
      h: SPLAT_MD,
      style: { right: 240, top: 230, opacity: 0.8, transform: "rotate(-10deg)" },
    },

    // bottom edges
    {
      src: SPLOTCH.lightGreen,
      w: SPLAT_SM,
      h: SPLAT_SM,
      style: { left: 0, bottom: 5, opacity: 0.9, transform: "rotate(-90deg)" },
    },
    {
      src: SPLOTCH.burntOrange,
      w: SPLAT_SM,
      h: SPLAT_SM,
      style: { right: 10, bottom: 0, opacity: 0.88, transform: "rotate(10deg)" },
    },
    {
      src: SPLOTCH.lightRed,
      w: SPLAT_SM,
      h: SPLAT_SM,
      style: { left: 220, bottom: 0, opacity: 0.95, transform: "rotate(12deg)" },
    },
  ];

  // Color plans
  const curbColors = ["#01284e", "#064297", "#0b77eb", "#64c7ff"];
  const craftColors = ["#ff2d2d", "#ff8a2a", "#ffd23a", "#a7e22e", "#22c1c8"];
  const galleryColors = ["#ff2d2d", "#ff8a2a", "#ffd23a", "#a7e22e", "#22c1c8", "#2e86ff", "#b44cff"];

  return (
    <div style={pageWrap}>
      {/* HERO */}
      <section style={heroOuter}>
        <div style={heroFrame}>
          <Image
            src={HERO_IMAGE}
            alt="Curb painting hero"
            fill
            priority
            style={{ objectFit: "cover", objectPosition: "center 57%" }}
          />

          {/* Darken photo only */}
          <div style={heroOverlay} />

          {/* ✅ Paint splats: in front of photo + overlay, but under text */}
          <HomeOnlySplats />

          {/* Sticker splats (also under text) */}
          {heroSplats.map((s, i) => {
            const isTopLayer = s.src === SPLOTCH.gold || s.src === SPLOTCH.red;
            const isBlue = s.src === SPLOTCH.blue;
            const z = isTopLayer ? 16 : isBlue ? 12 : 14;

            return (
              <div
                key={`hero-splat-wrap-${i}`}
                style={{
                  ...splotchHeroWrap,
                  zIndex: z,
                  width: s.w,
                  height: s.h,
                  ...s.style,
                }}
              >
                <Image src={s.src} alt="" fill style={{ objectFit: "contain" }} />
              </div>
            );
          })}

          {/* Text ALWAYS on top */}
          <div style={heroContent}>
            <h1 style={heroTitle} className="cc-heroTitle">
              <span className="cc-stroke-black">
                <RainbowText text="CURB" colors={curbColors} />
                <span style={{ display: "inline-block", width: 16 }} />
                <RainbowText text="CRAFT" colors={craftColors} />
              </span>
              <br />
              <span style={{ color: "#22c1c8" }} className="cc-stroke-black">
                CUSTOMS
              </span>
            </h1>
              <div className="cc-taglinePill" style={taglinePill}>
                Transforming Curbs, One Design a Time!
              </div>
            </div>
        </div>
      </section>

      {/* GALLERY */}
      <section style={galleryOuter}>
        <div style={leftBlock} />
        <div style={rightBlock} />
        <div style={centerTealPlate} />

        <div style={leftWedgeWrap}>
          <div style={leftHotTop} />
          <div style={leftHotBottom} />
        </div>

        <div style={rightWedgeWrap}>
          <div style={rightYellowTop} />
          <div style={rightYellowBottom} />
        </div>

        {gallerySplats.map((s, i) => (
          <div
            key={`gallery-splat-wrap-${i}`}
            style={{
              ...splotchGalleryWrap,
              width: s.w,
              height: s.h,
              ...s.style,
            }}
          >
            <Image src={s.src} alt="" fill style={{ objectFit: "contain" }} />
          </div>
        ))}

        <div className="cc-container" style={galleryInner}>
          <div style={galleryTitle} className="cc-galleryTitle">
            <span className="cc-stroke-black" style={galleryTitleRainbow}>
              <RainbowText text="GALLERY" colors={galleryColors} />
            </span>
          </div>

          <div style={cardsRow} className="cc-cards3">
            <div style={card}>
              <div style={cardImageWrap}>
                <HomePreviewRotator category="basic" intervalMs={2200} />
              </div>
              <div style={cardTextWrap}>
                <div style={cardHeading}>BASIC DESIGNS</div>
                <div style={cardSub}>Simple Black &amp; White</div>
              </div>
            </div>

            <div style={card}>
              <div style={cardImageWrap}>
                <HomePreviewRotator category="sports" intervalMs={2200} />
              </div>
              <div style={cardTextWrap}>
                <div style={cardHeading}>Show Your Team Pride!</div>
                <div style={cardSub}>All Leagues &amp; Colors</div>
              </div>
            </div>

            <div style={card}>
              <div style={cardImageWrap}>
                <HomePreviewRotator category="custom" intervalMs={2200} />
              </div>
              <div style={cardTextWrap}>
                <div style={cardHeading}>CUSTOM DESIGNS</div>
                <div style={cardSub}>Fully Personalized</div>
              </div>
            </div>
          </div>

          <div style={makeOwnWrap}>
            <div style={{ fontSize: 22, lineHeight: 1 }}>🎨</div>

            {/* ✅ now animated like Pricing page */}
            <Link href="/create" style={makeOwnBtnRainbow} className="cc-hover rainbow-btn">
              MAKE YOUR OWN DESIGN
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const pageWrap: CSSProperties = { width: "100%", position: "relative" };

/* HERO */
const heroOuter: CSSProperties = { background: "#fff" };

const heroFrame: CSSProperties = {
  position: "relative",
  width: "100%",
  height: 380,
  overflow: "hidden",
};

const heroOverlay: CSSProperties = {
  position: "absolute",
  inset: 0,
  background: "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.36) 100%)",
  zIndex: 2,
};

const heroContent: CSSProperties = {
  position: "absolute",
  inset: 0,
  zIndex: 20,
  display: "grid",
  placeItems: "center",
  textAlign: "center",
  padding: "44px 16px 18px",
};

const heroTitle: CSSProperties = {
  margin: 0,
  fontSize: 64,
  transform: "translateY(-35px)",
};

const taglinePill: CSSProperties = {
  marginTop: 10,
  display: "inline-block",
  padding: "10px 16px",
  borderRadius: 10,
  background: "rgba(105, 86, 170, 0.92)",
  color: "#fff",
  fontWeight: 900,
  fontSize: 14,
  boxShadow: "0 12px 28px rgba(0,0,0,0.25)",
};

const splotchHeroWrap: CSSProperties = {
  position: "absolute",
  pointerEvents: "none",
  mixBlendMode: "normal",
};

/* GALLERY */
const galleryOuter: CSSProperties = {
  position: "relative",
  overflow: "visible",
  paddingBottom: 30,
  background: "var(--cc-teal)",
};

const leftBlock: CSSProperties = {
  position: "absolute",
  left: 0,
  top: 0,
  bottom: 0,
  width: SEAM_LEFT,
  background: "var(--cc-hotpink)",
  zIndex: 0,
};

const rightBlock: CSSProperties = {
  position: "absolute",
  right: 0,
  top: 0,
  bottom: 0,
  width: SEAM_RIGHT,
  background: "var(--cc-yellow)",
  zIndex: 0,
};

const centerTealPlate: CSSProperties = {
  position: "absolute",
  left: SEAM_LEFT,
  right: SEAM_RIGHT,
  top: 0,
  bottom: 0,
  background: "rgba(34,193,200,0.98)",
  zIndex: 0,
};

const splotchGalleryWrap: CSSProperties = {
  position: "absolute",
  zIndex: 6,
  pointerEvents: "none",
  mixBlendMode: "normal",
  filter: "drop-shadow(0 10px 16px rgba(0,0,0,0.18))",
};

/* --- RIGHT TRIANGLE WEDGES --- */
const TRI_TOP = -140;
const TRI_H = 278;

const leftWedgeWrap: CSSProperties = {
  position: "absolute",
  left: 0,
  top: TRI_TOP,
  width: SEAM_LEFT,
  height: TRI_H,
  zIndex: 3,
  pointerEvents: "none",
};

const leftHotTop: CSSProperties = {
  position: "absolute",
  left: 0,
  top: 0,
  width: "100%",
  height: "50%",
  background: "var(--cc-hotpink)",
  clipPath: "polygon(0 0, 100% 100%, 0 100%)",
};

const leftHotBottom: CSSProperties = {
  position: "absolute",
  left: 0,
  bottom: 0,
  width: "100%",
  height: "50%",
  background: "var(--cc-hotpink)",
  clipPath: "polygon(0 0, 100% 0, 0 100%)",
};

const rightWedgeWrap: CSSProperties = {
  position: "absolute",
  right: 0,
  top: TRI_TOP,
  width: SEAM_RIGHT,
  height: TRI_H,
  zIndex: 3,
  pointerEvents: "none",
};

const rightYellowTop: CSSProperties = {
  position: "absolute",
  right: 0,
  top: 0,
  width: "100%",
  height: "50%",
  background: "var(--cc-yellow)",
  clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
};

const rightYellowBottom: CSSProperties = {
  position: "absolute",
  right: 0,
  bottom: 0,
  width: "100%",
  height: "50%",
  background: "var(--cc-yellow)",
  clipPath: "polygon(100% 0, 0 0, 100% 100%)",
};

/* content */
const galleryInner: CSSProperties = {
  position: "relative",
  zIndex: 10,
  paddingTop: 16,
  paddingBottom: 26,
};

const galleryTitle: CSSProperties = {
  textAlign: "center",
  marginTop: 6,
  marginBottom: 12,
};

const galleryTitleRainbow: CSSProperties = {
  fontSize: 58,
  display: "inline-block",
};

const cardsRow: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 280px)",
  justifyContent: "center",
  gap: 24,
  marginTop: 20,
};

const card: CSSProperties = {
  background: "#fff",
  borderRadius: 14,
  boxShadow: "0 20px 40px rgba(0,0,0,0.18)",
  overflow: "hidden",
  border: "1px solid rgba(0,0,0,0.08)",
};

const cardImageWrap: CSSProperties = {
  position: "relative",
  width: "100%",
  height: 155,
  background: "#f2f2f2",
};

const cardTextWrap: CSSProperties = {
  padding: "14px 14px 16px",
  textAlign: "center",
};

const cardHeading: CSSProperties = { fontWeight: 1000 as any, letterSpacing: 0.4 };
const cardSub: CSSProperties = { marginTop: 6, opacity: 0.8 };

const makeOwnWrap: CSSProperties = {
  marginTop: 18,
  display: "grid",
  gap: 10,
  justifyItems: "center",
};

/**
 * ✅ IMPORTANT:
 * No static background here — rainbow-btn class handles the animated gradient.
 */
const makeOwnBtnRainbow: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  padding: "12px 18px",
  borderRadius: 999,
  fontWeight: 1000 as any,
  textDecoration: "none",
  border: "1px solid rgba(0,0,0,0.10)",
  boxShadow: "0 18px 36px rgba(0,0,0,0.22)",
  textShadow: "0 3px 0 rgba(0,0,0,0.35)",
};
