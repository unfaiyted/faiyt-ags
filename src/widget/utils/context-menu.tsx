import { Widget, Gtk, Gdk, App, Astal } from "astal/gtk4";
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

export default function ContextMenuWindow({ name, gdkmonitor, visible }: { name: string; gdkmonitor?: Gdk.Monitor, visible: Variable<boolean> }) {
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
    const window = App.get_window(name);
    if (window) {
      window.hide();
    }

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
      gdkmonitor={gdkmonitor}
      setup={(self) => {
        self.connect("destroy", () => {
          // isVisible.set(false);
        });
        // isVisible.set(false);
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
        heightRequest={300}
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

  // Update global state
  contextMenuState.set({
    items,
    x,
    y,
    onClose,
  });

  // Show the window
  const window = App.get_window(name);
  if (window) {
    window.show();
  }

}

// Helper function to create and manage a context menu
export function createContextMenu(name: string,
  gdkmonitor: Gdk.Monitor,
  location: { x: number, y: number }, items: ContextMenuItem[], onClose?: () => void) {
  print("Creating context menu, name:", name);
  const visible = Variable(false);

  ContextMenuWindow({ name, gdkmonitor, visible: visible });
  return {
    show: () => {
      visible.set(true);

      print("Showing context menu");
      showContextMenu(name, items, location.x, location.y, onClose);
    },
    hide: () => {
      print("Hiding context menu");
      visible.set(false);

      const window = App.get_window(name);
      if (window) {
        window.hide();
      }
    },
  };
}

// Helper function to handle right-click events
export function handleContextMenu(
  widget: Gtk.Widget,
  items: ContextMenuItem[] | (() => ContextMenuItem[]),
  onClose?: () => void
) {

  // For widgets that support onButtonPressEvent
  // if ('onButtonPressEvent' in widget) {
  //   widget.onButtonPressEvent = () => {
  //     if (event.get_button()[1] === 3) { // Right click
  //       const menuItems = typeof items === "function" ? items() : items;
  //       showContextMenu(menuItems, event, undefined, undefined, onClose);
  //       return true;
  //     }
  //     return false;
  //   };
  // }
}
