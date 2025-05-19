import { Widget, Gtk, Gdk, Astal } from "astal/gtk4";
import { Variable, Binding } from "astal";
import { BaseWorkspacesProps } from "./types";
import WorkspaceContent from "./modes";
import { handleHyprResponse } from "../../../../utils/handlers";
import config from "../../../../utils/config";

// import { getScrollDirection } from "../../../../utils";
import { ClickButtonPressed } from "../../../../types";
import Hypr from "gi://AstalHyprland";

export default function Workspaces(workspacesProps: BaseWorkspacesProps) {
  const { mode } = workspacesProps;

  const hypr = Hypr.get_default();

  const handleScroll = (self: Gtk.Box) => {
    // In GTK4, we need to use a scroll controller 
    const scrollController = new Gtk.EventControllerScroll();
    scrollController.set_flags(Gtk.EventControllerScrollFlags.BOTH_AXES);
    self.add_controller(scrollController);
    
    scrollController.connect("scroll", (controller, dx, dy) => {
      // todo: add config option to reverse scroll direction
      if (dy < 0) {
        // scroll up
        hypr.message_async(`dispatch workspace +1`, handleHyprResponse);
      } else if (dy > 0) {
        // scroll down
        hypr.message_async(`dispatch workspace -1`, handleHyprResponse);
      }
      
      // Return true to mark the event as handled
      return true;
    });
  };

  const handleClick = () => {
    // self: Widget.EventBox, event: Astal.ClickEvent
    // 1 = left, 2 = middle, 3 = right
    // print("event.button: " + event.button);

    // if (event.button === ClickButtonPressed.LEFT.valueOf()) {
    // } else if (event.button === ClickButtonPressed.MIDDLE.valueOf()) {
    //   // todo: will need to do after adding osk
    //   // toggleWindowOnAllMonitors('osk'); // on screen keyboard
    // } else if (event.button === ClickButtonPressed.RIGHT.valueOf()) {
    //   // App.toggleWindow('overview');
    // }
  };

  const eventBoxSetup = (self: Gtk.Box) => {
    // setup?.(self);

    let clicked = false;

    // In GTK4, we need to use a gesture controller for motion and click events
    const motionController = new Gtk.EventControllerMotion();
    self.add_controller(motionController);
    
    const clickController = new Gtk.GestureClick();
    self.add_controller(clickController);
    
    // Handle motion events
    motionController.connect("motion", (controller, x, y) => {
      if (!clicked) return;

      const widgetWidth = self.get_allocation().width;
      const wsId = Math.ceil((x * config.workspaces.shown) / widgetWidth);

      hypr.message_async(`dispatch workspace ${wsId}`, handleHyprResponse);
    });

    // Handle click press events
    clickController.connect("pressed", (controller, n_press, x, y) => {
      const button = clickController.get_current_button();
      
      if (button === ClickButtonPressed.LEFT.valueOf()) {
        clicked = true;
      } else if (button === 8) {
        hypr.message_async(
          `dispatch togglespecialworkspace`,
          handleHyprResponse,
        );
      }
    });
    
    // Handle click release events
    clickController.connect("released", () => {
      clicked = false;
    });
  };

  return (
    <box homogeneous={true}>
      <box
        setup={(self) => {
          // Apply both event handlers
          handleScroll(self);
          eventBoxSetup(self);
        }}
      >
        <box homogeneous={true} cssName="bar-group-margin">
          <box
            cssName="bar-group bar-group-standalone bar-group-pad"
            widthRequest={2}
          >
            <WorkspaceContent
              mode={mode}
              shown={config.workspaces.shown}
              initilized={false}
            />
          </box>
        </box>
      </box>
    </box>
  );
}


export * from "./types";
export * from "./modes/normal";
export * from "./modes/focus";
