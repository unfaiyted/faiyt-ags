import config from "../../../utils/config";
import { NormalBarContentProps } from "../types";
import { Gtk } from "astal/gtk4";
import WindowTitle from "../modules/window-title";
import SideModule from "../modules/side";
import System from "../modules/system";
import Music from "../modules/music/index";
import Workspaces from "../modules/workspaces";
import Clock from "../modules/clock";
import Tray from "../modules/tray";
import LeftModule from "../modules/left";
import RightModule from "../modules/right";
import Battery from "../modules/battery";
import Utilities from "../modules/utilities";
import Weather from "../modules/weather";
import StatusIndicators from "../modules/indicators";

export default function NormalBarMode(barModeProps: NormalBarContentProps) {
  const { setup, child, ...props } = barModeProps;

  return (
    <centerbox
      hexpand={true}
      vexpand={false}
      halign={Gtk.Align.FILL}
      valign={Gtk.Align.START}
      heightRequest={32}
      startWidget={
        <LeftModule>
          <WindowTitle />
        </LeftModule>
      }
      centerWidget={
        <box
          hexpand={true}
          vexpand={false}
          halign={Gtk.Align.CENTER}
        >
          <SideModule>
            <System />
            <Music />
          </SideModule>
          <Workspaces
            mode={props.mode}
            shown={config.workspaces.shown}
            initilized={false}
            gdkmonitor={props.gdkmonitor}
          />
          <SideModule>
            <Utilities />
          </SideModule>
        </box>
      }
      endWidget={
        <RightModule>
          <box hexpand={true}
            vexpand={false}
            halign={Gtk.Align.CENTER}
            valign={Gtk.Align.CENTER}>
            <Battery />
            <Clock />
            <Weather />
            {/* <StatusIndicators /> */}
            <Tray />
          </box>
        </RightModule>
      }
      cssName="bar-bg"
    ></centerbox>
  );
}
