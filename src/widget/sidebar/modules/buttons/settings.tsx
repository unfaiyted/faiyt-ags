import { Widget, Gtk } from "astal/gtk4";
import { actions } from "../../../../utils/actions";
import { setupCursorHover } from "../../../utils/buttons";

// TODO: Add settings icon
export const SettingsIconButton = (props: Widget.ButtonProps) => {
  return (
    <button
      cssName="txt-small sidebar-iconbutton"
      tooltipText="Open Settings"
      onClicked={() => actions.app.settings()}
      setup={setupCursorHover}
    >
      {/* <MaterialIcon icon="settings" size="normal" /> */}
    </button>
  );
};
