import { Widget, Gtk } from "astal/gtk4";

import UtilitiesButton from "./utilities-button";
import RecordingButton from "./recording-button";
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
    icon: PhosphorIcons.Scissors,
    onClicked: actions.app.screenSnip,
  },
  {
    name: "Color Picker",
    icon: PhosphorIcons.Eyedropper,
    onClicked: actions.app.colorPicker,
  },
  // {
  //   name: "Toggle on-screen keyboard",
  //   icon: PhosphorIcons.Keyboard,
  //   onClicked: () => actions.window.toggle("osk"),
  // },
];

export default function UtilitiesModules(props: UtilitiesModuleProps) {
  return (
    <BarGroup>
      <box {...props} halign={Gtk.Align.CENTER} cssName="spacing-h-4">
        <RecordingButton />
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
