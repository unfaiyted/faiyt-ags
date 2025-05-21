import { Widget, Gtk } from "astal/gtk4";
import BarGroup from "../../utils/bar-group";
import { BatteryIcon } from "../../../utils/icons/phosphor-svg";

export interface BatteryModuleProps extends Widget.BoxProps {
  level?: number;
  charging?: boolean;
}

export default function BatteryModule(batteryModuleProps: BatteryModuleProps) {
  const { setup, level = 80, charging = false, ...props } = batteryModuleProps;

  return (
    <BarGroup>
      <box
        {...props}
        setup={(self) => {
          setup?.(self);
        }}
      >
        <BatteryIcon
          level={level}
          charging={charging}
          style="duotone"
          size={24}
          color="#ffffff"
        />
        {level}%
      </box>
    </BarGroup>
  );
}
