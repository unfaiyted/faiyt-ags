import { serviceLogger as log } from "../../../utils/logger";

interface ToggleSwitchProps {
  value: boolean;
  onToggled: (value: boolean) => void;
}

export const ToggleSwitch = ({
  value,
  onToggled
}: ToggleSwitchProps) => {
  return (
    <switch
      active={value}
      canFocus={true}
      sensitive={true}
      onStateSet={(self, state) => {
        log.debug(`Toggle switch state changed: ${state}`);
        onToggled(state);
        return false; // Return false to allow default behavior
      }}
    />
  );
};