import { FocusModeWorkspacesProps } from "../types";
import { Widget, Gtk } from "astal/gtk4";

// import { getFontWeightName } from "../../../../../utils/font";
import Cairo from "cairo";
import config from "../../../../../utils/config";
// import { mix } from "../../../../../utils/color";
import { RgbaColor } from "../../../types";
import { DrawingArea } from "../../../../utils/containers/drawing-area";

const WS_TAKEN_WIDTH_MULTIPLIER = 1.4;
const floor = Math.floor;
const ceil = Math.ceil;

const dummyWs = Widget.Box({ cssName: "bar-ws-focus" }); // Not shown. Only for getting size props
const dummyActiveWs = Widget.Box({
  cssName: "bar-ws-focus bar-ws-focus-active",
}); // Not shown. Only for getting size props
const dummyOccupiedWs = Widget.Box({
  cssName: "bar-ws-focus bar-ws-focus-occupied",
}); // Not shown. Only for getting size props

export default function FocusModeWorkspaces(
  modeProps: FocusModeWorkspacesProps,
) {
  const { setup, shown, workspace, workspaceMask, workspaceGroup, ...props } =
    modeProps;

  let lastImmediateActiveWs = workspace.get().id;
  let immediateActiveWs = workspace.get().id;

  const contentSetup = (self: Gtk.DrawingArea) => {
    setup?.(self);

    props.updateMask(self);
    
    // Set initial CSS value
    self.set_css(`font-size: ${((workspace.get().id - 1) % shown) + 1}px;`);

    // Subscribe to workspace changes
    workspace.subscribe(() => {
      immediateActiveWs = workspace.get().id;
      self.set_css(`font-size: ${((workspace.get().id - 1) % shown) + 1}px;`);
      
      const previousGroup = workspaceGroup.get();
      const currentGroup = Math.floor((workspace.get().id - 1) / shown);
      if (currentGroup !== previousGroup) {
        props.updateMask(self);
        workspaceGroup.set(currentGroup);
      }
      
      self.queue_draw();
    });

    self
      // .hook(
      //   Hyprland,
      //   (self) => self.attribute.updateMask(self),
      //   "notify::workspaces",
      // )
      .connect("draw", (area: Gtk.DrawingArea, cr: Cairo.Context) => {
        const offset =
          Math.floor((workspace.get().id - 1) / shown) *
          config.workspaces.shown;

        const allocation = area.get_allocation();
        const { width, height } = allocation;

        const workspaceStyleContext = dummyWs.get_style_context();
        const workspaceDiameter = parseFloat(
          workspaceStyleContext.get_property(
            "min-width",
            Gtk.StateFlags.NORMAL,
          ) as string,
        );

        const workspaceRadius = workspaceDiameter / 2;
        const wsbg = workspaceStyleContext.get_property(
          "background-color",
          Gtk.StateFlags.NORMAL,
        ) as RgbaColor;

        const occupiedWorkspaceStyleContext =
          dummyOccupiedWs.get_style_context();
        const occupiedbg = occupiedWorkspaceStyleContext.get_property(
          "background-color",
          Gtk.StateFlags.NORMAL,
        ) as RgbaColor;

        const activeWorkspaceStyleContext = dummyActiveWs.get_style_context();
        const activeWorkspaceWidth = parseFloat(
          activeWorkspaceStyleContext.get_property(
            "min-width",
            Gtk.StateFlags.NORMAL,
          ) as string,
        );
        // const activeWorkspaceWidth = 100;
        const activebg = activeWorkspaceStyleContext.get_property(
          "background-color",
          Gtk.StateFlags.NORMAL,
        ) as RgbaColor;

        const widgetStyleContext = area.get_style_context();
        const activeWs = parseFloat(
          widgetStyleContext.get_property(
            "font-size",
            Gtk.StateFlags.NORMAL,
          ) as string,
        );
        // const lastImmediateActiveWs = lastImmediateActiveWs;
        // const immediateActiveWs = immediateActiveWs;

        // Adjust immediateActiveWs to be relative to the current group
        const relativeActiveWs = ((workspace.get().id - 1) % shown) + 1;

        // Draw
        area.set_size_request(
          workspaceDiameter * WS_TAKEN_WIDTH_MULTIPLIER * (shown - 1) +
          activeWorkspaceWidth,
          -1,
        );
        for (let i = 1; i <= shown; i++) {
          if (i == relativeActiveWs) continue;
          let colors: RgbaColor = { red: 0, green: 0, blue: 0, alpha: 0 };
          if (workspaceMask.get() & (1 << (i - 1))) colors = occupiedbg;
          else colors = wsbg;

          // if ((i == immediateActiveWs + 1 && immediateActiveWs < activeWs) ||
          //     (i == immediateActiveWs + 1 && immediateActiveWs < activeWs)) {
          //     const widthPercentage = (i == immediateActiveWs - 1) ?
          //         1 - (immediateActiveWs - activeWs) :
          //         activeWs - immediateActiveWs;
          //     cr.setSourceRGBA(colors.red * widthPercentage + activebg.red * (1 - widthPercentage),
          //         colors.green * widthPercentage + activebg.green * (1 - widthPercentage),
          //         colors.blue * widthPercentage + activebg.blue * (1 - widthPercentage),
          //         colors.alpha);
          // }
          // else
          cr.setSourceRGBA(colors.red, colors.green, colors.blue, colors.alpha);

          const centerX =
            i <= activeWs
              ? -workspaceRadius +
              workspaceDiameter * WS_TAKEN_WIDTH_MULTIPLIER * i
              : -workspaceRadius +
              workspaceDiameter * WS_TAKEN_WIDTH_MULTIPLIER * (shown - 1) +
              activeWorkspaceWidth -
              (shown - i) * workspaceDiameter * WS_TAKEN_WIDTH_MULTIPLIER;
          cr.arc(centerX, height / 2, workspaceRadius, 0, 2 * Math.PI);
          cr.fill();
          // What if shrinking
          if (i == floor(activeWs) && relativeActiveWs > activeWs) {
            // To right
            const widthPercentage = 1 - (ceil(activeWs) - activeWs);
            const leftX = centerX;
            const wsWidth =
              (activeWorkspaceWidth - workspaceDiameter * 1.5) *
              (1 - widthPercentage);
            cr.rectangle(
              leftX,
              height / 2 - workspaceRadius,
              wsWidth,
              workspaceDiameter,
            );
            cr.fill();
            cr.arc(
              leftX + wsWidth,
              height / 2,
              workspaceRadius,
              0,
              Math.PI * 2,
            );
            cr.fill();
          } else if (i == ceil(activeWs) && relativeActiveWs < activeWs) {
            // To left
            const widthPercentage = activeWs - floor(activeWs);
            const rightX = centerX;
            const wsWidth =
              (activeWorkspaceWidth - workspaceDiameter * 1.5) *
              widthPercentage;
            const leftX = rightX - wsWidth;
            cr.rectangle(
              leftX,
              height / 2 - workspaceRadius,
              wsWidth,
              workspaceDiameter,
            );
            cr.fill();
            cr.arc(leftX, height / 2, workspaceRadius, 0, Math.PI * 2);
            cr.fill();
          }
        }

        let widthPercentage, leftX, rightX, activeWsWidth;
        cr.setSourceRGBA(
          activebg.red,
          activebg.green,
          activebg.blue,
          activebg.alpha,
        );
        if (relativeActiveWs > activeWs) {
          // To right
          const immediateActiveWs = ceil(activeWs);
          widthPercentage = immediateActiveWs - activeWs;
          rightX =
            -workspaceRadius +
            workspaceDiameter * WS_TAKEN_WIDTH_MULTIPLIER * (shown - 1) +
            activeWorkspaceWidth -
            (shown - immediateActiveWs) *
            workspaceDiameter *
            WS_TAKEN_WIDTH_MULTIPLIER;
          activeWsWidth =
            (activeWorkspaceWidth - workspaceDiameter * 1.5) *
            (1 - widthPercentage);
          leftX = rightX - activeWsWidth;

          cr.arc(leftX, height / 2, workspaceRadius, 0, Math.PI * 2); // Should be 0.5 * Math.PI, 1.5 * Math.PI in theory but it leaves a weird 1px gap
          cr.fill();
          cr.rectangle(
            leftX,
            height / 2 - workspaceRadius,
            activeWsWidth,
            workspaceDiameter,
          );
          cr.fill();
          cr.arc(
            leftX + activeWsWidth,
            height / 2,
            workspaceRadius,
            0,
            Math.PI * 2,
          );
          cr.fill();
        } else {
          // To left
          const immediateActiveWs = floor(activeWs);
          widthPercentage = 1 - (activeWs - immediateActiveWs);
          leftX =
            -workspaceRadius +
            workspaceDiameter * WS_TAKEN_WIDTH_MULTIPLIER * immediateActiveWs;
          activeWsWidth =
            (activeWorkspaceWidth - workspaceDiameter * 1.5) * widthPercentage;

          cr.arc(leftX, height / 2, workspaceRadius, 0, Math.PI * 2); // Should be 0.5 * Math.PI, 1.5 * Math.PI in theory but it leaves a weird 1px gap
          cr.fill();
          cr.rectangle(
            leftX,
            height / 2 - workspaceRadius,
            activeWsWidth,
            workspaceDiameter,
          );
          cr.fill();
          cr.arc(
            leftX + activeWsWidth,
            height / 2,
            workspaceRadius,
            0,
            Math.PI * 2,
          );
          cr.fill();
        }
      });
  };

  return (
    <DrawingArea
      {...props}
      cssName="bar-ws-container"
      setup={contentSetup}
    ></DrawingArea>
  );
}
