import { Widget, App, Astal, Gtk, Gdk } from "astal/gtk4";
import SystemTray from "gi://AstalTray";
import { PhosphorIcon } from "../../../utils/icons/phosphor";
import { PhosphorIcons, PhosphorIconStyle } from "../../../utils/icons/types";

export interface TrayItemProps extends Widget.ButtonProps {
  item: SystemTray.TrayItem;
  index?: number;
  array?: SystemTray.TrayItem[];
  key?: string;
}

export default function TrayItem(trayItemProps: TrayItemProps) {
  const { item } = trayItemProps;

  // const trayItem = new Variable(item);

  const handleItemClick = () => {
    // print("TrayItem clicked.");
    // if (event.button == Gdk.BUTTON_PRIMARY) {
    //   // print(`Gdk.BUTTON_PRIMARY: ${Gdk.BUTTON_PRIMARY}`);
    //   // print(`event.button: ${event.button}`);
    //   trayItem.get().activate(event.x, event.y);
    // }
    //
    // if (event.button == Gdk.BUTTON_SECONDARY) trayItem.get().get_menu_model();
  };

  // const markup = trayItem.get().get_tooltip_markup();

  return (
    <button
      cssName="bar-systray-item"
      tooltip-markup={item.tooltip_markup || item.id}
      onClicked={handleItemClick}
    >
      {item?.iconName == "" ? (
        <PhosphorIcon iconName={PhosphorIcons.QuestionMark} style={PhosphorIconStyle.Duotone} size={16} />
      ) : (
        <image
          iconName={item?.iconName == "" ? "missing-symbolic" : item.iconName}
        ></image>
      )}
    </button>
  );
}

export { TrayItem };
