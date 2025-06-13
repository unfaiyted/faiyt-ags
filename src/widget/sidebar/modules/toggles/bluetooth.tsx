import { Widget } from "astal/gtk4";
import { actions } from "../../../../utils/actions";
import { Variable, bind } from "astal";
import { ToggleIcon } from "./toggle-icon";
import { BluetoothIndicator } from "./indicators";

export type BluetoothToggleProps = Widget.ButtonProps;

export const BluetoothToggle = (props: BluetoothToggleProps) => {
  const tooltipText = Variable("Bluetooth | Right-Click to configure");


  const handleClick = () => {
    actions.bluetooth.toggle();
  };

  return (
    <ToggleIcon
      tooltipText={bind(tooltipText)}
      handleClick={handleClick}
      handleRightClick={actions.app.bluetooth}
      indicator={BluetoothIndicator}
      active={bind(actions.bluetooth.getBluetoothEnabled())}
      label="Bluetooth"
    />
  );
};

export default BluetoothToggle;
