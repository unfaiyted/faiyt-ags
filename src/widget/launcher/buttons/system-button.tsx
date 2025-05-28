import { Gtk, Widget } from "astal/gtk4";
import { Variable, Binding, bind } from "astal";
import { execAsync } from "astal/process";
import { App } from "astal/gtk4";
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
  const { action, index, selected, ref: buttonRef, ...rest } = props;

  if (!action) {
    log.error("SystemButton: action is undefined");
    return <box />;
  }

  const handleActivate = () => {
    log.debug("Executing system action", { action: action.name, command: action.command });
    
    // Close launcher first
    const windows = App.get_windows();
    windows.forEach(win => {
      if (win.name?.startsWith('launcher')) {
        win.hide();
      }
    });

    // Execute system action
    if (action.confirm) {
      // TODO: Show confirmation dialog
      log.debug("Confirmation required for action", { action: action.name });
    }
    
    execAsync(['bash', '-c', action.command]).catch(err => {
      log.error("Failed to execute system action", { error: err });
    });
  };

  return (
    <button
      cssName={selected 
        ? bind(selected).as(s => s ? "launcher-result selected" : "launcher-result")
        : "launcher-result"}
      onClicked={handleActivate}
      focusable={false}
      ref={(button) => {
        if (buttonRef) {
          buttonRef(button);
        }
      }}
      {...rest}
    >
      <box spacing={12} valign={Gtk.Align.CENTER}>
        <icon
          icon={action.icon}
          cssClasses={["launcher-result-icon"]}
        />
        <box vertical valign={Gtk.Align.CENTER}>
          <label
            label={action.name}
            cssClasses={["launcher-result-name"]}
            halign={Gtk.Align.START}
            truncate
            maxWidthChars={40}
          />
          <label
            label={action.description}
            cssClasses={["launcher-result-description"]}
            halign={Gtk.Align.START}
            truncate
            maxWidthChars={50}
          />
        </box>
      </box>
    </button>
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
  }
];