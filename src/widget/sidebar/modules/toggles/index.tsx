import { Widget, Astal, Gtk } from "astal/gtk4";
import { NetworkToggle } from "./network";
import BluetoothToggle from "./bluetooth";
import IdleInhibitorToggle from "./idle-inhibitor";

export default function QuickToggles(props: Widget.BoxProps) {
  return (
    <box
      cssName="quick-toggles"
      spacing={16}
      homogeneous
      {...props}
    >
      <NetworkToggle />
      <BluetoothToggle />
      <IdleInhibitorToggle />
    </box>
  );
}
