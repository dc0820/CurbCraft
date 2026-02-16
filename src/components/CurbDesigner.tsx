// src/components/CurbDesigner.tsx
"use client";

import { useMemo } from "react";
import type { DesignConfig, LogoSide, TeamBannerBorderStyle, TintStyle } from "@/lib/templates";
import { getBasicLogoSrc, getTeamConfigByLabel } from "@/lib/templates";

type Props = {
  config: DesignConfig;
};

type SportsTrim = "main" | "full";
type PlateStyle = "striped" | "plain" | "dogtag";
type TopBandStyle = "flag" | "team";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function lighten(hex: string, amount: number) {
  const c = hex.replace("#", "");
  const num = parseInt(c, 16);
  const r = Math.min(255, ((num >> 16) & 0xff) + 255 * amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + 255 * amount);
  const b = Math.min(255, (num & 0xff) + 255 * amount);
  return `rgb(${r}, ${g}, ${b})`;
}

/** 5-point star path */
function starPath(cx: number, cy: number, outerR: number, innerR: number) {
  const pts: Array<[number, number]> = [];
  const start = -Math.PI / 2;
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = start + (i * Math.PI) / 5;
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return `M ${pts.map((p) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(" L ")} Z`;
}

export default function CurbDesigner({ config }: Props) {
  const W = 980;
  const BASE_H = 260;

  const fontFamily =
    "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";

  const isSports = config.tier === "sports";
  const isBasic = config.tier === "basic";

  // ✅ Texas mode (UI-only fields passed via `as any` in page.tsx)
  const texasMode = Boolean((config as any).texasMode);
  const texasNumberPlacement = (((config as any).texasNumberPlacement ?? "white") as
    | "white"
    | "center");

  const teamCfg = isSports ? getTeamConfigByLabel(config.team as any) : undefined;

  // ✅ Basic logos (optional)
  const basicLogoLeftSrc = isBasic ? getBasicLogoSrc(config.basicLogoLeft) : undefined;
  const basicLogoRightSrc = isBasic ? getBasicLogoSrc(config.basicLogoRight) : undefined;
  const hasBasicLeft = Boolean(basicLogoLeftSrc);
  const hasBasicRight = Boolean(basicLogoRightSrc);

  // ✅ Basic white box option (numbers ONLY)
  const basicWhiteBox = Boolean(config.basicWhiteBox);

  const teamKey = teamCfg?.key ?? "";
  const isBrowns = Boolean(teamKey === "nfl-browns");

  const logoSide: LogoSide = (config.logoSide ?? "right") as LogoSide;

  const tintEnabled = Boolean(config.tintEnabled);
  const tintStyle: TintStyle = (config.tintStyle ?? "full") as TintStyle;

  const sportsTrim: SportsTrim = ((config as any).sportsTrim ?? "main") as SportsTrim;
  const topBandStyle: TopBandStyle = ((config as any).topBandStyle ?? "flag") as TopBandStyle;
  const plateStyle: PlateStyle = ((config as any).plateStyle ?? "striped") as PlateStyle;

  // ✅ Basic flag band add-on behaves like “Full Curb + U.S. Flag”
  const basicFlagBandOn = isBasic && (config.addOns ?? []).includes("flagPlus");

  // ✅ Top band shows when:
  // - Sports + full curb
  // - Basic + flagPlus add-on
  // BUT: Texas curb should NOT have the top band
  const hasTop = !texasMode && ((isSports && sportsTrim === "full") || basicFlagBandOn);

  // Full-curb “team banner” mode is sports-only
  const isFullTeamBand = isSports && hasTop && topBandStyle === "team";

  const teamBannerBorderStyle: TeamBannerBorderStyle =
    ((config as any).teamBannerBorderStyle ?? "standard") as TeamBannerBorderStyle;

  const showTripleBorder = isFullTeamBand && teamBannerBorderStyle === "triple";
  const showSideStripes = isFullTeamBand && teamBannerBorderStyle === "sideStripes";

  // ✅ jersey texture should work for sports MAIN or FULL
  const jerseyTextureEnabled = Boolean((config as any).jerseyTexture) && isSports;

  // Main-face jersey option (kept for compatibility)
  const mainJerseyTextureEnabled = Boolean((config as any).mainJerseyTexture) && isSports;

  const TOP_H = 95;
  const SEAM_H = 0;
  const H = hasTop ? BASE_H + TOP_H + SEAM_H : BASE_H;

  const digits = (config.address || "").replace(/[^0-9]/g, "").slice(0, 6);
  const digitCount = Math.max(3, Math.min(6, digits.length || 0));

  /* -------------------------------
     COLORS / ASSETS
  -------------------------------- */
  // Base primary: sports uses team primary; otherwise use config background
  // ✅ Texas: make the “behind everything” fill black so no white ring shows inside the border
  const basePrimary =
    texasMode ? "#000000" : isSports && teamCfg ? teamCfg.colors.primary : config.colors.bg;

  const lightPrimary = lighten(basePrimary, 0.36);

  // stripe uses SECONDARY (fallback to primary)
  const stripeColor = isSports && teamCfg ? teamCfg.colors.secondary : basePrimary;

  const logoHref = isSports && teamCfg ? teamCfg.assets.logo : undefined;
  const fontLogoHref =
    isSports && teamCfg
      ? ((teamCfg.assets as any).fontLogo || (teamCfg.assets as any).frontLogo)
      : undefined;

  /* -------------------------------
     OUTER CURB
  -------------------------------- */
  const outerStroke = 12;
  const outerRx = 6;

  const outerInnerX = outerStroke / 2.4;
  const outerInnerY = outerStroke / 3.2;
  const outerInnerW = W - outerStroke;
  const outerInnerH = H - outerStroke * 1;

  const innerRx = Math.max(0, outerRx - outerStroke);

  const PAD = 16;
  const innerX = PAD;
  const innerY = PAD;
  const innerW = W - PAD * 2;

  /* -------------------------------
     MAIN FACE GEOMETRY
  -------------------------------- */
  const mainBoxX = innerX;
  const mainBoxW = innerW;
  const mainBoxH = BASE_H - PAD * 2;
  const mainBoxY = hasTop ? innerY + TOP_H + SEAM_H : innerY;

  /* -------------------------------
     TOP BAND INSET
  -------------------------------- */
  const INSET_X = 6.9;
  const INSET_TOP = 6.9;
  const INSET_BOTTOM = -15;

  const bandX = outerInnerX;
  const bandY = outerInnerY;
  const bandW = outerInnerW;
  const bandH = hasTop ? Math.max(0, mainBoxY - bandY) : 0;

  const topBoxX = bandX + INSET_X;
  const topBoxY = bandY + INSET_TOP;
  const topBoxW = bandW - INSET_X * 2;
  const topBoxH = hasTop ? Math.max(0, TOP_H - INSET_TOP - INSET_BOTTOM) : 0;

  /* -------------------------------
     FLAG (U.S. flag top band)
  -------------------------------- */
  const stripeCount = 7;
  const stripeH = topBoxH > 0 ? topBoxH / stripeCount : 0;

  const cantonW = topBoxW * 0.34;
  const cantonH = topBoxH;

  const STRIPE_LEFT_INSET = 5;

  function renderStars() {
    // ✅ Basic flag band always uses the U.S. flag in top band
    if (!hasTop || topBandStyle !== "flag" || topBoxH <= 0) return null;

    const pattern = [6, 5, 6, 5, 6, 5, 6, 5, 6];
    const padX = cantonW * 0.06;
    const padY = cantonH * 0.16;

    const usableW = cantonW - padX * 2;
    const usableH = cantonH - padY * 2;

    const rows = pattern.length;
    const rowGap = rows > 1 ? usableH / (rows - 1) : 0;

    const colGap6 = usableW / 5;

    const outerR = Math.max(5.6, cantonH / 12.5);
    const innerR = outerR * 0.48;

    return pattern.flatMap((count, rowIdx) => {
      const y = topBoxY + padY + rowIdx * rowGap;
      const offset = count === 5 ? colGap6 / 2 : 0;

      return Array.from({ length: count }).map((_, colIdx) => {
        const cx = topBoxX + padX + offset + colIdx * colGap6;
        return (
          <path
            key={`star-${rowIdx}-${colIdx}`}
            d={starPath(cx, y, outerR, innerR)}
            fill="#ffffff"
            opacity={0.98}
          />
        );
      });
    });
  }

  /* -------------------------------
     LOGO (MAIN FACE) - SPORTS ONLY
  -------------------------------- */
  const logoW = hasTop ? 200 : 240;
  const logoH = mainBoxH - 18;

  const LOGO_EDGE_PAD = isFullTeamBand ? 90 : hasTop ? 55 : 40;

  const sportsLogoX =
    logoSide === "left"
      ? mainBoxX + LOGO_EDGE_PAD
      : mainBoxX + mainBoxW - LOGO_EDGE_PAD - logoW;

  const sportsLogoY = mainBoxY + 8;

  /* -------------------------------
     ADDRESS / BASIC LOGOS LAYOUT
  -------------------------------- */
  const boxPaddingX = 70;

  const approxCharW = isBasic
    ? digitCount <= 4
      ? 88
      : digitCount === 5
        ? 78
        : 72
    : digitCount <= 4
      ? 76
      : digitCount === 5
        ? 68
        : 62;

  const inset = 22;
  const mainCenterX = mainBoxX + mainBoxW / 2;

  // Sports bias stays same
  const bias = plateStyle === "striped" ? 140 : 110;
  const addrCenterX = isSports
    ? logoSide === "right"
      ? mainCenterX - bias
      : mainCenterX + bias
    : mainCenterX;

  // Plate height stays same
  const addrBoxH = 162;

  // ✅ BASIC: address box should NOT include logos
  const addrDigitsBoxW = digitCount * approxCharW + boxPaddingX * 2;

  const addrBoxW = isBasic ? addrDigitsBoxW : digitCount * approxCharW + boxPaddingX * 2;

  const addrBoxX = clamp(
    addrCenterX - addrBoxW / 2,
    mainBoxX + inset,
    mainBoxX + mainBoxW - inset - addrBoxW
  );

  const addrBoxY = clamp(
    mainBoxY + mainBoxH / 2 - addrBoxH / 2,
    mainBoxY + inset,
    mainBoxY + mainBoxH - inset - addrBoxH
  );

  // ✅ BASIC logos pinned near curb edges (outside address box)
  const basicLogoSize = 160;
  const basicLogoY = mainBoxY + mainBoxH / 2 - basicLogoSize / 2;

  const BASIC_EDGE_PAD = 18; // distance from main face edge
  const leftLogoX = mainBoxX + BASIC_EDGE_PAD;
  const rightLogoX = mainBoxX + mainBoxW - BASIC_EDGE_PAD - basicLogoSize;

  // ✅ BASIC stripe sits to the RIGHT of the digits box
  const dividerW = 16;
  const dividerGap = 18;

  const dividerXRawBasic = addrBoxX + addrBoxW + dividerGap;
  const dividerXRawSports =
    logoSide === "right"
      ? addrBoxX + addrBoxW + dividerGap
      : addrBoxX - dividerGap - dividerW;

  const dividerX = clamp(
    isBasic ? dividerXRawBasic : dividerXRawSports,
    mainBoxX + inset,
    mainBoxX + mainBoxW - inset - dividerW
  );

  // ✅ BASIC: “box + stripe” is present but matches background by default
  const basicPlateFill = basicWhiteBox ? "#FFFFFF" : basePrimary;
  const basicStripeFill = basePrimary;

  const fontSize = useMemo(() => {
    // Texas: make it big and clean
    if (texasMode) {
      return digitCount <= 3 ? 170 : digitCount === 4 ? 160 : digitCount === 5 ? 150 : 132;
    }

    const base = digitCount <= 3 ? 164 : digitCount === 4 ? 156 : digitCount === 5 ? 140 : 124;

    if (!isBasic) return base;

    const baseBasic = Math.round(base * 1.12);

    if (hasBasicLeft && hasBasicRight) return Math.round(baseBasic * 0.95);
    if (hasBasicLeft || hasBasicRight) return Math.round(baseBasic * 0.98);
    return baseBasic;
  }, [digitCount, isBasic, hasBasicLeft, hasBasicRight, texasMode]);

  const letterSpacing = useMemo(() => {
    if (texasMode) {
      return digitCount <= 3 ? 9 : digitCount === 4 ? 8 : digitCount === 5 ? 7 : 6.5;
    }

    const base = digitCount <= 3 ? 8 : digitCount === 4 ? 7.5 : digitCount === 5 ? 6.5 : 6;

    if (!isBasic) return base;

    if (hasBasicLeft && hasBasicRight) return base * 0.85;
    if (hasBasicLeft || hasBasicRight) return base * 0.9;
    return base * 0.9;
  }, [digitCount, isBasic, hasBasicLeft, hasBasicRight, texasMode]);

  /* -------------------------------
     TEAM BANNER (SPORTS TEAM TOP BAND)
  -------------------------------- */
  const isTripleBorder = isFullTeamBand && teamBannerBorderStyle === "triple";

  const TEAM_BANNER_SCALE_TRIPLE = 0.9;
  const TEAM_BANNER_Y_OFFSET_TRIPLE = 6;

  // Browns-only: reduce height + nudge down a bit (prevents clipping)
  const TEAM_BANNER_H_MULT_BASE = isBrowns ? 1 : 1.2;
  const TEAM_BANNER_EXTRA_Y_BASE = isBrowns ? 10 : 0;

  const TEAM_BANNER_OVERRIDES: Record<
    string,
    { scale?: number; wMult?: number; hMult?: number; y?: number; preserve?: "none" | "xMidYMid meet" }
  > = {
    "nba-pacers": { scale: 0.9 },
    "nba-spurs": { scale: 0.83 },
    "nba-jazz": { scale: 0.83 },
    "nba-raptors": { preserve: "xMidYMid meet", wMult: 0.96 },
  };

  const ovr = TEAM_BANNER_OVERRIDES[teamKey] ?? {};

  const teamBannerScale = (isTripleBorder ? TEAM_BANNER_SCALE_TRIPLE : 1) * (ovr.scale ?? 1);

  const TEAM_BANNER_H_MULT = TEAM_BANNER_H_MULT_BASE * (ovr.hMult ?? 1);
  const teamBannerW = topBoxW * 0.45 * teamBannerScale * (ovr.wMult ?? 1);
  const teamBannerH = topBoxH * TEAM_BANNER_H_MULT * teamBannerScale;

  const teamBannerX = topBoxX + (topBoxW - teamBannerW) / 2;
  const teamBannerY =
    topBoxY +
    (topBoxH - teamBannerH) / 2 +
    (isTripleBorder ? TEAM_BANNER_Y_OFFSET_TRIPLE : 0) +
    TEAM_BANNER_EXTRA_Y_BASE +
    (ovr.y ?? 0);

  const teamBannerPreserve: "none" | "xMidYMid meet" =
    ovr.preserve ?? (isBrowns ? "xMidYMid meet" : "none");

  /* -------------------------------
     TEAM BANNER FILL
  -------------------------------- */
  const fullTeamFill =
    !tintEnabled ? basePrimary : tintStyle === "edge" ? "url(#teamEdgeFull)" : "url(#teamTintFull)";

  /* -------------------------------
     TRIPLE BORDER SIZING
  -------------------------------- */
  const TRIPLE_WHITE = 10;
  const TRIPLE_INNER_BLACK = 6;

  const JERSEY_INSET_STANDARD = 10;
  const JERSEY_INSET_TRIPLE = TRIPLE_WHITE + TRIPLE_INNER_BLACK + 4;

  const JERSEY_OPACITY = 0.32;

  /* -------------------------------
     SIDE STRIPES
  -------------------------------- */
  const SIDE_STRIPE_OUTER_WHITE = 14;
  const SIDE_STRIPE_TEAM = 22;
  const SIDE_STRIPE_INNER_WHITE = 14;
  const SIDE_STRIPES_TOTAL = SIDE_STRIPE_OUTER_WHITE + SIDE_STRIPE_TEAM + SIDE_STRIPE_INNER_WHITE;

  /* -------------------------------
     TEXAS CURB GEOMETRY
  -------------------------------- */
  const TX_BLUE = "#0033A0";
  const TX_RED = "#BF0D3E";
  const TX_WHITE = "#FFFFFF";

  const txLeftW = mainBoxW * 0.28; // blue field width
  const txRightW = mainBoxW - txLeftW;

  const txBlueX = mainBoxX;
  const txBlueY = mainBoxY;

  const txRightX = mainBoxX + txLeftW;
  const txRightY = mainBoxY;

  const txHalfH = mainBoxH / 2;

  // Star in the blue field
  const txStarCx = txBlueX + txLeftW * 0.5;
  const txStarCy = txBlueY + mainBoxH * 0.5;
  const txStarOuter = Math.max(48, mainBoxH * 0.32);
  const txStarInner = txStarOuter * 0.45;

  // Number placement in Texas mode
  const txTextX = txRightX + txRightW * 0.52;

  const txTextY =
    texasNumberPlacement === "white"
      ? txRightY + txHalfH * 0.90   // center of the WHITE half
      : txRightY + mainBoxH * 0.50; // true vertical center


  // Texas number styling
  const txNumberFill = "#000000";
  const txNumberStroke = "none"; // subtle white outline like your mock
  const txNumberStrokeW = 0;

  // Default number color (non-Texas)
  const numberColor = "#000";

  // Non-Texas text anchor positions
  const textX = addrBoxX + addrBoxW / 2 - 1;
  const textY = addrBoxY + addrBoxH / 2 - 2;

  return (
    <div style={{ width: "100%", maxWidth: 920 }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ borderRadius: 7, background: "transparent" }}>
        <defs>
          <linearGradient id="teamTintOuter" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lightPrimary} />
            <stop offset="45%" stopColor={basePrimary} />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>

          <linearGradient id="teamTintFull" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lightPrimary} />
            <stop offset="55%" stopColor={basePrimary} />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>

          <radialGradient id="teamEdgeFull" gradientUnits="objectBoundingBox" cx="0.5" cy="0.5" r="0.9">
            <stop offset="35%" stopColor={basePrimary} />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.95" />
          </radialGradient>

          <linearGradient id="teamTintMain" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lightPrimary} />
            <stop offset="60%" stopColor={basePrimary} />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>

          <linearGradient id="teamStripeVibe" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#000000" />
            <stop offset="22%" stopColor={stripeColor} />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="78%" stopColor={stripeColor} />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>

          <pattern id="jerseyDots" patternUnits="userSpaceOnUse" width="18" height="18">
            <circle cx="4" cy="4" r="1.6" fill="#000000" opacity="1" />
            <circle cx="13" cy="10" r="1.6" fill="#000000" opacity="1" />
          </pattern>

          <clipPath id="outerInnerClip">
            <rect
              x={outerStroke / 2.4}
              y={outerStroke / 3.2}
              width={W - outerStroke}
              height={H - outerStroke}
              rx={innerRx}
            />
          </clipPath>

          <clipPath id="topClip">
            <rect x={topBoxX} y={topBoxY} width={topBoxW} height={topBoxH} rx={3} />
          </clipPath>

          <clipPath id="mainFaceClip">
            <rect x={mainBoxX} y={mainBoxY} width={mainBoxW} height={mainBoxH} rx={3} />
          </clipPath>

          <clipPath id="jerseyFullInsetClip">
            {(() => {
              const inset = showTripleBorder ? JERSEY_INSET_TRIPLE : JERSEY_INSET_STANDARD;
              return (
                <rect
                  x={outerInnerX + inset}
                  y={outerInnerY + inset}
                  width={outerInnerW - inset * 2}
                  height={outerInnerH - inset * 2}
                  rx={Math.max(0, innerRx - inset)}
                />
              );
            })()}
          </clipPath>

          <clipPath id="jerseySideStripeSafeClip">
            <rect
              x={outerInnerX + SIDE_STRIPES_TOTAL}
              y={outerInnerY + JERSEY_INSET_STANDARD}
              width={outerInnerW - SIDE_STRIPES_TOTAL * 2}
              height={outerInnerH - JERSEY_INSET_STANDARD * 2}
              rx={Math.max(0, innerRx - JERSEY_INSET_STANDARD)}
            />
          </clipPath>
        </defs>

        {/* OUTER BORDER */}
        <rect
          x={outerStroke / 2}
          y={outerStroke / 2}
          width={W - outerStroke}
          height={H - outerStroke}
          rx={outerRx}
          fill={tintEnabled ? "url(#teamTintOuter)" : basePrimary}
          stroke="#000"
          strokeWidth={outerStroke}
        />

        {/* TEXAS MODE OVERRIDE (Main face becomes Texas flag) */}
        {texasMode ? (
          <>
            {/* Main face base */}
            <g clipPath="url(#mainFaceClip)">
              {/* Left blue field */}
              <rect x={txBlueX} y={txBlueY} width={txLeftW} height={mainBoxH} fill={TX_BLUE} />
              {/* Right top white */}
              <rect x={txRightX} y={txRightY} width={txRightW} height={txHalfH} fill={TX_WHITE} />
              {/* Right bottom red */}
              <rect
                x={txRightX}
                y={txRightY + txHalfH}
                width={txRightW}
                height={txHalfH}
                fill={TX_RED}
              />

              {/* Star */}
              <path d={starPath(txStarCx, txStarCy, txStarOuter, txStarInner)} fill="#ffffff" opacity={0.98} />
            </g>

            {/* Numbers */}
            <text
              x={txTextX}
              y={txTextY}
              textAnchor="middle"
              dominantBaseline="central"
              fill={txNumberFill}
              stroke={txNumberStroke}
              strokeWidth={txNumberStrokeW}
              paintOrder="stroke"
              fontSize={fontSize}
              fontWeight={700}
              letterSpacing={letterSpacing}
              fontFamily={fontFamily}
            >
              {digits || "0000"}
            </text>
          </>
        ) : (
          <>
            {/* FULL TEAM BAND MODE (Sports only) */}
            {isFullTeamBand ? (
              <g clipPath="url(#outerInnerClip)">
                {showTripleBorder ? (
                  <>
                    <rect x={outerInnerX} y={outerInnerY} width={outerInnerW} height={outerInnerH} fill="#ffffff" />
                    <rect
                      x={outerInnerX + TRIPLE_WHITE}
                      y={outerInnerY + TRIPLE_WHITE}
                      width={outerInnerW - TRIPLE_WHITE * 2}
                      height={outerInnerH - TRIPLE_WHITE * 2}
                      fill={fullTeamFill}
                    />
                    <rect
                      x={outerInnerX + TRIPLE_WHITE + TRIPLE_INNER_BLACK / 2}
                      y={outerInnerY + TRIPLE_WHITE + TRIPLE_INNER_BLACK / 2}
                      width={outerInnerW - (TRIPLE_WHITE * 2 + TRIPLE_INNER_BLACK)}
                      height={outerInnerH - (TRIPLE_WHITE * 2 + TRIPLE_INNER_BLACK)}
                      fill="none"
                      stroke="#000000"
                      strokeWidth={TRIPLE_INNER_BLACK}
                    />
                  </>
                ) : (
                  <rect x={outerInnerX} y={outerInnerY} width={outerInnerW} height={outerInnerH} fill={fullTeamFill} />
                )}

                {showSideStripes && (
                  <>
                    <rect x={outerInnerX} y={outerInnerY} width={SIDE_STRIPE_OUTER_WHITE} height={outerInnerH} fill="#ffffff" />
                    <rect
                      x={outerInnerX + SIDE_STRIPE_OUTER_WHITE}
                      y={outerInnerY}
                      width={SIDE_STRIPE_TEAM}
                      height={outerInnerH}
                      fill="url(#teamStripeVibe)"
                    />
                    <rect
                      x={outerInnerX + SIDE_STRIPE_OUTER_WHITE + SIDE_STRIPE_TEAM}
                      y={outerInnerY}
                      width={SIDE_STRIPE_INNER_WHITE}
                      height={outerInnerH}
                      fill="#ffffff"
                    />

                    <rect
                      x={outerInnerX + outerInnerW - SIDE_STRIPE_OUTER_WHITE}
                      y={outerInnerY}
                      width={SIDE_STRIPE_OUTER_WHITE}
                      height={outerInnerH}
                      fill="#ffffff"
                    />
                    <rect
                      x={outerInnerX + outerInnerW - (SIDE_STRIPE_OUTER_WHITE + SIDE_STRIPE_TEAM)}
                      y={outerInnerY}
                      width={SIDE_STRIPE_TEAM}
                      height={outerInnerH}
                      fill="url(#teamStripeVibe)"
                    />
                    <rect
                      x={outerInnerX + outerInnerW - SIDE_STRIPES_TOTAL}
                      y={outerInnerY}
                      width={SIDE_STRIPE_INNER_WHITE}
                      height={outerInnerH}
                      fill="#ffffff"
                    />
                  </>
                )}

                {jerseyTextureEnabled && (
                  <g clipPath={showSideStripes ? "url(#jerseySideStripeSafeClip)" : "url(#jerseyFullInsetClip)"}>
                    <rect
                      x={outerInnerX}
                      y={outerInnerY}
                      width={outerInnerW}
                      height={outerInnerH}
                      fill="url(#jerseyDots)"
                      opacity={JERSEY_OPACITY}
                    />
                  </g>
                )}
              </g>
            ) : (
              <>
                {/* TOP BAND (FLAG) — supports Basic + flagPlus too */}
                {hasTop && (
                  <g clipPath="url(#outerInnerClip)">
                    <rect x={bandX} y={bandY} width={bandW} height={bandH} fill="#000000" />
                    {topBoxH > 0 ? (
                      <g clipPath="url(#topClip)">
                        <rect x={topBoxX} y={topBoxY} width={topBoxW} height={topBoxH} fill="#ffffff" />

                        {Array.from({ length: stripeCount }).map((_, i) => (
                          <rect
                            key={`stripe-${i}`}
                            x={topBoxX + STRIPE_LEFT_INSET}
                            y={topBoxY + i * stripeH}
                            width={topBoxW - STRIPE_LEFT_INSET}
                            height={stripeH}
                            fill={i % 2 === 0 ? "#b22234" : "#ffffff"}
                          />
                        ))}

                        <rect x={topBoxX} y={topBoxY} width={cantonW} height={cantonH} fill="#3c3b6e" />
                        {renderStars()}
                      </g>
                    ) : null}
                  </g>
                )}

                {/* MAIN FACE */}
                <rect
                  x={mainBoxX}
                  y={mainBoxY}
                  width={mainBoxW}
                  height={mainBoxH}
                  rx={3}
                  fill={tintEnabled ? "url(#teamTintMain)" : basePrimary}
                />

                {/* Jersey overlay for sports main OR full */}
                {jerseyTextureEnabled && (
                  <g clipPath="url(#mainFaceClip)">
                    <rect
                      x={mainBoxX}
                      y={mainBoxY}
                      width={mainBoxW}
                      height={mainBoxH}
                      fill="url(#jerseyDots)"
                      opacity={JERSEY_OPACITY}
                    />
                  </g>
                )}
              </>
            )}

            {/* Back-compat */}
            {mainJerseyTextureEnabled && !jerseyTextureEnabled && (
              <g clipPath="url(#mainFaceClip)">
                <rect
                  x={mainBoxX}
                  y={mainBoxY}
                  width={mainBoxW}
                  height={mainBoxH}
                  fill="url(#jerseyDots)"
                  opacity={JERSEY_OPACITY}
                />
              </g>
            )}

            {/* TEAM TOP BAND FONT LOGO (sports team banner only) */}
            {isFullTeamBand && topBoxH > 0 && (
              <g clipPath="url(#topClip)">
                {fontLogoHref ? (
                  <image
                    href={fontLogoHref}
                    x={teamBannerX}
                    y={teamBannerY}
                    width={teamBannerW}
                    height={teamBannerH}
                    preserveAspectRatio={teamBannerPreserve}
                    opacity={0.98}
                  />
                ) : null}
              </g>
            )}

            {/* MAIN SPORTS LOGO */}
            {isSports && logoHref && (
              <image
                href={logoHref}
                x={sportsLogoX}
                y={sportsLogoY}
                width={logoW}
                height={logoH}
                preserveAspectRatio="xMidYMid meet"
              />
            )}

            {/* Stripe element */}
            {isBasic ? (
              <rect x={dividerX} y={addrBoxY} width={dividerW} height={addrBoxH} rx={2} fill={basicStripeFill} />
            ) : (
              plateStyle === "striped" && (
                <rect x={dividerX} y={addrBoxY} width={dividerW} height={addrBoxH} rx={2} fill="#FFFFFF" />
              )
            )}

            {/* ADDRESS BOX */}
            {isSports ? (
              plateStyle !== "dogtag" ? (
                <rect x={addrBoxX} y={addrBoxY} width={addrBoxW} height={addrBoxH} rx={4} fill="#FFFFFF" />
              ) : (
                <>
                  <rect
                    x={addrBoxX}
                    y={addrBoxY}
                    width={addrBoxW}
                    height={addrBoxH}
                    rx={28}
                    fill="#FFFFFF"
                    stroke="#000000"
                    strokeWidth={6}
                    paintOrder="stroke"
                  />
                  {(() => {
                    const dotR = 7;
                    const midY = addrBoxY + addrBoxH / 2;
                    const leftDotX = addrBoxX + 16;
                    const rightDotX = addrBoxX + addrBoxW - 16;
                    return (
                      <>
                        <circle cx={leftDotX} cy={midY} r={dotR} fill="#111111" opacity={0.95} />
                        <circle cx={rightDotX} cy={midY} r={dotR} fill="#111111" opacity={0.95} />
                      </>
                    );
                  })()}
                </>
              )
            ) : (
              <rect x={addrBoxX} y={addrBoxY} width={addrBoxW} height={addrBoxH} rx={4} fill={basicPlateFill} />
            )}

            {/* BASIC logos are OUTSIDE the address box */}
            {isBasic && hasBasicLeft && basicLogoLeftSrc && (
              <image
                href={basicLogoLeftSrc}
                x={leftLogoX}
                y={basicLogoY}
                width={basicLogoSize}
                height={basicLogoSize}
                preserveAspectRatio="xMidYMid meet"
              />
            )}

            {isBasic && hasBasicRight && basicLogoRightSrc && (
              <image
                href={basicLogoRightSrc}
                x={rightLogoX}
                y={basicLogoY}
                width={basicLogoSize}
                height={basicLogoSize}
                preserveAspectRatio="xMidYMid meet"
              />
            )}

            {/* Numbers */}
            <text
              x={textX}
              y={textY}
              textAnchor="middle"
              dominantBaseline="central"
              fill={numberColor}
              fontSize={fontSize}
              fontWeight={700}
              letterSpacing={letterSpacing}
              fontFamily={fontFamily}
            >
              {digits || "0000"}
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
