import { NormalModeWorkspacesProps } from "../types";
import { Widget, Gtk } from "astal/gtk4";

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
    self.set_draw_func((area, cr, width, height) => {
      // print("Drawing workspaces");
      const offset =
        Math.floor((workspace.get().id - 1) / shown) *
        config.workspaces.shown;

      const allocation = area.get_allocation();
      // Use the height from parameters instead of allocation
      const areaHeight = height;

      const workspaceStyleContext = dummyWs.get_style_context();

      // In GTK4, we need to use CSS provider or hardcoded values 
      // since get_property doesn't work the same way for these properties
      const workspaceDiameter = 30; // Default size, adjust as needed
      const workspaceRadius = workspaceDiameter / 2;
      const workspaceFontSize = 11; // Default font size, adjust as needed

      // In GTK4, we can't directly use get_property for font properties
      // Let's use sensible defaults since these style properties 
      // are not accessible the same way in GTK4
      const workspaceFontFamily = ["Sans"];
      const workspaceFontWeight = Pango.Weight.NORMAL;

      // Define default colors for workspaces since get_property doesn't work
      // the same way in GTK4 for these CSS properties
      const wsfg: RgbaColor = { red: 0.7, green: 0.7, blue: 0.7, alpha: 1.0 };
      
      // Occupied workspace colors
      const occupiedbg: RgbaColor = { red: 0.3, green: 0.3, blue: 0.3, alpha: 1.0 };
      const occupiedfg: RgbaColor = { red: 0.9, green: 0.9, blue: 0.9, alpha: 1.0 };
      
      // Active workspace colors
      const activebg: RgbaColor = { red: 0.2, green: 0.6, blue: 0.9, alpha: 1.0 };
      const activefg: RgbaColor = { red: 1.0, green: 1.0, blue: 1.0, alpha: 1.0 };

      area.set_size_request(workspaceDiameter * shown, -1);
      
      // Get the active workspace - in GTK4 we need to get this a different way
      // Using the workspace ID from the Variable
      const activeWs = workspace.get().id;

      const activeWsCenterX =
        -(workspaceDiameter / 2) + workspaceDiameter * activeWs;
      const activeWsCenterY = areaHeight / 2;

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
          const wsCenterY = areaHeight / 2;
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
        const y = (areaHeight - layoutHeight) / 2;
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
