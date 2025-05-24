import { Widget } from "astal/gtk4";
import { actions } from "../../../../utils/actions";
import { Variable, bind } from "astal";
import { ToggleIcon } from "./toggle-icon";
import { PhosphorIcon, } from "../../../utils/icons/phosphor";
import { PhosphorIcons } from "../../../utils/icons/types";

export type IdleInhibitorProps = Widget.ButtonProps;

export const IdleInhibitorToggle = (props: IdleInhibitorProps) => {

  const isEnabled = Variable(false);
  const tooltipText = Variable("Idle Inhibitor | Not working probably");

  return (
    <ToggleIcon
      tooltipText={bind(tooltipText)}
      handleClick={() => {
        isEnabled.set(!isEnabled.get());
        // self.toggleClassName("sidebar-button-active", isEnabled.get());

        if (isEnabled.get()) {
          actions.system.idleInhibitor.start();
        } else {
          actions.system.idleInhibitor.stop();
        }
      }}
      handleRightClick={actions.app.settings}
      indicator={() => <PhosphorIcon iconName={PhosphorIcons.Coffee} size={20} cssName="indicator-icon" />}
      active={bind(isEnabled)}
      label="Caffeine"
    />
  );
};

export default IdleInhibitorToggle;
