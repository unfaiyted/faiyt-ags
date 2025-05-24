import { Widget, Gtk } from "astal/gtk4";
import { actions } from "../../../../utils/actions";
import { setupCursorHover } from "../../../utils/buttons";
import { PhosphorIcon } from "../../../utils/icons/phosphor";
import { PhosphorIcons } from "../../../utils/icons/types";

export const PowerIconButton = (props: Widget.ButtonProps) => {
  return (
    <button
      cssName="header-button power-button"
      tooltipText="Power Menu"
      onClicked={() => actions.window.open("session")}
      setup={setupCursorHover}
      {...props}
    >
      <PhosphorIcon iconName={PhosphorIcons.Power} size={24} />
    </button>
  );
};
