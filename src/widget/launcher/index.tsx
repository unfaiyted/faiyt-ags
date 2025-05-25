import { Widget, App, Astal, Gtk, Gdk } from "astal/gtk4";
import PopupWindow, { PopupWindowProps } from "../utils/popup-window";
import { Variable, bind } from "astal";
import config from "../../utils/config";
import LauncherResults from "./launcher-results";

export interface LauncherProps extends PopupWindowProps {
  monitor: number;
}

export default function LauncherBar(launcherProps: LauncherProps) {
  const { setup, child, ...props } = launcherProps;

  const isVisible = Variable(false);
  const placeholderText = Variable("Type to Search");
  const searchText = Variable("");
  let entryRef: Gtk.Entry | null = null;

  // Close the launcher
  const closeLauncher = () => {
    const window = App.get_window("launcher");
    if (window) {
      window.hide();
    }
  };

  // Handle text changes in the entry
  const handleTextChange = (text: string) => {
    if (text.length === 0) {
      placeholderText.set("Type to Search");
      searchText.set("");
    } else {
      placeholderText.set("");
      searchText.set(text);
    }
  };

  // Reset state when window visibility changes
  isVisible.subscribe((v) => {
    if (v) {
      searchText.set("");
      placeholderText.set("Type to Search");
      // Focus entry when shown
      if (entryRef) {
        entryRef.grab_focus();
      }
    }
  });

  return (
    <PopupWindow
      {...props}
      name="launcher"
      cssName="launcher"
      layer={Astal.Layer.TOP}
      anchor={
        Astal.WindowAnchor.TOP |
        Astal.WindowAnchor.BOTTOM |
        Astal.WindowAnchor.LEFT |
        Astal.WindowAnchor.RIGHT
      }
      visible={true}
      keymode={Astal.Keymode.ON_DEMAND}
      application={App}
      onKeyPressed={(self: Gtk.Window, keyval: number) => {
        if (keyval === Gdk.KEY_Escape) {
          closeLauncher();
          return true;
        }
        return false;
      }}
      setup={(self: Gtk.Window) => {
        // Connect window visibility to our variable
        self.connect("show", () => isVisible.set(true));
        self.connect("hide", () => isVisible.set(false));
      }}
    >
      <box
        vertical
        halign={Gtk.Align.CENTER}
        valign={Gtk.Align.CENTER}
        cssName="launcher-container"
        setup={(self: Gtk.Box) => {
          // Add click gesture for click-outside detection
          const clickGesture = new Gtk.GestureClick();
          clickGesture.connect("pressed", (gesture, n_press, x, y) => {
            // Get the search box allocation
            const searchBox = self.get_first_child()?.get_next_sibling();
            if (searchBox) {
              const allocation = searchBox.get_allocation();
              const [success, boxX, boxY] = searchBox.translate_coordinates(self, 0, 0);

              if (success) {
                // Check if click is outside the search/results area
                const isOutside = x < boxX || x > boxX + allocation.width ||
                  y < boxY || y > boxY + allocation.height;
                if (isOutside) {
                  closeLauncher();
                }
              }
            }
          });
          self.add_controller(clickGesture);
        }}
      >
        {/* Spacer for top area */}
        <box vexpand />

        {/* Search Box */}
        <box vertical cssName="launcher-search-box" halign={Gtk.Align.CENTER}>
          <overlay>
            <box cssName="search-input-container">
              <entry
                cssName="launcher-search-input"
                placeholderText="Type to Search"
                halign={Gtk.Align.CENTER}
                hexpand
                setup={(self: Gtk.Entry) => {
                  entryRef = self;
                  // Focus when window shows
                  self.get_root()?.connect("show", () => {
                    self.grab_focus();
                  });
                }}
                onChanged={(self: Gtk.Entry) => {
                  handleTextChange(self.get_text());
                }}
              />
            </box>

            {/* Search Icon */}
            <label
              cssName="search-icon"
              label="🔍"
              halign={Gtk.Align.START}
              valign={Gtk.Align.CENTER}
              sensitive={false}
            />

            {/* Placeholder (shown when empty) */}
            <revealer
              transitionType={Gtk.RevealerTransitionType.CROSSFADE}
              transitionDuration={config.animations.durationSmall}
              revealChild={bind(placeholderText).as(t => t.length > 0)}
              halign={Gtk.Align.CENTER}
              valign={Gtk.Align.CENTER}
              sensitive={false}
            >
              <label
                cssName="search-placeholder"
                label={bind(placeholderText)}
              />
            </revealer>
          </overlay>

          {/* Search Results */}
          <box cssName="launcher-results-container">
            <LauncherResults maxResults={10} searchText={bind(searchText)} />
          </box>
        </box>

        {/* Spacer for bottom area */}
        <box vexpand />
      </box>
    </PopupWindow>
  );
}
