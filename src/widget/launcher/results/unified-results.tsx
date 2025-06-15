import { Widget, Gtk } from "astal/gtk4";
import { Variable, bind, } from "astal";
import config from "../../../utils/config";
import ResultGroupWrapper from "./result-group-wrapper";
import { SearchType } from "../types";
import { launcherLogger as log } from "../../../utils/logger";
import getAppResults, { createAppButton } from "./app-results";
import getScreenCaptureResults from "./screen-capture-results";
import { ScreenButtonResult } from "./screen-capture-results";
import ScreenCaptureButton from "../buttons/screen-capture-button";
import { AppButtonResult } from "./app-results";
import { parseSearchText } from "../utils";
import getCommandResults, { CommandButtonResult } from "./command-results";
import getSystemResults, { SystemButtonResult } from "./system-results";
import getClipboardResults, { ClipboardButtonResult } from "./clipboard-results";
import CommandButton from "../buttons/command-button";
import SystemButton from "../buttons/system-button";
import ClipboardButton from "../buttons/clipboard-button";
import getExternalSearchResults, { ExternalSearchResult, createExternalSearchButton } from "./external-search-results";
import getDirectoryResults, { DirectoryButtonResult, createDirectoryButton } from "./directory-results";
import getHyprlandResults, { HyprlandWindowResult, createHyprlandButton } from "./hyprland-results";
import getListPrefixesResults, { ListPrefixesResult, createListPrefixesButton } from "./list-prefixes-results";
import { HyprlandClient } from "./hyprland-results";
import getKillResults, { KillButtonResult } from "./kill-results";
import KillButton from "../buttons/kill-button";
import { StickerResults } from "./sticker-results";

// TODO: Add in new types for emojis/icons. 
// For one I want to be able to quickly type in some keyworkds and find different memes and
// copy them to the clipboard. Custom button type widget. Also, for displaying the gifs.
// That might be a bit tricky though. (Gtk.PixbufAnimation?)


export interface UnifiedResultsRef {
  selectNext: () => void;
  selectPrevious: () => void;
  activateSelected: () => void;
  focusEntry?: () => void;
}

export interface ItemDetails<HyprlandItemOptions> {
  type: string;
  options: HyprlandItemOptions;
}

export interface HyprlandItemOptions {
  index: number;
  window: HyprlandClient;
  screenshotPath: string | null;

}

export interface UnifiedResultsListProps extends Widget.BoxProps {
  searchText: Variable<string>;
  maxResults: number;
  selectedIndex: Variable<number>;
  selectedItem?: Variable<any>;
  focusedItem?: Variable<ItemDetails<any> | null>;
  searchType: Variable<SearchType>;
  entryRef?: Gtk.Entry;
  refs?: (ref: UnifiedResultsRef) => void;
}


interface UnifiedResults {
  apps: AppButtonResult[];
  screenCaptures: ScreenButtonResult[];
  commands: CommandButtonResult[];
  system: SystemButtonResult[];
  clipboard: ClipboardButtonResult[];
  externalSearch: ExternalSearchResult[];
  directories: DirectoryButtonResult[];
  hyprland: HyprlandWindowResult[];
  listPrefixes: ListPrefixesResult[];
  kill: KillButtonResult[];
  stickers: any[];
  total: number;
}

export default function UnifiedResultsList(props: UnifiedResultsListProps) {
  const { searchText, maxResults, selectedIndex, selectedItem, focusedItem, entryRef } = props;

  // Track which result type is active
  const activeResultType = Variable<SearchType>(SearchType.ALL);

  // Separate refs for different result types
  let scrolledWindowRef: Gtk.ScrolledWindow | null = null;
  const buttonRefs = new Map<number, Gtk.Button>();

  // State for debounced search and results
  const debouncedSearchText = Variable("");
  const isSearching = Variable(false);
  const searchResults = Variable<UnifiedResults>({
    apps: [],
    screenCaptures: [],
    commands: [],
    system: [],
    clipboard: [],
    externalSearch: [],
    directories: [],
    hyprland: [],
    listPrefixes: [],
    kill: [],
    stickers: [],
    total: 0
  });
  const MIN_SEARCH_LENGTH = 2;
  const DEBOUNCE_DELAY = 300; // milliseconds - wait 300ms after user stops typing

  let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

  // Clear button refs when results change
  searchResults.subscribe(() => {
    buttonRefs.clear();
    focusedItem?.set(null);
  });

  // Debounced search implementation
  searchText.subscribe((text) => {
    // Clear previous timeout
    if (debounceTimeout !== null) {
      clearTimeout(debounceTimeout);
    }
    
    // Mark as searching when user types
    if (text.length > 0) {
      isSearching.set(true);
    }

    // Reset selection when text changes
    if (text.length > 0) {
      // Don't reset if we already have results and the index is valid
      const currentResults = searchResults.get();
      const currentIndex = selectedIndex.get();

      // Only reset if index is out of bounds or we have no results
      // Keep -1 (entry focus) as valid
      if (currentIndex >= currentResults.total || (currentResults.total === 0 && currentIndex !== -1)) {
        selectedIndex.set(-1); // Reset to entry focus
      }

      if (selectedItem) {
        selectedItem.set(null);
      }
      if (focusedItem) {
        focusedItem.set(null);
      }
    }

    // First check if the overall text is too short (before parsing)
    // Allow single character for potential prefixes
    if (text.length < 1) {
      debouncedSearchText.set("");
      isSearching.set(false);
      searchResults.set({
        apps: [],
        screenCaptures: [],
        commands: [],
        system: [],
        clipboard: [],
        externalSearch: [],
        directories: [],
        hyprland: [],
        listPrefixes: [],
        kill: [],
        stickers: [],
        total: 0
      });
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
      isSearching.set(false);
      searchResults.set({
        apps: [],
        screenCaptures: [],
        commands: [],
        system: [],
        clipboard: [],
        externalSearch: [],
        directories: [],
        hyprland: [],
        listPrefixes: [],
        kill: [],
        stickers: [],
        total: 0
      });
      activeResultType.set(SearchType.ALL);
      return;
    }

    // Set up new debounce timeout
    debounceTimeout = setTimeout(async () => {
      debouncedSearchText.set(text);
      activeResultType.set(parsed.type);
      log.debug("Executing search after debounce", {
        searchType: parsed.type,
        query: parsed.query
      });

      // Perform the search based on type
      let appList: AppButtonResult[] = [];
      let screenList: ScreenButtonResult[] = [];
      let commandList: CommandButtonResult[] = [];
      let systemList: SystemButtonResult[] = [];
      let clipboardList: ClipboardButtonResult[] = [];
      let externalSearchList: ExternalSearchResult[] = [];
      let directoryList: DirectoryButtonResult[] = [];
      let hyprlandList: HyprlandWindowResult[] = [];
      let listPrefixesList: ListPrefixesResult[] = [];
      let killList: KillButtonResult[] = [];

      switch (parsed.type) {
        case SearchType.APPS:
          props.searchType.set(SearchType.APPS);
          log.debug("Searching apps only", { query: parsed.query });
          appList = getAppResults(parsed.query);
          break;
        case SearchType.SCREENCAPTURE:
          props.searchType.set(SearchType.SCREENCAPTURE);
          log.debug("Searching screen captures only", { query: parsed.query });
          screenList = getScreenCaptureResults(parsed.query, true);
          break;
        case SearchType.COMMANDS:
          props.searchType.set(SearchType.COMMANDS);
          log.debug("Searching commands only", { query: parsed.query });
          commandList = getCommandResults(parsed.query, true);
          break;
        case SearchType.SYSTEM:
          props.searchType.set(SearchType.SYSTEM);
          log.debug("Searching system actions only", { query: parsed.query });
          systemList = getSystemResults(parsed.query, true);
          break;
        case SearchType.CLIPBOARD:
          props.searchType.set(SearchType.CLIPBOARD);
          log.debug("Searching clipboard only", { query: parsed.query });
          clipboardList = getClipboardResults(parsed.query, true);
          break;
        case SearchType.EXTERNAL_SEARCH:
          props.searchType.set(SearchType.EXTERNAL_SEARCH);
          log.debug("Searching external providers", { query: parsed.query });
          externalSearchList = getExternalSearchResults(text);
          break;
        case SearchType.DIRECTORY:
          props.searchType.set(SearchType.DIRECTORY);
          log.debug("Searching directories", { query: parsed.query });
          directoryList = await getDirectoryResults(parsed.query);
          break;
        case SearchType.HYPRLAND:
          props.searchType.set(SearchType.HYPRLAND);
          log.debug("Searching Hyprland windows", { query: parsed.query });
          hyprlandList = await getHyprlandResults(parsed.query);
          break;
        case SearchType.LIST_PREFIXES:
          props.searchType.set(SearchType.LIST_PREFIXES);
          log.debug("Listing search prefixes", { query: parsed.query });
          listPrefixesList = getListPrefixesResults(parsed.query, maxResults);
          break;
        case SearchType.KILL:
          props.searchType.set(SearchType.KILL);
          log.debug("Searching processes to kill", { query: parsed.query });
          killList = await getKillResults(parsed.query, true);
          break;
        case SearchType.STICKERS:
          props.searchType.set(SearchType.STICKERS);
          log.debug("Searching stickers", { query: parsed.query });
          // For stickers, we'll handle it differently - not adding to regular results
          break;
        case SearchType.ALL:
        default:
          props.searchType.set(SearchType.ALL);
          log.debug("Searching all types", { query: parsed.query });
          // Search all relevant types except stickers
          appList = getAppResults(parsed.query);
          screenList = getScreenCaptureResults(parsed.query, false);
          commandList = getCommandResults(parsed.query, false);
          systemList = getSystemResults(parsed.query, false);
          clipboardList = getClipboardResults(parsed.query, false);
          // Also search directories and hyprland windows for ALL
          directoryList = await getDirectoryResults(parsed.query);
          hyprlandList = await getHyprlandResults(parsed.query);
          // External search is included for web searches
          externalSearchList = getExternalSearchResults(text);
          break;
      }

      const total = appList.length + screenList.length + commandList.length +
        systemList.length + clipboardList.length + externalSearchList.length + directoryList.length + hyprlandList.length + listPrefixesList.length + killList.length;

      log.debug("Search results", {
        appCount: appList.length,
        screenCaptureCount: screenList.length,
        commandCount: commandList.length,
        systemCount: systemList.length,
        clipboardCount: clipboardList.length,
        externalSearchCount: externalSearchList.length,
        directoryCount: directoryList.length,
        hyprlandCount: hyprlandList.length,
        listPrefixesCount: listPrefixesList.length,
        killCount: killList.length,
        total
      });

      searchResults.set({
        apps: appList,
        screenCaptures: screenList,
        commands: commandList,
        system: systemList,
        clipboard: clipboardList,
        externalSearch: externalSearchList,
        directories: directoryList,
        hyprland: hyprlandList,
        listPrefixes: listPrefixesList,
        kill: killList,
        stickers: [],
        total
      });
      
      // Mark search as complete
      isSearching.set(false);
    }, DEBOUNCE_DELAY);
  });

  // Auto-scroll to keep selected item visible
  const ensureSelectedVisible = (index: number) => {
    if (scrolledWindowRef) {
      const adjustment = scrolledWindowRef.get_vadjustment();
      if (adjustment) {
        const itemHeight = 90; // Height per item
        const visibleHeight = 300; // Max visible height (5 items)
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

  // Update focused item based on selection
  const updateFocusedItem = (index: number) => {
    if (!focusedItem) return;

    const results = searchResults.get();
    let currentIndex = 0;

    log.debug("updateFocusedItem called", {
      index,
      totalResults: results.total,
      hyprlandCount: results.hyprland.length
    });

    // Find which result type and item is selected
    // TODO: This is a bit hacky, but it works for now, not scalable 
    if (index < results.apps.length) {
      // App result
      focusedItem.set(null); // Apps don't have screenshots yet
    } else if (index < results.apps.length + results.screenCaptures.length) {
      // Screen capture result
      focusedItem.set(null);
    } else if (index < results.apps.length + results.screenCaptures.length + results.commands.length) {
      // Command result
      focusedItem.set(null);
    } else if (index < results.apps.length + results.screenCaptures.length + results.commands.length + results.system.length) {
      // System result
      focusedItem.set(null);
    } else if (index < results.apps.length + results.screenCaptures.length + results.commands.length + results.system.length + results.clipboard.length) {
      // Clipboard result
      focusedItem.set(null);
    } else if (index < results.apps.length + results.screenCaptures.length + results.commands.length + results.system.length + results.clipboard.length + results.externalSearch.length) {
      // External search result
      focusedItem.set(null);
    } else if (index < results.apps.length + results.screenCaptures.length + results.commands.length + results.system.length + results.clipboard.length + results.externalSearch.length + results.directories.length) {
      // Directory result
      focusedItem.set(null);
    } else if (index < results.apps.length + results.screenCaptures.length + results.commands.length + results.system.length + results.clipboard.length + results.externalSearch.length + results.directories.length + results.hyprland.length) {
      // Hyprland window result
      const hyprlandIndex = index - (results.apps.length + results.screenCaptures.length + results.commands.length + results.system.length + results.clipboard.length + results.externalSearch.length + results.directories.length);
      const hyprlandResult = results.hyprland[hyprlandIndex];
      log.debug("Hyprland result selected", {
        index,
        hyprlandIndex,
        hasResult: !!hyprlandResult,
        windowTitle: hyprlandResult?.window?.title
      });
      if (hyprlandResult) {
        focusedItem.set({
          type: 'hyprland',
          options: {
            index,
            window: hyprlandResult.window,
            screenshotPath: hyprlandResult.screenshotPath
          }
        });
      }
    } else {
      // List prefixes result
      focusedItem.set(null);
    }
  };


  // Navigation methods that delegate to the active result type
  const selectNext = () => {
    const results = searchResults.get();
    const totalItems = results.total;
    if (totalItems === 0) return;

    const currentIndex = selectedIndex.get();

    // If entry is selected (index is -1), go to first result
    if (currentIndex === -1) {
      log.debug("Moving from entry to first result");
      selectedIndex.set(0);
      const button = buttonRefs.get(0);
      if (button) {
        button.set_focusable(true);
        button.grab_focus();
      }
      ensureSelectedVisible(0);
      updateFocusedItem(0);
      return;
    }

    const nextIndex = (currentIndex + 1) % totalItems;

    log.debug("Selecting next", { currentIndex, nextIndex, totalItems });
    selectedIndex.set(nextIndex);
    const button = buttonRefs.get(nextIndex);
    if (button) {
      button.set_focusable(true);
      button.grab_focus();
    }
    ensureSelectedVisible(nextIndex);
    updateFocusedItem(nextIndex);
  };

  const selectPrevious = () => {
    const results = searchResults.get();
    const totalItems = results.total;
    if (totalItems === 0) return;

    const currentIndex = selectedIndex.get();

    // If at index 0, go back to entry
    if (currentIndex === 0) {
      if (entryRef) {
        const entry = entryRef;
        if (entry) {
          log.debug("Going back to entry from first result");
          selectedIndex.set(-1); // Use -1 to indicate entry is selected
          entry.grab_focus();
          // Clear any button focus
          const button = buttonRefs.get(0);
          if (button) {
            button.set_focusable(false);
          }
          return;
        }
      }
      // If no entry ref, wrap to end
      const prevIndex = totalItems - 1;
      selectedIndex.set(prevIndex);
      const button = buttonRefs.get(prevIndex);
      if (button) {
        button.set_focusable(true);
        button.grab_focus();
      }
      ensureSelectedVisible(prevIndex);
      updateFocusedItem(prevIndex);
    } else {
      const prevIndex = currentIndex - 1;
      log.debug("Selecting previous", { currentIndex, prevIndex, totalItems });
      selectedIndex.set(prevIndex);
      const button = buttonRefs.get(prevIndex);
      if (button) {
        button.set_focusable(true);
        button.grab_focus();
      }
      ensureSelectedVisible(prevIndex);
      updateFocusedItem(prevIndex);
    }
  };

  const activateSelected = () => {
    const index = selectedIndex.get();
    log.debug("Activating selected", { index });

    // If entry is selected, do nothing (let the entry handle Enter key)
    if (index === -1) {
      return;
    }

    const button = buttonRefs.get(index);
    if (button) {
      button.grab_focus();
      button.activate();
    }
  };

  return (
    <box
      vertical
      margin_top={0}
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
      {bind(Variable.derive([activeResultType, debouncedSearchText], (type, text) =>
        type === SearchType.STICKERS ? (
          <revealer
            transitionDuration={config.animations?.durationLarge || 300}
            revealChild={true}
            transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
            halign={Gtk.Align.START}
          >
            <StickerResults
              query={parseSearchText(text).query}
              selectedIndex={selectedIndex}
              resultsCount={Variable(0)}
              entryRef={entryRef}
            />
          </revealer>
        ) : (
          <revealer
            transitionDuration={config.animations?.durationLarge || 300}
            revealChild={bind(Variable.derive([searchResults, isSearching], (results, searching) => 
              results.total > 0 && !searching
            ))}
            transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
            halign={Gtk.Align.START}
          >
            <box
              cssName="launcher-results"
              widthRequest={400}
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
                          {results.apps.map((appResult, index) =>
                            createAppButton(appResult, {
                              index,
                              selected: bind(selectedIndex).as(i => i === index),
                              ref: (button: Gtk.Button) => {
                                buttonRefs.set(index, button);
                              }
                            })
                          )}
                        </ResultGroupWrapper>

                        <ResultGroupWrapper
                          groupName="Screen Captures"
                          revealed={(results.screenCaptures.length > 0 && (type === SearchType.ALL || type === SearchType.SCREENCAPTURE))}
                        >
                          {results.screenCaptures.map((screenResult, index) => {
                            const adjustedIndex = results.apps.length + index;
                            return (
                              <ScreenCaptureButton
                                option={screenResult.screenCapture}
                                index={adjustedIndex}
                                selected={bind(selectedIndex).as(i => i === adjustedIndex)}
                                ref={(button: Gtk.Button) => {
                                  buttonRefs.set(adjustedIndex, button);
                                }}
                              />
                            );
                          })}
                        </ResultGroupWrapper>

                        <ResultGroupWrapper
                          groupName="Commands"
                          revealed={(results.commands.length > 0 && (type === SearchType.ALL || type === SearchType.COMMANDS))}
                        >
                          {results.commands.map((cmdResult, index) => {
                            if (!cmdResult || !cmdResult.command) {
                              log.error("Invalid command result", { cmdResult, index });
                              return null;
                            }
                            const adjustedIndex = results.apps.length + results.screenCaptures.length + index;
                            return (
                              <CommandButton
                                option={cmdResult.command}
                                index={adjustedIndex}
                                selected={bind(selectedIndex).as(i => i === adjustedIndex)}
                                ref={(button: Gtk.Button) => {
                                  buttonRefs.set(adjustedIndex, button);
                                }}
                              />
                            );
                          })}
                        </ResultGroupWrapper>

                        <ResultGroupWrapper
                          groupName="System Actions"
                          revealed={(results.system.length > 0 && (type === SearchType.ALL || type === SearchType.SYSTEM))}
                        >
                          {results.system.map((sysResult, index) => {
                            if (!sysResult || !sysResult.action) {
                              log.error("Invalid system result", { sysResult, index });
                              return null;
                            }
                            const adjustedIndex = results.apps.length + results.screenCaptures.length +
                              results.commands.length + index;
                            return (
                              <SystemButton
                                action={sysResult.action}
                                index={adjustedIndex}
                                selected={bind(selectedIndex).as(i => i === adjustedIndex)}
                                ref={(button: Gtk.Button) => {
                                  buttonRefs.set(adjustedIndex, button);
                                }}
                              />
                            );
                          })}
                        </ResultGroupWrapper>

                        <ResultGroupWrapper
                          groupName="Clipboard History"
                          revealed={(results.clipboard.length > 0 && (type === SearchType.ALL || type === SearchType.CLIPBOARD))}
                        >
                          {results.clipboard.map((clipResult, index) => {
                            if (!clipResult || !clipResult.entry) {
                              log.error("Invalid clipboard result", { clipResult, index });
                              return null;
                            }
                            const adjustedIndex = results.apps.length + results.screenCaptures.length +
                              results.commands.length + results.system.length + index;
                            return (
                              <ClipboardButton
                                entry={clipResult.entry}
                                index={adjustedIndex}
                                selected={bind(selectedIndex).as(i => i === adjustedIndex)}
                                ref={(button: Gtk.Button) => {
                                  buttonRefs.set(adjustedIndex, button);
                                }}
                              />
                            );
                          })}
                        </ResultGroupWrapper>

                        <ResultGroupWrapper
                          groupName="Web Search"
                          revealed={(results.externalSearch.length > 0 && (type === SearchType.ALL || type === SearchType.EXTERNAL_SEARCH))}
                        >
                          {results.externalSearch.map((searchResult, index) => {
                            const adjustedIndex = results.apps.length + results.screenCaptures.length +
                              results.commands.length + results.system.length + results.clipboard.length + index;
                            return createExternalSearchButton(searchResult, {
                              index: adjustedIndex,
                              selected: bind(selectedIndex).as(i => i === adjustedIndex),
                              ref: (button: Gtk.Button) => {
                                buttonRefs.set(adjustedIndex, button);
                              }
                            });
                          })}
                        </ResultGroupWrapper>

                        <ResultGroupWrapper
                          groupName="Files & Directories"
                          revealed={(results.directories.length > 0 && (type === SearchType.ALL || type === SearchType.DIRECTORY))}
                        >
                          {results.directories.map((dirResult, index) => {
                            const adjustedIndex = results.apps.length + results.screenCaptures.length +
                              results.commands.length + results.system.length + results.clipboard.length +
                              results.externalSearch.length + index;
                            return createDirectoryButton(dirResult, {
                              index: adjustedIndex,
                              selected: bind(selectedIndex).as(i => i === adjustedIndex),
                              ref: (button: Gtk.Button) => {
                                buttonRefs.set(adjustedIndex, button);
                              }
                            });
                          })}
                        </ResultGroupWrapper>

                        <ResultGroupWrapper
                          groupName="Open Windows"
                          revealed={(results.hyprland.length > 0 && (type === SearchType.ALL || type === SearchType.HYPRLAND))}
                        >
                          {results.hyprland.map((windowResult, index) => {
                            const adjustedIndex = results.apps.length + results.screenCaptures.length +
                              results.commands.length + results.system.length + results.clipboard.length +
                              results.externalSearch.length + results.directories.length + index;
                            return createHyprlandButton(windowResult, {
                              index: adjustedIndex,
                              selected: bind(selectedIndex).as(i => i === adjustedIndex),
                              ref: (button: Gtk.Button) => {
                                buttonRefs.set(adjustedIndex, button);
                              }
                            });
                          })}
                        </ResultGroupWrapper>

                        <ResultGroupWrapper
                          groupName="Search Prefixes"
                          revealed={(results.listPrefixes.length > 0 && (type === SearchType.ALL || type === SearchType.LIST_PREFIXES))}
                        >
                          {results.listPrefixes.map((prefixResult, index) => {
                            const adjustedIndex = results.apps.length + results.screenCaptures.length +
                              results.commands.length + results.system.length + results.clipboard.length +
                              results.externalSearch.length + results.directories.length + results.hyprland.length + index;
                            return createListPrefixesButton(prefixResult, {
                              index: adjustedIndex,
                              selected: bind(selectedIndex).as(i => i === adjustedIndex),
                              ref: (button: Gtk.Button) => {
                                buttonRefs.set(adjustedIndex, button);
                              },
                              entryRef: entryRef
                            });
                          })}
                        </ResultGroupWrapper>

                        <ResultGroupWrapper
                          groupName="Kill Processes"
                          revealed={(results.kill.length > 0 && (type === SearchType.ALL || type === SearchType.KILL))}
                        >
                          {results.kill.map((killResult, index) => {
                            const adjustedIndex = results.apps.length + results.screenCaptures.length +
                              results.commands.length + results.system.length + results.clipboard.length +
                              results.externalSearch.length + results.directories.length + results.hyprland.length +
                              results.listPrefixes.length + index;
                            return (
                              <KillButton
                                action={killResult.action}
                                index={adjustedIndex}
                                selected={bind(selectedIndex).as(i => i === adjustedIndex)}
                                ref={(button: Gtk.Button) => {
                                  buttonRefs.set(adjustedIndex, button);
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
        )
      ))}
    </box>
  );
}