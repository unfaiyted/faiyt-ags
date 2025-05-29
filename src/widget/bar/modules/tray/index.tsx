import { Widget, Gtk, } from "astal/gtk4";
import { Variable, bind } from "astal";
import SystemTray from "gi://AstalTray";
import TrayItem from "./item";
import config from "../../../../utils/config";
import { barLogger as log } from "../../../../utils/logger";

export interface TrayModuleProps extends Widget.BoxProps { }

export default function Tray(trayModuleProps: TrayModuleProps) {
  // const { ...props } = trayModuleProps;

  const tray = SystemTray.get_default();

  const trayItems = Variable<SystemTray.TrayItem[]>(tray.get_items());

  tray.connect("item-added", () => {
    log.debug("Tray item added");
    trayItems.set(tray.get_items());
  });

  tray.connect("item-removed", () => {
    log.debug("Tray item removed");
    trayItems.set(tray.get_items());
  });

  return (
    <box>
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
