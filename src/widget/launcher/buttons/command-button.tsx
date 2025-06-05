import { Gtk, Widget, Gdk } from "astal/gtk4";
import { Binding, bind, Variable } from "astal";
import { execAsync } from "astal/process";
import { App } from "astal/gtk4";
import { launcherLogger as log } from "../../../utils/logger";
import { c } from "../../../utils/style";
import LauncherButton from "./index";

export interface CommandOption {
  command: string;
  description: string;
  icon?: string;
  terminal?: boolean; // Whether to run in terminal
}

export interface CommandButtonProps extends Widget.ButtonProps {
  option: CommandOption;
  index: number;
  selected?: Binding<boolean>;
  ref?: (button: Gtk.Button) => void;
}

export default function CommandButton(props: CommandButtonProps) {
  const { option, index, ref: buttonRef, ...rest } = props;

  if (!option) {
    log.error("CommandButton: option is undefined");
    return <box />;
  }

  const handleActivate = () => {
    log.debug("Executing command", { command: option.command, terminal: option.terminal });

    // Close launcher first
    const windows = App.get_windows();
    windows.forEach(win => {
      if (win.name?.startsWith('launcher')) {
        win.hide();
      }
    });

    // Execute command
    if (option.terminal) {
      // Try common terminal emulators
      const terminals = ['kitty', 'alacritty', 'gnome-terminal', 'konsole', 'xterm'];
      const terminalCmd = terminals[0]; // TODO: Detect available terminal
      execAsync(['bash', '-c', `${terminalCmd} -e ${option.command}`]).catch(err => {
        log.error("Failed to execute command in terminal", { error: err });
      });
    } else {
      execAsync(['bash', '-c', option.command]).catch(err => {
        log.error("Failed to execute command", { error: err });
      });
    }
  };

  const handleKeyPress = (self: Gtk.Button, keyval: number) => {
    switch (keyval) {
      case Gdk.KEY_Return:
      case Gdk.KEY_KP_Enter:
        handleActivate();
        break;
      default:
        break;
    }
  };



  return (
    <LauncherButton
      {...rest}
      name={`$ ${option.command}`}
      icon={
        <image
          iconName={option.icon || "utilities-terminal-symbolic"}
          pixelSize={32}
        />
      }
      content={option.description}
      selected={props.selected}
      onKeyPressed={handleKeyPress}
      onClicked={handleActivate}
      setup={(self: Gtk.Button) => {
        if (buttonRef) {
          buttonRef(self);
        }
      }}

    />
  );
}
