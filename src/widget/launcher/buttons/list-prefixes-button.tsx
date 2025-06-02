import { Widget, App, Gtk, Gdk } from "astal/gtk4";
import LauncherButton from "./index";
import actions from "../../../utils/actions";
import { Variable, Binding } from "astal";

export interface PrefixInfo {
  prefix: string;
  description: string;
  type: string;
}

export interface ListPrefixesButtonProps extends Widget.ButtonProps {
  prefixInfo: PrefixInfo;
  index: number;
  selected?: Binding<boolean>;
  ref?: (button: Gtk.Button) => void;
}

export default function ListPrefixesButton(props: ListPrefixesButtonProps) {
  const handleKeyPress = (self: Gtk.Button, keyval: number) => {
    switch (keyval) {
      case Gdk.KEY_Return:
      case Gdk.KEY_KP_Enter:
        // Insert the prefix into the search box
        const window = App.get_window("launcher");
        if (window) {
          // We'll need to access the entry widget from the launcher
          // For now, just close the window
          window.hide();
        }
        break;
      default:
        break;
    }
  };

  return (
    <LauncherButton
      name={props.prefixInfo.prefix}
      icon={<image iconName="dialog-information-symbolic" pixelSize={32} />}
      content={props.prefixInfo.description}
      selected={props.selected}
      onKeyPressed={handleKeyPress}
      onClicked={() => {
        // For now, just close the launcher
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