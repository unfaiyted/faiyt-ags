import { BaseWorkspacesProps } from "../types";
import { Widget, Gtk, Gdk } from "astal/gtk4";
import { Variable } from "astal";

import { getFontWeightName } from "../../../../../utils/font";
import { DrawingArea } from "../../../../utils/containers/drawing-area";
import PangoCairo from "gi://PangoCairo";
import Pango from "gi://Pango";
// import Cairo from "gi://cairo";
import cairo from "cairo";
import config from "../../../../../utils/config";
import { mix, theme } from "../../../../../utils/color";
import { RgbaColor } from "../../../types";
import Hypr from "gi://AstalHyprland";

const dummyWs = Widget.Box({ cssName: "bar-ws" }); // Not shown. Only for getting size props
const dummyActiveWs = Widget.Box({ cssName: "bar-ws bar-ws-active" }); // Not shown. Only for getting size props
const dummyOccupiedWs = Widget.Box({ cssName: "bar-ws bar-ws-occupied" }); // Not shown. Only for getting size props


export interface NormalModeWorkspacesProps extends BaseWorkspacesProps {
  // Normal mode specific props
  workspace: Variable<Hypr.Workspace>;
  workspaceMask: Variable<number>;
  workspaceGroup: Variable<number>;
  updateMask: (self: Gtk.DrawingArea) => void;
  toggleMask: (self: Gtk.DrawingArea, occupied: boolean, name: string) => void;
}

export default function NormalModeWorkspaces(
  normalModeProps: NormalModeWorkspacesProps,
) {
  const { shown, workspace, } = normalModeProps;

  const hypr = Hypr.get_default();
  const workspaceMask = new Variable(0);
  const workspaceGroup = new Variable(0);

  // Function to update workspace mask based on occupied workspaces
  const updateMask = () => {
    const workspaces = hypr.get_workspaces();
    let mask = 0;

    // Set bits for occupied workspaces
    workspaces.forEach((ws) => {
      if (ws.id > 0 && ws.id <= shown * 10) { // Reasonable limit
        mask |= (1 << ws.id);
      }
    });

    workspaceMask.set(mask);
  };

  // Function to update workspace group when switching workspace groups
  const updateWorkspaceGroup = () => {
    const currentWs = workspace.get();
    if (!currentWs) return;

    const previousGroup = workspaceGroup.get();
    const currentGroup = Math.floor((currentWs.id - 1) / shown);

    if (currentGroup !== previousGroup) {
      workspaceGroup.set(currentGroup);
      updateMask(); // Update mask when group changes
    }
  };

  function setupCursorHover(self: Gtk.DrawingArea) {
    const motionController = new Gtk.EventControllerMotion();
    // Hand pointing cursor on hover
    const display = Gdk.Display.get_default();

    motionController.connect("enter", () => {
      if (display) {
        const cursor = Gdk.Cursor.new_from_name("pointer", null);
        self.set_cursor(cursor);
      } else {
        throw new Error("Could not get display");
      }
    });

    motionController.connect("leave", () => {
      if (display) {
        const cursor = Gdk.Cursor.new_from_name("default", null);
        self.set_cursor(cursor);
      }
    });

    self.add_controller(motionController);
  }


  const contentSetup = (self: Gtk.DrawingArea) => {
    setupCursorHover(self);
    // Initial setup
    updateMask();
    updateWorkspaceGroup();

    // Subscribe to workspace changes
    workspace.subscribe((currentWs) => {
      if (!currentWs) return;

      // Note: CSS animations handled by the parent DrawingArea component

      // Update workspace group
      updateWorkspaceGroup();

      // Trigger redraw
      self.queue_draw();
    });

    // Subscribe to Hyprland workspace changes
    hypr.connect("notify::workspaces", () => {
      updateMask();
      self.queue_draw();
    });

    // Subscribe to workspace mask changes to trigger redraws
    workspaceMask.subscribe(() => {
      self.queue_draw();
    });

    workspaceGroup.subscribe(() => {
      self.queue_draw();
    });

    // Cleanup function for when the widget is destroyed
    self.connect('destroy', () => {
      // The Variable subscriptions will be automatically cleaned up
      // when the Variables go out of scope, but we can be explicit
      workspaceMask.drop?.();
      workspaceGroup.drop?.();
    });
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

      // Helper function to convert hex color to RgbaColor
      const hexToRgba = (hex: string): RgbaColor => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return { red: r, green: g, blue: b, alpha: 1.0 };
      };

      // Define workspace colors using Rosé Pine theme
      const wsfg: RgbaColor = hexToRgba(theme.subtle); // subtle for inactive workspaces

      // Occupied workspace colors
      const occupiedbg: RgbaColor = hexToRgba(theme.surface); // surface for occupied background
      const occupiedfg: RgbaColor = hexToRgba(theme.text); // text for occupied foreground

      // Active workspace colors
      const activebg: RgbaColor = hexToRgba(theme.rose); // iris for active background
      const activefg: RgbaColor = hexToRgba(theme.base); // base for active foreground (contrast)

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
        if (workspaceMask.get() & (1 << i)) {
          // Draw bg highlight
          cr.setSourceRGBA(
            occupiedbg.red,
            occupiedbg.green,
            occupiedbg.blue,
            occupiedbg.alpha,
          );
          const wsCenterX = -workspaceRadius + workspaceDiameter * i;
          const wsCenterY = areaHeight / 2;
          if (!(workspaceMask.get() & (1 << (i - 1)))) {
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
          if (!(workspaceMask.get() & (1 << (i + 1)))) {
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
        const inactivecolors = workspaceMask.get() & (1 << i) ? occupiedfg : wsfg;
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
