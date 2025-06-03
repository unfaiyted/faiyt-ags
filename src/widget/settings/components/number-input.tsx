import { Gtk, Widget } from "astal/gtk4";
import { serviceLogger as log } from "../../../utils/logger";

interface NumberInputProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChanged: (value: number) => void;
}

export const NumberInput = ({
  value,
  min,
  max,
  step = 1,
  onChanged
}: NumberInputProps) => {
  const adjustment = new Gtk.Adjustment({
    lower: min,
    upper: max,
    step_increment: step,
    value: value
  });

  const spinButton = new Gtk.SpinButton({
    adjustment: adjustment,
    width_request: 80,
    climb_rate: 1,
    digits: step < 1 ? 2 : 0,
    numeric: true,
    can_focus: true,
    sensitive: true
  });

  spinButton.connect("value-changed", () => {
    const newValue = spinButton.value;
    log.debug(`Number input value changed: ${newValue}`);
    onChanged(newValue);
  });

  return (
    <box 
      setup={(self) => {
        self.append(spinButton);
      }}
    />
  );
};