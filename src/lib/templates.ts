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
export const SPORTS_TEAM_CATALOG: SportsTeamConfig[] = (() => {
  type League = "NFL" | "NBA" | "MLB";

  const logo = (league: League, teamFolder: string, file: string) =>
    `/Logos/${league}/${teamFolder}/${file}`;

  const team = (
    key: string,
    league: League,
    label: string,
    colors: { primary: string; secondary: string; text: string; border: string },
    teamFolder: string,
    files: { logo: string; frontLogo: string }
  ): SportsTeamConfig => ({
    key,
    league,
    label,
    colors,
    assets: {
      logo: logo(league, teamFolder, files.logo),
      frontLogo: logo(league, teamFolder, files.frontLogo),
    },
  });

  /* =========================
     NFL
  ========================= */
  const NFL: SportsTeamConfig[] = [
    // --- NFC ---
    team(
      "nfl-cardinals",
      "NFL",
      "Cardinals",
      { primary: "#b1324f", secondary: "#000000", text: "#FFFFFF", border: "#111111" },
      "Cardinals",
      { logo: "arizona-cardinals-logo-transparent.png", frontLogo: "arizona-cardinals-logo-font.png" }
    ),
    team(
      "nfl-falcons",
      "NFL",
      "Falcons",
      { primary: "#640f1d", secondary: "#000000", text: "#FFFFFF", border: "#111111" },
      "Falcons",
      { logo: "atlanta-falcons-logo-transparent.png", frontLogo: "atlanta-falcons-logo-font.png" }
    ),
    team(
      "nfl-panthers",
      "NFL",
      "Panthers",
      { primary: "#0e5a80", secondary: "#101820", text: "#FFFFFF", border: "#111111" },
      "Panthers",
      { logo: "carolina-panthers-logo-transparent.png", frontLogo: "carolina-panthers-logo-font.png" }
    ),
    team(
      "nfl-bears",
      "NFL",
      "Bears",
      { primary: "#0B162A", secondary: "#C83803", text: "#FFFFFF", border: "#111111" },
      "Bears",
      { logo: "chicago-bears-logo-transparent.png", frontLogo: "chicago-bears-logo-font.png" }
    ),
    team(
      "nfl-cowboys",
      "NFL",
      "Cowboys",
      { primary: "#0942ad", secondary: "#869397", text: "#FFFFFF", border: "#111111" },
      "Cowboys",
      { logo: "dallas-cowboys-logo-transparent.png", frontLogo: "dallas-cowboys-logo-font.png" }
    ),
    team(
      "nfl-lions",
      "NFL",
      "Lions",
      { primary: "#1ca1e9", secondary: "#B0B7BC", text: "#FFFFFF", border: "#111111" },
      "Lions",
      { logo: "detroit-lions-logo-transparent.png", frontLogo: "detroit-lions-logo-font.png" }
    ),
    team(
      "nfl-packers",
      "NFL",
      "Packers",
      { primary: "#346b5c", secondary: "#FFB612", text: "#FFFFFF", border: "#111111" },
      "Packers",
      { logo: "green-bay-packers-logo-transparent.png", frontLogo: "green-bay-packers-logo-font.png" }
    ),
    team(
      "nfl-rams",
      "NFL",
      "Rams",
      { primary: "#114cb9", secondary: "#FFD100", text: "#FFFFFF", border: "#111111" },
      "Rams",
      { logo: "los-angeles-rams-logo-transparent.png", frontLogo: "los-angeles-rams-logo-font.png" }
    ),
    team(
      "nfl-vikings",
      "NFL",
      "Vikings",
      { primary: "#58308d", secondary: "#FFC62F", text: "#FFFFFF", border: "#111111" },
      "Vikings",
      { logo: "minnesota-vikings-logo-transparent.png", frontLogo: "minnesota-vikings-logo-font.png" }
    ),
    team(
      "nfl-saints",
      "NFL",
      "Saints",
      { primary: "#151f29f8", secondary: "#D3BC8D", text: "#FFFFFF", border: "#111111" },
      "Saints",
      { logo: "new-orleans-saints-logo-transparent.png", frontLogo: "new-orleans-saints-logo-font.png" }
    ),
    team(
      "nfl-giants",
      "NFL",
      "Giants",
      { primary: "#2b438d", secondary: "#A71930", text: "#FFFFFF", border: "#111111" },
      "Giants",
      { logo: "new-york-giants-logo-transparent.png", frontLogo: "new-york-giants-logo-font.png" }
    ),
    team(
      "nfl-eagles",
      "NFL",
      "Eagles",
      { primary: "#03565f", secondary: "#A5ACAF", text: "#FFFFFF", border: "#111111" },
      "Eagles",
      { logo: "philadelphia-eagles-logo-transparent.png", frontLogo: "philadelphia-eagles-logo-font.png" }
    ),
    team(
      "nfl-49ers",
      "NFL",
      "49ers",
      { primary: "#810c0c", secondary: "#B3995D", text: "#FFFFFF", border: "#111111" },
      "49ers",
      { logo: "san-francisco-49ers-logo-transparent.png", frontLogo: "san-francisco-49ers-logo-font.png" }
    ),
    team(
      "nfl-seahawks",
      "NFL",
      "Seahawks",
      { primary: "#1f4b77", secondary: "#69BE28", text: "#FFFFFF", border: "#111111" },
      "Seahawks",
      { logo: "seattle-seahawks-logo-transparent.png", frontLogo: "seattle-seahawks-logo-font.png" }
    ),
    team(
      "nfl-buccaneers",
      "NFL",
      "Buccaneers",
      { primary: "#9b0f0f", secondary: "#34302B", text: "#FFFFFF", border: "#111111" },
      "Buccaneers",
      { logo: "tampa-bay-buccaneers-logo-transparent.png", frontLogo: "tampa-bay-buccaneers-logo-font.png" }
    ),
    team(
      "nfl-redskins",
      "NFL",
      "Redskins",
      { primary: "#8a1f1f", secondary: "#FFB612", text: "#FFFFFF", border: "#111111" },
      "Redskins",
      { logo: "washington-redskins-logo-transparent.png", frontLogo: "washington-redskins-logo-font.png" }
    ),

    // --- AFC ---
    team(
      "nfl-ravens",
      "NFL",
      "Ravens",
      { primary: "#251975", secondary: "#9E7C0C", text: "#FFFFFF", border: "#111111" },
      "Ravens",
      { logo: "baltimore-ravens-logo-transparent.png", frontLogo: "baltimore-ravens-logo-font.png" }
    ),
    team(
      "nfl-bills",
      "NFL",
      "Bills",
      { primary: "#1d51ac", secondary: "#C60C30", text: "#FFFFFF", border: "#111111" },
      "Bills",
      { logo: "buffalo-bills-logo-transparent.png", frontLogo: "buffalo-bills-logo-font.png" }
    ),
    team(
      "nfl-bengals",
      "NFL",
      "Bengals",
      { primary: "#c03c10", secondary: "#000000", text: "#111111", border: "#111111" },
      "Bengals",
      { logo: "cincinnati-bengals-logo-transparent.png", frontLogo: "cincinnati-bengals-logo-font.png" }
    ),
    team(
      "nfl-browns",
      "NFL",
      "Browns",
      { primary: "#311D00", secondary: "#FF3C00", text: "#FFFFFF", border: "#111111" },
      "Browns",
      { logo: "cleveland-browns-logo-transparent.png", frontLogo: "cleveland-browns-logo-font.png" }
    ),
    team(
      "nfl-broncos",
      "NFL",
      "Broncos",
      { primary: "#be522e", secondary: "#002244", text: "#FFFFFF", border: "#111111" },
      "Broncos",
      { logo: "denver-broncos-logo-transparent.png", frontLogo: "denver-broncos-logo-font.png" }
    ),
    team(
      "nfl-texans",
      "NFL",
      "Texans",
      { primary: "#0a3a52", secondary: "#A71930", text: "#FFFFFF", border: "#111111" },
      "Texans",
      { logo: "houston-texans-logo-transparent.png", frontLogo: "houston-texans-logo-font.png" }
    ),
    team(
      "nfl-colts",
      "NFL",
      "Colts",
      { primary: "#185497", secondary: "#A2AAAD", text: "#FFFFFF", border: "#111111" },
      "Colts",
      { logo: "indianapolis-colts-logo-transparent.png", frontLogo: "indianapolis-colts-logo-font.png" }
    ),
    team(
      "nfl-jaguars",
      "NFL",
      "Jaguars",
      { primary: "#04697a", secondary: "#D7A22A", text: "#FFFFFF", border: "#111111" },
      "Jaguars",
      { logo: "jacksonville-jaguars-logo-transparent.png", frontLogo: "jacksonville-jaguars-logo-font.png" }
    ),
    team(
      "nfl-chiefs",
      "NFL",
      "Chiefs",
      { primary: "#b41a31", secondary: "#FFB81C", text: "#FFFFFF", border: "#111111" },
      "Chiefs",
      { logo: "kansas-city-chiefs-logo-transparent.png", frontLogo: "kansas-city-chiefs-logo-font.png" }
    ),
    team(
      "nfl-raiders",
      "NFL",
      "Raiders",
      { primary: "#221e1e", secondary: "#A5ACAF", text: "#FFFFFF", border: "#111111" },
      "Raiders",
      { logo: "oakland-raiders-logo-transparent.png", frontLogo: "oakland-raiders-logo-font.png" }
    ),
    team(
      "nfl-chargers",
      "NFL",
      "Chargers",
      { primary: "#0b7ab6", secondary: "#FFC20E", text: "#FFFFFF", border: "#111111" },
      "Chargers",
      { logo: "los-angeles-chargers-logo-transparent.png", frontLogo: "los-angeles-chargers-logo-font.png" }
    ),
    team(
      "nfl-dolphins",
      "NFL",
      "Dolphins",
      { primary: "#077981", secondary: "#FC4C02", text: "#FFFFFF", border: "#111111" },
      "Dolphins",
      { logo: "miami-dolphins-logo-transparent.png", frontLogo: "miami-dolphins-logo-font.png" }
    ),
    team(
      "nfl-patriots",
      "NFL",
      "Patriots",
      { primary: "#0e3e6e", secondary: "#C60C30", text: "#FFFFFF", border: "#111111" },
      "Patriots",
      { logo: "new-england-patriots-logo-transparent.png", frontLogo: "new-england-patriots-logo-font.png" }
    ),
    team(
      "nfl-jets",
      "NFL",
      "Jets",
      { primary: "#1c7456", secondary: "#000000", text: "#FFFFFF", border: "#111111" },
      "Jets",
      { logo: "new-york-jets-logo-transparent.png", frontLogo: "new-york-jets-football-logo.png" }
    ),
    team(
      "nfl-steelers",
      "NFL",
      "Steelers",
      { primary: "#101820", secondary: "#FFB612", text: "#FFFFFF", border: "#111111" },
      "Steelers",
      { logo: "pittsburgh-steelers-logo-transparent.png", frontLogo: "pittsburgh-steelers-logo-font.png" }
    ),
    team(
      "nfl-titans",
      "NFL",
      "Titans",
      { primary: "#0C2340", secondary: "#4B92DB", text: "#FFFFFF", border: "#111111" },
      "Titans",
      { logo: "tennessee-titans-logo-transparent.png", frontLogo: "tennessee-titans-logo-font.png" }
    ),
  ];

  /* =========================
     NBA
  ========================= */
  const NBA: SportsTeamConfig[] = [
    team(
      "nba-celtics",
      "NBA",
      "Celtics",
      { primary: "#4ba06e", secondary: "#BA9653", text: "#FFFFFF", border: "#111111" },
      "Celtics",
      { logo: "boston-celtics-logo-transparent.png", frontLogo: "boston-celtics-logo-font.png" }
    ),
    team(
      "nba-nets",
      "NBA",
      "Nets",
      { primary: "#424242", secondary: "#FFFFFF", text: "#FFFFFF", border: "#111111" },
      "Nets",
      { logo: "brooklyn-nets-logo-transparent.png", frontLogo: "brooklyn-nets-logo-font.png" }
    ),
    team(
      "nba-knicks",
      "NBA",
      "Knicks",
      { primary: "#448ec4", secondary: "#F58426", text: "#FFFFFF", border: "#111111" },
      "Knicks",
      { logo: "new-york-knicks-logo-transparent.png", frontLogo: "new-york-knicks-logo-font.png" }
    ),
    team(
      "nba-76ers",
      "NBA",
      "76ers",
      { primary: "#247dbd", secondary: "#ED174C", text: "#FFFFFF", border: "#111111" },
      "76ers",
      { logo: "philadelphia-76ers-logo-transparent.png", frontLogo: "philadelphia-76ers-logo-font.png" }
    ),
    team(
      "nba-raptors",
      "NBA",
      "Raptors",
      { primary: "#b42a4d", secondary: "#000000", text: "#FFFFFF", border: "#111111" },
      "Raptors",
      { logo: "toronto-raptors-logo-transparent.png", frontLogo: "toronto-raptors-logo-official.png" }
    ),
    team(
      "nba-bulls",
      "NBA",
      "Bulls",
      { primary: "#cf1644", secondary: "#000000", text: "#FFFFFF", border: "#111111" },
      "Bulls",
      { logo: "chicago-bulls-logo-transparent.png", frontLogo: "chicago-bulls-logo.png" }
    ),
    team(
      "nba-cavaliers",
      "NBA",
      "Cavaliers",
      { primary: "#990744", secondary: "#FDBB30", text: "#FFFFFF", border: "#111111" },
      "Cavaliers",
      { logo: "cleveland-cavaliers-logo-transparent.png", frontLogo: "cleveland-cavaliers-logo-font.png" }
    ),
    team(
      "nba-pistons",
      "NBA",
      "Pistons",
      { primary: "#9c192f", secondary: "#1D42BA", text: "#FFFFFF", border: "#111111" },
      "Pistons",
      { logo: "detroit-pistons-logo-transparent.png", frontLogo: "detroit-pistons-logo-font.png" }
    ),
    team(
      "nba-pacers",
      "NBA",
      "Pacers",
      { primary: "#14549e", secondary: "#FDBB30", text: "#FFFFFF", border: "#111111" },
      "Pacers",
      { logo: "indiana-pacers-logo-transparent.png", frontLogo: "indiana-pacers-logo-font.png" }
    ),

    /* NOTE: this fixes your “trail blazers” space issue by using a real folder name */
    team(
      "nba-trail-blazers",
      "NBA",
      "Trail Blazers",
      { primary: "#bd3d3f", secondary: "#000000", text: "#FFFFFF", border: "#111111" },
      "Trail-Blazers",
      { logo: "portland-trail-blazers-logo.png", frontLogo: "portland-trail-blazers-logo-font.png" }
    ),

    team(
      "nba-jazz",
      "NBA",
      "Jazz",
      { primary: "#0d4483", secondary: "#F9A01B", text: "#FFFFFF", border: "#111111" },
      "Jazz",
      { logo: "utah-jazz-logo-transparent.png", frontLogo: "utah-jazz-logo.png" }
    ),
    team(
      "nba-warriors",
      "NBA",
      "Warriors",
      { primary: "#1D428A", secondary: "#FFC72C", text: "#FFFFFF", border: "#111111" },
      "Warriors",
      { logo: "golden-state-warriors-logo-transparent.png", frontLogo: "golden-state-warriors-logo-font.png" }
    ),
    team(
      "nba-clippers",
      "NBA",
      "Clippers",
      { primary: "#234894", secondary: "#C8102E", text: "#FFFFFF", border: "#111111" },
      "Clippers",
      { logo: "los-angeles-clippers-logo-transparent.png", frontLogo: "los-angeles-clippers-logo-font.png" }
    ),
    team(
      "nba-lakers",
      "NBA",
      "Lakers",
      { primary: "#642f96", secondary: "#FDB927", text: "#FFFFFF", border: "#111111" },
      "Lakers",
      { logo: "los-angeles-lakers-logo-transparent.png", frontLogo: "los-angeles-lakers-logo-font.png" }
    ),
    team(
      "nba-spurs",
      "NBA",
      "Spurs",
      { primary: "#353131", secondary: "#C4CED4", text: "#FFFFFF", border: "#111111" },
      "Spurs",
      { logo: "san-antonio-spurs-logo.png", frontLogo: "san-antonio-spurs-logo-transparent.png" }
    ),
  ];

/* =========================
   MLB
========================= */
const MLB: SportsTeamConfig[] = [
  team(
    "mlb-angels",
    "MLB",
    "Angels",
    { primary: "#e43051", secondary: "#003263", text: "#FFFFFF", border: "#111111" },
    "Angels",
    { logo: "los-angeles-angels-logo-transparent.png", frontLogo: "los-angeles-angels-logo-font.png" }
  ),
  team(
    "mlb-astros",
    "MLB",
    "Astros",
    { primary: "#193e68", secondary: "#EB6E1F", text: "#FFFFFF", border: "#111111" },
    "Astros",
    { logo: "houston-astros-logo-transparent.png", frontLogo: "houston-astros-logo-font.png" }
  ),
  team(
    "mlb-athletics",
    "MLB",
    "Athletics",
    { primary: "#0b665b", secondary: "#EFB21E", text: "#FFFFFF", border: "#111111" },
    "Athletics",
    { logo: "oakland-athletics-logo-transparent.png", frontLogo: "oakland-athletics-logo-font.png" }
  ),
  team(
    "mlb-blue-jays",
    "MLB",
    "Blue Jays",
    { primary: "#0e3564", secondary: "#1D2D5C", text: "#FFFFFF", border: "#111111" },
    "Blue-Jays",
    { logo: "toronto-blue-jays-logo-transparent.png", frontLogo: "toronto-blue-jays-logo-font.png" }
  ),
  team(
    "mlb-braves",
    "MLB",
    "Braves",
    { primary: "#0d2a66", secondary: "#CE1141", text: "#FFFFFF", border: "#111111" },
    "Braves",
    { logo: "atlanta-braves-logo-transparent.png", frontLogo: "atlanta-braves-logo-font.png" }
  ),
  team(
    "mlb-brewers",
    "MLB",
    "Brewers",
    { primary: "#153674", secondary: "#FFC52F", text: "#FFFFFF", border: "#111111" },
    "Brewers",
    { logo: "milwaukee-brewers-logo-transparent.png", frontLogo: "milwaukee-brewers-logo-font.png" }
  ),
  team(
    "mlb-cardinals",
    "MLB",
    "Cardinals",
    { primary: "#C41E3A", secondary: "#0C2340", text: "#FFFFFF", border: "#111111" },
    "Cardinals",
    { logo: "st-louis-cardinals-logo-transparent.png", frontLogo: "st-louis-cardinals-logo-font.png" }
  ),
  team(
    "mlb-cubs",
    "MLB",
    "Cubs",
    { primary: "#102046", secondary: "#CC3433", text: "#FFFFFF", border: "#111111" },
    "Cubs",
    { logo: "chicago-cubs-logo-transparent.png", frontLogo: "chicago-cubs-bear-logo-font.png" }
  ),
  team(
    "mlb-diamondbacks",
    "MLB",
    "Diamondbacks",
    { primary: "#910e23", secondary: "#000000", text: "#FFFFFF", border: "#111111" },
    "Diamondbacks",
    { logo: "arizona-diamondbacks-logo-transparent.png", frontLogo: "arizona-diamondbacks-logo-font.png" }
  ),
  team(
    "mlb-dodgers",
    "MLB",
    "Dodgers",
    { primary: "#4291c9", secondary: "#FFFFFF", text: "#FFFFFF", border: "#111111" },
    "Dodgers",
    { logo: "los-angeles-dodgers-logo-transparent.png", frontLogo: "los-angeles-dodgers-logo-font.png" }
  ),
  team(
    "mlb-giants",
    "MLB",
    "Giants",
    { primary: "#575245", secondary: "#FD5A1E", text: "#FFFFFF", border: "#111111" },
    "Giants",
    { logo: "san-francisco-giants-logo-transparent.png", frontLogo: "san-francisco-giants-logo-font.png" }
  ),
  team(
    "mlb-indians",
    "MLB",
    "Indians",
    { primary: "#0e315c", secondary: "#E31937", text: "#FFFFFF", border: "#111111" },
    "Indians",
    { logo: "cleveland-indians-cap-logo.png", frontLogo: "cleveland-indians-logo-font.png" }
  ),
  team(
    "mlb-mariners",
    "MLB",
    "Mariners",
    { primary: "#0f3566", secondary: "#005C5C", text: "#FFFFFF", border: "#111111" },
    "Mariners",
    { logo: "seattle-mariners-logo-transparent.png", frontLogo: "seattle-mariners-logo-font.png" }
  ),
  team(
    "mlb-marlins",
    "MLB",
    "Marlins",
    { primary: "#00A3E0", secondary: "#EF3340", text: "#FFFFFF", border: "#111111" },
    "Marlins",
    { logo: "miami-marlins-logo-transparent.png", frontLogo: "miami-marlins-logo-font.png" }
  ),
  team(
    "mlb-mets",
    "MLB",
    "Mets",
    { primary: "#002D72", secondary: "#FF5910", text: "#FFFFFF", border: "#111111" },
    "Mets",
    { logo: "new-york-mets-logo-transparent.png", frontLogo: "new-york-mets-logo-font.png" }
  ),
  team(
    "mlb-nationals",
    "MLB",
    "Nationals",
    { primary: "#660708", secondary: "#14225A", text: "#FFFFFF", border: "#111111" },
    "Nationals",
    { logo: "washington-nationals-logo-transparent.png", frontLogo: "washington-nationals-logo-font.png" }
  ),
  team(
    "mlb-orioles",
    "MLB",
    "Orioles",
    { primary: "#923307", secondary: "#000000", text: "#FFFFFF", border: "#111111" },
    "Orioles",
    { logo: "baltimore-orioles-bird-logo.png", frontLogo: "baltimore-orioles-alternative-font-logo.png" }
  ),
  team(
    "mlb-padres",
    "MLB",
    "Padres",
    { primary: "#664f41", secondary: "#FFC425", text: "#FFFFFF", border: "#111111" },
    "Padres",
    { logo: "san-diego-padres-logo-transparent.png", frontLogo: "san-diego-padres-logo-font.png" }
  ),
  team(
    "mlb-phillies",
    "MLB",
    "Phillies",
    { primary: "#b82e39", secondary: "#002D72", text: "#FFFFFF", border: "#111111" },
    "Phillies",
    { logo: "philadelphia-phillies-logo-transparent.png", frontLogo: "philadelphia-phillies-logo-font.png" }
  ),
  team(
    "mlb-pirates",
    "MLB",
    "Pirates",
    { primary: "#27251F", secondary: "#FDB827", text: "#FFFFFF", border: "#111111" },
    "Pirates",
    { logo: "pittsburgh-pirates-logo-transparent.png", frontLogo: "pittsburgh-pirates-logo-font.png" }
  ),
  team(
    "mlb-rangers",
    "MLB",
    "Rangers",
    { primary: "#326cbd", secondary: "#C0111F", text: "#FFFFFF", border: "#111111" },
    "Rangers",
    { logo: "texas-rangers-logo-transparent.png", frontLogo: "texas-rangers-logo-font.png" }
  ),
  team(
    "mlb-rays",
    "MLB",
    "Rays",
    { primary: "#164586", secondary: "#8FBCE6", text: "#FFFFFF", border: "#111111" },
    "Rays",
    { logo: "tampa-bay-rays-logo-transparent.png", frontLogo: "tampa-bay-rays-logo-font.png" }
  ),
  team(
    "mlb-reds",
    "MLB",
    "Reds",
    { primary: "#97081e", secondary: "#000000", text: "#FFFFFF", border: "#111111" },
    "Reds",
    { logo: "cincinnati-reds-logo-transparent.png", frontLogo: "cincinnati-reds-logo-font.png" }
  ),
  team(
    "mlb-red-sox",
    "MLB",
    "Red Sox",
    { primary: "#10396b", secondary: "#BD3039", text: "#FFFFFF", border: "#111111" },
    "Red-Sox",
    { logo: "boston-red-sox-logo-transparent.png", frontLogo: "boston-red-sox-logo-font.png" }
  ),
  team(
    "mlb-rockies",
    "MLB",
    "Rockies",
    { primary: "#5d2b97", secondary: "#C4CED4", text: "#FFFFFF", border: "#111111" },
    "Rockies",
    { logo: "colorado-rockies-logo-transparent.png", frontLogo: "colorado-rockies-logo-font.png" }
  ),
  team(
    "mlb-royals",
    "MLB",
    "Royals",
    { primary: "#286fb1", secondary: "#BD9B60", text: "#FFFFFF", border: "#111111" },
    "Royals",
    { logo: "kansas-city-royals-logo-transparent.png", frontLogo: "kansas-city-royals-logo-font.png" }
  ),
  team(
    "mlb-tigers",
    "MLB",
    "Tigers",
    { primary: "#244977", secondary: "#FA4616", text: "#FFFFFF", border: "#111111" },
    "Tigers",
    { logo: "detroit-tigers-logo-transparent.png", frontLogo: "detroit-tigers-logo-font.png" }
  ),
  team(
    "mlb-twins",
    "MLB",
    "Twins",
    { primary: "#002B5C", secondary: "#D31145", text: "#FFFFFF", border: "#111111" },
    "Twins",
    { logo: "minnesota-twins-logo-transparent.png", frontLogo: "minnesota-twins-logo-font.png" }
  ),
  team(
    "mlb-white-sox",
    "MLB",
    "White Sox",
    { primary: "#504e47", secondary: "#C4CED4", text: "#FFFFFF", border: "#111111" },
    "White-Sox",
    { logo: "chicago-white-sox-logo-transparent.png", frontLogo: "chicago-white-sox-logo-font.png" }
  ),
  team(
    "mlb-yankees",
    "MLB",
    "Yankees",
    { primary: "#3874bd", secondary: "#C4CED4", text: "#FFFFFF", border: "#111111" },
    "Yankees",
    { logo: "new-york-yankees-logo-transparent.png", frontLogo: "new-york-yankees-logo-font.png" }
  ),
];

  return [...NFL, ...NBA, ...MLB];
})();

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
