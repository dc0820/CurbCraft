// src/app/create/page.tsx
"use client";

import { Suspense, useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import CurbDesigner from "@/components/CurbDesigner";
import HomePreviewRotator from "@/app/HomePreviewRotator";

export const dynamic = "force-dynamic";

import {
  BASIC_LOGOS,
  BASIC_BG_COLORS,
  getBasicBgHex,
  computePrice,
  isAddOnEnabled,
  toggleAddOn,
  getTeamsByLeague,
  type AddOn,
  type BasicLogoId,
  type BasicBgColorId,
  type DesignConfig,
  type IconType,
  type Tier,
  type SportsTeam,
  type SportsLeague,
  type TeamBannerBorderStyle,
} from "@/lib/templates";

type LogoSide = "left" | "right";
type SportsTrim = "main" | "full";
type PlateStyle = "striped" | "plain" | "dogtag";
type TopBandStyle = "flag" | "team";
type TintStyle = "full" | "edge";

// ✅ UI-only tier (so Texas works even if templates Tier doesn't include it yet)
type UITier = Tier | "texas";

// Brand-ish colors
const CC_GOLD = "#ffc20e";
const CC_GOLD_TEXT = "#111";

export default function CreatePage() {
  return (
    <Suspense fallback={null}>
      <CreatePageInner />
    </Suspense>
  );
}

function CreatePageInner() {
  const [tier, setTier] = useState<UITier>("basic");
  const [address, setAddress] = useState("12345");

  const searchParams = useSearchParams();
  const selectedTier = tier;

  // ✅ read /create?tier=texas etc
  useEffect(() => {
    const t = searchParams.get("tier");
    if (!t) return;

    if (t === "texas" || t === "basic" || t === "sports" || t === "custom") {
      switchTier(t as UITier);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const [addOns, setAddOns] = useState<AddOn[]>([]);

  // Basic logos (optional)
  const [basicLogoLeft, setBasicLogoLeft] = useState<BasicLogoId>("none");
  const [basicLogoRight, setBasicLogoRight] = useState<BasicLogoId>("none");
  const [secondLogoEnabled, setSecondLogoEnabled] = useState<boolean>(false);

  // Basic background preset color
  const [basicBgColor, setBasicBgColor] = useState<BasicBgColorId>("light-yellow");

  // Basic white address box (numbers only; logos stay outside)
  const [basicWhiteBox, setBasicWhiteBox] = useState<boolean>(false);

  // Sports
  const [league, setLeague] = useState<SportsLeague>("NFL");
  const leagueTeams = useMemo(() => getTeamsByLeague(league), [league]);

  const [team, setTeam] = useState<SportsTeam>("Eagles");
  const [logoSide, setLogoSide] = useState<LogoSide>("right");

  const [sportsTrim, setSportsTrim] = useState<SportsTrim>("main");
  const [tintEnabled, setTintEnabled] = useState<boolean>(false);

  const [tintStyle, setTintStyle] = useState<TintStyle>("full");
  const [plateStyle, setPlateStyle] = useState<PlateStyle>("striped");
  const [topBandStyle, setTopBandStyle] = useState<TopBandStyle>("flag");

  const [teamBannerBorderStyle, setTeamBannerBorderStyle] =
    useState<TeamBannerBorderStyle>("standard");

  const [jerseyTexture, setJerseyTexture] = useState<boolean>(false);

  // Custom colors
  const [bg, setBg] = useState("#111111");
  const [text, setText] = useState("#FFFFFF");
  const [border, setBorder] = useState("#FFFFFF");

  // Icons add-on state (basic)
  const [activeIcon, setActiveIcon] = useState<IconType>("paw");
  const [activeIconScale, setActiveIconScale] = useState<number>(1);
  const [placedIcons, setPlacedIcons] = useState<DesignConfig["placedIcons"]>([]);

  const isSports = tier === "sports";
  const isCustom = tier === "custom";
  const isTexas = tier === "texas";
  const isBasic = tier === "basic" || tier === "texas"; // Texas behaves like Basic UI-wise (no options)

  // If league changes and current team isn’t in that league, snap to first team
  useMemo(() => {
    if (!leagueTeams.includes(team as any)) {
      setTeam((leagueTeams[0] as SportsTeam) ?? ("Eagles" as SportsTeam));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leagueTeams]);

  // Effective colors
  const colors = useMemo(() => {
    if (isCustom) return { bg, text, border };
    if (isSports) return { bg: "#0B0B0B", text: "#FFFFFF", border: "#FFFFFF" };

    // BASIC / TEXAS:
    const basicBgEnabled = !isTexas && isAddOnEnabled(addOns, "basicBgColor");
    const picked = basicBgEnabled ? getBasicBgHex(basicBgColor) : undefined;
    return { bg: picked ?? "#FFFFFF", text: "#000000", border: "#000000" };
  }, [isCustom, isSports, isTexas, bg, text, border, addOns, basicBgColor]);

  // ✅ Only allow add-ons on BASIC, but NEVER in Texas
  const effectiveAddOns = useMemo(() => {
    if (isTexas) return [];
    return tier === "basic" ? addOns : [];
  }, [isTexas, tier, addOns]);

  // Count basic logos (only when icons add-on is ON) — never in Texas
  const basicLogoCount = useMemo(() => {
    if (isTexas) return 0;
    if (!(tier === "basic" && isAddOnEnabled(addOns, "icons"))) return 0;

    let count = 0;
    if (basicLogoLeft !== "none") count += 1;
    if (secondLogoEnabled && basicLogoRight !== "none") count += 1;
    return count;
  }, [isTexas, tier, addOns, basicLogoLeft, secondLogoEnabled, basicLogoRight]);

  // ✅ For pricing + config typing, map Texas -> "basic" tier under the hood
  const effectiveTierForLogic: Tier = useMemo(() => {
    return isTexas ? ("basic" as Tier) : (tier as Tier);
  }, [isTexas, tier]);

  // ✅ PRICE (Texas fixed $40)
  const price = useMemo(() => {
    if (isTexas) {
      return {
        amount: 40,
        label: "$40",
        base: 40,
        addOnTotal: 0,
        breakdown: {
          base: 40,
          addOns: 0,
          icons: 0,
          iconCount: 0,
          basicLogos: 0,
          basicLogoCount: 0,
          sports: 0,
        },
      };
    }

    return computePrice(effectiveTierForLogic, effectiveAddOns, {
      iconCount: placedIcons.length,
      basic: { logoCount: basicLogoCount },
      sports: {
        sportsTrim,
        plateStyle,
        topBandStyle,
        teamBannerBorderStyle,
        tintEnabled,
        tintStyle,
        jerseyTexture,
      },
    });
  }, [
    isTexas,
    effectiveTierForLogic,
    effectiveAddOns,
    placedIcons.length,
    basicLogoCount,
    sportsTrim,
    plateStyle,
    topBandStyle,
    teamBannerBorderStyle,
    tintEnabled,
    tintStyle,
    jerseyTexture,
  ]);

  const showTeamBannerTintStyle =
    isSports && sportsTrim === "full" && topBandStyle === "team" && tintEnabled;

  const showTeamBannerBorderStyle =
    isSports && sportsTrim === "full" && topBandStyle === "team";

  const showJerseyTexture = isSports;

  const config: DesignConfig = useMemo(
    () =>
      ({
        // ✅ Keep templates type happy (Texas uses Basic tier logic)
        tier: effectiveTierForLogic,
        address,
        colors,
        team: isSports ? team : undefined,
        addOns: effectiveAddOns,

        // Basic logo selection only matters if icons add-on is ON (and not Texas)
        basicLogoLeft:
          !isTexas &&
          tier === "basic" &&
          isAddOnEnabled(addOns, "icons") &&
          basicLogoLeft !== "none"
            ? basicLogoLeft
            : undefined,
        basicLogoRight:
          !isTexas &&
          tier === "basic" &&
          isAddOnEnabled(addOns, "icons") &&
          secondLogoEnabled &&
          basicLogoRight !== "none"
            ? basicLogoRight
            : undefined,

        basicBgColor:
          !isTexas && tier === "basic" && isAddOnEnabled(addOns, "basicBgColor")
            ? basicBgColor
            : undefined,

        basicWhiteBox: !isTexas && tier === "basic" ? basicWhiteBox : undefined,

        activeIcon,
        activeIconScale,
        placedIcons,

        // ✅ extra flag for your renderer (safe via any)
        texasMode: isTexas,

        ...(isSports
          ? {
              logoSide,
              tintEnabled,
              tintStyle,
              sportsTrim,
              plateStyle,
              topBandStyle,
              teamBannerBorderStyle,
              jerseyTexture,
            }
          : {}),
      } as any),
    [
      effectiveTierForLogic,
      address,
      colors,
      isSports,
      team,
      effectiveAddOns,
      isTexas,
      tier,
      addOns,
      basicLogoLeft,
      basicLogoRight,
      secondLogoEnabled,
      basicBgColor,
      basicWhiteBox,
      activeIcon,
      activeIconScale,
      placedIcons,
      logoSide,
      tintEnabled,
      tintStyle,
      sportsTrim,
      plateStyle,
      topBandStyle,
      teamBannerBorderStyle,
      jerseyTexture,
    ]
  );

  function switchTier(next: UITier) {
    setTier(next);

    // reset shared stuff
    setAddOns([]);
    setPlacedIcons([]);

    // Texas has NO options
    if (next === "texas") {
      setBasicWhiteBox(false);
      setSecondLogoEnabled(false);
      setBasicLogoLeft("none");
      setBasicLogoRight("none");
      return;
    }

    // leaving basic -> reset basic-only stuff
    if (next !== "basic") {
      setBasicWhiteBox(false);
      setSecondLogoEnabled(false);
      setBasicLogoLeft("none");
      setBasicLogoRight("none");
    }

    if (next === "sports") {
      setLeague("NFL");
      setTeam("Eagles" as SportsTeam);
      setLogoSide("right");
      setTintEnabled(false);
      setTintStyle("full");
      setSportsTrim("main");
      setPlateStyle("striped");
      setTopBandStyle("flag");
      setTeamBannerBorderStyle("standard");
      setJerseyTexture(false);
    }
  }

  function toggleOption(id: AddOn) {
    setAddOns((prev) => toggleAddOn(prev, id));
  }

  const iconsOn = tier === "basic" && !isTexas && isAddOnEnabled(addOns, "icons");
  const bgOn = tier === "basic" && !isTexas && isAddOnEnabled(addOns, "basicBgColor");

  const subtitleText = isTexas
    ? "Enter your address → preview your Texas design."
    : "Start with your selection → enter your address → add options.";

  return (
    <div style={pageContainer}>
      <div style={{ display: "grid", gap: 14 }}>
        <div style={pageHeader}>
          <div style={{ textAlign: "left" }}>
            <h1 style={pageTitle}>Create your design</h1>
            <p style={pageSubtitle}>{subtitleText}</p>
          </div>

          <div style={pricePill}>
            <div style={{ fontSize: 12, opacity: 0.75 }}>Price</div>
            <div style={{ fontSize: 20, fontWeight: 900 }}>{price.label}</div>
          </div>
        </div>

        <div style={{ ...tierRow, justifyContent: "flex-start" }}>
          {(["basic", "texas", "sports", "custom"] as UITier[]).map((t) => {
            const isSelected = selectedTier === t;
            return (
              <button
                key={t}
                onClick={() => switchTier(t)}
                style={{
                  ...tierBtn,
                  background: isSelected ? CC_GOLD : "#f3f3f3",
                  color: isSelected ? CC_GOLD_TEXT : "#111",
                  border: isSelected ? "1px solid rgba(0,0,0,0.15)" : "1px solid transparent",
                }}
                type="button"
              >
                {t === "basic"
                  ? "Basic"
                  : t === "texas"
                    ? "Texas"
                    : t === "sports"
                      ? "Sports Team"
                      : "Custom"}
                <span style={{ marginLeft: 8, opacity: 0.85, fontWeight: 900 }}>
                  {t === "basic"
                    ? "$30+"
                    : t === "texas"
                      ? "$40"
                      : t === "sports"
                        ? "$60+"
                        : "$50+"}
                </span>
              </button>
            );
          })}
        </div>

        <div style={layout}>
          {/* LEFT: Controls */}
          <div style={panel}>
            <label style={label}>Address (3–6 digits)</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
              style={input}
              inputMode="numeric"
            />

            {/* BASIC (includes Texas) */}
            {isBasic && (
              <>
                {isTexas && <div style={texasNote}>Only the address can be edited for this style.</div>}

                {!isTexas && (
                  <>
                    <div style={{ marginTop: 6 }}>
                      <div style={label}>Add options</div>

                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
                        <button
                          onClick={() => toggleOption("icons")}
                          style={{
                            ...pillBtn,
                            background: isAddOnEnabled(addOns, "icons") ? CC_GOLD : "#f3f3f3",
                            color: isAddOnEnabled(addOns, "icons") ? CC_GOLD_TEXT : "#111",
                            border: isAddOnEnabled(addOns, "icons")
                              ? "1px solid rgba(0,0,0,0.15)"
                              : "1px solid transparent",
                          }}
                          type="button"
                        >
                          Icons <span style={{ fontWeight: 900 }}>+$10</span>{" "}
                          <span style={{ opacity: 0.9 }}>each</span>
                        </button>

                        <button
                          onClick={() => toggleOption("flagPlus")}
                          style={{
                            ...pillBtn,
                            background: isAddOnEnabled(addOns, "flagPlus") ? CC_GOLD : "#f3f3f3",
                            color: isAddOnEnabled(addOns, "flagPlus") ? CC_GOLD_TEXT : "#111",
                            border: isAddOnEnabled(addOns, "flagPlus")
                              ? "1px solid rgba(0,0,0,0.15)"
                              : "1px solid transparent",
                          }}
                          type="button"
                        >
                          U.S. Flag Band <span style={{ fontWeight: 900 }}>+$30</span>
                        </button>

                        <button
                          onClick={() => toggleOption("basicBgColor")}
                          style={{
                            ...pillBtn,
                            background: isAddOnEnabled(addOns, "basicBgColor") ? CC_GOLD : "#f3f3f3",
                            color: isAddOnEnabled(addOns, "basicBgColor") ? CC_GOLD_TEXT : "#111",
                            border: isAddOnEnabled(addOns, "basicBgColor")
                              ? "1px solid rgba(0,0,0,0.15)"
                              : "1px solid transparent",
                          }}
                          type="button"
                        >
                          Background Color <span style={{ fontWeight: 900 }}>+$15</span>
                        </button>
                      </div>

                      {bgOn && (
                        <div style={{ marginTop: 12 }}>
                          <div style={label}>Background color (preset)</div>
                          <select
                            value={basicBgColor}
                            onChange={(e) => setBasicBgColor(e.target.value as BasicBgColorId)}
                            style={selectStyle}
                          >
                            {BASIC_BG_COLORS.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.label}
                              </option>
                            ))}
                          </select>
                          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
                            Preset colors only (no color wheel).
                          </div>
                        </div>
                      )}

                      <div style={{ marginTop: 12 }}>
                        <div style={label}>Address box</div>
                        <button
                          type="button"
                          onClick={() => setBasicWhiteBox((v) => !v)}
                          style={{
                            ...pillBtn,
                            marginTop: 8,
                            background: basicWhiteBox ? CC_GOLD : "#f3f3f3",
                            color: basicWhiteBox ? CC_GOLD_TEXT : "#111",
                            border: basicWhiteBox
                              ? "1px solid rgba(0,0,0,0.15)"
                              : "1px solid transparent",
                          }}
                        >
                          {basicWhiteBox ? "White Address Box ON" : "White Address Box OFF"}
                        </button>
                        <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
                          White box is for the address only — logos stay outside.
                        </div>
                      </div>
                    </div>

                    {iconsOn && (
                      <div style={{ marginTop: 14 }}>
                        <div style={label}>
                          Logos (optional) <span style={{ opacity: 0.7 }}>+$10 each</span>
                        </div>

                        <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
                          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                            <div style={{ width: 110, fontWeight: 600 }}>Left</div>
                            <select
                              value={basicLogoLeft}
                              onChange={(e) => setBasicLogoLeft(e.target.value as BasicLogoId)}
                              style={selectStyle}
                            >
                              {BASIC_LOGOS.map((l) => (
                                <option key={l.id} value={l.id}>
                                  {l.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <input
                                type="checkbox"
                                checked={secondLogoEnabled}
                                onChange={(e) => {
                                  const on = e.target.checked;
                                  setSecondLogoEnabled(on);
                                  if (!on) setBasicLogoRight("none");
                                }}
                              />
                              Add a second logo
                            </label>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              gap: 10,
                              alignItems: "center",
                              flexWrap: "wrap",
                              opacity: secondLogoEnabled ? 1 : 0.5,
                            }}
                          >
                            <div style={{ width: 110, fontWeight: 600 }}>Right</div>
                            <select
                              disabled={!secondLogoEnabled}
                              value={basicLogoRight}
                              onChange={(e) => setBasicLogoRight(e.target.value as BasicLogoId)}
                              style={selectStyle}
                            >
                              {BASIC_LOGOS.map((l) => (
                                <option key={l.id} value={l.id}>
                                  {l.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
                          Pricing: any logo other than “None” adds <b>$10</b>.
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {/* Sports panel */}
            {isSports && (
              <>
                <label style={{ ...label, marginTop: 10 }}>League</label>
                <select
                  value={league}
                  onChange={(e) => setLeague(e.target.value as SportsLeague)}
                  style={input}
                >
                  <option value="NFL">NFL</option>
                  <option value="NBA">NBA</option>
                  <option value="MLB">MLB</option>
                </select>

                <label style={{ ...label, marginTop: 10 }}>Team</label>
                <select value={team} onChange={(e) => setTeam(e.target.value as SportsTeam)} style={input}>
                  {leagueTeams.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>

                <div style={{ marginTop: 10 }}>
                  <div style={label}>Logo orientation</div>
                  <div style={segmentWrap}>
                    <button
                      onClick={() => setLogoSide("left")}
                      style={{
                        ...segmentBtn,
                        ...(logoSide === "left" ? segmentBtnActive : {}),
                        borderTopLeftRadius: 12,
                        borderBottomLeftRadius: 12,
                      }}
                      type="button"
                    >
                      Logo Left
                    </button>
                    <button
                      onClick={() => setLogoSide("right")}
                      style={{
                        ...segmentBtn,
                        ...(logoSide === "right" ? segmentBtnActive : {}),
                        borderTopRightRadius: 12,
                        borderBottomRightRadius: 12,
                        borderLeft: "1px solid #e7e7e7",
                      }}
                      type="button"
                    >
                      Logo Right
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: 10 }}>
                  <div style={label}>Address plate</div>
                  <div style={{ ...segmentWrap, gridTemplateColumns: "1fr 1fr 1fr" }}>
                    <button
                      type="button"
                      onClick={() => setPlateStyle("striped")}
                      style={{
                        ...segmentBtn,
                        ...(plateStyle === "striped" ? segmentBtnActive : {}),
                        borderTopLeftRadius: 12,
                        borderBottomLeftRadius: 12,
                      }}
                    >
                      Box + Stripe <span style={{ fontWeight: 900 }}>+$5</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPlateStyle("plain")}
                      style={{
                        ...segmentBtn,
                        ...(plateStyle === "plain" ? segmentBtnActive : {}),
                        borderLeft: "1px solid #e7e7e7",
                      }}
                    >
                      Box Only
                    </button>

                    <button
                      type="button"
                      onClick={() => setPlateStyle("dogtag")}
                      style={{
                        ...segmentBtn,
                        ...(plateStyle === "dogtag" ? segmentBtnActive : {}),
                        borderTopRightRadius: 12,
                        borderBottomRightRadius: 12,
                        borderLeft: "1px solid #e7e7e7",
                      }}
                    >
                      Dog Tag <span style={{ fontWeight: 900 }}>+$10</span>
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: 10 }}>
                  <div style={label}>Curb style</div>
                  <div style={segmentWrap}>
                    <button
                      onClick={() => setSportsTrim("main")}
                      style={{
                        ...segmentBtn,
                        ...(sportsTrim === "main" ? segmentBtnActive : {}),
                        borderTopLeftRadius: 12,
                        borderBottomLeftRadius: 12,
                      }}
                      type="button"
                    >
                      Main Face
                    </button>
                    <button
                      onClick={() => setSportsTrim("full")}
                      style={{
                        ...segmentBtn,
                        ...(sportsTrim === "full" ? segmentBtnActive : {}),
                        borderTopRightRadius: 12,
                        borderBottomRightRadius: 12,
                        borderLeft: "1px solid #e7e7e7",
                      }}
                      type="button"
                    >
                      Full Curb (Top Band) <span style={{ fontWeight: 900 }}>+$30</span>
                    </button>
                  </div>
                </div>

                {sportsTrim === "full" && (
                  <div style={{ marginTop: 10 }}>
                    <div style={label}>Top band style</div>
                    <div style={{ ...segmentWrap, gridTemplateColumns: "1fr 1fr" }}>
                      <button
                        type="button"
                        onClick={() => setTopBandStyle("flag")}
                        style={{
                          ...segmentBtn,
                          ...(topBandStyle === "flag" ? segmentBtnActive : {}),
                          borderTopLeftRadius: 12,
                          borderBottomLeftRadius: 12,
                        }}
                      >
                        U.S. Flag
                      </button>

                      <button
                        type="button"
                        onClick={() => setTopBandStyle("team")}
                        style={{
                          ...segmentBtn,
                          ...(topBandStyle === "team" ? segmentBtnActive : {}),
                          borderTopRightRadius: 12,
                          borderBottomRightRadius: 12,
                          borderLeft: "1px solid #e7e7e7",
                        }}
                      >
                        Team Banner
                      </button>
                    </div>
                  </div>
                )}

                {showTeamBannerBorderStyle && (
                  <div style={{ marginTop: 10 }}>
                    <div style={label}>Border style (Team Banner)</div>
                    <div style={{ ...segmentWrap, gridTemplateColumns: "1fr 1fr 1fr" }}>
                      <button
                        type="button"
                        onClick={() => setTeamBannerBorderStyle("standard")}
                        style={{
                          ...segmentBtn,
                          ...(teamBannerBorderStyle === "standard" ? segmentBtnActive : {}),
                          borderTopLeftRadius: 12,
                          borderBottomLeftRadius: 12,
                        }}
                      >
                        Standard (black)
                      </button>

                      <button
                        type="button"
                        onClick={() => setTeamBannerBorderStyle("triple")}
                        style={{
                          ...segmentBtn,
                          ...(teamBannerBorderStyle === "triple" ? segmentBtnActive : {}),
                          borderLeft: "1px solid #e7e7e7",
                        }}
                      >
                        Black / White / Black <span style={{ fontWeight: 900 }}>+$10</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTeamBannerBorderStyle("sideStripes")}
                        style={{
                          ...segmentBtn,
                          ...(teamBannerBorderStyle === "sideStripes" ? segmentBtnActive : {}),
                          borderTopRightRadius: 12,
                          borderBottomRightRadius: 12,
                          borderLeft: "1px solid #e7e7e7",
                        }}
                      >
                        Side Stripes <span style={{ fontWeight: 900 }}>+$20</span>
                      </button>
                    </div>
                  </div>
                )}

                {showJerseyTexture && (
                  <div style={{ marginTop: 10 }}>
                    <div style={label}>Jersey texture</div>
                    <button
                      type="button"
                      onClick={() => setJerseyTexture((v) => !v)}
                      style={{
                        ...pillBtn,
                        marginTop: 8,
                        background: jerseyTexture ? CC_GOLD : "#f3f3f3",
                        color: jerseyTexture ? CC_GOLD_TEXT : "#111",
                        border: jerseyTexture
                          ? "1px solid rgba(0,0,0,0.15)"
                          : "1px solid transparent",
                      }}
                    >
                      {jerseyTexture ? "Jersey ON (dots) +$10" : "Jersey OFF"}
                    </button>
                  </div>
                )}

                <div style={{ marginTop: 10 }}>
                  <div style={label}>Background tint</div>
                  <button
                    type="button"
                    onClick={() => setTintEnabled((v) => !v)}
                    style={{
                      ...pillBtn,
                      marginTop: 8,
                      background: tintEnabled ? CC_GOLD : "#f3f3f3",
                      color: tintEnabled ? CC_GOLD_TEXT : "#111",
                      border: tintEnabled
                        ? "1px solid rgba(0,0,0,0.15)"
                        : "1px solid transparent",
                    }}
                  >
                    {tintEnabled ? "Tint ON" : "Tint OFF (solid)"}
                  </button>

                  {showTeamBannerTintStyle && (
                    <div style={{ marginTop: 10 }}>
                      <div style={label}>Tint type (Team Banner)</div>
                      <div style={{ ...segmentWrap, gridTemplateColumns: "1fr 1fr" }}>
                        <button
                          type="button"
                          onClick={() => setTintStyle("full")}
                          style={{
                            ...segmentBtn,
                            ...(tintStyle === "full" ? segmentBtnActive : {}),
                            borderTopLeftRadius: 12,
                            borderBottomLeftRadius: 12,
                          }}
                        >
                          Fade <span style={{ fontWeight: 900 }}>+$20</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setTintStyle("edge")}
                          style={{
                            ...segmentBtn,
                            ...(tintStyle === "edge" ? segmentBtnActive : {}),
                            borderTopRightRadius: 12,
                            borderBottomRightRadius: 12,
                            borderLeft: "1px solid #e7e7e7",
                          }}
                        >
                          Edge black <span style={{ fontWeight: 900 }}>+$20</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div style={sportsRequestBox}>
                  <div style={sportsRequestText}>
                    <strong>Can’t find your team?</strong> Request it in{" "}
                    <span style={{ fontWeight: 900 }}>Custom</span> (college, international, or multiple have teams on your curb).
                  </div>

                  <Link href="/create?tier=custom" style={sportsRequestBtn}>
                    Go to Custom →
                  </Link>
                </div>
              </>
            )}

            {/* ✅ ACTIONS (RAINBOW STYLES) — INSIDE PANEL */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
              <Link
                href={`/quote?design=${encodeURIComponent(
                  JSON.stringify({ ...config, price, uiTier: tier })
                )}`}
                style={btnPrimary}
                className="cc-hover cc-btn-rainbow"
              >
                <span className="cc-btn-rainbow-text">Get Quote for This</span>
              </Link>

              <Link
                href="/gallery"
                style={{ ...btnGhost, position: "relative", overflow: "hidden", background: "transparent" }}
                className="cc-hover cc-btn-rainbow"
              >
                <span className="cc-btn-rainbow-bg" aria-hidden="true" />
                <span className="cc-btn-rainbow-content">Browse Styles</span>
              </Link>
            </div>
          </div>

          {/* RIGHT: Preview */}
          <div style={preview}>
            {tier === "custom" ? (
              <div
                style={{
                  width: "100%",
                  height: 320,
                  borderRadius: 14,
                  overflow: "hidden",
                  border: "1px solid rgba(0,0,0,0.08)",
                  background: "#f7f7f7",
                }}
                aria-hidden="true"
              >
                <HomePreviewRotator category="custom" />
              </div>
            ) : (
              <CurbDesigner config={config as any} />
            )}

            {/* Disclaimer (ALL TIERS) */}
            <div style={templateNote}>This is a template photo that draws inspiration to your ideas.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* styles */
const pageContainer: CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "0 24px",
};

const pageHeader: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  flexWrap: "wrap",
  alignItems: "flex-start",
};

const pageTitle: CSSProperties = {
  margin: 0,
  fontSize: 42,
  fontWeight: 900,
  letterSpacing: -0.5,
};

const pageSubtitle: CSSProperties = {
  marginTop: 10,
  marginBottom: 0,
  opacity: 0.75,
  fontSize: 16,
};

const layout: CSSProperties = {
  display: "grid",
  gap: 12,
  gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
  alignItems: "start",
};

const panel: CSSProperties = {
  border: "1px solid #eee",
  borderRadius: 18,
  padding: 16,
  display: "grid",
  gap: 10,
  background: "#fff",
};

const preview: CSSProperties = {
  border: "1px solid #eee",
  borderRadius: 18,
  padding: 16,
  background: "#fff",
};

const templateNote: CSSProperties = {
  marginTop: 10,
  fontSize: 13,
  opacity: 0.7,
  textAlign: "center",
};

const tierRow: CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  alignItems: "center",
};

const tierBtn: CSSProperties = {
  border: "none",
  borderRadius: 14,
  padding: "10px 12px",
  fontWeight: 900,
  cursor: "pointer",
};

const pillBtn: CSSProperties = {
  border: "none",
  borderRadius: 999,
  padding: "10px 12px",
  fontWeight: 900,
  cursor: "pointer",
  background: "#f3f3f3",
};

const segmentWrap: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  border: "1px solid #e7e7e7",
  borderRadius: 12,
  overflow: "hidden",
  marginTop: 8,
};

const segmentBtn: CSSProperties = {
  padding: "10px 12px",
  background: "#fff",
  cursor: "pointer",
  border: "none",
  fontWeight: 900,
};

const segmentBtnActive: CSSProperties = {
  background: CC_GOLD,
  color: CC_GOLD_TEXT,
};

const pricePill: CSSProperties = {
  border: "1px solid #eee",
  borderRadius: 16,
  padding: "10px 14px",
  background: "#fff",
  minWidth: 120,
  textAlign: "right",
};

const label: CSSProperties = { fontSize: 13, fontWeight: 900, opacity: 0.85 };

const input: CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #e7e7e7",
  outline: "none",
};

const selectStyle: CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #e7e7e7",
  outline: "none",
  background: "#fff",
};

const texasNote: CSSProperties = {
  fontSize: 13,
  opacity: 0.85,
  background: "#fff7d6",
  border: "1px solid rgba(0,0,0,0.12)",
  borderRadius: 12,
  padding: 10,
};

const sportsRequestBox: CSSProperties = {
  marginTop: 14,
  background: "#fff7d6",
  border: "1px solid rgba(0,0,0,0.12)",
  borderRadius: 14,
  padding: "14px 16px",
  display: "grid",
  gap: 10,
};

const sportsRequestText: CSSProperties = {
  fontSize: 14,
  lineHeight: 1.4,
  color: "#111",
};

const sportsRequestBtn: CSSProperties = {
  background: CC_GOLD,
  color: CC_GOLD_TEXT,
  padding: "8px 14px",
  borderRadius: 10,
  fontWeight: 900,
  textDecoration: "none",
  display: "inline-block",
  width: "fit-content",
  border: "1px solid rgba(0,0,0,0.15)",
};

const btnPrimary: CSSProperties = {
  background: "#111",
  color: "#fff",
  padding: "10px 12px",
  borderRadius: 12,
  fontWeight: 900,
  textDecoration: "none",
  display: "inline-block",
};

const btnGhost: CSSProperties = {
  background: "#f3f3f3",
  color: "#111",
  padding: "10px 12px",
  borderRadius: 12,
  fontWeight: 900,
  textDecoration: "none",
  display: "inline-block",
};
  const [basicLogoRight, setBasicLogoRight] = useState<BasicLogoId>("none");
  const [secondLogoEnabled, setSecondLogoEnabled] = useState<boolean>(false);

  // Basic background preset color
  const [basicBgColor, setBasicBgColor] = useState<BasicBgColorId>("light-yellow");

  // Basic white address box (numbers only; logos stay outside)
  const [basicWhiteBox, setBasicWhiteBox] = useState<boolean>(false);

  // Sports
  const [league, setLeague] = useState<SportsLeague>("NFL");
  const leagueTeams = useMemo(() => getTeamsByLeague(league), [league]);

  const [team, setTeam] = useState<SportsTeam>("Eagles");
  const [logoSide, setLogoSide] = useState<LogoSide>("right");

  const [sportsTrim, setSportsTrim] = useState<SportsTrim>("main");
  const [tintEnabled, setTintEnabled] = useState<boolean>(false);

  const [tintStyle, setTintStyle] = useState<TintStyle>("full");
  const [plateStyle, setPlateStyle] = useState<PlateStyle>("striped");
  const [topBandStyle, setTopBandStyle] = useState<TopBandStyle>("flag");

  const [teamBannerBorderStyle, setTeamBannerBorderStyle] =
    useState<TeamBannerBorderStyle>("standard");

  const [jerseyTexture, setJerseyTexture] = useState<boolean>(false);

  // Custom colors
  const [bg, setBg] = useState("#111111");
  const [text, setText] = useState("#FFFFFF");
  const [border, setBorder] = useState("#FFFFFF");

  // Icons add-on state (basic)
  const [activeIcon, setActiveIcon] = useState<IconType>("paw");
  const [activeIconScale, setActiveIconScale] = useState<number>(1);
  const [placedIcons, setPlacedIcons] = useState<DesignConfig["placedIcons"]>([]);

  const isSports = tier === "sports";
  const isCustom = tier === "custom";
  const isTexas = tier === "texas";
  const isBasic = tier === "basic" || tier === "texas"; // Texas behaves like Basic UI-wise (no options)

  // If league changes and current team isn’t in that league, snap to first team
  useMemo(() => {
    if (!leagueTeams.includes(team as any)) {
      setTeam((leagueTeams[0] as SportsTeam) ?? ("Eagles" as SportsTeam));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leagueTeams]);

  // Effective colors
  const colors = useMemo(() => {
    if (isCustom) return { bg, text, border };
    if (isSports) return { bg: "#0B0B0B", text: "#FFFFFF", border: "#FFFFFF" };

    // BASIC / TEXAS:
    const basicBgEnabled = !isTexas && isAddOnEnabled(addOns, "basicBgColor");
    const picked = basicBgEnabled ? getBasicBgHex(basicBgColor) : undefined;
    return { bg: picked ?? "#FFFFFF", text: "#000000", border: "#000000" };
  }, [isCustom, isSports, isTexas, bg, text, border, addOns, basicBgColor]);

  // ✅ Only allow add-ons on BASIC, but NEVER in Texas
  const effectiveAddOns = useMemo(() => {
    if (isTexas) return [];
    return tier === "basic" ? addOns : [];
  }, [isTexas, tier, addOns]);

  // Count basic logos (only when icons add-on is ON) — never in Texas
  const basicLogoCount = useMemo(() => {
    if (isTexas) return 0;
    if (!(tier === "basic" && isAddOnEnabled(addOns, "icons"))) return 0;

    let count = 0;
    if (basicLogoLeft !== "none") count += 1;
    if (secondLogoEnabled && basicLogoRight !== "none") count += 1;
    return count;
  }, [isTexas, tier, addOns, basicLogoLeft, secondLogoEnabled, basicLogoRight]);

  // ✅ For pricing + config typing, map Texas -> "basic" tier under the hood
  const effectiveTierForLogic: Tier = useMemo(() => {
    return isTexas ? ("basic" as Tier) : (tier as Tier);
  }, [isTexas, tier]);

  // ✅ PRICE (Texas fixed $40)
  const price = useMemo(() => {
    if (isTexas) {
      return {
        amount: 40,
        label: "$40",
        base: 40,
        addOnTotal: 0,
        breakdown: {
          base: 40,
          addOns: 0,
          icons: 0,
          iconCount: 0,
          basicLogos: 0,
          basicLogoCount: 0,
          sports: 0,
        },
      };
    }

    return computePrice(effectiveTierForLogic, effectiveAddOns, {
      iconCount: placedIcons.length,
      basic: { logoCount: basicLogoCount },
      sports: {
        sportsTrim,
        plateStyle,
        topBandStyle,
        teamBannerBorderStyle,
        tintEnabled,
        tintStyle,
        jerseyTexture,
      },
    });
  }, [
    isTexas,
    effectiveTierForLogic,
    effectiveAddOns,
    placedIcons.length,
    basicLogoCount,
    sportsTrim,
    plateStyle,
    topBandStyle,
    teamBannerBorderStyle,
    tintEnabled,
    tintStyle,
    jerseyTexture,
  ]);

  const showTeamBannerTintStyle =
    isSports && sportsTrim === "full" && topBandStyle === "team" && tintEnabled;

  const showTeamBannerBorderStyle =
    isSports && sportsTrim === "full" && topBandStyle === "team";

  const showJerseyTexture = isSports;

  const config: DesignConfig = useMemo(
    () =>
      ({
        // ✅ Keep templates type happy (Texas uses Basic tier logic)
        tier: effectiveTierForLogic,
        address,
        colors,
        team: isSports ? team : undefined,
        addOns: effectiveAddOns,

        // Basic logo selection only matters if icons add-on is ON (and not Texas)
        basicLogoLeft:
          !isTexas &&
          tier === "basic" &&
          isAddOnEnabled(addOns, "icons") &&
          basicLogoLeft !== "none"
            ? basicLogoLeft
            : undefined,
        basicLogoRight:
          !isTexas &&
          tier === "basic" &&
          isAddOnEnabled(addOns, "icons") &&
          secondLogoEnabled &&
          basicLogoRight !== "none"
            ? basicLogoRight
            : undefined,

        basicBgColor:
          !isTexas && tier === "basic" && isAddOnEnabled(addOns, "basicBgColor")
            ? basicBgColor
            : undefined,

        basicWhiteBox: !isTexas && tier === "basic" ? basicWhiteBox : undefined,

        activeIcon,
        activeIconScale,
        placedIcons,

        // ✅ extra flag for your renderer (safe via any)
        texasMode: isTexas,

        ...(isSports
          ? {
              logoSide,
              tintEnabled,
              tintStyle,
              sportsTrim,
              plateStyle,
              topBandStyle,
              teamBannerBorderStyle,
              jerseyTexture,
            }
          : {}),
      } as any),
    [
      effectiveTierForLogic,
      address,
      colors,
      isSports,
      team,
      effectiveAddOns,
      isTexas,
      tier,
      addOns,
      basicLogoLeft,
      basicLogoRight,
      secondLogoEnabled,
      basicBgColor,
      basicWhiteBox,
      activeIcon,
      activeIconScale,
      placedIcons,
      logoSide,
      tintEnabled,
      tintStyle,
      sportsTrim,
      plateStyle,
      topBandStyle,
      teamBannerBorderStyle,
      jerseyTexture,
    ]
  );

  function switchTier(next: UITier) {
    setTier(next);

    // reset shared stuff
    setAddOns([]);
    setPlacedIcons([]);

    // Texas has NO options
    if (next === "texas") {
      setBasicWhiteBox(false);
      setSecondLogoEnabled(false);
      setBasicLogoLeft("none");
      setBasicLogoRight("none");
      return;
    }

    // leaving basic -> reset basic-only stuff
    if (next !== "basic") {
      setBasicWhiteBox(false);
      setSecondLogoEnabled(false);
      setBasicLogoLeft("none");
      setBasicLogoRight("none");
    }

    if (next === "sports") {
      setLeague("NFL");
      setTeam("Eagles" as SportsTeam);
      setLogoSide("right");
      setTintEnabled(false);
      setTintStyle("full");
      setSportsTrim("main");
      setPlateStyle("striped");
      setTopBandStyle("flag");
      setTeamBannerBorderStyle("standard");
      setJerseyTexture(false);
    }
  }

  function toggleOption(id: AddOn) {
    setAddOns((prev) => toggleAddOn(prev, id));
  }

  const iconsOn = tier === "basic" && !isTexas && isAddOnEnabled(addOns, "icons");
  const bgOn = tier === "basic" && !isTexas && isAddOnEnabled(addOns, "basicBgColor");

  const subtitleText = isTexas
    ? "Enter your address → preview your Texas design."
    : "Start with your selection → enter your address → add options.";

  return (
    <div style={pageContainer}>
      <div style={{ display: "grid", gap: 14 }}>
        <div style={pageHeader}>
          <div style={{ textAlign: "left" }}>
            <h1 style={pageTitle}>Create your design</h1>
            <p style={pageSubtitle}>{subtitleText}</p>
          </div>

          <div style={pricePill}>
            <div style={{ fontSize: 12, opacity: 0.75 }}>Price</div>
            <div style={{ fontSize: 20, fontWeight: 900 }}>{price.label}</div>
          </div>
        </div>

        <div style={{ ...tierRow, justifyContent: "flex-start" }}>
          {(["basic", "texas", "sports", "custom"] as UITier[]).map((t) => {
            const isSelected = selectedTier === t;
            return (
              <button
                key={t}
                onClick={() => switchTier(t)}
                style={{
                  ...tierBtn,
                  background: isSelected ? CC_GOLD : "#f3f3f3",
                  color: isSelected ? CC_GOLD_TEXT : "#111",
                  border: isSelected ? "1px solid rgba(0,0,0,0.15)" : "1px solid transparent",
                }}
                type="button"
              >
                {t === "basic"
                  ? "Basic"
                  : t === "texas"
                    ? "Texas"
                    : t === "sports"
                      ? "Sports Team"
                      : "Custom"}
                <span style={{ marginLeft: 8, opacity: 0.85, fontWeight: 900 }}>
                  {t === "basic"
                    ? "$30+"
                    : t === "texas"
                      ? "$40"
                      : t === "sports"
                        ? "$60+"
                        : "$50+"}
                </span>
              </button>
            );
          })}
        </div>

        <div style={layout}>
          {/* LEFT: Controls */}
          <div style={panel}>
            <label style={label}>Address (3–6 digits)</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
              style={input}
              inputMode="numeric"
            />

            {/* BASIC (includes Texas) */}
            {isBasic && (
              <>
                {isTexas && <div style={texasNote}>Only the address can be edited for this style.</div>}

                {!isTexas && (
                  <>
                    <div style={{ marginTop: 6 }}>
                      <div style={label}>Add options</div>

                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
                        <button
                          onClick={() => toggleOption("icons")}
                          style={{
                            ...pillBtn,
                            background: isAddOnEnabled(addOns, "icons") ? CC_GOLD : "#f3f3f3",
                            color: isAddOnEnabled(addOns, "icons") ? CC_GOLD_TEXT : "#111",
                            border: isAddOnEnabled(addOns, "icons")
                              ? "1px solid rgba(0,0,0,0.15)"
                              : "1px solid transparent",
                          }}
                          type="button"
                        >
                          Icons <span style={{ fontWeight: 900 }}>+$10</span>{" "}
                          <span style={{ opacity: 0.9 }}>each</span>
                        </button>

                        <button
                          onClick={() => toggleOption("flagPlus")}
                          style={{
                            ...pillBtn,
                            background: isAddOnEnabled(addOns, "flagPlus") ? CC_GOLD : "#f3f3f3",
                            color: isAddOnEnabled(addOns, "flagPlus") ? CC_GOLD_TEXT : "#111",
                            border: isAddOnEnabled(addOns, "flagPlus")
                              ? "1px solid rgba(0,0,0,0.15)"
                              : "1px solid transparent",
                          }}
                          type="button"
                        >
                          U.S. Flag Band <span style={{ fontWeight: 900 }}>+$30</span>
                        </button>

                        <button
                          onClick={() => toggleOption("basicBgColor")}
                          style={{
                            ...pillBtn,
                            background: isAddOnEnabled(addOns, "basicBgColor") ? CC_GOLD : "#f3f3f3",
                            color: isAddOnEnabled(addOns, "basicBgColor") ? CC_GOLD_TEXT : "#111",
                            border: isAddOnEnabled(addOns, "basicBgColor")
                              ? "1px solid rgba(0,0,0,0.15)"
                              : "1px solid transparent",
                          }}
                          type="button"
                        >
                          Background Color <span style={{ fontWeight: 900 }}>+$15</span>
                        </button>
                      </div>

                      {bgOn && (
                        <div style={{ marginTop: 12 }}>
                          <div style={label}>Background color (preset)</div>
                          <select
                            value={basicBgColor}
                            onChange={(e) => setBasicBgColor(e.target.value as BasicBgColorId)}
                            style={selectStyle}
                          >
                            {BASIC_BG_COLORS.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.label}
                              </option>
                            ))}
                          </select>
                          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
                            Preset colors only (no color wheel).
                          </div>
                        </div>
                      )}

                      <div style={{ marginTop: 12 }}>
                        <div style={label}>Address box</div>
                        <button
                          type="button"
                          onClick={() => setBasicWhiteBox((v) => !v)}
                          style={{
                            ...pillBtn,
                            marginTop: 8,
                            background: basicWhiteBox ? CC_GOLD : "#f3f3f3",
                            color: basicWhiteBox ? CC_GOLD_TEXT : "#111",
                            border: basicWhiteBox
                              ? "1px solid rgba(0,0,0,0.15)"
                              : "1px solid transparent",
                          }}
                        >
                          {basicWhiteBox ? "White Address Box ON" : "White Address Box OFF"}
                        </button>
                        <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
                          White box is for the address only — logos stay outside.
                        </div>
                      </div>
                    </div>

                    {iconsOn && (
                      <div style={{ marginTop: 14 }}>
                        <div style={label}>
                          Logos (optional) <span style={{ opacity: 0.7 }}>+$10 each</span>
                        </div>

                        <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
                          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                            <div style={{ width: 110, fontWeight: 600 }}>Left</div>
                            <select
                              value={basicLogoLeft}
                              onChange={(e) => setBasicLogoLeft(e.target.value as BasicLogoId)}
                              style={selectStyle}
                            >
                              {BASIC_LOGOS.map((l) => (
                                <option key={l.id} value={l.id}>
                                  {l.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <input
                                type="checkbox"
                                checked={secondLogoEnabled}
                                onChange={(e) => {
                                  const on = e.target.checked;
                                  setSecondLogoEnabled(on);
                                  if (!on) setBasicLogoRight("none");
                                }}
                              />
                              Add a second logo
                            </label>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              gap: 10,
                              alignItems: "center",
                              flexWrap: "wrap",
                              opacity: secondLogoEnabled ? 1 : 0.5,
                            }}
                          >
                            <div style={{ width: 110, fontWeight: 600 }}>Right</div>
                            <select
                              disabled={!secondLogoEnabled}
                              value={basicLogoRight}
                              onChange={(e) => setBasicLogoRight(e.target.value as BasicLogoId)}
                              style={selectStyle}
                            >
                              {BASIC_LOGOS.map((l) => (
                                <option key={l.id} value={l.id}>
                                  {l.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
                          Pricing: any logo other than “None” adds <b>$10</b>.
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {/* Sports panel */}
            {isSports && (
              <>
                <label style={{ ...label, marginTop: 10 }}>League</label>
                <select
                  value={league}
                  onChange={(e) => setLeague(e.target.value as SportsLeague)}
                  style={input}
                >
                  <option value="NFL">NFL</option>
                  <option value="NBA">NBA</option>
                  <option value="MLB">MLB</option>
                </select>

                <label style={{ ...label, marginTop: 10 }}>Team</label>
                <select value={team} onChange={(e) => setTeam(e.target.value as SportsTeam)} style={input}>
                  {leagueTeams.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>

                <div style={{ marginTop: 10 }}>
                  <div style={label}>Logo orientation</div>
                  <div style={segmentWrap}>
                    <button
                      onClick={() => setLogoSide("left")}
                      style={{
                        ...segmentBtn,
                        ...(logoSide === "left" ? segmentBtnActive : {}),
                        borderTopLeftRadius: 12,
                        borderBottomLeftRadius: 12,
                      }}
                      type="button"
                    >
                      Logo Left
                    </button>
                    <button
                      onClick={() => setLogoSide("right")}
                      style={{
                        ...segmentBtn,
                        ...(logoSide === "right" ? segmentBtnActive : {}),
                        borderTopRightRadius: 12,
                        borderBottomRightRadius: 12,
                        borderLeft: "1px solid #e7e7e7",
                      }}
                      type="button"
                    >
                      Logo Right
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: 10 }}>
                  <div style={label}>Address plate</div>
                  <div style={{ ...segmentWrap, gridTemplateColumns: "1fr 1fr 1fr" }}>
                    <button
                      type="button"
                      onClick={() => setPlateStyle("striped")}
                      style={{
                        ...segmentBtn,
                        ...(plateStyle === "striped" ? segmentBtnActive : {}),
                        borderTopLeftRadius: 12,
                        borderBottomLeftRadius: 12,
                      }}
                    >
                      Box + Stripe <span style={{ fontWeight: 900 }}>+$5</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPlateStyle("plain")}
                      style={{
                        ...segmentBtn,
                        ...(plateStyle === "plain" ? segmentBtnActive : {}),
                        borderLeft: "1px solid #e7e7e7",
                      }}
                    >
                      Box Only
                    </button>

                    <button
                      type="button"
                      onClick={() => setPlateStyle("dogtag")}
                      style={{
                        ...segmentBtn,
                        ...(plateStyle === "dogtag" ? segmentBtnActive : {}),
                        borderTopRightRadius: 12,
                        borderBottomRightRadius: 12,
                        borderLeft: "1px solid #e7e7e7",
                      }}
                    >
                      Dog Tag <span style={{ fontWeight: 900 }}>+$10</span>
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: 10 }}>
                  <div style={label}>Curb style</div>
                  <div style={segmentWrap}>
                    <button
                      onClick={() => setSportsTrim("main")}
                      style={{
                        ...segmentBtn,
                        ...(sportsTrim === "main" ? segmentBtnActive : {}),
                        borderTopLeftRadius: 12,
                        borderBottomLeftRadius: 12,
                      }}
                      type="button"
                    >
                      Main Face
                    </button>
                    <button
                      onClick={() => setSportsTrim("full")}
                      style={{
                        ...segmentBtn,
                        ...(sportsTrim === "full" ? segmentBtnActive : {}),
                        borderTopRightRadius: 12,
                        borderBottomRightRadius: 12,
                        borderLeft: "1px solid #e7e7e7",
                      }}
                      type="button"
                    >
                      Full Curb (Top Band) <span style={{ fontWeight: 900 }}>+$30</span>
                    </button>
                  </div>
                </div>

                {sportsTrim === "full" && (
                  <div style={{ marginTop: 10 }}>
                    <div style={label}>Top band style</div>
                    <div style={{ ...segmentWrap, gridTemplateColumns: "1fr 1fr" }}>
                      <button
                        type="button"
                        onClick={() => setTopBandStyle("flag")}
                        style={{
                          ...segmentBtn,
                          ...(topBandStyle === "flag" ? segmentBtnActive : {}),
                          borderTopLeftRadius: 12,
                          borderBottomLeftRadius: 12,
                        }}
                      >
                        U.S. Flag
                      </button>

                      <button
                        type="button"
                        onClick={() => setTopBandStyle("team")}
                        style={{
                          ...segmentBtn,
                          ...(topBandStyle === "team" ? segmentBtnActive : {}),
                          borderTopRightRadius: 12,
                          borderBottomRightRadius: 12,
                          borderLeft: "1px solid #e7e7e7",
                        }}
                      >
                        Team Banner
                      </button>
                    </div>
                  </div>
                )}

                {showTeamBannerBorderStyle && (
                  <div style={{ marginTop: 10 }}>
                    <div style={label}>Border style (Team Banner)</div>
                    <div style={{ ...segmentWrap, gridTemplateColumns: "1fr 1fr 1fr" }}>
                      <button
                        type="button"
                        onClick={() => setTeamBannerBorderStyle("standard")}
                        style={{
                          ...segmentBtn,
                          ...(teamBannerBorderStyle === "standard" ? segmentBtnActive : {}),
                          borderTopLeftRadius: 12,
                          borderBottomLeftRadius: 12,
                        }}
                      >
                        Standard (black)
                      </button>

                      <button
                        type="button"
                        onClick={() => setTeamBannerBorderStyle("triple")}
                        style={{
                          ...segmentBtn,
                          ...(teamBannerBorderStyle === "triple" ? segmentBtnActive : {}),
                          borderLeft: "1px solid #e7e7e7",
                        }}
                      >
                        Black / White / Black <span style={{ fontWeight: 900 }}>+$10</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTeamBannerBorderStyle("sideStripes")}
                        style={{
                          ...segmentBtn,
                          ...(teamBannerBorderStyle === "sideStripes" ? segmentBtnActive : {}),
                          borderTopRightRadius: 12,
                          borderBottomRightRadius: 12,
                          borderLeft: "1px solid #e7e7e7",
                        }}
                      >
                        Side Stripes <span style={{ fontWeight: 900 }}>+$20</span>
                      </button>
                    </div>
                  </div>
                )}

                {showJerseyTexture && (
                  <div style={{ marginTop: 10 }}>
                    <div style={label}>Jersey texture</div>
                    <button
                      type="button"
                      onClick={() => setJerseyTexture((v) => !v)}
                      style={{
                        ...pillBtn,
                        marginTop: 8,
                        background: jerseyTexture ? CC_GOLD : "#f3f3f3",
                        color: jerseyTexture ? CC_GOLD_TEXT : "#111",
                        border: jerseyTexture
                          ? "1px solid rgba(0,0,0,0.15)"
                          : "1px solid transparent",
                      }}
                    >
                      {jerseyTexture ? "Jersey ON (dots) +$10" : "Jersey OFF"}
                    </button>
                  </div>
                )}

                <div style={{ marginTop: 10 }}>
                  <div style={label}>Background tint</div>
                  <button
                    type="button"
                    onClick={() => setTintEnabled((v) => !v)}
                    style={{
                      ...pillBtn,
                      marginTop: 8,
                      background: tintEnabled ? CC_GOLD : "#f3f3f3",
                      color: tintEnabled ? CC_GOLD_TEXT : "#111",
                      border: tintEnabled
                        ? "1px solid rgba(0,0,0,0.15)"
                        : "1px solid transparent",
                    }}
                  >
                    {tintEnabled ? "Tint ON" : "Tint OFF (solid)"}
                  </button>

                  {showTeamBannerTintStyle && (
                    <div style={{ marginTop: 10 }}>
                      <div style={label}>Tint type (Team Banner)</div>
                      <div style={{ ...segmentWrap, gridTemplateColumns: "1fr 1fr" }}>
                        <button
                          type="button"
                          onClick={() => setTintStyle("full")}
                          style={{
                            ...segmentBtn,
                            ...(tintStyle === "full" ? segmentBtnActive : {}),
                            borderTopLeftRadius: 12,
                            borderBottomLeftRadius: 12,
                          }}
                        >
                          Fade <span style={{ fontWeight: 900 }}>+$20</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setTintStyle("edge")}
                          style={{
                            ...segmentBtn,
                            ...(tintStyle === "edge" ? segmentBtnActive : {}),
                            borderTopRightRadius: 12,
                            borderBottomRightRadius: 12,
                            borderLeft: "1px solid #e7e7e7",
                          }}
                        >
                          Edge black <span style={{ fontWeight: 900 }}>+$20</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div style={sportsRequestBox}>
                  <div style={sportsRequestText}>
                    <strong>Can’t find your team?</strong> Request it in{" "}
                    <span style={{ fontWeight: 900 }}>Custom</span> (college, international, or multiple have teams on your curb).
                  </div>

                  <Link href="/create?tier=custom" style={sportsRequestBtn}>
                    Go to Custom →
                  </Link>
                </div>
              </>
            )}

          {/* ✅ ACTIONS (RAINBOW STYLES) — INSIDE PANEL */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
            <Link
              href={`/quote?design=${encodeURIComponent(
                JSON.stringify({ ...config, price, uiTier: tier })
              )}`}
              style={btnPrimary}
              className="cc-hover cc-btn-rainbow"
            >
              <span className="cc-btn-rainbow-text">Get Quote for This</span>
            </Link>
              <Link
                href="/gallery"
                style={{ ...btnGhost, position: "relative", overflow: "hidden", background: "transparent" }}
                className="cc-hover cc-btn-rainbow"
              >
                <span className="cc-btn-rainbow-bg" aria-hidden="true" />
                <span className="cc-btn-rainbow-content">Browse Styles</span>
              </Link>
          </div>
        </div>
          {/* RIGHT: Preview */}
          <div style={preview}>
            {tier === "custom" ? (
              <div
                style={{
                  width: "100%",
                  height: 320,
                  borderRadius: 14,
                  overflow: "hidden",
                  border: "1px solid rgba(0,0,0,0.08)",
                  background: "#f7f7f7",
                }}
                aria-hidden="true"
              >
                <HomePreviewRotator category="custom" />
              </div>
            ) : (
              <CurbDesigner config={config as any} />
            )}

            {/* Disclaimer (ALL TIERS) */}
            <div style={templateNote}>This is a template photo that draws inspiration to your ideas.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* styles */
const pageContainer: CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "0 24px",
};

const pageHeader: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  flexWrap: "wrap",
  alignItems: "flex-start",
};

const pageTitle: CSSProperties = {
  margin: 0,
  fontSize: 42,
  fontWeight: 900,
  letterSpacing: -0.5,
};

const pageSubtitle: CSSProperties = {
  marginTop: 10,
  marginBottom: 0,
  opacity: 0.75,
  fontSize: 16,
};

const layout: CSSProperties = {
  display: "grid",
  gap: 12,
  gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
  alignItems: "start",
};

const panel: CSSProperties = {
  border: "1px solid #eee",
  borderRadius: 18,
  padding: 16,
  display: "grid",
  gap: 10,
  background: "#fff",
};

const preview: CSSProperties = {
  border: "1px solid #eee",
  borderRadius: 18,
  padding: 16,
  background: "#fff",
};

const templateNote: CSSProperties = {
  marginTop: 10,
  fontSize: 13,
  opacity: 0.7,
  textAlign: "center",
};

const tierRow: CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  alignItems: "center",
};

const tierBtn: CSSProperties = {
  border: "none",
  borderRadius: 14,
  padding: "10px 12px",
  fontWeight: 900,
  cursor: "pointer",
};

const pillBtn: CSSProperties = {
  border: "none",
  borderRadius: 999,
  padding: "10px 12px",
  fontWeight: 900,
  cursor: "pointer",
  background: "#f3f3f3",
};

const segmentWrap: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  border: "1px solid #e7e7e7",
  borderRadius: 12,
  overflow: "hidden",
  marginTop: 8,
};

const segmentBtn: CSSProperties = {
  padding: "10px 12px",
  background: "#fff",
  cursor: "pointer",
  border: "none",
  fontWeight: 900,
};

const segmentBtnActive: CSSProperties = {
  background: CC_GOLD,
  color: CC_GOLD_TEXT,
};

const pricePill: CSSProperties = {
  border: "1px solid #eee",
  borderRadius: 16,
  padding: "10px 14px",
  background: "#fff",
  minWidth: 120,
  textAlign: "right",
};

const label: CSSProperties = { fontSize: 13, fontWeight: 900, opacity: 0.85 };

const input: CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #e7e7e7",
  outline: "none",
};

const selectStyle: CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #e7e7e7",
  outline: "none",
  background: "#fff",
};

const texasNote: CSSProperties = {
  fontSize: 13,
  opacity: 0.85,
  background: "#fff7d6",
  border: "1px solid rgba(0,0,0,0.12)",
  borderRadius: 12,
  padding: 10,
};

const sportsRequestBox: CSSProperties = {
  marginTop: 14,
  background: "#fff7d6",
  border: "1px solid rgba(0,0,0,0.12)",
  borderRadius: 14,
  padding: "14px 16px",
  display: "grid",
  gap: 10,
};

const sportsRequestText: CSSProperties = {
  fontSize: 14,
  lineHeight: 1.4,
  color: "#111",
};

const sportsRequestBtn: CSSProperties = {
  background: CC_GOLD,
  color: CC_GOLD_TEXT,
  padding: "8px 14px",
  borderRadius: 10,
  fontWeight: 900,
  textDecoration: "none",
  display: "inline-block",
  width: "fit-content",
  border: "1px solid rgba(0,0,0,0.15)",
};

const btnPrimary: CSSProperties = {
  background: "#111",
  color: "#fff",
  padding: "10px 12px",
  borderRadius: 12,
  fontWeight: 900,
  textDecoration: "none",
  display: "inline-block",
};

const btnGhost: CSSProperties = {
  background: "#f3f3f3",
  color: "#111",
  padding: "10px 12px",
  borderRadius: 12,
  fontWeight: 900,
  textDecoration: "none",
  display: "inline-block",
};
