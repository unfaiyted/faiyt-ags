import { Widget, Gtk } from "astal/gtk4";
import { Variable } from "astal";
import { actions } from "../../../../utils/actions";
import { setupCursorHover } from "../../../utils/buttons";
import { PhosphorIcon } from "../../../utils/icons/phosphor";
import { PhosphorIcons } from "../../../utils/icons/types";
import { theme } from "../../../../utils/color";
import { createContextMenu, ContextMenuItem } from "../../../utils/context-menu";
import { execAsync } from "astal/process";


export interface PowerIconButtonProps extends Widget.ButtonProps {
  gdkmonitor: Gdk.Monitor;
  monitorIndex: number;
}


export const PowerIconButton = (props: PowerIconButtonProps) => {
  const powerMenuItems: ContextMenuItem[] = [
    {
      label: "Lock Screen",
      icon: "lock-simple",
      action: () => execAsync("hyprlock"),
    },
    {
      label: "Sign Out",
      icon: "sign-out",
      action: () => execAsync("hyprctl dispatch exit"),
    },
    {
      separator: true,
    },
    {
      label: "Suspend",
      icon: "moon",
      action: () => execAsync("systemctl suspend"),
    },
    {
      label: "Reboot",
      icon: "arrow-clockwise",
      action: () => execAsync("systemctl reboot"),
    },
    {
      label: "Shutdown",
      icon: "power",
      action: () => execAsync("systemctl poweroff"),
      danger: true,
    },
  ];
  const name = "power-button-window";
  // TODO: calculate these based on the screen size
  const location = { x: 1200, y: 100 };
  const isVisible = Variable(false);


  const menu = createContextMenu(name, props.gdkmonitor, location, powerMenuItems);

  isVisible.subscribe((v) => {
    if (v) {
      menu.show();
    } else {
      menu.hide();
    }
  });

  return (
    <button
      cssName="power-button"
      tooltipText="Power Menu"
      onClicked={() => (isVisible.set(!isVisible.get()))}
      setup={setupCursorHover}
      {...props}
    >
      <PhosphorIcon
        iconName={PhosphorIcons.Power}
        color={theme.accent}
        size={24}
      />
    </button>
  );
};
