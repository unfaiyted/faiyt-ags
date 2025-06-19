import { Widget, Gtk, Gdk } from "astal/gtk4";
import { setupCursorHover } from "../../../utils/buttons";
import { PhosphorIcon } from "../../../utils/icons/phosphor";
import "./utililies-button.scss";
import { ThemeColor } from "../../../../styles/themes";
import { PhosphorIcons, PhosphorIconStyle } from "../../../utils/icons/types";

export interface UtilitiesButtonProps extends Widget.ButtonProps {
  icon: PhosphorIcons;
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
      marginStart={8}
      marginEnd={8}
    >
      <PhosphorIcon
        iconName={icon}
        style={PhosphorIconStyle.Duotone}
        size={18}
        color={ThemeColor.Foreground}
      />
    </button>
  );
}

export { UtilitiesButton };
