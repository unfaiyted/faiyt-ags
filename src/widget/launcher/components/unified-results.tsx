import { Widget, Gtk } from "astal/gtk4";
import { Variable, bind, } from "astal";
import config from "../../../utils/config";
import AppButton from "../buttons/app-button";
import ResultGroupWrapper from "./result-group-wrapper";
import { SearchType } from "../types";
import { launcherLogger as log } from "../../../utils/logger";
import getAppResults from "./app-results";
import getScreenCaptureResults from "./screen-capture-results";
import { ScreenButtonResult } from "./screen-capture-results";
import ScreenCaptureButton from "../buttons/screen-capture-button";
import { AppButtonResult } from "./app-results";
import { parseSearchText } from "../utils";

export interface UnifiedResultsRef {
  selectNext: () => void;
  selectPrevious: () => void;
  activateSelected: () => void;
}

export interface UnifiedResultsListProps extends Widget.BoxProps {
  searchText: Variable<string>;
  maxResults: number;
  selectedIndex: Variable<number>;
  selectedItem?: Variable<any>;
  refs?: (ref: UnifiedResultsRef) => void;
}


interface UnifiedResults {
  apps: AppButtonResult[];
  screenCaptures: ScreenButtonResult[];
  total: number;
}

export default function UnifiedResultsList(props: UnifiedResultsListProps) {
  const { searchText, maxResults, selectedIndex, selectedItem } = props;

  // Track which result type is active
  const activeResultType = Variable<SearchType>(SearchType.ALL);

  // Separate refs for different result types
  let scrolledWindowRef: Gtk.ScrolledWindow | null = null;
  const buttonRefs: Gtk.Button[] = [];

  // State for debounced search and results
  const debouncedSearchText = Variable("");
  const searchResults = Variable<UnifiedResults>({ apps: [], screenCaptures: [], total: 0 });
  const MIN_SEARCH_LENGTH = 2;
  const DEBOUNCE_DELAY = 175; // milliseconds

  let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

  // Clear button refs when results change
  searchResults.subscribe(() => {
    buttonRefs.length = 0;
  });

  // Debounced search implementation
  searchText.subscribe((text) => {
    // Clear previous timeout
    if (debounceTimeout !== null) {
      clearTimeout(debounceTimeout);
    }

    // Reset selection when text changes
    if (text.length > 0) {
      selectedIndex.set(0);
      if (selectedItem) {
        selectedItem.set(null);
      }
    }

    // First check if the overall text is too short (before parsing)
    // Allow single character for potential prefixes
    if (text.length < 1) {
      debouncedSearchText.set("");
      searchResults.set({ apps: [], screenCaptures: [], total: 0 });
      activeResultType.set(SearchType.ALL);
      return;
    }

    // Parse the search text to determine type and query
    const parsed = parseSearchText(text);
    log.debug("Parsed search text", {
      originalText: text,
      parsedQuery: parsed.query,
      searchType: parsed.type,
      hasPrefix: parsed.hasPrefix
    });

    // For prefix searches, we can search with shorter queries (even empty)
    const minLength = parsed.hasPrefix ? 0 : MIN_SEARCH_LENGTH;

    // Clear results immediately if search is too short
    if (parsed.query.length < minLength) {
      log.debug("Search query too short", {
        queryLength: parsed.query.length,
        minLength,
        hasPrefix: parsed.hasPrefix
      });
      debouncedSearchText.set("");
      searchResults.set({ apps: [], screenCaptures: [], total: 0 });
      activeResultType.set(SearchType.ALL);
      return;
    }

    // Set up new debounce timeout
    debounceTimeout = setTimeout(() => {
      debouncedSearchText.set(text);
      activeResultType.set(parsed.type);
      log.debug("Executing search after debounce", {
        searchType: parsed.type,
        query: parsed.query
      });

      // Perform the search based on type
      let appList: AppButtonResult[] = [];
      let screenList: ScreenButtonResult[] = [];

      switch (parsed.type) {
        case SearchType.APPS:
          log.debug("Searching apps only", { query: parsed.query });
          appList = getAppResults(parsed.query);
          break;
        case SearchType.SCREENCAPTURE:
          log.debug("Searching screen captures only", { query: parsed.query });
          screenList = getScreenCaptureResults(parsed.query, true);
          break;
        case SearchType.ALL:
        default:
          log.debug("Searching all types", { query: parsed.query });
          appList = getAppResults(parsed.query);
          screenList = getScreenCaptureResults(parsed.query, false);
          break;
      }

      log.debug("Search results", {
        appCount: appList.length,
        screenCaptureCount: screenList.length,
        total: appList.length + screenList.length
      });

      searchResults.set({
        apps: appList,
        screenCaptures: screenList,
        total: appList.length + screenList.length
      });
    }, DEBOUNCE_DELAY);
  });

  // Auto-scroll to keep selected item visible
  const ensureSelectedVisible = (index: number) => {
    if (scrolledWindowRef) {
      const adjustment = scrolledWindowRef.get_vadjustment();
      if (adjustment) {
        const itemHeight = 90; // Height per item
        const visibleHeight = 350; // Max visible height (5 items)
        const selectedPosition = index * itemHeight;
        const currentScroll = adjustment.get_value();
        const visibleTop = currentScroll;
        const visibleBottom = currentScroll + visibleHeight;

        // If selected item is above visible area
        if (selectedPosition < visibleTop) {
          adjustment.set_value(selectedPosition);
        }
        // If selected item is below visible area
        else if (selectedPosition + itemHeight > visibleBottom) {
          adjustment.set_value(selectedPosition + itemHeight - visibleHeight);
        }
      }
    }
  };


  // Navigation methods that delegate to the active result type
  const selectNext = () => {
    const results = searchResults.get();
    const totalItems = results.total;
    if (totalItems === 0) return;

    const currentIndex = selectedIndex.get();
    const nextIndex = (currentIndex + 1) % totalItems;

    log.debug("Selecting next", { currentIndex, nextIndex, totalItems });
    selectedIndex.set(nextIndex);
    buttonRefs[nextIndex]?.set_focusable(true);
    buttonRefs[nextIndex]?.grab_focus();
    ensureSelectedVisible(nextIndex);
  };

  const selectPrevious = () => {
    const results = searchResults.get();
    const totalItems = results.total;
    if (totalItems === 0) return;

    const currentIndex = selectedIndex.get();
    const prevIndex = currentIndex === 0 ? totalItems - 1 : currentIndex - 1;

    log.debug("Selecting previous", { currentIndex, prevIndex, totalItems });
    selectedIndex.set(prevIndex);
    buttonRefs[prevIndex]?.set_focusable(true);
    buttonRefs[prevIndex]?.grab_focus();
    ensureSelectedVisible(prevIndex);
  };

  const activateSelected = () => {
    log.debug("Activating selected", {});
    buttonRefs[selectedIndex.get()]?.grab_focus();
    buttonRefs[selectedIndex.get()]?.activate();
  };

  return (
    <box
      vertical
      setup={(self) => {
        if (props.refs) {
          log.debug("Setting up UnifiedResults refs");
          const unifiedRefs = {
            selectNext,
            selectPrevious,
            activateSelected
          };
          props.refs(unifiedRefs);
        }
      }}
    >
      <revealer
        transitionDuration={config.animations?.durationLarge || 300}
        revealChild={bind(searchResults).as((l) => l.total > 0)}
        transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
        halign={Gtk.Align.START}
      >
        <box
          cssName="launcher-results"
          vertical
          hexpand
        >
          {(() => {
            const scrollWindow = new Gtk.ScrolledWindow({
              hexpand: true,
              vexpand: false,
              hscrollbar_policy: Gtk.PolicyType.NEVER,
              vscrollbar_policy: Gtk.PolicyType.AUTOMATIC, // We'll update this based on content
              max_content_height: 300,
              min_content_height: 300,
            });

            // Store reference for auto-scrolling
            scrolledWindowRef = scrollWindow;

            const resultsBox = (
              <box vertical cssName="launcher-results-list">

                {bind(Variable.derive([searchResults, activeResultType], (results, type) =>
                  <box vertical>
                    <ResultGroupWrapper
                      groupName="Apps"
                      revealed={(results.apps.length > 0 && (type === SearchType.ALL || type === SearchType.APPS))}
                    >
                      {results.apps.map((appResult, index) => (
                        <AppButton
                          app={appResult.app}
                          index={index}
                          selected={bind(selectedIndex).as(i => i === index)}
                          ref={(button: Gtk.Button) => {
                            buttonRefs.push(button);
                          }}
                        />
                      ))}
                    </ResultGroupWrapper>

                    <ResultGroupWrapper
                      groupName="Screen Captures"
                      revealed={((type === SearchType.ALL || type === SearchType.SCREENCAPTURE))}
                    >
                      {results.screenCaptures.map((screenResult, index) => {
                        const adjustedIndex = results.apps.length + index;
                        return (
                          <ScreenCaptureButton
                            option={screenResult.screenCapture}
                            index={adjustedIndex}
                            selected={bind(selectedIndex).as(i => i === adjustedIndex)}
                            ref={(button: Gtk.Button) => {
                              buttonRefs.push(button);
                            }}
                          />
                        );
                      })}
                    </ResultGroupWrapper>
                  </box>
                ))}

              </box>
            );

            scrollWindow.set_child(resultsBox);
            return scrollWindow;
          })()}
        </box>
      </revealer>
    </box >
  );
}
