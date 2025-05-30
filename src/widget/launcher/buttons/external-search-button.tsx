import { Widget, App, Gtk, Gdk } from "astal/gtk4";
import LauncherButton from "./index";
import actions from "../../../utils/actions";
import { Binding } from "astal";
import { execAsync } from "astal";
import configManager from "../../../services/config-manager";

export interface ExternalSearchButtonProps extends Widget.ButtonProps {
  providerName: string;
  query: string;
  url: string;
  icon: string;
  index: number;
  selected?: Binding<boolean>;
  ref?: (button: Gtk.Button) => void;
}

export default function ExternalSearchButton(props: ExternalSearchButtonProps) {
  const iconName = props.icon;
  const handleKeyPress = (self: Gtk.Button, keyval: number) => {
    switch (keyval) {
      case Gdk.KEY_Return:
      case Gdk.KEY_KP_Enter:
        const searchUrl = props.url.replace("%s", encodeURIComponent(props.query));
        execAsync([configManager.config.apps.browser, searchUrl]);
        // Close launcher after opening browser
        actions.window.toggle("launcher");
        break;
      default:
        break;
    }
  };

  return (
    <LauncherButton
      {...props}
      name={`Search "${props.query}" on ${props.providerName}`}
      icon={<image iconName={iconName} pixelSize={32} />}
      content={`Open in ${configManager.config.apps.browser}`}
      selected={props.selected}
      onKeyPressed={handleKeyPress}
      onClicked={() => {
        const searchUrl = props.url.replace("%s", encodeURIComponent(props.query));
        execAsync([configManager.config.apps.browser, searchUrl]);
        // Close launcher after opening browser
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

    />
  );
}
