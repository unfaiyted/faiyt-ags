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
  entryRef?: Gtk.Entry;
}

export default function ListPrefixesButton(props: ListPrefixesButtonProps) {
  const handleActivate = () => {
    if (props.entryRef) {
      const entry = props.entryRef;
      if (entry) {
        // Get the first prefix from the comma-separated list
        const firstPrefix = props.prefixInfo.prefix.split(',')[0].trim();
        // Set the entry text to the prefix with a space (prefix already includes colon)
        entry.text = `${firstPrefix} `;
        // Focus the entry and position cursor at the end
        entry.grab_focus();
        entry.set_position(-1);
      }
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
      name={props.prefixInfo.prefix}
      icon={<image iconName="dialog-information-symbolic" pixelSize={32} />}
      content={props.prefixInfo.description}
      selected={props.selected}
      onKeyPressed={handleKeyPress}
      onClicked={handleActivate}
      setup={(self: Gtk.Button) => {
        if (props.ref) {
          props.ref(self);
        }
      }}
      {...props}
    />
  );
}
