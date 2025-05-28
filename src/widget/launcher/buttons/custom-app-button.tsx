import { Widget, App, Gtk, Gdk } from "astal/gtk4";
import GLib from "gi://GLib";
import LauncherButton from "./index";
import actions from "../../../utils/actions";
import { Binding } from "astal";
import { DesktopEntry } from "../../../services/desktop-scanner";
import { launcherLogger as logger } from "../../../utils/logger";

export interface CustomAppButtonProps extends Widget.ButtonProps {
  entry: DesktopEntry;
  index: number;
  selected?: Binding<boolean>;
  ref?: (button: Gtk.Button) => void;
}

export default function CustomAppButton(props: CustomAppButtonProps) {
  const handleKeyPress = (self: Gtk.Button, keyval: number) => {
    switch (keyval) {
      case Gdk.KEY_Return:
      case Gdk.KEY_KP_Enter:
        launchApp(props.entry);
        // Close launcher after launching
        actions.window.toggle("launcher");
        break;
      default:
        break;
    }
  };

  const launchApp = (entry: DesktopEntry) => {
    try {
      // Parse the Exec field to handle special cases
      let command = entry.exec;

      // Remove field codes (%f, %F, %u, %U, etc.)
      command = command.replace(/%[fFuUdDnNickvm]/g, "");

      // Handle quotes
      command = command.trim();

      logger.debug(`Launching app: ${entry.name} with command: ${command}`);

      // Use GLib.spawn_command_line_async for better compatibility
      GLib.spawn_command_line_async(command);
    } catch (error) {
      logger.error(`Failed to launch ${entry.name}: ${error}`);
    }
  };

  return (
    <LauncherButton
      name={props.entry.name}
      icon={<image iconName={props.entry.icon || "application-x-executable"} pixelSize={32} />}
      content={props.entry.description || ""}
      selected={props.selected}
      onKeyPressed={handleKeyPress}
      onClicked={() => {
        launchApp(props.entry);
        // Close launcher after launching
        const window = App.get_window("launcher");
        if (window) {
          window.hide();
        }
      }}
      setup={(self: Gtk.Button) => {
        if (props.ref) {
          props.ref(self);
        }
      }}
      {...props}
    />
  );
}
