import { Widget, Gdk } from "astal/gtk4";
import { Variable, Binding } from "astal";
import { setupCursorHover } from "../../../utils/buttons";
import { PhosphorIcon } from "../../../utils/icons/phosphor";
import { PhosphorIcons } from "../../../utils/icons/types";
import { theme } from "../../../../utils/color";
import { ContextMenuItem } from "../../../utils/context-menu";
import { setupContextMenuController } from "../../../utils/controllers";
import { execAsync } from "astal/process";


export interface PowerIconButtonProps extends Widget.ButtonProps {
  gdkmonitor: Binding<Gdk.Monitor>;
  monitorIndex: number;
}


export const PowerIconButton = (props: PowerIconButtonProps) => {
  const powerMenuItems: ContextMenuItem[] = [
    {
      label: "Lock Screen",
      icon: PhosphorIcons.LockSimple,
      action: () => execAsync("hyprlock"),
    },
    {
      label: "Sign Out",
      icon: PhosphorIcons.SignOut,
      action: () => execAsync("hyprctl dispatch exit"),
    },
    {
      separator: true,
    },
    {
      label: "Suspend",
      icon: PhosphorIcons.Moon,
      action: () => execAsync("systemctl suspend"),
    },
    {
      label: "Reboot",
      icon: PhosphorIcons.ArrowClockwise,
      action: () => execAsync("systemctl reboot"),
    },
    {
      label: "Shutdown",
      icon: PhosphorIcons.Power,
      action: () => execAsync("systemctl poweroff"),
      danger: true,
    },
  ];

  const isVisible = Variable(false);

  return (
    <button
      cssName="power-button"
      tooltipText="Power Menu"
      onClicked={() => {
        isVisible.set(!isVisible.get());
      }}
      setup={(self) => {
        setupCursorHover(self);

        const offset = { x: 0, y: 0 };

        // Add left-click handler for context menu
        setupContextMenuController(self, 'power-menu', powerMenuItems, props.gdkmonitor, offset, isVisible);

      }}
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
