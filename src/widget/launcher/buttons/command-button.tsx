import { Gtk, Widget } from "astal/gtk4";
import { Binding, bind, Variable } from "astal";
import { execAsync } from "astal/process";
import { App } from "astal/gtk4";
import { launcherLogger as log } from "../../../utils/logger";
import { c } from "../../../utils/style";

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


  const selected = props.selected || Variable(false);
  return (
    <button
      cssName="overview-search-result-btn"
      cssClasses={bind(selected).as(s =>
        c`txt ${s ? 'selected' : ''} ${props.cssName || ''}`
      )}
      onClicked={handleActivate}
      focusable={false}
      setup={(self: Gtk.Button) => {
        if (buttonRef) {
          buttonRef(self);
        }
      }}

      {...rest}
    >
      <box spacing={12} valign={Gtk.Align.CENTER}>
        <image
          iconName={option.icon || "utilities-terminal-symbolic"}
          cssClasses={["launcher-result-icon"]}
        />
        <box vertical valign={Gtk.Align.CENTER}>
          <label
            label={`$ ${option.command}`}
            cssName="overview-search-results-txt"
            halign={Gtk.Align.START}
            maxWidthChars={40}
          />
          <label
            label={option.description}
            cssName="overview-search-results-txt"
            halign={Gtk.Align.START}
            maxWidthChars={50}
          />
        </box>
      </box>
    </button>
  );
}
