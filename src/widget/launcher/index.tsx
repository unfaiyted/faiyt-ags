import { App, Astal, Gtk, Gdk, hook } from "astal/gtk4";
import PopupWindow, { PopupWindowProps } from "../utils/popup-window";
import { Variable, bind } from "astal";
import config from "../../utils/config";
import LauncherResults from "./launcher-results";
import { launcherLogger as log } from "../../utils/logger";
import KeyboardShortcut from "../utils/keyboard-shortcut";

export interface LauncherProps extends PopupWindowProps {
  monitorIndex: number;
}

export default function LauncherBar(launcherProps: LauncherProps) {
  const { setup, child, ...props } = launcherProps;

  log.debug("Creating launcher bar", { monitor: launcherProps.monitor });
  const isVisible = Variable(false);
  const placeholderText = Variable("Type to Search");
  const searchText = Variable("");
  const selectedIndex = Variable(0);
  const selectedApp = Variable<any>(null);
  const maxResults = config.launcher?.maxResults || 5;
  let entryRef: Gtk.Entry | null = null;
  let resultsRef: any = null;
  const monitorSuffix = props.monitorIndex !== undefined ? `-${props.monitorIndex}` : '';

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
    } else {
      placeholderText.set("");
    }
  });

  // Handle text changes in the entry
  const onEnter = () => {
    if (resultsRef) {
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
      onKeyPressed={(self: Gtk.Window, keyval: number) => {
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
        hook(self, App, "window-toggled", (self, win) => {
          if (win.name !== name) return;
          searchText.set("");
          selectedApp.set(null);
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
          clickGesture.connect("pressed", (gesture, n_press, x, y) => {
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
            halign={Gtk.Align.CENTER}
          >
            <box
              vertical
              cssClasses={bind(searchText).as(text =>
                text.length > 1 ? ["launcher-search-box"] : ["launcher-search-box", "compact"]
              )}
            >
              <box cssClasses={["search-input-container"]}>
                <entry
                  cssClasses={["launcher-search-input"]}
                  placeholderText="Search for apps, files, or type a command..."
                  hexpand
                  onNotifyText={(self) => {
                    log.debug("Search text changed", { text: self.text });
                    searchText.set(self.text);
                  }}
                  focusable={true}
                  onActivate={onEnter}
                  setup={(self) => {
                    entryRef = self;
                    hook(self, App, "window-toggled", (self, win) => {
                      if (win.name !== name) return;
                      self.grab_focus();
                      self.set_text("");
                    });
                  }}
                />
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
                  {bind(selectedApp).as(app => app ? (
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
                  ) : (
                    <label label="Type to search applications" cssClasses={["action-hint"]} />
                  ))}
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
