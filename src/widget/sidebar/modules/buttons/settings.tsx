import { Widget, Gtk } from "astal/gtk4";
import { actions } from "../../../../utils/actions";
import { setupCursorHover } from "../../../utils/buttons";
import { PhosphorIcon } from "../../../utils/icons/phosphor";
import { PhosphorIcons } from "../../../utils/icons/types";

export const SettingsIconButton = (props: Widget.ButtonProps) => {




  return (
    <button
      cssName="header-button"
      tooltipText="Open Settings"
      onClicked={() => actions.window.toggle('settings')}
      valign={Gtk.Align.CENTER}
      halign={Gtk.Align.CENTER}

      setup={setupCursorHover}
      {...props}
    >
      <PhosphorIcon iconName={PhosphorIcons.Gear} size={24} />
    </button>
  );
};
