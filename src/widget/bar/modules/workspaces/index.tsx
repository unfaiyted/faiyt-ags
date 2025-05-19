
import { Gdk, Gtk } from "astal/gtk4";
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

  const handleScroll = () => {
    // self: Widget.Box, event: Astal.ScrollEvent
    // const scrollDirection = getScrollDirection(event);
    //
    // // todo: add config option to reverse scroll direction
    // if (scrollDirection === Gdk.ScrollDirection.UP) {
    //   // print("scroll up");
    //   hypr.message_async(`dispatch workspace +1`, handleHyprResponse);
    // } else if (scrollDirection === Gdk.ScrollDirection.DOWN) {
    //   // print("scroll down");
    //   hypr.message_async(`dispatch workspace -1`, handleHyprResponse);
    // }
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

    // self.add_events(Gdk.EventMask.POINTER_MOTION_MASK);

    self.connect("motion-notify-event", (self, event: Gdk.MotionEvent) => {
      if (!clicked) return;

      let [_, axes] = event.get_axes();

      const widgetWidth = self.get_allocation().width;
      const wsId = Math.ceil((axes[0] * config.workspaces.shown) / widgetWidth);

      hypr.message_async(`dispatch workspace ${wsId}`, handleHyprResponse);
      // Utils.execAsync([
      // `${App.configDir}/scripts/hyprland/workspace_action.sh`,
      // "workspace",
      // `${wsId}`,
      // ]).catch(print);
    });

    self.connect("button-press-event", (_self, event: Gdk.ButtonEvent) => {

      const button = event.get_button();


      if (button === ClickButtonPressed.LEFT.valueOf()) {
        clicked = true;

        // const widgetWidth = self.get_allocation().width;
        // const wsId = Math.ceil(
        // (event.x * config.workspaces.shown) / widgetWidth,
        // );
        //   Utils.execAsync([
        //     `${App.configDir}/scripts/hyprland/workspace_action.sh`,
        //     "workspace",
        //     `${wsId}`,
        //   ]).catch(print);
      } else if (button === 8) {
        hypr.message_async(
          `dispatch togglespecialworkspace`,
          handleHyprResponse,
        );
      }
    });
    self.connect("button-release-event", () => (clicked = false));
  };

  return (
    <box homogeneous={true}>
      <box
        onScroll={handleScroll}
        onClick={handleClick}
        setup={eventBoxSetup}
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
