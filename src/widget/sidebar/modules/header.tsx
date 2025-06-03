import { Widget, Gtk, Gdk } from "astal/gtk4";
import { getDistroIcon } from "../../../utils/system";
import { ReloadIconButton } from "./buttons/reload";
import { SettingsIconButton } from "./buttons/settings";
import { PowerIconButton } from "./buttons/power";
import { Variable, bind, Binding } from "astal";
import { getUptime } from "../../../utils/system";
import { PhosphorIcon } from "../../utils/icons/phosphor";
import { PhosphorIcons } from "../../utils/icons/types";
import configManager from "../../../services/config-manager";
import GLib from "gi://GLib";

export interface HeaderModuleProps extends Widget.BoxProps {
  gdkmonitor: Binding<Gdk.Monitor> | Gdk.Monitor | undefined;
  monitorIndex: number;
}

export default function HeaderModule(props: HeaderModuleProps) {
  const uptime = Variable("").poll(5000, async () => await getUptime());
  const avatarPath = configManager.getValue("user.avatarPath");
  const username = GLib.get_user_name();

  return (
    <box cssName="header-module" spacing={12} {...props}>
      <box cssName="header-info" spacing={12} hexpand>
        <box cssName="user-avatar-wrapper" overflow={Gtk.Overflow.HIDDEN}>
          {avatarPath && GLib.file_test(avatarPath, GLib.FileTest.EXISTS) ? (
            <image file={avatarPath} pixelSize={48} cssClasses={["user-avatar"]} />
          ) : (
            <box cssClasses={["user-avatar-placeholder"]} widthRequest={48} heightRequest={48}>
              <PhosphorIcon iconName={PhosphorIcons.User} size={24} />
            </box>
          )}
        </box>
        <box vertical valign={Gtk.Align.CENTER}>
          <label
            cssName="header-title"
            xalign={0}
            label={username}
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
