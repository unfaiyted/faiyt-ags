import { Widget, App, Astal, Gtk, Gdk } from "astal/gtk4";
import Apps from "gi://AstalApps";
import PopupWindow, { PopupWindowProps } from "../utils/popup-window";
import CloseRegion from "../utils/containers/close-region";
import { Variable, bind, Binding } from "astal";
import GLib from "gi://GLib";
import config from "../../utils/config";
import actions from "../../utils/actions";
import { VarMap } from "../../types/var-map";
import AppButton from "./buttons/app-button";

const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number,
) => {
  let timeoutId: number;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      GLib.source_remove(timeoutId);
    }

    timeoutId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, delay, () => {
      func(...args);
      return false;
    });
  };
};

export interface LauncherResultsProps extends Widget.BoxProps {
  searchText: Binding<string>;
  maxResults: number;
}

const apps = new Apps.Apps({
  // nameMultiplier: 2,
  // entryMultiplier: 1,
  // executableMultiplier: 2,
});

export default function LauncherResults(props: LauncherResultsProps) {
  const appResults = new VarMap<number, Apps.Application>([]);
  const revealResults = Variable(false);

  const updateResults = (searchText: string) => {
    appResults.deleteAll();

    if (searchText.length > 1) {
      const resultApps = apps.fuzzy_query(searchText);

      resultApps.forEach((app, index) => {
        if (index >= props.maxResults) return;
        appResults.set(index, app);
      });

      revealResults.set(resultApps.length > 0);
    } else {
      revealResults.set(false);
    }
  };

  // Debounced update function
  const debouncedUpdate = debounce(updateResults, 200);

  // Subscribe to search text changes
  const cleanup = props.searchText.subscribe(debouncedUpdate);

  // Clear results when hidden
  revealResults.subscribe((v) => {
    if (!v) appResults.deleteAll();
  });

  return (
    <revealer
      transitionDuration={config.animations.durationLarge}
      revealChild={bind(revealResults)}
      transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
      halign={Gtk.Align.CENTER}
    >
      <box
        cssName="launcher-results"
        vertical
        hexpand
      >
        <scrollable
          hexpand
          vscroll={Gtk.PolicyType.AUTOMATIC}
          hscroll={Gtk.PolicyType.NEVER}
          vexpand
          maxContentHeight={400}
        >
          <box vertical cssName="launcher-results-list">
            {bind(appResults).as((v) => {
              return v.map(([num, app]) => (
                <AppButton key={app.get_id()} index={num} app={app} />
              ));
            })}
          </box>
        </scrollable>
      </box>
    </revealer>
  );
}
