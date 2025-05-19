import { Widget } from "astal/gtk4";
import BarGroup from "../../utils/bar-group";


export interface BatteryModuleProps extends Widget.BoxProps { }

export default function BatteryModule(batteryModuleProps: BatteryModuleProps) {
  const { setup, child, ...props } = batteryModuleProps;

  return (
    <BarGroup>
      <box
        {...props}
        setup={(self) => {
          setup?.(self);
        }}
      >
        BATTERY!
      </box>
    </BarGroup>
  );
}
