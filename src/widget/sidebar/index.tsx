import { Widget, App, Astal, Gtk, Gdk } from "astal/gtk4";
import { ScreenSide } from "./types";
import { Variable, bind } from "astal";


export interface SideBarProps extends Widget.WindowProps {
  screenSide: ScreenSide;
  monitorIndex?: number;
  child?: Widget.BoxProps["child"];
}

export default function SideBar(sideBarProps: SideBarProps) {
  const { setup, child, screenSide, monitorIndex, ...props } = sideBarProps;

  print(`SideBar - screenSide: ${screenSide}, monitorIndex: ${monitorIndex}, gdkmonitor: ${props.gdkmonitor}`);

  const keymode: Astal.Keymode = Astal.Keymode.ON_DEMAND;
  const revealSidebar = Variable(false);

  const monitorSuffix = monitorIndex !== undefined ? `-${monitorIndex}` : '';
  const name: string = `sidebar-${screenSide}${monitorSuffix}`;
  const layer: Astal.Layer = Astal.Layer.TOP;

  // Determine sidebar alignment based on screen side
  let sidebarHalign: Gtk.Align = Gtk.Align.START;
  let sidebarValign: Gtk.Align = Gtk.Align.FILL;

  switch (screenSide) {
    case ScreenSide.LEFT:
      sidebarHalign = Gtk.Align.START;
      break;
    case ScreenSide.RIGHT:
      sidebarHalign = Gtk.Align.END;
      break;
    case ScreenSide.TOP:
      sidebarValign = Gtk.Align.START;
      sidebarHalign = Gtk.Align.FILL;
      break;
    case ScreenSide.BOTTOM:
      sidebarValign = Gtk.Align.END;
      sidebarHalign = Gtk.Align.FILL;
      break;
  }

  // Close the sidebar window
  const closeSidebar = () => {
    revealSidebar.set(false);
    // Wait for animation to complete before hiding window
    setTimeout(() => {
      const window = App.get_window(name);
      if (window) {
        print(`Sidebar ${name}: closing`);
        window.hide();
      }
    }, 350);
  };

  print("Registering sidebar with name", name);

  return (
    <window
      {...props}
      name={name}
      gdkmonitor={props.gdkmonitor}
      layer={layer}
      anchor={
        Astal.WindowAnchor.TOP |
        Astal.WindowAnchor.BOTTOM |
        Astal.WindowAnchor.LEFT |
        Astal.WindowAnchor.RIGHT
      }
      visible={false}
      keymode={keymode}
      cssName="sidebar-fullscreen"
      decorated={false}
      exclusivity={Astal.Exclusivity.NORMAL}
      application={App}
      setup={(self: Gtk.Window) => {
        print(`Sidebar window created: ${name}`);

        // When window is shown, trigger the slide animation
        self.connect("show", () => {
          print(`Sidebar ${name}: Window shown, triggering slide animation`);
          setTimeout(() => {
            revealSidebar.set(true);
          }, 40);
        });

        // Reset the reveal state when window is hidden
        self.connect("hide", () => {
          revealSidebar.set(false);
        });
      }}
      onKeyPressed={(self: Gtk.Window, keyval: number) => {
        if (keyval === Gdk.KEY_Escape) {
          closeSidebar();
          return true;
        }
        return false;
      }}
    >
      <box
        hexpand
        vexpand
        cssName="sidebar-click-area"
        setup={(self: Gtk.Box) => {
          print(`Sidebar ${name}: Setting up click detection for ${screenSide}`);
          // Add click gesture to detect clicks outside sidebar
          const clickGesture = new Gtk.GestureClick();
          clickGesture.connect("pressed", (gesture, n_press, x, y) => {
            print(`Sidebar ${name}: Click at ${x}, ${y}`);

            // Navigate to the actual sidebar box inside the structure:
            // self (click-area box) -> sidebar-container -> revealer -> sidebar box
            const container = self.get_first_child();
            if (container) {
              // Find the revealer child
              let revealer = null;
              let sidebar = null;

              // Iterate through children to find the revealer
              const children = [];
              let child = container.get_first_child();
              while (child) {
                if (child instanceof Gtk.Revealer) {
                  revealer = child;
                  sidebar = revealer.get_child();
                  break;
                }
                child = child.get_next_sibling();
              }

              if (sidebar) {
                const allocation = sidebar.get_allocation();
                print(`Sidebar ${name}: Sidebar allocation - x: ${allocation.x}, y: ${allocation.y}, width: ${allocation.width}, height: ${allocation.height}`);
                print(`Sidebar ${name}: Container size - width: ${self.get_width()}, height: ${self.get_height()}`);

                // Convert click coordinates to sidebar-relative coordinates
                const [success, sidebarX, sidebarY] = sidebar.translate_coordinates(self, 0, 0);
                if (success) {
                  print(`Sidebar ${name}: Sidebar position relative to click area: ${sidebarX}, ${sidebarY}`);

                  // Check if click is within sidebar bounds
                  const isInside = x >= sidebarX && x <= sidebarX + allocation.width &&
                    y >= sidebarY && y <= sidebarY + allocation.height;

                  if (!isInside) {
                    print(`Sidebar ${name}: Click is outside sidebar`);
                    closeSidebar();
                  } else {
                    print(`Sidebar ${name}: Click is inside sidebar`);
                  }
                }
              } else {
                print(`Sidebar ${name}: Could not find sidebar widget`);
              }
            }
          });
          self.add_controller(clickGesture);
        }}
      >
        <box
          cssName="sidebar-container"
          hexpand
          vexpand
          vertical={screenSide === ScreenSide.TOP || screenSide === ScreenSide.BOTTOM}
        >
          {screenSide === ScreenSide.RIGHT && <box hexpand />}
          {screenSide === ScreenSide.BOTTOM && <box vexpand />}

          <revealer
            revealChild={bind(revealSidebar)}
            transitionDuration={300}
            transitionType={
              screenSide === ScreenSide.LEFT ? Gtk.RevealerTransitionType.SLIDE_RIGHT :
                screenSide === ScreenSide.RIGHT ? Gtk.RevealerTransitionType.SLIDE_LEFT :
                  screenSide === ScreenSide.TOP ? Gtk.RevealerTransitionType.SLIDE_DOWN :
                    Gtk.RevealerTransitionType.SLIDE_UP
            }
          >
            <box
              cssName="sidebar"
              hexpand={false}
              vexpand={screenSide === ScreenSide.LEFT || screenSide === ScreenSide.RIGHT}
            >
              {child}
            </box>
          </revealer>

          {screenSide === ScreenSide.LEFT && <box hexpand />}
          {screenSide === ScreenSide.TOP && <box vexpand />}
        </box>
      </box>
    </window>
  );
}
