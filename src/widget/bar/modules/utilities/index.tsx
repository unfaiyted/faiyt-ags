import { Widget, Gtk } from "astal/gtk4";

import UtilitiesButton from "./button";
import { actions } from "../../../../utils/actions";
import BarGroup from "../../utils/bar-group";

export interface UtilitiesModuleProps extends Widget.BoxProps { }

export interface Utility {
  icon: string;
  name: string;
  onClicked: () => void;
}

const utilities: Utility[] = [
  {
    name: "Screen Snip",
    icon: "screenshot_region",
    onClicked: actions.app.screenSnip,
  },
  {
    name: "Color Picker",
    icon: "colorize",
    onClicked: actions.app.colorPicker,
  },
  {
    name: "Toggle on-screen keyboard",
    icon: "keyboard",
    onClicked: () => actions.window.toggle("osk"),
  },
];

export default function UtilitiesModules(props: UtilitiesModuleProps) {
  return (
    <BarGroup>
      <box {...props} halign={Gtk.Align.CENTER} cssName="spacing-h-4">
        {utilities.map((utility) => (
          <UtilitiesButton
            icon={utility.icon}
            name={utility.name}
            onClicked={utility.onClicked}
          />
        ))}
      </box>
    </BarGroup>
  );
}
