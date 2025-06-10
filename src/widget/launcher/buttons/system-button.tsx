import { Widget, App, Gtk, Gdk } from "astal/gtk4";
import LauncherButton from "./index";
import actions from "../../../utils/actions";
import { Binding } from "astal";
import { execAsync } from "astal/process";
import { launcherLogger as log } from "../../../utils/logger";

export interface SystemAction {
  name: string;
  description: string;
  icon: string;
  command: string;
  confirm?: boolean; // Whether to show confirmation dialog
}

export interface SystemButtonProps extends Widget.ButtonProps {
  action: SystemAction;
  index: number;
  selected?: Binding<boolean>;
  ref?: (button: Gtk.Button) => void;
}

export default function SystemButton(props: SystemButtonProps) {
  let lastExecutionTime = 0;
  const DEBOUNCE_DELAY = 200; // 200ms debounce


  if (!props.action) {
    log.error("SystemButton: action is undefined");
    return <box />;
  }

  const handleKeyPress = (self: Gtk.Button, keyval: number) => {
    switch (keyval) {
      case Gdk.KEY_Return:
      case Gdk.KEY_KP_Enter:
        executeAction();
        break;
      default:
        break;
    }
  };

  const executeAction = () => {
    const now = Date.now();
    if (now - lastExecutionTime < DEBOUNCE_DELAY) {
      log.debug("Ignoring duplicate execution within debounce period");
      return;
    }
    lastExecutionTime = now;


    log.debug("Executing system action", {
      action: props.action.name,
      command: props.action.command
    });

    // Close launcher first
    actions.window.close("launcher");

    // Execute system action
    if (props.action.confirm) {
      // TODO: Show confirmation dialog
      log.debug("Confirmation required for action", { action: props.action.name });
    }

    execAsync(['bash', '-c', props.action.command]).catch(err => {
      log.error("Failed to execute system action", { error: err });
    });
  };

  return (
    <LauncherButton
      name={props.action.name}
      icon={<image iconName={props.action.icon} pixelSize={32} />}
      content={props.action.description}
      selected={props.selected}
      onKeyPressed={handleKeyPress}
      onClicked={executeAction}
      setup={(self: Gtk.Button) => {
        if (props.ref) {
          props.ref(self);
        }
      }}
      {...props}
    />
  );
}

// Pre-defined system actions
export const SYSTEM_ACTIONS: SystemAction[] = [
  {
    name: "Power Off",
    description: "Shut down the computer",
    icon: "system-shutdown-symbolic",
    command: "systemctl poweroff",
    confirm: true
  },
  {
    name: "Reboot",
    description: "Restart the computer",
    icon: "system-reboot-symbolic",
    command: "systemctl reboot",
    confirm: true
  },
  {
    name: "Suspend",
    description: "Put computer to sleep",
    icon: "system-suspend-symbolic",
    command: "systemctl suspend"
  },
  {
    name: "Lock Screen",
    description: "Lock the current session",
    icon: "system-lock-screen-symbolic",
    command: "hyprlock"
  },
  {
    name: "Log Out",
    description: "End the current session",
    icon: "system-log-out-symbolic",
    command: "hyprctl dispatch exit",
    confirm: true
  },
  {
    name: "Hibernate",
    description: "Save session to disk and power off",
    icon: "system-hibernate-symbolic",
    command: "systemctl hibernate",
    confirm: true
  },
  {
    name: "Reload Config",
    description: "Reload Hyprland configuration",
    icon: "view-refresh-symbolic",
    command: "hyprctl reload"
  },
  {
    name: "Change Wallpaper",
    description: "Open wallpaper selector",
    icon: "preferences-desktop-wallpaper-symbolic",
    command: "ags request 'window toggle desktop-wallpaper'"
  }
];
