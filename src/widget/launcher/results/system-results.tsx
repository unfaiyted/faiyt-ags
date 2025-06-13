import { SystemAction, SYSTEM_ACTIONS } from "../buttons/system-button";
import { launcherLogger as log } from "../../../utils/logger";

export interface SystemButtonResult {
  action: SystemAction;
  index: number;
}

export default function getSystemResults(searchText: string, isPrefixSearch: boolean = false): SystemButtonResult[] {
  const query = searchText.toLowerCase().trim();
  
  // If empty query with prefix, show all system actions
  if (isPrefixSearch && query === '') {
    return SYSTEM_ACTIONS.map((action, index) => ({
      action,
      index
    }));
  }

  // Filter system actions based on query
  const filtered = SYSTEM_ACTIONS.filter(action => {
    const searchTarget = `${action.name} ${action.description}`.toLowerCase();
    
    // Split query into words for better matching
    const queryWords = query.split(/\s+/);
    return queryWords.every(word => searchTarget.includes(word));
  });

  log.debug("System results", { query, resultCount: filtered.length });

  return filtered.map((action, index) => ({
    action,
    index
  }));
}