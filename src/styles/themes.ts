export interface ThemeColors {
  // Base Colors
  base: string;
  surface: string;
  overlay: string;

  // Text Colors
  muted: string;
  subtle: string;
  text: string;

  // Accent Colors
  love: string;
  gold: string;
  rose: string;
  pine: string;
  foam: string;
  iris: string;

  // Semantic Color Roles
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  info: string;

  // UI Component Colors
  background: string;
  backgroundAlt: string;
  backgroundElevated: string;
  foreground: string;
  foregroundAlt: string;
  foregroundMuted: string;
  border: string;
  borderAlt: string;

  // State Colors
  hover: string;
  active: string;
  focus: string;
  disabled: string;
}

export enum ThemeColor {
  Base = "base",
  Surface = "surface",
  Overlay = "overlay",
  Muted = "muted",
  Subtle = "subtle",
  Text = "text",
  Love = "love",
  Gold = "gold",
  Rose = "rose",
  Pine = "pine",
  Foam = "foam",
  Iris = "iris",
  Primary = "primary",
  Secondary = "secondary",
  Accent = "accent",
  Success = "success",
  Warning = "warning",
  Error = "error",
  Info = "info",
  Background = "background",
  BackgroundAlt = "backgroundAlt",
  BackgroundElevated = "backgroundElevated",
  Foreground = "foreground",
  ForegroundAlt = "foregroundAlt",
  ForegroundMuted = "foregroundMuted",
  Border = "border",
  BorderAlt = "borderAlt",
  Hover = "hover",
  Active = "active",
  Focus = "focus",
  Disabled = "disabled",
}

export interface Theme {
  name: string;
  displayName: string;
  colors: ThemeColors;
}

export const themes: Record<string, Theme> = {
  "rose-pine": {
    name: "rose-pine",
    displayName: "Rosé Pine",
    colors: {
      // Base Colors
      base: "#191724",
      surface: "#1f1d2e",
      overlay: "#26233a",

      // Text Colors
      muted: "#6e6a86",
      subtle: "#908caa",
      text: "#e0def4",

      // Accent Colors
      love: "#eb6f92",
      gold: "#f6c177",
      rose: "#ebbcba",
      pine: "#31748f",
      foam: "#9ccfd8",
      iris: "#c4a7e7",

      // Semantic Color Roles
      primary: "#c4a7e7",
      secondary: "#31748f",
      accent: "#eb6f92",
      success: "#9ccfd8",
      warning: "#f6c177",
      error: "#eb6f92",
      info: "#31748f",

      // UI Component Colors
      background: "#191724",
      backgroundAlt: "#1f1d2e",
      backgroundElevated: "#26233a",
      foreground: "#e0def4",
      foregroundAlt: "#908caa",
      foregroundMuted: "#6e6a86",
      border: "#26233a",
      borderAlt: "#6e6a86",

      // State Colors
      hover: "#26233a",
      active: "#393552",
      focus: "#c4a7e7",
      disabled: "#6e6a86",
    },
  },
  "rose-pine-moon": {
    name: "rose-pine-moon",
    displayName: "Rosé Pine Moon",
    colors: {
      // Base Colors
      base: "#232136",
      surface: "#2a273f",
      overlay: "#393552",

      // Text Colors
      muted: "#6e6a86",
      subtle: "#908caa",
      text: "#e0def4",

      // Accent Colors
      love: "#eb6f92",
      gold: "#f6c177",
      rose: "#ea9a97",
      pine: "#3e8fb0",
      foam: "#9ccfd8",
      iris: "#c4a7e7",

      // Semantic Color Roles
      primary: "#c4a7e7",
      secondary: "#3e8fb0",
      accent: "#eb6f92",
      success: "#9ccfd8",
      warning: "#f6c177",
      error: "#eb6f92",
      info: "#3e8fb0",

      // UI Component Colors
      background: "#232136",
      backgroundAlt: "#2a273f",
      backgroundElevated: "#393552",
      foreground: "#e0def4",
      foregroundAlt: "#908caa",
      foregroundMuted: "#6e6a86",
      border: "#393552",
      borderAlt: "#6e6a86",

      // State Colors
      hover: "#393552",
      active: "#44415a",
      focus: "#c4a7e7",
      disabled: "#6e6a86",
    },
  },
  "rose-pine-dawn": {
    name: "rose-pine-dawn",
    displayName: "Rosé Pine Dawn",
    colors: {
      // Base Colors
      base: "#faf4ed",
      surface: "#fffaf3",
      overlay: "#f2e9e1",

      // Text Colors
      muted: "#9893a5",
      subtle: "#797593",
      text: "#575279",

      // Accent Colors
      love: "#b4637a",
      gold: "#ea9d34",
      rose: "#d7827e",
      pine: "#286983",
      foam: "#56949f",
      iris: "#907aa9",

      // Semantic Color Roles
      primary: "#907aa9",
      secondary: "#286983",
      accent: "#b4637a",
      success: "#56949f",
      warning: "#ea9d34",
      error: "#b4637a",
      info: "#286983",

      // UI Component Colors
      background: "#faf4ed",
      backgroundAlt: "#fffaf3",
      backgroundElevated: "#f2e9e1",
      foreground: "#575279",
      foregroundAlt: "#797593",
      foregroundMuted: "#9893a5",
      border: "#f2e9e1",
      borderAlt: "#9893a5",

      // State Colors
      hover: "#f2e9e1",
      active: "#ede4d3",
      focus: "#907aa9",
      disabled: "#9893a5",
    },
  },
};
