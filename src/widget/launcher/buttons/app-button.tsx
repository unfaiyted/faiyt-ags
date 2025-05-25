import { Widget, Gtk, Gdk } from "astal/gtk4";
import LauncherButton from "./index";
import Apps from "gi://AstalApps";

export interface AppButtonProps extends Widget.ButtonProps {
  app: Apps.Application;
  index: number;
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
      icon={<image iconName={props.app.iconName || "application-x-executable"} pixelSize={24} />}
      content={props.app.name}
      // onKeyPressEvent={handleKeyPress}
      onClicked={() => props.app.launch()}
      {...props}
    />
  );
}
