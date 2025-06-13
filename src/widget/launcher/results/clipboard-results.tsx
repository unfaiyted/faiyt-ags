import clipboardManager from "../../../services/clipboard-manager";
import { ClipboardEntry } from "../../../services/clipboard-manager";
import { launcherLogger as log } from "../../../utils/logger";

export interface ClipboardButtonResult {
  entry: ClipboardEntry;
  index: number;
}

export default function getClipboardResults(searchText: string, isPrefixSearch: boolean = false): ClipboardButtonResult[] {
  const query = searchText.toLowerCase().trim();
  const history = clipboardManager.getHistory();
  log.debug("Getting clipboard results", { query, isPrefixSearch, historyCount: history.length });
  
  // If empty query with prefix, show recent clipboard entries
  if (isPrefixSearch && query === '') {
    return history.slice(0, 10).map((entry, index) => ({
      entry,
      index
    }));
  }

  // Filter clipboard entries based on query
  const filtered = history.filter(entry => {
    const searchTarget = entry.preview?.toLowerCase() || entry.content.toLowerCase();
    
    // Split query into words for better matching
    const queryWords = query.split(/\s+/);
    return queryWords.every(word => searchTarget.includes(word));
  });

  log.debug("Clipboard results", { query, resultCount: filtered.length });

  return filtered.slice(0, 10).map((entry, index) => ({
    entry,
    index
  }));
}