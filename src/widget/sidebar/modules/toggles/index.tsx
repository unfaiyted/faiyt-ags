import { Widget, Astal, Gtk } from "astal/gtk4";
import { NetworkToggle } from "./network";
import BluetoothToggle from "./bluetooth";
import IdleInhibitorToggle from "./idle-inhibitor";

export default function QuickToggles(props: Widget.BoxProps) {
  return (
    <box
      halign={Gtk.Align.CENTER}
      cssName="sidebar-togglesbox spacing-h-5"
      {...props}
    >
      <NetworkToggle />
      <BluetoothToggle />
      <IdleInhibitorToggle />
    </box>
  );
}
