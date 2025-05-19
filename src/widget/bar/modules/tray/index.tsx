import { Gtk } from "astal/gtk4";
import SystemTray from "gi://AstalTray";
import { Variable } from "astal";
import TrayItem from "./item";
import { TrayModuleProps } from "./types";
import config from "../../../../utils/config";
import { bind } from "astal";

export default function Tray(trayModuleProps: TrayModuleProps) {
  const { setup, child, ...props } = trayModuleProps;

  const tray = SystemTray.get_default();

  const trayItems = Variable<SystemTray.TrayItem[]>(tray.get_items());

  tray.connect("item-added", () => {
    print("Tray item added.");
    trayItems.set(tray.get_items());
  });

  tray.connect("item-removed", () => {
    print("Tray item removed.");
    trayItems.set(tray.get_items());
  });

  return (
    <box {...props}>
      <revealer
        reveal-child={true}
        transition-type={Gtk.RevealerTransitionType.SLIDE_DOWN}
        transition-duration={config.animations.durationLarge}
      >
        <box cssName="margin-right-5 spacing-h-15">
          {bind(trayItems).as((v: SystemTray.TrayItem[]) =>
            v.map((v) => <TrayItem item={v} />),
          )}
        </box>
      </revealer>
    </box>
  );
}
