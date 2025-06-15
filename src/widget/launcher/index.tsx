import { App, Astal, Gtk, Gdk, hook } from "astal/gtk4";
import PopupWindow, { PopupWindowProps } from "../utils/popup-window";
import { Variable, bind } from "astal";
import config from "../../utils/config";
import UnifiedResults, { type UnifiedResultsRef } from "./results/unified-results";
import { launcherLogger as log } from "../../utils/logger";
import KeyboardShortcut from "../utils/keyboard-shortcut";
import { evaluatorManager, type EvaluatorResult } from "../../utils/evaluators";
import ColorPreview from "./results/color-preview";
import { RoundedImageReactive } from "../utils/rounded-image";
import launcherState from "../../services/launcher-state";
import { clearKillCache } from "./results/kill-results";
import ActionBar from "./components/action-bar";
import { SearchType } from "./types";

export interface LauncherProps extends PopupWindowProps {
  monitorIndex: number;
}

export default function LauncherBar(launcherProps: LauncherProps) {
  const { setup, child, ...props } = launcherProps;

  log.debug("Creating launcher bar", { monitor: launcherProps.monitor });
  // const isVisible = Variable(false);
  const placeholderText = Variable("Type to Search");
  const searchText = Variable("");
  const selectedIndex = Variable(-1); // Start with -1 to indicate entry is focused
  const selectedItem = Variable<any>(null);
  const focusedItem = Variable<any>(null);
  const maxResults = config.launcher?.maxResults || 5;
  let entryRef: Gtk.Entry | null = null;
  const monitorSuffix = props.monitorIndex !== undefined ? `-${props.monitorIndex}` : '';
  const evaluatorResult = Variable<EvaluatorResult | null>(null);


  // Track if we're in the process of closing to prevent rapid operations
  let isClosing = false;
  
  // Close the launcher
  const closeLauncher = () => {
    if (isClosing) {
      log.debug("Already closing launcher, ignoring request");
      return;
    }
    
    isClosing = true;
    log.debug("Closing launcher");
    const window = App.get_window(`launcher${monitorSuffix}`);
    if (window && window.visible) {
      // Add a small delay to prevent Wayland protocol errors
      setTimeout(() => {
        window.hide();
        isClosing = false;
      }, 10);
    } else {
      isClosing = false;
    }
  };

  const unifiedResultsRef = Variable<UnifiedResultsRef | null>(null);
  const setupNavigation = (self: Gtk.Window) => {   // Add keyboard event controller
    const keyController = new Gtk.EventControllerKey();
    log.debug("Setting up UnifiedResults key controller");

    keyController.connect('key-pressed', (_controller, keyval, _keycode, state) => {
      log.debug("UnifiedResults key pressed", { keyval, state });

      // Check if Ctrl is pressed
      const ctrlPressed = (state & Gdk.ModifierType.CONTROL_MASK) !== 0;

      switch (keyval) {
        case Gdk.KEY_Down:
        case Gdk.KEY_KP_Down:
        case Gdk.KEY_j:
          if ((keyval === Gdk.KEY_j && ctrlPressed) || keyval !== Gdk.KEY_j) {
            log.debug("Calling selectNext from UnifiedResults");
            unifiedResultsRef.get()?.selectNext();
            return true;
          }
          break;
        case Gdk.KEY_Up:
        case Gdk.KEY_KP_Up:
        case Gdk.KEY_k:
          if ((keyval === Gdk.KEY_k && ctrlPressed) || keyval !== Gdk.KEY_k) {
            log.debug("Calling selectPrevious from UnifiedResults");
            unifiedResultsRef.get()?.selectPrevious();
            return true;
          }
          break;
        case Gdk.KEY_Return:
        case Gdk.KEY_KP_Enter:
          log.debug("Calling activateSelected from UnifiedResults");
          unifiedResultsRef.get()?.activateSelected();
          return true;
      }

      return false;
    });

    self.add_controller(keyController);
  }


  const searchType = Variable(SearchType.ALL);



  // Handle text changes
  searchText.subscribe((text) => {
    if (text.length === 0) {
      placeholderText.set("Type to Search");
      evaluatorResult.set(null);
    } else {
      placeholderText.set("");
      // Try to evaluate with all registered evaluators
      const result = evaluatorManager.evaluate(text);
      evaluatorResult.set(result);
    }
  });

  // Handle text changes in the entry
  const onEnter = () => {
    // If we have an evaluator result, handle it
    const currentResult = evaluatorResult.get();
    if (currentResult) {
      if (currentResult.onActivate) {
        // Use custom activation handler if provided
        currentResult.onActivate();
      } else {
        // Default: copy the result to clipboard
        const clipboard = Gdk.Display.get_default()?.get_clipboard();
        if (clipboard) {
          clipboard.set(currentResult.value);
        }
      }
      // Close the launcher after handling
      closeLauncher();
    } else {
      // Otherwise, activate the selected app
      const ref = unifiedResultsRef.get();
      log.debug("Calling activateSelected", { hasRef: !!ref });
      if (ref) {
        ref.activateSelected();
      }
    }
  };

  const name: string = `launcher${monitorSuffix}`;

  return (
    <PopupWindow
      {...props}
      name={name}
      cssName="launcher"
      layer={Astal.Layer.OVERLAY}
      anchor={
        Astal.WindowAnchor.TOP |
        Astal.WindowAnchor.BOTTOM |
        Astal.WindowAnchor.LEFT |
        Astal.WindowAnchor.RIGHT
      }
      visible={false}
      keymode={Astal.Keymode.ON_DEMAND}
      application={App}
      onKeyPressed={(self: Gtk.Window, keyval: number, _keycode: number, state: Gdk.ModifierType) => {

        log.debug("Key pressed", { key: keyval, state });
        if (keyval === Gdk.KEY_Escape) {
          log.debug("Closing launcher");
          closeLauncher();
          return true;
        }

        // Don't handle navigation keys here - let them propagate to child components
        return false;
      }}
      setup={(self) => {
        setupNavigation(self);
        hook(self, App, "window-toggled", (_self, win) => {
          if (win.name !== name) return;

          // When launcher is shown, ensure selectedIndex starts at -1 (entry focused)
          if (win.visible) {
            selectedIndex.set(-1);
            isClosing = false; // Reset closing flag when shown
            
            // Focus the entry after a small delay to ensure window is ready
            setTimeout(() => {
              if (entryRef) {
                entryRef.grab_focus();
              }
            }, 50);
          } else {
            // Clear the kill cache when launcher is hidden
            // This ensures fresh data when the launcher is reopened
            clearKillCache();
          }

          // Don't clear searchText to preserve equations/conversions
          // searchText.set("");
          selectedItem.set(null);
          // Don't clear evaluatorResult either to keep showing the result
          // evaluatorResult.set(null);
        });
      }}
    >
      <box
        hexpand
        vexpand
        cssClasses={["launcher-click-area"]}
        setup={(self: Gtk.Box) => {


          log.debug("Setting up click detection for launcher");
          // Add click gesture to detect clicks outside launcher
          const clickGesture = new Gtk.GestureClick();
          clickGesture.connect("pressed", (_gesture, _n_press, x, y) => {
            log.debug("Click detected in launcher", { x, y });

            // Get the launcher container (the centered box with actual content)
            const container = self.get_first_child();
            if (container) {
              const allocation = container.get_allocation();
              const [success, containerX, containerY] = container.translate_coordinates(self, 0, 0);

              if (success) {
                log.debug("Launcher container position", {
                  containerX, containerY,
                  width: allocation.width,
                  height: allocation.height
                });

                // Check if click is within launcher bounds
                const isInside = x >= containerX && x <= containerX + allocation.width &&
                  y >= containerY && y <= containerY + allocation.height;

                if (!isInside) {
                  log.debug("Click outside launcher, closing");
                  closeLauncher();
                } else {
                  log.debug("Click inside launcher");
                }
              }
            }
          });
          self.add_controller(clickGesture);
        }}
      >
        <box
          vertical
          halign={Gtk.Align.CENTER}
          valign={Gtk.Align.CENTER}
          cssClasses={["launcher-container"]}
        >
          {/* Spacer for top area */}
          <box vexpand />

          {/* Main launcher content with split panel */}
          <box
            cssClasses={["launcher-main-content"]}
            spacing={0}
            widthRequest={1200}
            halign={Gtk.Align.CENTER}
          >
            {/* Left panel - Search and results */}
            <box
              cssClasses={["launcher-left-panel"]}
              vertical
              widthRequest={800}
            >
              {/* Search Box with gradient border wrapper */}
              <box
                cssClasses={["launcher-search-box-wrapper"]}
                widthRequest={800}
                halign={Gtk.Align.CENTER}
              >
                <box
                  vertical
                  cssClasses={bind(searchText).as(text =>
                    text.length > 1 ? ["launcher-search-box"] : ["launcher-search-box", "compact"]
                  )}
                >
                  <box cssClasses={["search-input-container"]} spacing={12}>
                    <entry
                      cssClasses={["launcher-search-input"]}
                      placeholderText="Search apps, use prefixes (app: sc: screen:) or calculate..."
                      hexpand={true}
                      halign={Gtk.Align.FILL}
                      onNotifyText={(self) => {
                        log.debug("Search text changed", { text: self.text });
                        searchText.set(self.text);
                        // Don't do any selection here - just update the variable
                      }}
                      focusable={true}
                      onActivate={onEnter}
                      setup={(self) => {
                        entryRef = self;
                        hook(self, App, "window-toggled", (self, win) => {
                          if (win.name !== name) return;
                          if (win.visible) {
                            // Check for initial text from launcher state
                            const initialText = launcherState.initialText.get();
                            if (initialText) {
                              log.debug("Setting initial launcher text in entry", { initialText });
                              self.text = initialText;
                              searchText.set(initialText);
                              // Clear the initial text after using it
                              launcherState.clearInitialText();
                            }

                            // Use a small delay to ensure proper focus
                            setTimeout(() => {
                              self.grab_focus();
                              // Only select all text when window is shown, not on every toggle
                              // And only if there's text to select
                              if (self.text.length > 0) {
                                self.select_region(0, -1);
                              }
                            }, 10);
                          }
                        });
                      }}
                    />
                    <box
                      halign={Gtk.Align.END}
                      valign={Gtk.Align.CENTER}
                      spacing={8}
                      visible={bind(evaluatorResult).as(result => result !== null)}
                      hexpand={false}
                    >
                      <label
                        label={bind(evaluatorResult).as(result => result ? `= ${result.value}` : "")}
                        cssClasses={["evaluator-result"]}
                        hexpand={false}
                        ellipsize={3} // PANGO_ELLIPSIZE_END
                        maxWidthChars={30}
                      />
                      {bind(evaluatorResult).as(result =>
                        result?.metadata?.type === 'color' && result.metadata.color ? (
                          <ColorPreview
                            color={result.metadata.color}
                            cssClasses={["color-preview"]}
                          />
                        ) : <box />
                      )}
                    </box>
                  </box>

                  {/* Search Icon */}
                  {/* <label */}
                  {/*   cssClasses={["search-icon"]} */}
                  {/*   halign={Gtk.Align.START} */}
                  {/*   valign={Gtk.Align.CENTER} */}
                  {/*   sensitive={false} */}
                  {/* /> */}

                  {/* Search Results */}
                  <box
                    cssName="launcher-results-container"
                  >
                    <UnifiedResults
                      maxResults={maxResults}
                      searchText={searchText}
                      selectedIndex={selectedIndex}
                      selectedItem={selectedItem}
                      searchType={searchType}
                      focusedItem={focusedItem}
                      entryRef={entryRef || undefined}
                      refs={(ref: UnifiedResultsRef) => {
                        log.debug("Setting UnifiedResults ref in variable");
                        unifiedResultsRef.set(ref);
                      }}
                    />
                  </box>

                  {/* Action Bar */}
                  <ActionBar
                    selectedItem={bind(selectedItem)}
                    focusedItem={bind(focusedItem)}
                    searchType={bind(searchType)}
                    entryRef={entryRef || undefined}
                    evaluatorResult={bind(evaluatorResult)}
                  />
                </box>
              </box>

              {/* Right panel - Detail view */}
              <box
                cssClasses={["launcher-detail-panel"]}
                widthRequest={600}
                visible={bind(focusedItem).as(item => item !== null)}
              >
                {bind(focusedItem).as(item => {
                  if (!item) return <box />;

                  // Check if it's a Hyprland window with screenshot
                  if (item.type === 'hyprland' && item.window && item.screenshotPath) {
                    const window = item.window;
                    return (
                      <box
                        vertical
                        cssClasses={["detail-panel-content"]}
                        halign={Gtk.Align.CENTER}
                        valign={Gtk.Align.CENTER}
                        spacing={24}
                      >
                        {/* Large screenshot preview */}
                        <box cssClasses={["detail-screenshot-frame"]}>
                          <RoundedImageReactive
                            file={Variable(item.screenshotPath)()}
                            size={480}
                            radius={16}
                            cssClasses={["detail-screenshot-preview"]}
                          />
                        </box>

                        {/* Window information */}
                        <box vertical spacing={12} cssClasses={["detail-window-info"]}>
                          <label
                            label={window.title || window.class}
                            cssClasses={["detail-window-title"]}
                            ellipsize={3}
                          />
                          <box spacing={16} halign={Gtk.Align.CENTER}>
                            <box spacing={8}>
                              <label label="Class:" cssClasses={["detail-label"]} />
                              <label label={window.class} cssClasses={["detail-value"]} />
                            </box>
                            <box spacing={8}>
                              <label label="Workspace:" cssClasses={["detail-label"]} />
                              <label
                                label={window.workspace.name || `${window.workspace.id}`}
                                cssClasses={["detail-value"]}
                              />
                            </box>
                          </box>
                          {window.floating && (
                            <label
                              label="Floating Window"
                              cssClasses={["detail-badge", "floating"]}
                            />
                          )}
                          {window.fullscreen && (
                            <label
                              label="Fullscreen"
                              cssClasses={["detail-badge", "fullscreen"]}
                            />
                          )}
                        </box>
                      </box>
                    );
                  }

                  // For other types, return empty box for now
                  return <box />;
                })}
              </box>
            </box>

            <box vexpand />
          </box>
        </box>
      </box>
    </PopupWindow>
  );
}
