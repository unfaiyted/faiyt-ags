export const mix = (value1: number, value2: number, perc: number) => {
  return value1 * perc + value2 * (1 - perc);
};

// Rosé Pine Theme Colors
export const theme = {
  // Base Colors
  base: "#191724",
  surface: "#1f1d2e",
  overlay: "#26233a",

  // Text Colors
  muted: "#6e6a86",
  subtle: "#908caa",
  text: "#e0def4",

  // Accent Colors
  love: "#eb6f92", // Pink/Red accent
  gold: "#f6c177", // Yellow/Orange accent
  rose: "#ebbcba", // Light pink accent
  pine: "#31748f", // Blue/Teal accent
  foam: "#9ccfd8", // Light blue/cyan accent
  iris: "#c4a7e7", // Purple accent

  // Semantic Color Roles
  primary: "#c4a7e7", // iris - primary brand color
  secondary: "#31748f", // pine - secondary accent
  accent: "#eb6f92", // love - attention/highlight
  success: "#9ccfd8", // foam - success states
  warning: "#f6c177", // gold - warnings
  error: "#eb6f92", // love - errors
  info: "#31748f", // pine - information

  // UI Component Colors
  background: "#191724", // base - main background
  backgroundAlt: "#1f1d2e", // surface - cards, modals
  backgroundElevated: "#26233a", // overlay - elevated surfaces

  foreground: "#e0def4", // text - primary text
  foregroundAlt: "#908caa", // subtle - secondary text
  foregroundMuted: "#6e6a86", // muted - disabled/placeholder text

  border: "#26233a", // overlay - borders
  borderAlt: "#6e6a86", // muted - subtle borders

  // State Colors
  hover: "#26233a", // overlay - hover states
  active: "#393552", // slightly lighter overlay
  focus: "#c4a7e7", // iris - focus rings
  disabled: "#6e6a86", // muted - disabled elements
};
