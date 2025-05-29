import { Variable, } from "astal";
import {
  ScreenCaptureOption,
  generateScreenCaptureOptions
} from "../buttons/screen-capture-button";

import { SCREEN_TRIGGER_KEYWORDS } from "../types";
import { launcherLogger as log } from "../../../utils/logger";

export interface ScreenButtonResult {
  screenCapture: ScreenCaptureOption;
  index: number;
}

export default function getScreenCaptureResults(searchText: string, isPrefixSearch: boolean = false): ScreenButtonResult[] {
  log.debug("getScreenCaptureResults called", {
    searchText,
    isPrefixSearch,
    triggerKeywords: SCREEN_TRIGGER_KEYWORDS
  });

  // Generate options once
  const screenCaptureOptions = Variable(generateScreenCaptureOptions());

  // Filter options based on search text
  const lowerText = searchText.toLowerCase().trim();

  // If this is a prefix search (like sc:), don't require trigger keywords
  if (!isPrefixSearch) {
    // Check if any trigger keyword is present
    const hasKeyword = SCREEN_TRIGGER_KEYWORDS.some(keyword =>
      lowerText.includes(keyword)
    );

    log.debug("Checking for trigger keywords", {
      hasKeyword,
      lowerText,
      isPrefixSearch
    });

    if (!hasKeyword) {
      log.debug("No trigger keywords found, returning empty results");
      return [] as ScreenButtonResult[];
    }
  }

  // Filter options based on search text
  const options = screenCaptureOptions.get();
  log.debug("Generated screen capture options", {
    optionCount: options.length,
    options: options.map(o => ({ name: o.name, command: o.command }))
  });

  // If empty search or just the trigger keyword, show all options
  if (lowerText === '' || SCREEN_TRIGGER_KEYWORDS.includes(lowerText)) {
    log.debug("Empty search or trigger keyword only, returning all options");
    return options.map((option, index) => ({ screenCapture: option, index }));
  }

  // Otherwise filter based on the search
  const filtered = options.filter(option => {
    const searchTerms = lowerText.split(/\s+/);
    const optionText = `${option.name} ${option.description}`.toLowerCase();

    return searchTerms.every(term => optionText.includes(term))
  }).map((option, index) => ({ screenCapture: option, index }));

  log.debug("Filtered results", {
    filteredCount: filtered.length,
    searchTerms: lowerText.split(/\s+/)
  });

  return filtered;
}
