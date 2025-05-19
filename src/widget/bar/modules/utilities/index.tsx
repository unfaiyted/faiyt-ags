import { Widget, Gtk } from "astal/gtk4";
import UtilitiesButton from "./button";
import { actions } from "../../../../utils/actions";
import BarGroup from "../../utils/bar-group";

export interface UtilitiesModuleProps extends Widget.BoxProps { }

export interface Utility {
  icon: string;
  name: string;
  onClick: () => void;
}

const utilities: Utility[] = [
  {
    name: "Screen Snip",
    icon: "screenshot_region",
    onClick: actions.app.screenSnip,
  },
  {
    name: "Color Picker",
    icon: "colorize",
    onClick: actions.app.colorPicker,
  },
  {
    name: "Toggle on-screen keyboard",
    icon: "keyboard",
    onClick: () => actions.window.toggle("osk"),
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
            onClick={utility.onClick}
          />
        ))}
      </box>
    </BarGroup>
  );
}
