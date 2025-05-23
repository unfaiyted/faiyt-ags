import { Widget, Gtk, Gdk } from "astal/gtk4";
import { setupCursorHover } from "../../../utils/buttons";
import { PhosphorSvgIcon } from "../../../utils/icons/phosphor-svg";
import "./utililies-button.scss";
import { theme } from "../../../../utils/color";

export interface UtilitiesButtonProps extends Widget.ButtonProps {
  icon: string;
  cssName?: string;
  name: string;
}

export default function UtilitiesButton(props: UtilitiesButtonProps) {
  const { icon, name, cssName, onClicked, ...rest } = props;
  const cursor = Gdk.Cursor.new_from_name("pointer", null);

  return (
    <button
      {...rest}

      valign={Gtk.Align.CENTER}
      tooltipText={name}
      onClicked={onClicked}
      setup={setupCursorHover}
      cursor={cursor}
      cssName="bar-util-btn"
      marginStart={7}
      marginEnd={7}
    >
      <PhosphorSvgIcon
        iconName={icon}
        style="duotone"
        size={18}
        color={theme.foreground}
      />
    </button>
  );
}

export { UtilitiesButton };
