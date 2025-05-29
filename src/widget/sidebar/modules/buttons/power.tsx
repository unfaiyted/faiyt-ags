import { Widget, Gtk, Gdk } from "astal/gtk4";
import { Variable } from "astal";
import { actions } from "../../../../utils/actions";
import { setupCursorHover } from "../../../utils/buttons";
import { PhosphorIcon } from "../../../utils/icons/phosphor";
import { PhosphorIcons } from "../../../utils/icons/types";
import { theme } from "../../../../utils/color";
import { createContextMenu, ContextMenuItem, handleContextMenu } from "../../../utils/context-menu";
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

        // Add left-click handler for context menu
        const clickGesture = new Gtk.GestureClick();
        clickGesture.set_button(1); // Left click

        const contextName = `power-menu`;
        const menu = createContextMenu(contextName, props.gdkmonitor, { x: 0, y: 0 }, powerMenuItems, isVisible);

        clickGesture.connect("pressed", (_gesture, _n_press, x, y) => {

          // Get widget's allocation to calculate absolute position
          const allocation = self.get_allocation();
          const native = self.get_native();
          if (!native) return;

          const surface = native.get_surface();
          if (!surface) return;

          // Calculate absolute screen position
          let absoluteX = x - 90;
          let absoluteY = y + allocation.height + 50; // Position below button

          // Walk up the widget tree to calculate absolute position
          let currentWidget: Gtk.Widget | null = self;
          while (currentWidget && currentWidget !== native) {
            const alloc = currentWidget.get_allocation();
            absoluteX += alloc.x;
            absoluteY += alloc.y;
            currentWidget = currentWidget.get_parent();
          }

          // Get window position if available
          if (native instanceof Gtk.Window) {
            // In GTK4, use the properties directly
            const marginLeft = native.margin_start || 0;
            const marginTop = native.margin_top || 0;
            absoluteX += marginLeft;
            absoluteY += marginTop;
          }

          if (isVisible.get()) {
            menu.hide();
            isVisible.set(false);
            return;
          }
          const location = { x: absoluteX, y: absoluteY };
          menu.show(location);
          isVisible.set(true);


        });

        self.add_controller(clickGesture);
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
