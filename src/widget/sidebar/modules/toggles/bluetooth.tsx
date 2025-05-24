import { Widget } from "astal/gtk4";
import { actions } from "../../../../utils/actions";
import { Variable, bind } from "astal";
import { ToggleIcon } from "./toggle-icon";
import { BluetoothIndicator } from "./indicators";
import Bluetooth from "gi://AstalBluetooth";

export type BluetoothToggleProps = Widget.ButtonProps;

export const BluetoothToggle = (props: BluetoothToggleProps) => {
  const bt = Bluetooth.get_default();
  const isEnabled = Variable(bt.isPowered);
  const tooltipText = Variable("Bluetooth | Right-Click to configure");

  bt.connect("notify", (_bt: Bluetooth.Bluetooth) => {
    isEnabled.set(_bt.isPowered);
  });

  return (
    <ToggleIcon
      tooltipText={bind(tooltipText)}
      handleClick={actions.bluetooth.toggle}
      handleRightClick={actions.app.bluetooth}
      indicator={BluetoothIndicator}
      active={bind(isEnabled)}
      label="Bluetooth"
    />
  );
};

export default BluetoothToggle;