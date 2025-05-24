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
        if (index > 10) return;
        appResults.set(index, app);
      });

      revealResults.set(resultApps.length > 0);
    }
  };

  props.searchText.subscribe(() => {
    if (props.searchText.get().length > 1) {
      revealResults.set(true);
      return;
    }
    revealResults.set(false);
  });

  const debouncedUpdate = debounce(updateResults, 200);
  const sub = props.searchText.subscribe(debouncedUpdate);

  const setupResults = (self: Widget.Revealer) => { };

  revealResults.subscribe((v) => {
    if (!v) appResults.deleteAll();
  });

  return (
    <revealer
      setup={setupResults}
      transitionDuration={config.animations.durationLarge}
      revealChild={bind(revealResults)}
      transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
      halign={Gtk.Align.CENTER}
    >
      <box
        className="overview-search-results"
        css={`
          min-height: 30rem;
        `} // TODO: make configurable seems to be 6 on my monitor and setup. Might want to look into this moer to check on laptop and such
        vertical
      >
        <scrollable
          hexpand
          vscroll={Gtk.PolicyType.AUTOMATIC}
          hscroll={Gtk.PolicyType.NEVER}
          vexpand
        >
          <box vexpand homogeneous>
            <box
              className="spacing-v-5-revealer"
              valign={Gtk.Align.START}
              vertical
            >
              {bind(appResults).as((v) => {
                return v.map(([num, app]) => (
                  <AppButton index={num} app={app} />
                ));
              })}
            </box>
          </box>
        </scrollable>
      </box>
    </revealer>
  );
}
