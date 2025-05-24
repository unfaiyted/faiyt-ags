import { App, Astal, Gtk, Gdk } from "astal/gtk4";
import { Widget } from "astal/gtk3";
import PopupWindow, { PopupWindowProps } from "../utils/popup-window";
import CloseRegion from "../utils/containers/close-region";
import { Variable, bind } from "astal";
import config from "../../utils/config";
import actions from "../../utils/actions";
import LauncherResults from "./launcher-results";

export interface LauncherProps extends PopupWindowProps {
  monitor: number;
}

export default function LauncherBar(launcherProps: LauncherProps) {
  const { setup, child, ...props } = launcherProps;

  const isVisible = Variable(true);
  const placeholderText = Variable("Type to Search");
  const searchText = Variable("");

  const handleKeyPress = (self: Widget.Entry, event: Gdk.Event) => {
    // esc key = reset text value
    if (event.get_keyval()[1] === Gdk.KEY_Escape) {
      self.text = "";
      searchText.set("");
    }

    if (self.text.length == 0) {
      placeholderText.set("Type to Search");
      return;
    }

    searchText.set(self.text);
    placeholderText.set("");
  };

  isVisible.subscribe((v) => {
    if (v) {
      searchText.set("");
      placeholderText.set("Type to Search");
    }
  });

  return (
    <PopupWindow
      name={"launcher"}
      className={props.className}
      layer={Astal.Layer.TOP}
      halign={Gtk.Align.CENTER}
      valign={Gtk.Align.CENTER}
      visible={bind(isVisible).as((v) => v)}
      keymode={Astal.Keymode.ON_DEMAND}
      expand
      anchor={
        Astal.WindowAnchor.TOP |
        Astal.WindowAnchor.BOTTOM |
        Astal.WindowAnchor.LEFT |
        Astal.WindowAnchor.RIGHT
      }
      css={``}
      application={App}
      {...props}
    >
      <box expand>
        <box vertical css={``}>
          <CloseRegion
            multimonitor={true}
            monitor={props.monitor}
            hexpand
            height="40%"
            handleClose={() => actions.window.close("launcher")}
          />
          <box halign={Gtk.Align.CENTER}>
            <overlay
              overlays={[
                <revealer
                  transitionType={Gtk.RevealerTransitionType.CROSSFADE}
                  transitionDuration={config.animations.durationLarge}
                  revealChild={true}
                  halign={Gtk.Align.START}
                >
                  <label
                    className="txt txt-large icon-material overview-search-icon"
                    label="search"
                  />
                </revealer>,
                <revealer
                  transitionType={Gtk.RevealerTransitionType.CROSSFADE}
                  transitionDuration={config.animations.durationLarge}
                  revealChild={true}
                  halign={Gtk.Align.CENTER}
                >
                  <label className="overview-search-prompt txt-small txt">
                    {bind(placeholderText)}
                  </label>
                </revealer>,
              ]}
            >
              <entry
                setup={(self) => self.grab_focus()}
                onKeyReleaseEvent={handleKeyPress}
                className={"overview-search-box txt-small txt"}
                halign={Gtk.Align.CENTER}
              ></entry>
            </overlay>

            <box className={"overview-search-icon-box"}></box>
            <box
              className={"overview-search-prompt-box"}
              halign={Gtk.Align.CENTER}
            />
          </box>
          {/* <CloseRegion */}
          {/*   hexpand */}
          {/*   height="50%" */}
          {/*   multimonitor={true} */}
          {/*   monitor={props.monitor} */}
          {/*   handleClose={() => actions.window.close("launcher")} */}
          {/* /> */}
          {/* <WorkspacesOverview /> */}
          <LauncherResults maxResults={10} searchText={bind(searchText)} />
        </box>
      </box>
    </PopupWindow>
  );
}
