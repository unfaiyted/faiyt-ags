export enum SearchType {
  ALL = "all",
  APPS = "apps",
  SCREENCAPTURE = "screencapture",
  COMMANDS = "commands",
  SYSTEM = "system",
  CLIPBOARD = "clipboard",
  EXTERNAL_SEARCH = "external_search",
  DIRECTORY = "directory",
  HYPRLAND = "hyprland",
  LIST_PREFIXES = "list_prefixes",
  KILL = "kill",
  STICKERS = "stickers",
}

// Keywords that trigger screen capture options
export const SCREEN_TRIGGER_KEYWORDS = [
  "screenshot",
  "screen",
  "capture",
  "record",
  "recording",
  "screencap",
  "screencast",
  "shot",
  "snap",
  "grab",
];

// Keywords that trigger screen capture options
export const APP_TRIGGER_KEYWORDS = ["app", "apps", "application"];
