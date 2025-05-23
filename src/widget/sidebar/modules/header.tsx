import { Widget, Gtk } from "astal/gtk3";
import { getDistroIcon } from "../../../utils/system";
import { ReloadIconButton } from "./buttons/reload";
import { SettingsIconButton } from "./buttons/settings";
import { PowerIconButton } from "./buttons/power";
import { Variable, bind } from "astal";
import { getUptime } from "../../../utils/system";

export interface HeaderModuleProps extends Widget.BoxProps { }

export default function HeaderModule(props: HeaderModuleProps) {
  const uptime = Variable("").poll(5000, async () => await getUptime());

  return (
    <box
      cssName="spacing-h-10 sidebar-group-invisible-morehorizpad"
    >
      <icon icon={getDistroIcon()} className="txt txt-larger" />
      <label
        halign={Gtk.Align.START}
        label={bind(uptime).as((v) => "Uptime: " + v.toString())}
        cssName="txt txt-small"
      />
      <box hexpand />
      <ReloadIconButton halign={Gtk.Align.END} />
      <SettingsIconButton halign={Gtk.Align.END} />
      <PowerIconButton halign={Gtk.Align.END} />
    </box>
  );
}
