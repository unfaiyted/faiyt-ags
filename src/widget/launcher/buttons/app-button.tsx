import { Widget, App, Gtk, Gdk } from "astal/gtk4";
import LauncherButton from "./index";
import Apps from "gi://AstalApps";
import { Variable, Binding } from "astal";

export interface AppButtonProps extends Widget.ButtonProps {
  app: Apps.Application;
  index: number;
  selected?: Binding<boolean>;
}

export default function AppButton(props: AppButtonProps) {
  const handleKeyPress = (self: Widget.Button, event: Gdk.Event) => {
    print("eventKey:", event.get_keyval()[1]);
    switch (event.get_keyval()[1]) {
      case Gdk.KEY_Return:
      case Gdk.KEY_KP_Enter:
        props.app.launch();
        break;
      default:
        break;
    }
  };

  return (
    <LauncherButton
      name={props.app.name}
      icon={<image iconName={props.app.iconName || "application-x-executable"} pixelSize={32} />}
      content={props.app.description || props.app.comment || ""}
      selected={props.selected}
      // onKeyPressEvent={handleKeyPress}
      onClicked={() => {
        props.app.launch();
        // Close launcher after launching
        const window = App.get_window("launcher");
        if (window) {
          window.hide();
        }
      }}
      {...props}
    />
  );
}
