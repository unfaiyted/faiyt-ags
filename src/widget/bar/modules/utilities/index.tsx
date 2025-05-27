import { Widget, Gtk } from "astal/gtk4";

import UtilitiesButton from "./utilities-button";
import { actions } from "../../../../utils/actions";
import BarGroup from "../../utils/bar-group";
import { PhosphorIcons } from "../../../utils/icons/types";

export interface UtilitiesModuleProps extends Widget.BoxProps { }

export interface Utility {
  icon: PhosphorIcons;
  name: string;
  onClicked: () => void;
}

const utilities: Utility[] = [
  {
    name: "Screen Snip",
    icon: "scissors",
    onClicked: actions.app.screenSnip,
  },
  {
    name: "Color Picker",
    icon: "eyedropper",
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
