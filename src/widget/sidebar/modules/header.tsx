import { Widget, Gtk, Gdk } from "astal/gtk4";
import { getDistroIcon } from "../../../utils/system";
import { ReloadIconButton } from "./buttons/reload";
import { SettingsIconButton } from "./buttons/settings";
import { PowerIconButton } from "./buttons/power";
import { Variable, bind, Binding } from "astal";
import { getUptime } from "../../../utils/system";
import { PhosphorIcon } from "../../utils/icons/phosphor";
import { PhosphorIcons } from "../../utils/icons/types";

export interface HeaderModuleProps extends Widget.BoxProps {
  gdkmonitor: Binding<Gdk.Monitor> | Gdk.Monitor | undefined;
  monitorIndex: number;
}

export default function HeaderModule(props: HeaderModuleProps) {
  const uptime = Variable("").poll(5000, async () => await getUptime());

  return (
    <box cssName="header-module" spacing={12} {...props}>
      <box cssName="header-info" spacing={12} hexpand>
        <box cssName="distro-icon-wrapper">
          <image iconName={getDistroIcon()} pixelSize={32} />
        </box>
        <box vertical>
          <label
            cssName="header-title"
            xalign={0}
            label="System"
          />
          <label
            cssName="header-uptime"
            xalign={0}
            label={bind(uptime).as((v) => `Uptime: ${v}`)}
          />
        </box>
      </box>
      <box cssName="header-actions" spacing={4}>
        <ReloadIconButton />
        <SettingsIconButton />
        <PowerIconButton marginStart={4} gdkmonitor={props.gdkmonitor} monitorIndex={props.monitorIndex} />
      </box>
    </box>
  );
}
