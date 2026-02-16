// src/lib/templates.ts

/* =========================
   TYPES
========================= */

export type Tier = "basic" | "texas" | "sports" | "custom";

// ✅ Add-on ids (MUST match page.tsx)
export type AddOn = "icons" | "flagPlus" | "basicBgColor";

// Sports-specific options
export type SportsTrim = "main" | "full"; // main = face only, full = top + face
export type LogoSide = "left" | "right";
export type SportsLeague = "NFL" | "NBA" | "MLB";

// Sports address plate styles
export type PlateStyle = "striped" | "plain" | "dogtag";

// Top band style (sports/full curb only)
export type TopBandStyle = "flag" | "team";

// Background tint behavior (team banner mode)
export type TintStyle = "full" | "edge";

// Team Banner border style (full curb + team banner only)
export type TeamBannerBorderStyle = "standard" | "triple" | "sideStripes";

/* =========================
   ADD-ONS + ICONS
========================= */

export const ADD_ONS: { id: AddOn; label: string; price: number }[] = [
  // NOTE: icons are per-icon and calculated in computePrice with iconCount
  { id: "icons", label: "Icons (per icon)", price: 0 },

  { id: "flagPlus", label: "U.S. Flag Band", price: 30 },
  { id: "basicBgColor", label: "Background Color", price: 15 },
];

export const ICONS = [
  { id: "star", label: "Star" },
  { id: "heart", label: "Heart" },
  { id: "paw", label: "Paw" },
  { id: "flower", label: "Flower" },
  { id: "bolt", label: "Bolt" },
  { id: "crown", label: "Crown" },
] as const;

export type IconType = (typeof ICONS)[number]["id"];

/* =========================
   BASIC BACKGROUND COLORS (PRESETS)
========================= */

export const BASIC_BG_COLORS = [
  { id: "white", label: "White", hex: "#FFFFFF" },
  {id: "light-blue", label: "Light Blue", hex: "#D0E8F2" },
  { id: "green", label: "Green", hex: "#0ea500" },
  {id: "light-yellow", label: "Light Yellow", hex: "#FEF9C3" },
  {id: "light-pink", label: "Light Pink", hex: "#FADADD" },
  {id: "light-purple", label: "Light Purple", hex: "#E6D5F7" },
  { id: "light-gray", label: "Light Gray", hex: "#EDEDED" },
  { id: "black", label: "Black", hex: "#111111" },
  { id: "navy", label: "Navy", hex: "#0B1F3A" },
  { id: "royal-blue", label: "Royal Blue", hex: "#1E4ED8" },
  { id: "red", label: "Red", hex: "#C1121F" },
  { id: "maroon", label: "Maroon", hex: "#6D0F1A" },
  { id: "forest", label: "Forest Green", hex: "#0B5D1E" },
  { id: "teal", label: "Teal", hex: "#0F766E" },
  { id: "purple", label: "Purple", hex: "#5B21B6" },
  { id: "gold", label: "Gold", hex: "#FFD700" },
  { id: "orange", label: "Orange", hex: "#F97316" },
] as const;

export type BasicBgColorId = (typeof BASIC_BG_COLORS)[number]["id"];

export function getBasicBgHex(id?: BasicBgColorId) {
  if (!id) return "#FFFFFF";
  return BASIC_BG_COLORS.find((c) => c.id === id)?.hex ?? "#FFFFFF";
}

/* =========================
   BASIC LOGOS
========================= */

export const BASIC_LOGOS = [
  { id: "none", label: "None", src: "" },
  { id: "us-flag", label: "U.S. Flag", src: "/Logos/US-Flag-logo.png" },
  { id: "air-force", label: "Air Force", src: "/Logos/Air-Force-logo.png" },
  { id: "marine-corps", label: "Marine Corps", src: "/Logos/Marine-corps-logo.png" },
  { id: "navy", label: "Navy", src: "/Logos/Navy-logo.png" },
] as const;

export type BasicLogoId = (typeof BASIC_LOGOS)[number]["id"];

export function getBasicLogoSrc(id?: BasicLogoId) {
  if (!id || id === "none") return undefined;
  return BASIC_LOGOS.find((l) => l.id === id)?.src || undefined;
}

/* =========================
   SPORTS CATALOG
========================= */

export type TeamAssets = {
  logo: string; // transparent logo (required)
  frontLogo?: string; // wordmark / top-band logo (optional)
  fontLogo?: string; // optional alias
};

export type TeamColors = {
  primary: string; // curb background
  secondary: string; // accents
  text: string; // numbers color
  border: string; // plate border
  plate?: string; // optional plate fill override (future)
};

export type SportsTeamConfig = {
  key: string; // internal id
  league: SportsLeague;
  label: string; // display label (shown in dropdown)
  colors: TeamColors;
  assets: TeamAssets;
};

/**
 * NOTE ON COLORS:
 * These are solid “team-ish” defaults so your designs look right immediately.
 * If any team looks slightly off, just tweak primary/secondary.
 */
export const SPORTS_TEAM_CATALOG: SportsTeamConfig[] = [
  /* =========================
     NFL
  ========================= */

  // --- NFC ---
  {
    key: "nfl-cardinals",
    league: "NFL",
    label: "Cardinals",
    colors: { primary: "#b1324f", secondary: "#000000", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nfl/cardinals/arizona-cardinals-logo-transparent.png",
      frontLogo: "/logos/nfl/cardinals/arizona-cardinals-logo-font.png",
    },
  },
  {
    key: "nfl-falcons",
    league: "NFL",
    label: "Falcons",
    colors: { primary: "#640f1d", secondary: "#000000", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nfl/falcons/atlanta-falcons-logo-transparent.png",
      frontLogo: "/logos/nfl/falcons/atlanta-falcons-logo-font.png",
    },
  },
  {
    key: "nfl-panthers",
    league: "NFL",
    label: "Panthers",
    colors: { primary: "#0e5a80", secondary: "#101820", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nfl/panthers/carolina-panthers-logo-transparent.png",
      frontLogo: "/logos/nfl/panthers/carolina-panthers-logo-font.png",
    },
  },
  {
    key: "nfl-bears",
    league: "NFL",
    label: "Bears",
    colors: { primary: "#0B162A", secondary: "#C83803", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nfl/bears/chicago-bears-logo-transparent.png",
      frontLogo: "/logos/nfl/bears/chicago-bears-logo-font.png",
    },
  },
  {
    key: "nfl-cowboys",
    league: "NFL",
    label: "Cowboys",
    colors: { primary: "#0942ad", secondary: "#869397", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nfl/cowboys/dallas-cowboys-logo-transparent.png",
      frontLogo: "/logos/nfl/cowboys/dallas-cowboys-logo-font.png",
    },
  },
  {
    key: "nfl-lions",
    league: "NFL",
    label: "Lions",
    colors: { primary: "#1ca1e9", secondary: "#B0B7BC", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nfl/lions/detroit-lions-logo-transparent.png",
      frontLogo: "/logos/nfl/lions/detroit-lions-logo-font.png",
    },
  },
  {
    key: "nfl-packers",
    league: "NFL",
    label: "Packers",
    colors: { primary: "#346b5c", secondary: "#FFB612", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nfl/packers/green-bay-packers-logo-transparent.png",
      frontLogo: "/logos/nfl/packers/green-bay-packers-logo-font.png",
    },
  },
  {
    key: "nfl-rams",
    league: "NFL",
    label: "Rams",
    colors: { primary: "#114cb9", secondary: "#FFD100", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nfl/rams/los-angeles-rams-logo-transparent.png",
      frontLogo: "/logos/nfl/rams/los-angeles-rams-logo-font.png",
    },
  },
  {
    key: "nfl-vikings",
    league: "NFL",
    label: "Vikings",
    colors: { primary: "#58308d", secondary: "#FFC62F", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nfl/vikings/minnesota-vikings-logo-transparent.png",
      frontLogo: "/logos/nfl/vikings/minnesota-vikings-logo-font.png",
    },
  },
  {
    key: "nfl-saints",
    league: "NFL",
    label: "Saints",
    colors: { primary: "#151f29f8", secondary: "#D3BC8D", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nfl/saints/new-orleans-saints-logo-transparent.png",
      frontLogo: "/logos/nfl/saints/new-orleans-saints-logo-font.png",
    },
  },
  {
    key: "nfl-giants",
    league: "NFL",
    label: "Giants",
    colors: { primary: "#2b438d", secondary: "#A71930", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nfl/giants/new-york-giants-logo-transparent.png",
      frontLogo: "/logos/nfl/giants/new-york-giants-logo-font.png",
    },
  },
  {
    key: "nfl-eagles",
    league: "NFL",
    label: "Eagles",
    colors: { primary: "#03565f", secondary: "#A5ACAF", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nfl/eagles/philadelphia-eagles-logo-transparent.png",
      frontLogo: "/logos/nfl/eagles/philadelphia-eagles-logo-font.png",
    },
  },
  {
    key: "nfl-49ers",
    league: "NFL",
    label: "49ers",
    colors: { primary: "#810c0c", secondary: "#B3995D", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nfl/49ers/san-francisco-49ers-logo-transparent.png",
      frontLogo: "/logos/nfl/49ers/san-francisco-49ers-logo-font.png",
    },
  },
  {
    key: "nfl-seahawks",
    league: "NFL",
    label: "Seahawks",
    colors: { primary: "#1f4b77", secondary: "#69BE28", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nfl/seahawks/seattle-seahawks-logo-transparent.png",
      frontLogo: "/logos/nfl/seahawks/seattle-seahawks-logo-font.png",
    },
  },
  {
    key: "nfl-buccaneers",
    league: "NFL",
    label: "Buccaneers",
    colors: { primary: "#9b0f0f", secondary: "#34302B", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nfl/buccaneers/tampa-bay-buccaneers-logo-transparent.png",
      frontLogo: "/logos/nfl/buccaneers/tampa-bay-buccaneers-logo-font.png",
    },
  },
  {
    key: "nfl-redskins",
    league: "NFL",
    label: "Redskins",
    colors: { primary: "#8a1f1f", secondary: "#FFB612", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nfl/redskins/washington-redskins-logo-transparent.png",
      frontLogo: "/logos/nfl/redskins/washington-redskins-logo-font.png",
    },
  },

  // --- AFC ---
  {
    key: "nfl-ravens",
    league: "NFL",
    label: "Ravens",
    colors: { primary: "#251975", secondary: "#9E7C0C", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nfl/ravens/baltimore-ravens-logo-transparent.png",
      frontLogo: "/logos/nfl/ravens/baltimore-ravens-logo-font.png",
    },
  },
  {
    key: "nfl-bills",
    league: "NFL",
    label: "Bills",
    colors: { primary: "#1d51ac", secondary: "#C60C30", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nfl/bills/buffalo-bills-logo-transparent.png",
      frontLogo: "/logos/nfl/bills/buffalo-bills-logo-font.png",
    },
  },
  {
    key: "nfl-bengals",
    league: "NFL",
    label: "Bengals",
    colors: { primary: "#c03c10", secondary: "#000000", text: "#111111", border: "#111111" },
    assets: {
      logo: "/logos/nfl/bengals/cincinnati-bengals-logo-transparent.png",
      frontLogo: "/logos/nfl/bengals/cincinnati-bengals-logo-font.png",
    },
  },
  {
    key: "nfl-browns",
    league: "NFL",
    label: "Browns",
    colors: { primary: "#311D00", secondary: "#FF3C00", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nfl/browns/cleveland-browns-logo-transparent.png",
      frontLogo: "/logos/nfl/browns/cleveland-browns-logo-font.png",
    },
  },
  {
    key: "nfl-broncos",
    league: "NFL",
    label: "Broncos",
    colors: { primary: "#be522e", secondary: "#002244", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nfl/broncos/denver-broncos-logo-transparent.png",
      frontLogo: "/logos/nfl/broncos/denver-broncos-logo-font.png",
    },
  },
  {
    key: "nfl-texans",
    league: "NFL",
    label: "Texans",
    colors: { primary: "#0a3a52", secondary: "#A71930", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nfl/texans/houston-texans-logo-transparent.png",
      frontLogo: "/logos/nfl/texans/houston-texans-logo-font.png",
    },
  },
  {
    key: "nfl-colts",
    league: "NFL",
    label: "Colts",
    colors: { primary: "#185497", secondary: "#A2AAAD", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nfl/colts/indianapolis-colts-logo-transparent.png",
      frontLogo: "/logos/nfl/colts/indianapolis-colts-logo-font.png",
    },
  },
  {
    key: "nfl-jaguars",
    league: "NFL",
    label: "Jaguars",
    colors: { primary: "#04697a", secondary: "#D7A22A", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nfl/jaguars/jacksonville-jaguars-logo-transparent.png",
      frontLogo: "/logos/nfl/jaguars/jacksonville-jaguars-logo-font.png",
    },
  },
  {
    key: "nfl-chiefs",
    league: "NFL",
    label: "Chiefs",
    colors: { primary: "#b41a31", secondary: "#FFB81C", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nfl/chiefs/kansas-city-chiefs-logo-transparent.png",
      frontLogo: "/logos/nfl/chiefs/kansas-city-chiefs-logo-font.png",
    },
  },
  {
    key: "nfl-raiders",
    league: "NFL",
    label: "Raiders",
    colors: { primary: "#221e1e", secondary: "#A5ACAF", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nfl/raiders/oakland-raiders-logo-transparent.png",
      frontLogo: "/logos/nfl/raiders/oakland-raiders-logo-font.png",
    },
  },
  {
    key: "nfl-chargers",
    league: "NFL",
    label: "Chargers",
    colors: { primary: "#0b7ab6", secondary: "#FFC20E", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nfl/chargers/los-angeles-chargers-logo-transparent.png",
      frontLogo: "/logos/nfl/chargers/los-angeles-chargers-logo-font.png",
    },
  },
  {
    key: "nfl-dolphins",
    league: "NFL",
    label: "Dolphins",
    colors: { primary: "#077981", secondary: "#FC4C02", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nfl/dolphins/miami-dolphins-logo-transparent.png",
      frontLogo: "/logos/nfl/dolphins/miami-dolphins-logo-font.png",
    },
  },
  {
    key: "nfl-patriots",
    league: "NFL",
    label: "Patriots",
    colors: { primary: "#0e3e6e", secondary: "#C60C30", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nfl/patriots/new-england-patriots-logo-transparent.png",
      frontLogo: "/logos/nfl/patriots/new-england-patriots-logo-font.png",
    },
  },
  {
    key: "nfl-jets",
    league: "NFL",
    label: "Jets",
    colors: { primary: "#1c7456", secondary: "#000000", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nfl/jets/new-york-jets-logo-transparent.png",
      frontLogo: "/logos/nfl/jets/new-york-jets-football-logo.png",
    },
  },
  {
    key: "nfl-steelers",
    league: "NFL",
    label: "Steelers",
    colors: { primary: "#101820", secondary: "#FFB612", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nfl/steelers/pittsburgh-steelers-logo-transparent.png",
      frontLogo: "/logos/nfl/steelers/pittsburgh-steelers-logo-font.png",
    },
  },
  {
    key: "nfl-titans",
    league: "NFL",
    label: "Titans",
    colors: { primary: "#0C2340", secondary: "#4B92DB", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nfl/titans/tennessee-titans-logo-transparent.png",
      frontLogo: "/logos/nfl/titans/tennessee-titans-logo-font.png",
    },
  },

  /* =========================
     NBA
  ========================= */
  {
    key: "nba-celtics",
    league: "NBA",
    label: "Celtics",
    colors: { primary: "#4ba06e", secondary: "#BA9653", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nba/celtics/boston-celtics-logo-transparent.png",
      frontLogo: "/logos/nba/celtics/boston-celtics-logo-font.png",
    },
  },
  {
    key: "nba-nets",
    league: "NBA",
    label: "Nets",
    colors: { primary: "#424242", secondary: "#FFFFFF", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nba/nets/brooklyn-nets-logo-transparent.png",
      frontLogo: "/logos/nba/nets/brooklyn-nets-logo-font.png",
    },
  },
  {
    key: "nba-knicks",
    league: "NBA",
    label: "Knicks",
    colors: { primary: "#448ec4", secondary: "#F58426", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nba/knicks/new-york-knicks-logo-transparent.png",
      frontLogo: "/logos/nba/knicks/new-york-knicks-logo-font.png",
    },
  },
  {
    key: "nba-76ers",
    league: "NBA",
    label: "76ers",
    colors: { primary: "#247dbd", secondary: "#ED174C", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nba/76ers/philadelphia-76ers-logo-transparent.png",
      frontLogo: "/logos/nba/76ers/philadelphia-76ers-logo-font.png",
    },
  },
  {
    key: "nba-raptors",
    league: "NBA",
    label: "Raptors",
    colors: { primary: "#b42a4d", secondary: "#000000", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nba/raptors/toronto-raptors-logo-transparent.png",
      frontLogo: "/logos/nba/raptors/toronto-raptors-logo-official.png",
    },
  },
  {
    key: "nba-bulls",
    league: "NBA",
    label: "Bulls",
    colors: { primary: "#cf1644", secondary: "#000000", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nba/bulls/chicago-bulls-logo-transparent.png",
      frontLogo: "/logos/nba/bulls/chicago-bulls-logo.png",
    },
  },
  {
    key: "nba-cavaliers",
    league: "NBA",
    label: "Cavaliers",
    colors: { primary: "#990744", secondary: "#FDBB30", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nba/cavaliers/cleveland-cavaliers-logo-transparent.png",
      frontLogo: "/logos/nba/cavaliers/cleveland-cavaliers-logo-font.png",
    },
  },
  {
    key: "nba-pistons",
    league: "NBA",
    label: "Pistons",
    colors: { primary: "#9c192f", secondary: "#1D42BA", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nba/pistons/detroit-pistons-logo-transparent.png",
      frontLogo: "/logos/nba/pistons/detroit-pistons-logo-font.png",
    },
  },
  {
    key: "nba-pacers",
    league: "NBA",
    label: "Pacers",
    colors: { primary: "#14549e", secondary: "#FDBB30", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nba/pacers/indiana-pacers-logo-transparent.png",
      frontLogo: "/logos/nba/pacers/indiana-pacers-logo-font.png",
    },
  },
  {
    key: "nba-bucks",
    league: "NBA",
    label: "Bucks",
    colors: { primary: "#097231", secondary: "#EEE1C6", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nba/bucks/milwaukee-bucks-logo-transparent.png",
      frontLogo: "/logos/nba/bucks/milwaukee-bucks-logo-font.png",
    },
  },
  {
    key: "nba-hawks",
    league: "NBA",
    label: "Hawks",
    colors: { primary: "#a7292b", secondary: "#C1D32F", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nba/hawks/atlanta-hawks-logo-transparent.png",
      frontLogo: "/logos/nba/hawks/atlanta-hawks-logo-font.png",
    },
  },
  {
    key: "nba-hornets",
    league: "NBA",
    label: "Hornets",
    colors: { primary: "#332388", secondary: "#00788C", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nba/hornets/charlotte-hornets-logo-transparent.png",
      frontLogo: "/logos/nba/hornets/charlotte-hornets-logo-font.png",
    },
  },
  {
    key: "nba-heat",
    league: "NBA",
    label: "Heat",
    colors: { primary: "#98002E", secondary: "#F9A01B", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nba/heat/miami-heat-logo-transparent.png",
      frontLogo: "/logos/nba/heat/miami-heat-logo-font.png",
    },
  },
  {
    key: "nba-magic",
    league: "NBA",
    label: "Magic",
    colors: { primary: "#0077C0", secondary: "#C4CED4", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nba/magic/orlando-magic-logo-transparent.png",
      frontLogo: "/logos/nba/magic/orlando-magic-logo-font.png",
    },
  },
  {
    key: "nba-wizards",
    league: "NBA",
    label: "Wizards",
    colors: { primary: "#154f92", secondary: "#E31837", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nba/wizards/washington-wizards-logo-transparent.png",
      frontLogo: "/logos/nba/wizards/washington-wizards-logo-font.png",
    },
  },
  {
    key: "nba-nuggets",
    league: "NBA",
    label: "Nuggets",
    colors: { primary: "#122a4e", secondary: "#FEC524", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nba/nuggets/denver-nuggets-logo-transparent.png",
      frontLogo: "/logos/nba/nuggets/denver-nuggets-logo-font.png",
    },
  },
  {
    key: "nba-timberwolves",
    league: "NBA",
    label: "Timberwolves",
    colors: { primary: "#1d4474", secondary: "#78BE20", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nba/timberwolves/minnesota-timberwolves-logo-transparent.png",
      frontLogo: "/logos/nba/timberwolves/minnesota-timberwolves-logo-font.png",
    },
  },
  {
    key: "nba-thunder",
    league: "NBA",
    label: "Thunder",
    colors: { primary: "#0783ca", secondary: "#EF3B24", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nba/thunder/oklahoma-city-thunder-logo-transparent.png",
      frontLogo: "/logos/nba/thunder/oklahoma-city-thunder-logo-font.png",
    },
  },
  {
    key: "nba-trail-blazers",
    league: "NBA",
    label: "Trail Blazers",
    colors: { primary: "#bd3d3f", secondary: "#000000", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nba/trail blazers/portland-trail-blazers-logo.png",
      frontLogo: "/logos/nba/trail blazers/portland-trail-blazers-logo-font.png",
    },
  },
  {
    key: "nba-jazz",
    league: "NBA",
    label: "Jazz",
    colors: { primary: "#0d4483", secondary: "#F9A01B", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nba/jazz/utah-jazz-logo-transparent.png",
      frontLogo: "/logos/nba/jazz/utah-jazz-logo.png",
    },
  },
  {
    key: "nba-warriors",
    league: "NBA",
    label: "Warriors",
    colors: { primary: "#1D428A", secondary: "#FFC72C", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nba/warriors/golden-state-warriors-logo-transparent.png",
      frontLogo: "/logos/nba/warriors/golden-state-warriors-logo-font.png",
    },
  },
  {
    key: "nba-clippers",
    league: "NBA",
    label: "Clippers",
    colors: { primary: "#234894", secondary: "#C8102E", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nba/clippers/los-angeles-clippers-logo-transparent.png",
      frontLogo: "/logos/nba/clippers/los-angeles-clippers-logo-font.png",
    },
  },
  {
    key: "nba-lakers",
    league: "NBA",
    label: "Lakers",
    colors: { primary: "#642f96", secondary: "#FDB927", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nba/lakers/los-angeles-lakers-logo-transparent.png",
      frontLogo: "/logos/nba/lakers/los-angeles-lakers-logo-font.png",
    },
  },
  {
    key: "nba-suns",
    league: "NBA",
    label: "Suns",
    colors: { primary: "#291a7a", secondary: "#E56020", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nba/suns/phoenix-suns-logo-black-and-white-transparent.png",
      frontLogo: "/logos/nba/suns/phoenix-suns-logo-font.png",
    },
  },
  {
    key: "nba-kings",
    league: "NBA",
    label: "Kings",
    colors: { primary: "#7e4caa", secondary: "#63727A", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nba/kings/sacramento-kings-logo-transparent.png",
      frontLogo: "/logos/nba/kings/sacramento-kings-crown-logo.png",
    },
  },
  {
    key: "nba-mavericks",
    league: "NBA",
    label: "Mavericks",
    colors: { primary: "#035c97", secondary: "#B8C4CA", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nba/mavericks/dallas-mavericks-logo-transparent.png",
      frontLogo: "/logos/nba/mavericks/dallas-mavericks-logo-font.png",
    },
  },
  {
    key: "nba-rockets",
    league: "NBA",
    label: "Rockets",
    colors: { primary: "#e62555", secondary: "#C4CED4", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nba/rockets/houston-rockets-logo-transparent.png",
      frontLogo: "/logos/nba/rockets/houston-rockets-logo-font.png",
    },
  },
  {
    key: "nba-grizzlies",
    league: "NBA",
    label: "Grizzlies",
    colors: { primary: "#4d6599", secondary: "#12173F", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nba/grizzlies/memphis-grizzlies-logo-transparent.png",
      frontLogo: "/logos/nba/grizzlies/memphis-grizzlies-logo-font.png",
    },
  },
  {
    key: "nba-pelicans",
    league: "NBA",
    label: "Pelicans",
    colors: { primary: "#081b33", secondary: "#C8102E", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nba/pelicans/new-orleans-pelicans-logo-transparent.png",
      frontLogo: "/logos/nba/pelicans/new-orleans-pelicans-logo-font.png",
    },
  },
  {
    key: "nba-spurs",
    league: "NBA",
    label: "Spurs",
    colors: { primary: "#353131", secondary: "#C4CED4", text: "#FFFFFF", border: "#111111" },
    assets: {
      logo: "/logos/nba/spurs/san-antonio-spurs-logo.png",
      frontLogo: "/logos/nba/spurs/san-antonio-spurs-logo-transparent.png",
    },
  },
    /* =========================
     MLB
  ========================= */
{
  key: "mlb-diamondbacks",
  league: "MLB",
  label: "Diamondbacks",
  colors: { primary: "#910e23", secondary: "#000000", text: "#FFFFFF", border: "#111111" },
  assets: {
    logo: "/logos/mlb/diamondbacks/arizona-diamondbacks-logo-transparent.png",
    frontLogo: "/logos/mlb/diamondbacks/arizona-diamondbacks-logo-font.png",
  },
},
{
  key: "mlb-braves",
  league: "MLB",
  label: "Braves",
  colors: { primary: "#0d2a66", secondary: "#CE1141", text: "#FFFFFF", border: "#111111" },
  assets: {
    logo: "/logos/mlb/braves/atlanta-braves-logo-transparent.png",
    frontLogo: "/logos/mlb/braves/atlanta-braves-logo-font.png",
  },
},
{
  key: "mlb-orioles",
  league: "MLB",
  label: "Orioles",
  colors: { primary: "#923307", secondary: "#000000", text: "#FFFFFF", border: "#111111" },
  assets: {
    logo: "/logos/mlb/orioles/baltimore-orioles-bird-logo.png",
    frontLogo: "/logos/mlb/orioles/baltimore-orioles-alternative-font-logo.png",
  },
},
{
  key: "mlb-red-sox",
  league: "MLB",
  label: "Red Sox",
  colors: { primary: "#10396b", secondary: "#BD3039", text: "#FFFFFF", border: "#111111" },
  assets: {
    logo: "/logos/mlb/red-sox/boston-red-sox-logo-transparent.png",
    frontLogo: "/logos/mlb/red-sox/boston-red-sox-logo-font.png",
  },
},
{
  key: "mlb-cubs",
  league: "MLB",
  label: "Cubs",
  colors: { primary: "#102046", secondary: "#CC3433", text: "#FFFFFF", border: "#111111" },
  assets: {
    logo: "/logos/mlb/cubs/chicago-cubs-logo-transparent.png",
    frontLogo: "/logos/mlb/cubs/chicago-cubs-bear-logo-font.png",
  },
},
{
  key: "mlb-white-sox",
  league: "MLB",
  label: "White Sox",
  colors: { primary: "#504e47", secondary: "#C4CED4", text: "#FFFFFF", border: "#111111" },
  assets: {
    logo: "/logos/mlb/white-sox/chicago-white-sox-logo-transparent.png",
    frontLogo: "/logos/mlb/white-sox/chicago-white-sox-logo-font.png",
  },
},
{
  key: "mlb-reds",
  league: "MLB",
  label: "Reds",
  colors: { primary: "#97081e", secondary: "#000000", text: "#FFFFFF", border: "#111111" },
  assets: {
    logo: "/logos/mlb/reds/cincinnati-reds-logo-transparent.png",
    frontLogo: "/logos/mlb/reds/cincinnati-reds-logo-font.png",
  },
},
{
  key: "mlb-indians",
  league: "MLB",
  label: "Indians",
  colors: { primary: "#0e315c", secondary: "#E31937", text: "#FFFFFF", border: "#111111" },
  assets: {
    logo: "/logos/mlb/indians/cleveland-indians-cap-logo.png",
    frontLogo: "/logos/mlb/indians/cleveland-indians-logo-font.png",
  },
},
{
  key: "mlb-rockies",
  league: "MLB",
  label: "Rockies",
  colors: { primary: "#5d2b97", secondary: "#C4CED4", text: "#FFFFFF", border: "#111111" },
  assets: {
    logo: "/logos/mlb/rockies/colorado-rockies-logo-transparent.png",
    frontLogo: "/logos/mlb/rockies/colorado-rockies-logo-font.png",
  },
},
{
  key: "mlb-tigers",
  league: "MLB",
  label: "Tigers",
  colors: { primary: "#244977", secondary: "#FA4616", text: "#FFFFFF", border: "#111111" },
  assets: {
    logo: "/logos/mlb/tigers/detroit-tigers-logo-transparent.png",
    frontLogo: "/logos/mlb/tigers/detroit-tigers-logo-font.png",
  },
},
{
  key: "mlb-astros",
  league: "MLB",
  label: "Astros",
  colors: { primary: "#193e68", secondary: "#EB6E1F", text: "#FFFFFF", border: "#111111" },
  assets: {
    logo: "/logos/mlb/astros/houston-astros-logo-transparent.png",
    frontLogo: "/logos/mlb/astros/houston-astros-logo-font.png",
  },
},
{
  key: "mlb-royals",
  league: "MLB",
  label: "Royals",
  colors: { primary: "#286fb1", secondary: "#BD9B60", text: "#FFFFFF", border: "#111111" },
  assets: {
    logo: "/logos/mlb/royals/kansas-city-royals-logo-transparent.png",
    frontLogo: "/logos/mlb/royals/kansas-city-royals-logo-font.png",
  },
},
{
  key: "mlb-angels",
  league: "MLB",
  label: "Angels",
  colors: { primary: "#e43051", secondary: "#003263", text: "#FFFFFF", border: "#111111" },
  assets: {
    logo: "/logos/mlb/angels/los-angeles-angels-logo-transparent.png",
    frontLogo: "/logos/mlb/angels/los-angeles-angels-logo-font.png",
  },
},
{
  key: "mlb-dodgers",
  league: "MLB",
  label: "Dodgers",
  colors: { primary: "#4291c9", secondary: "#FFFFFF", text: "#FFFFFF", border: "#111111" },
  assets: {
    logo: "/logos/mlb/dodgers/los-angeles-dodgers-logo-transparent.png",
    frontLogo: "/logos/mlb/dodgers/los-angeles-dodgers-logo-font.png",
  },
},
{
  key: "mlb-marlins",
  league: "MLB",
  label: "Marlins",
  colors: { primary: "#00A3E0", secondary: "#EF3340", text: "#FFFFFF", border: "#111111" },
  assets: {
    logo: "/logos/mlb/marlins/miami-marlins-logo-transparent.png",
    frontLogo: "/logos/mlb/marlins/miami-marlins-logo-font.png",
  },
},
{
  key: "mlb-brewers",
  league: "MLB",
  label: "Brewers",
  colors: { primary: "#153674", secondary: "#FFC52F", text: "#FFFFFF", border: "#111111" },
  assets: {
    logo: "/logos/mlb/brewers/milwaukee-brewers-logo-transparent.png",
    frontLogo: "/logos/mlb/brewers/milwaukee-brewers-logo-font.png",
  },
},
{
  key: "mlb-twins",
  league: "MLB",
  label: "Twins",
  colors: { primary: "#002B5C", secondary: "#D31145", text: "#FFFFFF", border: "#111111" },
  assets: {
    logo: "/logos/mlb/twins/minnesota-twins-logo-transparent.png",
    frontLogo: "/logos/mlb/twins/minnesota-twins-logo-font.png",
  },
},
{
  key: "mlb-mets",
  league: "MLB",
  label: "Mets",
  colors: { primary: "#002D72", secondary: "#FF5910", text: "#FFFFFF", border: "#111111" },
  assets: {
    logo: "/logos/mlb/mets/new-york-mets-logo-transparent.png",
    frontLogo: "/logos/mlb/mets/new-york-mets-logo-font.png",
  },
},
{
  key: "mlb-yankees",
  league: "MLB",
  label: "Yankees",
  colors: { primary: "#3874bd", secondary: "#C4CED4", text: "#FFFFFF", border: "#111111" },
  assets: {
    logo: "/logos/mlb/yankees/new-york-yankees-logo-transparent.png",
    frontLogo: "/logos/mlb/yankees/new-york-yankees-logo-font.png",
  },
},
{
  key: "mlb-athletics",
  league: "MLB",
  label: "Athletics",
  colors: { primary: "#0b665b", secondary: "#EFB21E", text: "#FFFFFF", border: "#111111" },
  assets: {
    logo: "/logos/mlb/athletics/oakland-athletics-logo-transparent.png",
    frontLogo: "/logos/mlb/athletics/oakland-athletics-logo-font.png",
  },
},
{
  key: "mlb-phillies",
  league: "MLB",
  label: "Phillies",
  colors: { primary: "#b82e39", secondary: "#002D72", text: "#FFFFFF", border: "#111111" },
  assets: {
    logo: "/logos/mlb/phillies/philadelphia-phillies-logo-transparent.png",
    frontLogo: "/logos/mlb/phillies/philadelphia-phillies-logo-font.png",
  },
},
{
  key: "mlb-pirates",
  league: "MLB",
  label: "Pirates",
  colors: { primary: "#27251F", secondary: "#FDB827", text: "#FFFFFF", border: "#111111" },
  assets: {
    logo: "/logos/mlb/pirates/pittsburgh-pirates-logo-transparent.png",
    frontLogo: "/logos/mlb/pirates/pittsburgh-pirates-logo-font.png",
  },
},
{
  key: "mlb-padres",
  league: "MLB",
  label: "Padres",
  colors: { primary: "#664f41", secondary: "#FFC425", text: "#FFFFFF", border: "#111111" },
  assets: {
    logo: "/logos/mlb/padres/san-diego-padres-logo-transparent.png",
    frontLogo: "/logos/mlb/padres/san-diego-padres-logo-font.png",
  },
},
{
  key: "mlb-giants",
  league: "MLB",
  label: "Giants",
  colors: { primary: "#575245", secondary: "#FD5A1E", text: "#FFFFFF", border: "#111111" },
  assets: {
    logo: "/logos/mlb/giants/san-francisco-giants-logo-transparent.png",
    frontLogo: "/logos/mlb/giants/san-francisco-giants-logo-font.png",
  },
},
{
  key: "mlb-mariners",
  league: "MLB",
  label: "Mariners",
  colors: { primary: "#0f3566", secondary: "#005C5C", text: "#FFFFFF", border: "#111111" },
  assets: {
    logo: "/logos/mlb/mariners/seattle-mariners-logo-transparent.png",
    frontLogo: "/logos/mlb/mariners/seattle-mariners-logo-font.png",
  },
},
{
  key: "mlb-cardinals",
  league: "MLB",
  label: "Cardinals",
  colors: { primary: "#C41E3A", secondary: "#0C2340", text: "#FFFFFF", border: "#111111" },
  assets: {
    logo: "/logos/mlb/cardinals/st-louis-cardinals-logo-transparent.png",
    frontLogo: "/logos/mlb/cardinals/st-louis-cardinals-logo-font.png",
  },
},
{
  key: "mlb-rays",
  league: "MLB",
  label: "Rays",
  colors: { primary: "#164586", secondary: "#8FBCE6", text: "#FFFFFF", border: "#111111" },
  assets: {
    logo: "/logos/mlb/rays/tampa-bay-rays-logo-transparent.png",
    frontLogo: "/logos/mlb/rays/tampa-bay-rays-logo-font.png",
  },
},
{
  key: "mlb-rangers",
  league: "MLB",
  label: "Rangers",
  colors: { primary: "#326cbd", secondary: "#C0111F", text: "#FFFFFF", border: "#111111" },
  assets: {
    logo: "/logos/mlb/rangers/texas-rangers-logo-transparent.png",
    frontLogo: "/logos/mlb/rangers/texas-rangers-logo-font.png",
  },
},
{
  key: "mlb-blue-jays",
  league: "MLB",
  label: "Blue Jays",
  colors: { primary: "#0e3564", secondary: "#1D2D5C", text: "#FFFFFF", border: "#111111" },
  assets: {
    logo: "/logos/mlb/blue-jays/toronto-blue-jays-logo-transparent.png",
    frontLogo: "/logos/mlb/blue-jays/toronto-blue-jays-logo-font.png",
  },
},
{
  key: "mlb-nationals",
  league: "MLB",
  label: "Nationals",
  colors: { primary: "#660708", secondary: "#14225A", text: "#FFFFFF", border: "#111111" },
  assets: {
    logo: "/logos/mlb/nationals/washington-nationals-logo-transparent.png",
    frontLogo: "/logos/mlb/nationals/washington-nationals-logo-font.png",
  },
},

];

/* =========================
   TEAM LISTS / LOOKUPS
========================= */

export const SPORTS_TEAMS = SPORTS_TEAM_CATALOG.map((t) => t.label) as readonly string[];
export type SportsTeam = (typeof SPORTS_TEAMS)[number];

export const NFL_TEAMS = SPORTS_TEAM_CATALOG.filter((t) => t.league === "NFL").map((t) => t.label) as readonly string[];
export const NBA_TEAMS = SPORTS_TEAM_CATALOG.filter((t) => t.league === "NBA").map((t) => t.label) as readonly string[];
export const MLB_TEAMS = SPORTS_TEAM_CATALOG.filter((t) => t.league === "MLB").map((t) => t.label) as readonly string[];

export function getTeamConfigByLabel(label?: SportsTeam) {
  if (!label) return undefined;
  return SPORTS_TEAM_CATALOG.find((t) => t.label === label);
}

export function getTeamsByLeague(league: SportsLeague) {
  return SPORTS_TEAM_CATALOG.filter((t) => t.league === league).map((t) => t.label) as SportsTeam[];
}

/* =========================
   DESIGN CONFIG
========================= */

export type Colors = { bg: string; text: string; border: string };

export type PlacedIcon = {
  id: IconType;
  x: number;
  y: number;
  scale: number;
};

export type DesignConfig = {
  tier: Tier;
  address: string;
  colors: Colors;

  // ✅ basic: white address box (numbers only; logos stay outside)
  basicWhiteBox?: boolean;

  // basic logos (optional)
  basicLogoLeft?: BasicLogoId;
  basicLogoRight?: BasicLogoId;

  // ✅ basic: background preset selection (only if addOn basicBgColor is enabled)
  basicBgColor?: BasicBgColorId;

  // sports fields
  team?: SportsTeam;

  // sports controls
  sportsTrim?: SportsTrim; // main | full
  logoSide?: LogoSide; // left | right
  plateStyle?: PlateStyle;
  topBandStyle?: TopBandStyle;

  // (sports/full + team banner)
  tintEnabled?: boolean;
  tintStyle?: TintStyle;
  teamBannerBorderStyle?: TeamBannerBorderStyle;

  // (sports) jersey texture
  jerseyTexture?: boolean;

  // add-ons
  addOns: AddOn[];

  // icons add-on fields
  activeIcon?: IconType;
  activeIconScale?: number;
  placedIcons: PlacedIcon[];
};

/* =========================
   PRICING
========================= */

const BASE_PRICES: Record<Tier, number> = {
  basic: 30,
  texas: 40,
  sports: 60,
  custom: 50,
};

export type PriceOptions = {
  // Basic: placed icons are “per icon”
  iconCount?: number;

  // Basic: each selected logo (left/right) that isn't "none" adds $10
  basic?: {
    logoCount?: number;
  };

  // Sports: option-based upsells
  sports?: {
    sportsTrim?: SportsTrim; // full adds $30
    plateStyle?: PlateStyle; // striped +$5, dogtag +$10
    topBandStyle?: TopBandStyle;
    teamBannerBorderStyle?: TeamBannerBorderStyle; // triple +$10, sideStripes +$20
    tintEnabled?: boolean;
    tintStyle?: TintStyle; // when tintEnabled + team => +$20
    jerseyTexture?: boolean; // +$10
  };
};

export function computePrice(tier: Tier, addOns: AddOn[], opts?: PriceOptions) {
  const base = BASE_PRICES[tier];

  // Flat add-ons (flag band / background color). Icons are handled separately.
  const addOnFlatTotal = addOns.reduce((sum, id) => {
    const found = ADD_ONS.find((a) => a.id === id);
    return sum + (found?.price ?? 0);
  }, 0);

  // Placed icons are per icon (only when icons add-on is enabled)
  const iconsEnabled = addOns.includes("icons");
  const iconUnit = 10;
  const iconCount = iconsEnabled ? Math.max(0, opts?.iconCount ?? 0) : 0;
  const iconsTotal = iconsEnabled ? iconCount * iconUnit : 0;

  // Basic logos are per logo (only when icons add-on is enabled)
  const logoUnit = 10;
  const basicLogoCount = iconsEnabled ? Math.max(0, opts?.basic?.logoCount ?? 0) : 0;
  const basicLogosTotal = iconsEnabled ? basicLogoCount * logoUnit : 0;

  // Sports upcharges
  let sportsTotal = 0;
  if (tier === "sports" && opts?.sports) {
    const s = opts.sports;

    // Plate style
    if (s.plateStyle === "striped") sportsTotal += 5;
    if (s.plateStyle === "dogtag") sportsTotal += 10;

    // Full curb
    if (s.sportsTrim === "full") sportsTotal += 30;

    // Jersey texture (+$10) — main or full
    if (s.jerseyTexture) sportsTotal += 10;

    // Team-banner-only upgrades
    if (s.topBandStyle === "team") {
      if (s.teamBannerBorderStyle === "triple") sportsTotal += 10;
      if (s.teamBannerBorderStyle === "sideStripes") sportsTotal += 20;
    }

    // Background tint (+$20) — applies to MAIN or FULL (flag or team)
    if (s.tintEnabled) {
      sportsTotal += 20;
    }
  }

  const amount = base + addOnFlatTotal + iconsTotal + basicLogosTotal + sportsTotal;

  return {
    amount,
    label: tier === "custom" ? `$${amount}+` : `$${amount}`,
    base,
    addOnTotal: addOnFlatTotal + iconsTotal + basicLogosTotal + sportsTotal,
    breakdown: {
      base,
      addOns: addOnFlatTotal,
      icons: iconsTotal,
      iconCount,
      basicLogos: basicLogosTotal,
      basicLogoCount,
      sports: sportsTotal,
    },
  };
}

export function isAddOnEnabled(addOns: AddOn[], id: AddOn) {
  return addOns.includes(id);
}

export function toggleAddOn(addOns: AddOn[], id: AddOn) {
  return addOns.includes(id) ? addOns.filter((x) => x !== id) : [...addOns, id];
}
