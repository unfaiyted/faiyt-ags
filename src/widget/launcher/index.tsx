import { App, Astal, Gtk, Gdk, hook } from "astal/gtk4";
import PopupWindow, { PopupWindowProps } from "../utils/popup-window";
import { Variable, bind } from "astal";
import config from "../../utils/config";
import LauncherResults from "./launcher-results";
import { launcherLogger as log } from "../../utils/logger";
import KeyboardShortcut from "../utils/keyboard-shortcut";
import { evaluatorManager, type EvaluatorResult } from "../../utils/evaluators";
import ColorPreview from "./components/color-preview";

export interface LauncherProps extends PopupWindowProps {
  monitorIndex: number;
}

export default function LauncherBar(launcherProps: LauncherProps) {
  const { setup, child, ...props } = launcherProps;

  log.debug("Creating launcher bar", { monitor: launcherProps.monitor });
  // const isVisible = Variable(false);
  const placeholderText = Variable("Type to Search");
  const searchText = Variable("");
  const selectedIndex = Variable(0);
  const selectedApp = Variable<any>(null);
  const maxResults = config.launcher?.maxResults || 5;
  let entryRef: Gtk.Entry | null = null;
  let resultsRef: any = null;
  const monitorSuffix = props.monitorIndex !== undefined ? `-${props.monitorIndex}` : '';
  const evaluatorResult = Variable<EvaluatorResult | null>(null);

  // Close the launcher
  const closeLauncher = () => {
    log.debug("Closing launcher");
    const window = App.get_window(`launcher${monitorSuffix}`);
    if (window) {
      window.hide();
    }
  };


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
    } else if (resultsRef) {
      // Otherwise, activate the selected app
      resultsRef.activateSelected();
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
      onKeyPressed={(_self: Gtk.Window, keyval: number) => {
        log.debug("Key pressed", { key: keyval });
        if (keyval === Gdk.KEY_Escape) {
          closeLauncher();
          return true;
        }

        // Handle navigation keys
        switch (keyval) {
          case Gdk.KEY_Down:
          case Gdk.KEY_KP_Down:
            if (resultsRef) {
              resultsRef.selectNext();
            }
            return true;
          case Gdk.KEY_Up:
          case Gdk.KEY_KP_Up:
            if (resultsRef) {
              resultsRef.selectPrevious();
            }
            return true;
          case Gdk.KEY_Return:
          case Gdk.KEY_KP_Enter:
            if (resultsRef) {
              resultsRef.activateSelected();
            }
            return true;
        }

        return false;
      }}
      setup={(self) => {
        hook(self, App, "window-toggled", (_self, win) => {
          if (win.name !== name) return;
          // Don't clear searchText to preserve equations/conversions
          // searchText.set("");
          selectedApp.set(null);
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
                  placeholderText="Search for apps, files, or type a command..."
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
                        self.grab_focus();
                        // Only select all text when window is shown, not on every toggle
                        // And only if there's text to select
                        if (self.text.length > 0) {
                          self.select_region(0, -1);
                        }
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
              <label
                cssClasses={["search-icon"]}
                halign={Gtk.Align.START}
                valign={Gtk.Align.CENTER}
                sensitive={false}
              />

              {/* Search Results */}
              <box cssClasses={["launcher-results-container"]}>
                <LauncherResults
                  maxResults={maxResults}
                  searchText={searchText}
                  selectedIndex={selectedIndex}
                  selectedApp={selectedApp}
                  ref={(ref: any) => { resultsRef = ref; }}
                />
              </box>

              {/* Action Bar */}
              <box cssClasses={["launcher-action-bar"]} spacing={20}>
                {/* Left side - App actions */}
                <box hexpand halign={Gtk.Align.START} spacing={16}>
                  {bind(Variable.derive([evaluatorResult, selectedApp], (evalResult, app) => {
                    if (evalResult) {
                      return (
                        <box spacing={8}>
                          <KeyboardShortcut keys={["↵"]} compact />
                          <label label={evalResult.hint || "Copy result to clipboard"} cssClasses={["action-label"]} />
                        </box>
                      );
                    } else if (app) {
                      return (
                        <>
                          <box spacing={8}>
                            <KeyboardShortcut keys={["↵"]} compact />
                            <label label="Open" cssClasses={["action-label"]} />
                          </box>
                          <box spacing={8}>
                            <KeyboardShortcut keys={["Ctrl", "↵"]} compact />
                            <label label="Open in Terminal" cssClasses={["action-label"]} />
                          </box>
                          <box spacing={8}>
                            <KeyboardShortcut keys={["Alt", "↵"]} compact />
                            <label label="Show in Files" cssClasses={["action-label"]} />
                          </box>
                        </>
                      );
                    } else {
                      return <label label="Type to search, calculate, or convert units" cssClasses={["action-hint"]} />;
                    }
                  }))}
                </box>

                {/* Right side - General shortcuts */}
                <box halign={Gtk.Align.END} spacing={16}>
                  <box spacing={8}>
                    <KeyboardShortcut keys={["Tab"]} compact />
                    <label label="Autocomplete" cssClasses={["action-label"]} />
                  </box>
                  <box spacing={8}>
                    <KeyboardShortcut keys={["Esc"]} compact />
                    <label label="Close" cssClasses={["action-label"]} />
                  </box>
                </box>
              </box>
            </box>
          </box>

          {/* Spacer for bottom area */}
          <box vexpand />
        </box>
      </box>
    </PopupWindow>
  );
}
