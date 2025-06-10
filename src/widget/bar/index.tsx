import Gtk from "gi://Gtk?version=4.0";
import Gdk from "gi://Gdk?version=4.0";
// import Battery from "gi://AstalBattery";
import "./bar.scss";
import { Widget, App, Astal } from "astal/gtk4";
import { Variable, Binding, bind } from "astal";
import config from "../../utils/config";
import { shellMode } from "./utils";
import { BarMode } from "./types";
import BarModeContent from "./modes";
import { barLogger as log } from "../../utils/logger";


// Main top bar
export interface BarProps extends Widget.WindowProps {
  mode: BarMode;
  gdkmonitor: Gdk.Monitor;
  index?: number;
}

export default function Bar(barProps: BarProps) {
  const { gdkmonitor, index } = barProps;
  var barShellMode = new Variable<BarMode>(BarMode.Normal);

  log.debug(`Bar created for monitor ${index}`);

  shellMode.subscribe((shellMode: BarMode) => {
    log.debug(`Shell mode changed for monitor ${index}`, { mode: shellMode.modes[index as number] });
    barShellMode.set(shellMode.modes[index as number]);
  });

  // Handle setup of the bar window
  const setupWindow = (self: Astal.Window) => {
    // Set window properties for proper bar behavior
    // Note: Astal.Window handles most of these properties via attributes in JSX

    // For Astal.Window:
    // - Positioning is handled by the anchor property
    // - Always-on-top behavior is handled by Astal.Window's layer management
    // - Decoration is controlled by the decorated attribute

    // Set a nice dark background color
    if (self.get_style_context) {
      const style = self.get_style_context();
      style.add_class('top-bar');
    }

    // If layer shell fails, position the window manually at the top of the screen
  }

  // Create a bar window
  // First try to use layer shell properties, but they will be ignored if layer shell is not available
  // In that case, we'll fall back to regular GTK window with styling to make it look like a bar
  return (
    <window
      cssName="top-bar"
      name={`bar-${index}`}
      gdkmonitor={gdkmonitor}
      // Layer shell properties
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      visible={true}
      decorated={false}
      resizable={true}
      anchor={
        Astal.WindowAnchor.TOP |
        Astal.WindowAnchor.LEFT |
        Astal.WindowAnchor.RIGHT
      }
      // Regular GTK window properties (will be used if layer shell is not available)
      title="Bar"
      application={App}
      setup={setupWindow}
    >
      <stack
        hhomogeneous={false}
        vhomogeneous={false}
        transitionType={Gtk.StackTransitionType.SLIDE_UP_DOWN}
        transitionDuration={config.animations.durationLarge}
      >
        <BarModeContent
          name="bar-content"
          mode={bind(barShellMode)}
          gdkmonitor={gdkmonitor}
          monitorIndex={index}
        />
      </stack>
    </window>
  );
}
