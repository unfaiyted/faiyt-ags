import { Widget, App, Astal, Gtk, Gdk } from "astal/gtk4";
import Apps from "gi://AstalApps";
import PopupWindow, { PopupWindowProps } from "../utils/popup-window";
import CloseRegion from "../utils/containers/close-region";
import { Variable, bind } from "astal";
import config from "../../utils/config";
import AppButton from "./buttons/app-button";


export interface LauncherResultsProps extends Widget.BoxProps {
  searchText: Variable<string>;
  maxResults: number;
  selectedIndex: Variable<number>;
  selectedApp?: Variable<any>;
  ref?: (ref: any) => void;
}

const apps = new Apps.Apps({
  // nameMultiplier: 2,
  // entryMultiplier: 1,
  // executableMultiplier: 2,
});

export default function LauncherResults(props: LauncherResultsProps) {
  const selectedIndex = props.selectedIndex || Variable(0);

  const list = props.searchText((text) => {
    if (text.length > 1) {
      const results = apps.fuzzy_query(text).slice(0, props.maxResults);
      selectedIndex.set(0); // Reset selection when results change
      if (props.selectedApp && results.length > 0) {
        props.selectedApp.set(results[0]);
      } else if (props.selectedApp) {
        props.selectedApp.set(null);
      }
      return results;
    }
    if (props.selectedApp) {
      props.selectedApp.set(null);
    }
    return [];
  });

  // Navigation methods
  const selectNext = () => {
    const results = list.get();
    if (results.length > 0) {
      const current = selectedIndex.get();
      const newIndex = (current + 1) % results.length;
      selectedIndex.set(newIndex);
      if (props.selectedApp) {
        props.selectedApp.set(results[newIndex]);
      }
    }
  };

  const selectPrevious = () => {
    const results = list.get();
    if (results.length > 0) {
      const current = selectedIndex.get();
      const newIndex = current === 0 ? results.length - 1 : current - 1;
      selectedIndex.set(newIndex);
      if (props.selectedApp) {
        props.selectedApp.set(results[newIndex]);
      }
    }
  };

  const activateSelected = () => {
    const results = list.get();
    const index = selectedIndex.get();
    if (results.length > 0 && index >= 0 && index < results.length) {
      results[index].launch();
      // Close launcher after launching
      const window = App.get_window("launcher");
      if (window) {
        window.hide();
      }
    }
  };

  // Expose methods via ref
  if (props.ref) {
    props.ref({
      selectNext,
      selectPrevious,
      activateSelected
    });
  }


  return (
    <revealer
      transitionDuration={config.animations.durationLarge}
      revealChild={list.as((l) => l.length > 0)}
      transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
      halign={Gtk.Align.START}
    >
      <box
        cssName="launcher-results"
        vertical
        hexpand
      >
        <Gtk.ScrolledWindow
          hexpand
          vscrollbar_policy={Gtk.PolicyType.NEVER}
          hscrollbar_policy={Gtk.PolicyType.NEVER}
          vexpand={false}
          maxContentHeight={list.as(apps => Math.min(apps.length * 60, 360))}
        >
          <box vertical cssName="launcher-results-list">
            {list.as((apps) =>
              apps.map((app, index) => (
                <AppButton
                  index={index}
                  app={app}
                  selected={bind(selectedIndex).as(i => i === index)}
                />
              ))
            )}
          </box>
        </Gtk.ScrolledWindow>
      </box>
    </revealer>
  );
}
