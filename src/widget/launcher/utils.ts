import { Variable, bind } from "astal";
import {
  SearchType,
  SCREEN_TRIGGER_KEYWORDS,
  APP_TRIGGER_KEYWORDS,
} from "./types";
import { launcherLogger as log } from "../../utils/logger";

/**
 * To add a new search type:
 * 1. Add a new SearchType enum value in types.ts
 * 2. Add prefix mappings below in SEARCH_PREFIXES
 * 3. Update UnifiedResults interface in unified-results.tsx
 * 4. Add search function (like getAppResults) in its own component file
 * 5. Update the switch statement in unified-results.tsx to handle the new type
 * 6. Add a new ResultGroupWrapper section in the render method
 */

// Define search prefix mappings
export const SEARCH_PREFIXES: Record<string, SearchType> = {
  "app:": SearchType.APPS,
  "apps:": SearchType.APPS,
  "a:": SearchType.APPS,
  "screen:": SearchType.SCREENCAPTURE,
  "screenshot:": SearchType.SCREENCAPTURE,
  "sc:": SearchType.SCREENCAPTURE,
  "s:": SearchType.SCREENCAPTURE,
  "capture:": SearchType.SCREENCAPTURE,
  "record:": SearchType.SCREENCAPTURE,
  "cmd:": SearchType.COMMANDS,
  "command:": SearchType.COMMANDS,
  "run:": SearchType.COMMANDS,
  "$:": SearchType.COMMANDS,
  ">:": SearchType.COMMANDS,
  "sys:": SearchType.SYSTEM,
  "system:": SearchType.SYSTEM,
  "action:": SearchType.SYSTEM,
  "clip:": SearchType.CLIPBOARD,
  "clipboard:": SearchType.CLIPBOARD,
  "cb:": SearchType.CLIPBOARD,
  "cp:": SearchType.CLIPBOARD,
  "search:": SearchType.EXTERNAL_SEARCH,
  "!g ": SearchType.EXTERNAL_SEARCH,
  "!d ": SearchType.EXTERNAL_SEARCH,
  "!c ": SearchType.EXTERNAL_SEARCH,
  "d:": SearchType.DIRECTORY,
  "dir:": SearchType.DIRECTORY,
  "directory:": SearchType.DIRECTORY,
  "h:": SearchType.HYPRLAND,
  "wm:": SearchType.HYPRLAND,
  "hypr:": SearchType.HYPRLAND,
  "win:": SearchType.HYPRLAND,
  "window:": SearchType.HYPRLAND,
  "list:": SearchType.LIST_PREFIXES,
  "ls:": SearchType.LIST_PREFIXES,
  "kill:": SearchType.KILL,
  "k:": SearchType.KILL,
  "killall:": SearchType.KILL,
  "pkill:": SearchType.KILL,
  "sticker:": SearchType.STICKERS,
  "stickers:": SearchType.STICKERS,
  "stkr:": SearchType.STICKERS,
  "st:": SearchType.STICKERS,
};

export interface ParsedSearch {
  type: SearchType;
  query: string;
  hasPrefix: boolean;
}

// Parse search text to determine type and clean query
export function parseSearchText(text: string): ParsedSearch {
  const trimmedText = text.trim();
  const lowerText = trimmedText.toLowerCase();

  log.debug("parseSearchText called", {
    originalText: text,
    trimmedText,
    lowerText,
    availablePrefixes: Object.keys(SEARCH_PREFIXES),
  });

  // Check for explicit prefixes first
  for (const [prefix, type] of Object.entries(SEARCH_PREFIXES)) {
    if (lowerText.startsWith(prefix)) {
      const parsedQuery = trimmedText.substring(prefix.length).trim();
      log.debug("Found matching prefix", {
        prefix,
        type,
        parsedQuery,
        hasPrefix: true,
      });
      return {
        type,
        query: parsedQuery,
        hasPrefix: true,
      };
    }
  }

  // If no prefix, return full query with ALL type
  log.debug("No prefix found, using ALL search", {
    type: SearchType.ALL,
    query: trimmedText,
    hasPrefix: false,
  });
  return {
    type: SearchType.ALL,
    query: trimmedText,
    hasPrefix: false,
  };
}

// Check if search text matches screen capture keywords
export function isScreenCaptureSearch(text: string): boolean {
  const lowerText = text.toLowerCase().trim();
  const keywords = SCREEN_TRIGGER_KEYWORDS;
  return keywords.some((keyword) => lowerText.includes(keyword));
}

export function isAppSearch(text: string): boolean {
  const lowerText = text.toLowerCase().trim();
  const keywords = APP_TRIGGER_KEYWORDS;
  return keywords.some((keyword) => lowerText.includes(keyword));
}
