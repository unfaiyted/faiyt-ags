import { App, Astal, Gtk, Gdk } from "astal/gtk3";
import { Widget } from "astal/gtk3";
import { bind } from "astal";
import config from "../../../utils/config";
import Workspaces from "../modules/workspaces";
import { getScrollDirection } from "../../../utils";
import Hypr from "gi://AstalHyprland";
import Gio from "gi://Gio";
import { FocusBarContentProps } from "../types";
import SideModule from "../modules/side";
import Battery from "gi://AstalBattery";
export default function FocusBarMode(focusBarModeProps: FocusBarContentProps) {
  const { setup, child, ...props } = focusBarModeProps;

  const battery = Battery.get_default();

  const batteryPercentage = bind(battery, "percentage").as((v) => v);

  return (
    <centerbox
      className="bar-bg-focus"
      startWidget={<box />}
      centerWidget={
        <box className="spacing-h-4">
          <SideModule></SideModule>
          <Workspaces
            mode={props.mode}
            initilized={false}
            shown={config.workspaces.shown}
          />
          <SideModule></SideModule>
        </box>
      }
      endWidget={<box />}
      // todo: fix battery percentage
      setup={(self) => {
        self.hook(batteryPercentage, (self) => {
          if (!battery) return;
          self.toggleClassName(
            "bar-bg-focus-batterylow",
            batteryPercentage.get() <= (config?.battery?.low || 0),
          );
        });
      }}
    ></centerbox>
  );
}
