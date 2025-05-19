import Astal from "gi://Astal";
// import Battery from "gi://AstalBattery";
import Gtk from "gi://Gtk?version=4.0";
import Gdk from "gi://Gdk?version=4.0";
import { Widget, App, } from "astal/gtk4";
import { Variable, Binding, bind } from "astal";
import config from "../../utils/config";
import { shellMode } from "./utils";
import { BarMode } from "./types";
import BarModeContent from "./modes";


// Main top bar
export interface BarProps extends Widget.WindowProps {
  mode: BarMode;
  gdkmonitor: Gdk.Monitor;
  index?: number;
}

export default function Bar(barProps: BarProps) {
  const { gdkmonitor, index } = barProps;
  var barShellMode = new Variable<BarMode>(BarMode.Normal);

  // print("Bar created");

  shellMode.subscribe((shellMode: BarMode) => {
    // print("COMPONENT: Shell mode changed:", shellMode.modes[index as number]);
    barShellMode.set(shellMode.modes[index as number]);
  });

  // Handle setup of the bar window
  const setupWindow = (self: Gtk.Window) => {
    // Set window properties for proper bar behavior
    self.set_resizable(true);
    self.set_decorated(false);
    self.set_default_size(gdkmonitor.get_geometry().width, -1); // Full width, but natural height
    
    // Position window at the top of the screen
    self.move(0, 0);
    
    // Make it always stay on top
    self.set_keep_above(true);
    
    // Set a nice dark background color if not using layer shell
    const style = self.get_style_context();
    style.add_class('top-bar');
    
    // Make sure the window can expand horizontally but only take needed vertical space
    self.set_vexpand(false);
    self.set_hexpand(true);
    
    // Stick to all workspaces
    self.stick();
  };
  
  return (
    <window
      cssName="Bar"
      name={`bar${index}`}
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      visible={true}
      anchor={
        Astal.WindowAnchor.TOP |
        Astal.WindowAnchor.LEFT |
        Astal.WindowAnchor.RIGHT
      }
      application={App}
      setup={setupWindow}
    >
      <stack
        hhomogeneous={false}
        vhomogeneous={false}
        transitionType={Gtk.StackTransitionType.SLIDE_UP_DOWN}
        transitionDuration={config.animations.durationLarge}
      >
        <BarModeContent mode={bind(barShellMode)} />
      </stack>
    </window>
  );
}
