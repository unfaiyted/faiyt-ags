import { Widget, Gtk } from "astal/gtk4";
import { actions } from "../../../../utils/actions";
import { setupCursorHover } from "../../../utils/buttons";
import { PhosphorIcon } from "../../../utils/icons/phosphor";
import { PhosphorIcons } from "../../../utils/icons/types";

export const ReloadIconButton = (props: Widget.ButtonProps) => {
  return (
    <button
      cssName="header-button"
      tooltipText="Reload Environment config"
      onClicked={actions.system.reload}
      setup={setupCursorHover}
      valign={Gtk.Align.CENTER}
      halign={Gtk.Align.CENTER}
      {...props}
    >
      <PhosphorIcon iconName={PhosphorIcons.ArrowClockwise} size={24} />
    </button>
  );
}
