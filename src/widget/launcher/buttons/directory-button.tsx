import { Widget, App, Gtk, Gdk } from "astal/gtk4";
import LauncherButton from "./index";
import actions from "../../../utils/actions";
import { Binding } from "astal";
import { execAsync } from "astal";
import configManager from "../../../services/config-manager";
import { launcherLogger as log } from "../../../utils/logger";

export interface DirectoryResult {
  path: string;
  name: string;
  isDirectory: boolean;
  score: number; // Fuzzy match score
}

export interface DirectoryButtonProps extends Widget.ButtonProps {
  result: DirectoryResult;
  index: number;
  selected?: Binding<boolean>;
  ref?: (button: Gtk.Button) => void;
}

export default function DirectoryButton(props: DirectoryButtonProps) {
  const { result } = props;
  const icon = result.isDirectory ? "folder" : "text-x-generic";
  
  const handleKeyPress = (self: Gtk.Button, keyval: number) => {
    switch (keyval) {
      case Gdk.KEY_Return:
      case Gdk.KEY_KP_Enter:
        openPath();
        break;
      default:
        break;
    }
  };

  const openPath = () => {
    log.debug("Opening path", { path: result.path });
    
    // Close launcher
    actions.window.toggle("launcher");
    
    // Open the path with the default file manager or editor
    if (result.isDirectory) {
      execAsync([configManager.config.apps.fileManager || "nautilus", result.path]).catch(err => {
        log.error("Failed to open directory", { error: err });
      });
    } else {
      // Open file with default application
      execAsync(["xdg-open", result.path]).catch(err => {
        log.error("Failed to open file", { error: err });
      });
    }
  };

  return (
    <LauncherButton
      name={result.name}
      icon={<image iconName={icon} pixelSize={32} />}
      content={result.path}
      selected={props.selected}
      onKeyPressed={handleKeyPress}
      onClicked={openPath}
      setup={(self: Gtk.Button) => {
        if (props.ref) {
          props.ref(self);
        }
      }}
      {...props}
    />
  );
}