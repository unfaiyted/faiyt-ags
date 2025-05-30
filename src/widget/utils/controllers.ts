import { Gtk, Gdk } from "astal/gtk4";
import { createContextMenu, ContextMenuItem } from "./context-menu";

import { Variable, Binding } from "astal";

export const setupContextMenuController = (
  self: Gtk.Widget,
  name: string,
  items: ContextMenuItem[],
  gdkmonitor: Binding<Gdk.Monitor>,
  offset: { x: number; y: number },
  isVisible: Variable<boolean>,
) => {
  // Add left-click handler for context menu
  const clickGesture = new Gtk.GestureClick();
  clickGesture.set_button(1); // Left click

  const menu = createContextMenu(
    name,
    gdkmonitor,
    { x: 0, y: 0 },
    items,
    isVisible,
  );

  clickGesture.connect("pressed", (_gesture, _n_press, x, y) => {
    print("Clicked at", x, y);

    // Get widget's allocation to calculate absolute position
    const allocation = self.get_allocation();
    const native = self.get_native();
    if (!native) return;

    const surface = native.get_surface();
    if (!surface) return;

    // Calculate absolute screen position
    let absoluteX = x - 90 + offset.x;
    let absoluteY = y + allocation.height + 50 + offset.y; // Position below button

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
};
