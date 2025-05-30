import { Widget, Gtk, Gdk, App, Astal } from "astal/gtk4";
import type GdkPixbuf from "gi://Gdk";
import { Variable, Binding, bind } from "astal";
import PhosphorIcon from "./icons/phosphor";
import { PhosphorIcons } from "./icons/types";
import PopupWindow from "./popup-window";
import actions from "../../utils/actions";
import { c } from "../../utils/style";

export interface ContextMenuItem {
  label?: string;
  icon?: PhosphorIcons;
  action?: () => void;
  danger?: boolean;
  separator?: boolean;
  disabled?: boolean;
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  onClose?: () => void;
  name: string;
  gdkmonitor?: Gdk.Monitor;
}

// Global state for dynamic context menus
const contextMenuState = Variable<{
  items: ContextMenuItem[];
  x: number;
  y: number;
  onClose?: () => void;
}>({
  items: [],
  x: 0,
  y: 0,
});

export default function ContextMenuWindow({ name, gdkmonitor, visible }: { name: string; gdkmonitor?: Binding<Gdk.Monitor>, visible: Variable<boolean> }) {
  const menuItems = Variable<ContextMenuItem[]>([]);
  const x = Variable(300);
  const y = Variable(100);


  // Subscribe to global state changes
  contextMenuState.subscribe((state) => {
    menuItems.set(state.items);
    x.set(state.x);
    y.set(state.y);
  });

  const hide = () => {
    visible.set(false);
  };

  return (
    <window
      cssName="context-menu-window"
      name={name}
      // namespace="context-menu"
      layer={Astal.Layer.OVERLAY}
      exclusivity={Astal.Exclusivity.IGNORE}
      keymode={Astal.Keymode.NONE}
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT}
      margin_top={bind(y)}
      margin_left={bind(x)}
      visible={bind(visible)}
      onHoverLeave={() => {
        hide();
      }}
      gdkmonitor={gdkmonitor}
      setup={(self) => {
        self.connect("destroy", () => { });
      }}
      onKeyPressed={(_, keyval) => {
        if (keyval === Gdk.KEY_Escape) {
          hide();
          return true;
        }
      }}
    >
      <box
        widthRequest={200}
        heightRequest={250}
        onKeyPressed={(_, keyval) => {
          if (keyval === Gdk.KEY_Escape) {
            hide();
            return true;
          }
        }}
      >
        <box cssName="context-menu-overlay" hexpand vexpand>
          <box>
            <box
              cssName="context-menu"
              vertical
              spacing={4}
            >
              {bind(menuItems).as(items =>
                items.map((item, _index) => {
                  if (item.separator) {
                    return (
                      <box
                        cssName="context-menu-separator"
                        heightRequest={1}
                        hexpand
                      />
                    );
                  }

                  return (
                    <button
                      cssName="context-menu-item"
                      cssClasses={c`${item.danger ? "danger" : ""} ${item.disabled ? "disabled" : ""}`}
                      sensitive={!item.disabled}
                      on_clicked={() => {
                        if (!item.disabled && item.action) {
                          hide();
                          item.action();
                        }
                      }}
                    >
                      <box spacing={12}>
                        {item.icon && (
                          <PhosphorIcon
                            iconName={item.icon}
                            size={18}
                            cssName="context-menu-icon"
                          />
                        )}
                        <label
                          label={item.label || ""}
                          cssName="context-menu-label"
                          halign={Gtk.Align.START}
                          hexpand
                        />
                      </box>
                    </button>
                  );
                })
              )}
            </box>
          </box>
        </box>
      </box>
    </window>
  );
}

// Helper function to show context menu
export function showContextMenu(
  name: string,
  items: ContextMenuItem[],
  targetX?: number,
  targetY?: number,
  onClose?: () => void
) {
  let x = targetX || 0;
  let y = targetY || 0;

  // Get monitor geometry to ensure menu stays on screen
  const window = App.get_window(name);
  if (window) {
    const surface = window.get_surface();
    if (surface != null) {
      const monitor = window.get_display()?.get_monitor_at_surface(surface);

      if (monitor) {
        const geometry = monitor.get_geometry();
        const menuWidth = 200; // From widthRequest in the component
        const menuHeight = items.length * 40 + 20; // Approximate height based on items

        // Adjust X position if menu would go off screen
        if (x + menuWidth > geometry.x + geometry.width) {
          x = geometry.x + geometry.width - menuWidth - 10;
        }

        // Adjust Y position if menu would go off screen
        if (y + menuHeight > geometry.y + geometry.height) {
          y = geometry.y + geometry.height - menuHeight - 10;
        }

        // Ensure minimum distance from edges
        x = Math.max(geometry.x + 10, x);
        y = Math.max(geometry.y + 10, y);
      }
    } else {
      print("No surface found for context menu");
      return;
    }
  }

  // Update global state
  contextMenuState.set({
    items,
    x,
    y,
    onClose,
  });

  // Show the window
  if (window) {
    window.show();
  }

}


// Helper function to create and manage a context menu
export function createContextMenu(name: string,
  gdkmonitor: Binding<Gdk.Monitor>,
  location: { x: number, y: number },
  items: ContextMenuItem[],
  visible: Variable<boolean>,
  onClose?: () => void) {
  print("Creating context menu, name:", name);


  ContextMenuWindow({ name, gdkmonitor, visible: visible });

  return {
    show: (location: { x: number, y: number }) => {
      visible.set(true);
      print("Showing context menu");
      showContextMenu(name, items, location.x, location.y, onClose);
    },
    hide: () => {
      print("Hiding context menu");
      visible.set(false);
    },
  };
}

// Helper function to handle right-click events
export function handleContextMenu(
  widget: Gtk.Widget,
  items: ContextMenuItem[] | (() => ContextMenuItem[]),
  onClose?: () => void
) {
  const clickGesture = new Gtk.GestureClick();
  clickGesture.set_button(3); // Right click only
  const visible = Variable(false);

  clickGesture.connect("pressed", (_gesture, _n_press, x, y) => {
    // Get widget's allocation to calculate absolute position
    const allocation = widget.get_allocation();

    // Get the widget's native (top-level window)
    const native = widget.get_native();
    if (!native) return;

    // Get surface position
    const surface = native.get_surface();
    if (!surface) return;

    // Calculate absolute screen position
    let absoluteX = x;
    let absoluteY = y;

    // Walk up the widget tree to calculate absolute position
    let currentWidget: Gtk.Widget | null = widget;
    while (currentWidget && currentWidget !== native) {
      const alloc = currentWidget.get_allocation();
      absoluteX += alloc.x;
      absoluteY += alloc.y;
      currentWidget = currentWidget.get_parent();
    }

    // Get window position if available
    if (native instanceof Gtk.Window) {
      // For layer shell windows, we need to add the margin offsets
      // In GTK4, access properties directly
      const marginLeft = native.margin_start || 0;
      const marginTop = native.margin_top || 0;
      absoluteX += marginLeft;
      absoluteY += marginTop;
    }

    const menuItems = typeof items === "function" ? items() : items;
    const contextName = `context-menu-${Date.now()}`;

    // Get the monitor the widget is on
    const display = widget.get_display();
    const monitor = display?.get_monitor_at_surface(surface);

    if (monitor) {
      const menu = createContextMenu(contextName, monitor, { x: absoluteX, y: absoluteY }, menuItems, visible, onClose);
      menu.show({ x: absoluteX, y: absoluteY });
    }
  });

  widget.add_controller(clickGesture);
}

// Helper function to attach context menu to any widget
export function withContextMenu<T extends Widget.ButtonProps | Widget.BoxProps>(
  props: T,
  items: ContextMenuItem[] | (() => ContextMenuItem[]),
  onClose?: () => void
): T {
  return {
    ...props,
    setup: (self: Gtk.Widget) => {
      // Call original setup if exists
      if (props.setup) {
        props.setup(self);
      }

      // Add context menu handling
      handleContextMenu(self, items, onClose);
    }
  };
}
