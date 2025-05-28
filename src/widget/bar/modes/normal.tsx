import config from "../../../utils/config";
import { BaseBarContentProps } from "./index";
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

export interface NormalBarContentProps extends BaseBarContentProps {
  monitorIndex?: number;
}

export default function NormalBarMode(barModeProps: NormalBarContentProps) {
  const { setup, child, ...props } = barModeProps;

  return (
    <centerbox
      hexpand={true}
      vexpand={false}
      halign={Gtk.Align.FILL}
      valign={Gtk.Align.START}
      heightRequest={40}
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
            <Music
              monitorIndex={props.monitorIndex}
            />
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
        <RightModule monitorIndex={props.monitorIndex}>
          <box hexpand={true}
            spacing={4}
            vexpand={false}
            halign={Gtk.Align.START}
            valign={Gtk.Align.CENTER}>
            <Battery />
            <Clock />
            <Weather />
            <box
              marginStart={40}
              halign={Gtk.Align.END}
              hexpand
            >
              {/* <StatusIndicators /> */}
              {/* <Tray /> */}
            </box>
          </box>
        </RightModule>
      }
      cssName="bar-bg"
    ></centerbox>
  );
}
