import { Widget, Gtk } from "astal/gtk4";
import { actions } from "../../../../utils/actions";
import { setupCursorHover } from "../../../utils/buttons";

export const PowerIconButton = (props: Widget.ButtonProps) => {
  return (
    <button
      cssName="sidebar-iconbutton"
      tooltipText="Session"
      onClicked={() => actions.window.open("session")}
      setup={setupCursorHover}
    >
      {/* <MaterialIcon icon="power_settings_new" size="normal" /> */}
    </button>
  );
};
