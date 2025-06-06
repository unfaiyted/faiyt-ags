import { SearchType } from "../types";
import { SEARCH_PREFIXES } from "../utils";
import ListPrefixesButton, { PrefixInfo } from "../buttons/list-prefixes-button";
import { Variable, Binding } from "astal";
import { Gtk } from "astal/gtk4";
import { launcherLogger as log } from "../../../utils/logger";

export interface ListPrefixesResult extends PrefixInfo {
  id: string;
}

export function createListPrefixesButton(
  result: ListPrefixesResult,
  options: {
    index: number;
    selected: Binding<boolean>;
    ref?: (button: Gtk.Button) => void;
    entryRef?: () => Gtk.Entry | null;
  }
) {
  return (
    <ListPrefixesButton
      prefixInfo={result}
      index={options.index}
      selected={options.selected}
      ref={options.ref}
      entryRef={options.entryRef}
    />
  );
}

export default function getListPrefixesResults(
  query: string,
  maxResults: number
): ListPrefixesResult[] {
  log.debug("Getting list prefixes results", { query, maxResults });

  // Group prefixes by SearchType
  const prefixesByType: Map<SearchType, string[]> = new Map();
  
  for (const [prefix, type] of Object.entries(SEARCH_PREFIXES)) {
    if (!prefixesByType.has(type)) {
      prefixesByType.set(type, []);
    }
    prefixesByType.get(type)!.push(prefix);
  }

  // Create results with descriptions
  const results: ListPrefixesResult[] = [];
  const typeDescriptions: Record<SearchType, string> = {
    [SearchType.ALL]: "Search everything",
    [SearchType.APPS]: "Search applications",
    [SearchType.SCREENCAPTURE]: "Take screenshots or record screen",
    [SearchType.COMMANDS]: "Run shell commands",
    [SearchType.SYSTEM]: "System actions (power, logout, etc.)",
    [SearchType.CLIPBOARD]: "Search clipboard history",
    [SearchType.EXTERNAL_SEARCH]: "Search the web",
    [SearchType.DIRECTORY]: "Search directories and files",
    [SearchType.HYPRLAND]: "Switch between Hyprland windows",
    [SearchType.LIST_PREFIXES]: "List all search prefixes",
  };

  for (const [type, prefixes] of prefixesByType.entries()) {
    // Skip LIST_PREFIXES type itself
    if (type === SearchType.LIST_PREFIXES) continue;

    const prefixList = prefixes.join(", ");
    const description = typeDescriptions[type] || "Unknown search type";
    
    // Filter by query if provided
    if (!query || 
        prefixList.toLowerCase().includes(query.toLowerCase()) ||
        description.toLowerCase().includes(query.toLowerCase()) ||
        type.toLowerCase().includes(query.toLowerCase())) {
      results.push({
        id: `prefix-${type}`,
        prefix: prefixList,
        description: description,
        type: type,
      });
    }
  }

  log.debug("List prefixes results", { 
    totalResults: results.length,
    results: results.slice(0, maxResults) 
  });

  return results.slice(0, maxResults);
}