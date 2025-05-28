import { Widget, App, Gtk, Gdk } from "astal/gtk4";
import LauncherButton from "./index";
import actions from "../../../utils/actions";
import Apps from "gi://AstalApps";
import { Variable, Binding } from "astal";

export interface AppButtonProps extends Widget.ButtonProps {
  app: Apps.Application;
  index: number;
  selected?: Binding<boolean>;
  ref?: (button: Gtk.Button) => void;
}

export default function AppButton(props: AppButtonProps) {
  const handleKeyPress = (self: Gtk.Button, keyval: number) => {
    switch (keyval) {
      case Gdk.KEY_Return:
      case Gdk.KEY_KP_Enter:
        props.app.launch();
        // Close launcher after launching
        actions.window.toggle("launcher");
        break;
      default:
        break;
    }
  };

  return (
    <LauncherButton
      name={props.app.name}
      icon={<image iconName={props.app.iconName || "application-x-executable"} pixelSize={32} />}
      content={props.app.description || ""}
      selected={props.selected}
      onKeyPressed={handleKeyPress}
      onClicked={() => {
        props.app.launch();
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
