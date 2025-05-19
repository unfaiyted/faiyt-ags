import { Widget, App, Astal, Gtk, Gdk } from "astal/gtk4";
import Battery from "gi://AstalBattery";
import { Variable, bind, Binding } from "astal";
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
  var barShellMode = Variable<BarMode>(BarMode.Normal);

  // print("Bar created");

  shellMode.subscribe((shellMode) => {
    // print("COMPONENT: Shell mode changed:", shellMode.modes[index as number]);
    barShellMode.set(shellMode.modes[index as number]);
  });

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
      app={App}
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
