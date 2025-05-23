import { Widget, Gtk } from "astal/gtk3";
import MaterialIcon from "../../../utils/icons/material";
import { actions } from "../../../../utils/actions";
import { setupCursorHover } from "../../../utils/buttons";

// TODO: Add settings icon
export const SettingsIconButton = (props: Widget.ButtonProps) => {
  return (
    <button
      cssName="txt-small sidebar-iconbutton"
      tooltipText="Open Settings"
      onClick={() => actions.app.settings()}
      setup={setupCursorHover}
    >
      {/* <MaterialIcon icon="settings" size="normal" /> */}
    </button>
  );
};
