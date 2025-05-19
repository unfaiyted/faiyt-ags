import { NormalModeWorkspacesProps } from "../types";

import { Gtk, Widget } from "astal/gtk4";
import { getFontWeightName } from "../../../../../utils/font";
import { DrawingArea } from "../../../../utils/containers/drawing-area";
import PangoCairo from "gi://PangoCairo";
import Pango from "gi://Pango";
// import Cairo from "gi://cairo";
import cairo from "cairo";
import config from "../../../../../utils/config";
import { mix } from "../../../../../utils/color";
import { RgbaColor } from "../../../types";

const dummyWs = Widget.Box({ cssName: "bar-ws" }); // Not shown. Only for getting size props
const dummyActiveWs = Widget.Box({ cssName: "bar-ws bar-ws-active" }); // Not shown. Only for getting size props
const dummyOccupiedWs = Widget.Box({ cssName: "bar-ws bar-ws-occupied" }); // Not shown. Only for getting size props

export default function NormalModeWorkspaces(
  normalModeProps: NormalModeWorkspacesProps,
) {
  const { shown, workspace, } = normalModeProps;

  let workspaceMask = 0;
  // let workspaceGroup = 0;

  const contentSetup = (self: Gtk.DrawingArea) => {
    // setup?.(self);

    // self
    //   .hook(workspace, (self) => {
    //     self.set_css(`font-size: ${((workspace.get().id - 1) % shown) + 1}px;`);
    //     const previousGroup = workspaceGroup;
    //     const currentGroup = Math.floor((workspace.get().id - 1) / shown);
    //     if (currentGroup !== previousGroup) {
    //       props.updateMask(self);
    //       workspaceGroup = currentGroup;
    //     }
    // })
    // .hook(
    //   Hyprland,
    //   (self) => self.attribute.updateMask(self),
    //   "notify::workspaces",
    // )
    self.connect("draw", (area: Gtk.DrawingArea, cr: cairo.Context) => {
      // print("Drawing workspaces");
      const offset =
        Math.floor((workspace.get().id - 1) / shown) *
        config.workspaces.shown;

      const allocation = area.get_allocation();
      const { height } = allocation;

      const workspaceStyleContext = dummyWs.get_style_context();

      const workspaceDiameter = parseFloat(
        workspaceStyleContext.get_property(
          "min-width",
          Gtk.StateFlags.NORMAL,
        ) as string,
      );

      const workspaceRadius = workspaceDiameter / 2;

      const workspaceFontSize =
        (parseFloat(
          workspaceStyleContext.get_property(
            "font-size",
            Gtk.StateFlags.NORMAL,
          ) as string,
        ) /
          4) *
        3;

      const workspaceFontFamily = workspaceStyleContext.get_property(
        "font-family",
        Gtk.StateFlags.NORMAL,
      ) as [string];

      const workspaceFontWeight = workspaceStyleContext.get_property(
        "font-weight",
        Gtk.StateFlags.NORMAL,
      ) as Pango.Weight;

      // const wsbg = workspaceStyleContext.get_property(
      //   "background-color",
      //   Gtk.StateFlags.NORMAL,
      // );
      const wsfg = workspaceStyleContext.get_property(
        "color",
        Gtk.StateFlags.NORMAL,
      ) as RgbaColor;

      const occupiedWorkspaceStyleContext =
        dummyOccupiedWs.get_style_context();
      const occupiedbg = occupiedWorkspaceStyleContext.get_property(
        "background-color",
        Gtk.StateFlags.NORMAL,
      ) as RgbaColor;

      const occupiedfg = occupiedWorkspaceStyleContext.get_property(
        "color",
        Gtk.StateFlags.NORMAL,
      ) as RgbaColor;

      const activeWorkspaceStyleContext = dummyActiveWs.get_style_context();
      const activebg = activeWorkspaceStyleContext.get_property(
        "background-color",
        Gtk.StateFlags.NORMAL,
      ) as RgbaColor;

      const activefg = activeWorkspaceStyleContext.get_property(
        "color",
        Gtk.StateFlags.NORMAL,
      ) as RgbaColor;

      area.set_size_request(workspaceDiameter * shown, -1);
      const widgetStyleContext = area.get_style_context();
      const activeWs = parseFloat(
        widgetStyleContext.get_property(
          "font-size",
          Gtk.StateFlags.NORMAL,
        ) as string,
      );

      const activeWsCenterX =
        -(workspaceDiameter / 2) + workspaceDiameter * activeWs;
      const activeWsCenterY = height / 2;

      // Font
      const layout = PangoCairo.create_layout(cr);
      const fontDesc = Pango.font_description_from_string(
        `${workspaceFontFamily[0]} ${getFontWeightName(workspaceFontWeight)} ${workspaceFontSize}`,
      );
      layout.set_font_description(fontDesc);
      cr.setAntialias(cairo.Antialias.BEST);
      // Get kinda min radius for number indicators
      layout.set_text("0".repeat(shown.toString().length), -1);
      const [layoutWidth, layoutHeight] = layout.get_pixel_size();
      const indicatorRadius =
        (Math.max(layoutWidth, layoutHeight) / 2) * 1.15; // smaller than sqrt(2)*radius
      const indicatorGap = workspaceRadius - indicatorRadius;

      for (let i = 1; i <= shown; i++) {
        if (workspaceMask & (1 << i)) {
          // Draw bg highlight
          cr.setSourceRGBA(
            occupiedbg.red,
            occupiedbg.green,
            occupiedbg.blue,
            occupiedbg.alpha,
          );
          const wsCenterX = -workspaceRadius + workspaceDiameter * i;
          const wsCenterY = height / 2;
          if (!(workspaceMask & (1 << (i - 1)))) {
            // Left
            cr.arc(
              wsCenterX,
              wsCenterY,
              workspaceRadius,
              0.5 * Math.PI,
              1.5 * Math.PI,
            );
            cr.fill();
          } else {
            cr.rectangle(
              wsCenterX - workspaceRadius,
              wsCenterY - workspaceRadius,
              workspaceRadius,
              workspaceRadius * 2,
            );
            cr.fill();
          }
          if (!(workspaceMask & (1 << (i + 1)))) {
            // Right
            cr.arc(
              wsCenterX,
              wsCenterY,
              workspaceRadius,
              -0.5 * Math.PI,
              0.5 * Math.PI,
            );
            cr.fill();
          } else {
            cr.rectangle(
              wsCenterX,
              wsCenterY - workspaceRadius,
              workspaceRadius,
              workspaceRadius * 2,
            );
            cr.fill();
          }
        }
      }

      // Draw active ws
      cr.setSourceRGBA(
        activebg.red,
        activebg.green,
        activebg.blue,
        activebg.alpha,
      );

      cr.arc(
        activeWsCenterX,
        activeWsCenterY,
        indicatorRadius,
        0,
        2 * Math.PI,
      );
      cr.fill();

      // Draw workspace numbers
      for (let i = 1; i <= shown; i++) {
        const inactivecolors = workspaceMask & (1 << i) ? occupiedfg : wsfg;
        if (i == activeWs) {
          cr.setSourceRGBA(
            activefg.red,
            activefg.green,
            activefg.blue,
            activefg.alpha,
          );
        }
        // Moving to
        else if (
          (i == Math.floor(activeWs) && workspace.get().id < activeWs) ||
          (i == Math.ceil(activeWs) && workspace.get().id > activeWs)
        ) {
          cr.setSourceRGBA(
            mix(activefg.red, inactivecolors.red, 1 - Math.abs(activeWs - i)),
            mix(
              activefg.green,
              inactivecolors.green,
              1 - Math.abs(activeWs - i),
            ),
            mix(
              activefg.blue,
              inactivecolors.blue,
              1 - Math.abs(activeWs - i),
            ),
            activefg.alpha,
          );
        }
        // Moving from
        else if (
          (i == Math.floor(activeWs) && workspace.get().id > activeWs) ||
          (i == Math.ceil(activeWs) && workspace.get().id < activeWs)
        ) {
          cr.setSourceRGBA(
            mix(activefg.red, inactivecolors.red, 1 - Math.abs(activeWs - i)),
            mix(
              activefg.green,
              inactivecolors.green,
              1 - Math.abs(activeWs - i),
            ),
            mix(
              activefg.blue,
              inactivecolors.blue,
              1 - Math.abs(activeWs - i),
            ),
            activefg.alpha,
          );
        }
        // Inactive
        else
          cr.setSourceRGBA(
            inactivecolors.red,
            inactivecolors.green,
            inactivecolors.blue,
            inactivecolors.alpha,
          );

        layout.set_text(`${i + offset}`, -1);
        const [layoutWidth, layoutHeight] = layout.get_pixel_size();
        const x = -workspaceRadius + workspaceDiameter * i - layoutWidth / 2;
        const y = (height - layoutHeight) / 2;
        cr.moveTo(x, y);
        PangoCairo.show_layout(cr, layout);
        cr.stroke();
      }
    });
  };

  return (
    <DrawingArea
      cssName="bar-ws-container"
      setup={contentSetup}
    ></DrawingArea>



  );
}
