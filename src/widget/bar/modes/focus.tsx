import { Widget, App, Astal, Gtk, Gdk } from "astal/gtk4";
import { Variable, Binding, bind } from "astal";
import Hypr from "gi://AstalHyprland";
import Gio from "gi://Gio";
import { BaseBarContentProps } from "./index";
import Workspaces from "../modules/workspaces";
import SideModule from "../modules/side";
import Battery from "gi://AstalBattery";
import config from "../../../utils/config";

export interface FocusBarContentProps extends BaseBarContentProps { }

export default function FocusBarMode(focusBarModeProps: FocusBarContentProps) {
  const { setup, child, ...props } = focusBarModeProps;

  const battery = Battery.get_default();

  const batteryPercentage = bind(battery, "percentage").as((v) => v);

  return (
    <centerbox
      cssName="bar-bg-focus"
      startWidget={<box />}
      centerWidget={
        <box cssName="spacing-h-4">
          <SideModule></SideModule>
          <Workspaces
            mode={props.mode}
            initilized={false}
            shown={config.workspaces.shown}
            gdkmonitor={props.gdkmonitor}
          />
          <SideModule></SideModule>
        </box>
      }
      endWidget={<box />}
      // todo: fix battery percentage
      setup={(self) => {
        // self.hook(batteryPercentage, (self) => {
        //   if (!battery) return;
        //   self.toggleClassName(
        //     "bar-bg-focus-batterylow",
        //     batteryPercentage.get() <= (config?.battery?.low || 0),
        //   );
        // });
      }}
    ></centerbox>
  );
}
