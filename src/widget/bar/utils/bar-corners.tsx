import { DrawingAreaProps, DrawingArea } from "../../utils/containers/drawing-area";
import { Widget, Gtk, Astal } from "astal/gtk4";
import { enableClickthrough } from "../../../utils";
import { timeout } from "astal/time";
import "../bar.scss"
import cairo from "cairo";
import { RgbaColor } from "../types";
import { theme } from "../../../utils/color";
import { barLogger as log } from "../../../utils/logger";

export interface BarCornerTopProps extends Widget.WindowProps {
  index?: number;
}

enum BarCornerPlace {
  TOP_LEFT = "top-left",
  TOP_RIGHT = "top-right",
  BOTTOM_LEFT = "bottom-left",
  BOTTOM_RIGHT = "bottom-right",
}

export interface RoundedCornerProps extends DrawingAreaProps {
  place: BarCornerPlace;
}

export const RoundedCorner = (props: RoundedCornerProps) => {
  log.debug(`Creating RoundedCorner`, { place: props.place });
  const setupDrawingArea = (self: Gtk.DrawingArea) => {
    log.debug(`Setting up corner drawing area`, { place: props.place });

    //   const c = self
    //     .get_style_context()
    //     .get_property("background-color", Gtk.StateFlags.NORMAL);
    //   const r = parseFloat(
    //     self
    //       .get_style_context()
    //       .get_property("border-radius", Gtk.StateFlags.NORMAL) as string,
    //   );
    //
    //   print(`Corner radius: ${r}px`);
    //   print(`Corner color: ${c}`);
    //
    //   // Fixed radius for all corners
    //   // let r = 24;
    //   self.set_size_request(r, r);
    //
    //   // Make sure we can actually read the style context properties
    // print("Style context properties:");
    // print(`- has background-color: ${!!self.get_style_context().get_property("background-color", Gtk.StateFlags.NORMAL)}`);
    // print(`- has border-radius: ${!!self.get_style_context().get_property("border-radius", Gtk.StateFlags.NORMAL)}`);
    //
    // Get styles again after a short delay
    // In GTK4, we need a simpler approach
    timeout(10, () => {
      log.debug(`Style timeout triggered`, { place: props.place });

      // Since we can't directly access CSS properties in GTK4's style context,
      // we'll use theme values that match our CSS

      // Helper function to convert hex color to RgbaColor
      const hexToRgba = (hex: string, alpha: number = 1.0): RgbaColor => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return { red: r, green: g, blue: b, alpha };
      };

      // Get the standard background color from our Rosé Pine theme (matching top-bar bg)
      const c = hexToRgba(theme.background, 0.95); // Using surface color with transparency
      const r = 24; // Standard corner radius

      log.debug(`Theme values`, { 
        radius: `${r}px`,
        color: `rgba(${c.red * 255}, ${c.green * 255}, ${c.blue * 255}, ${c.alpha})`
      });

      self.set_draw_func((widget, cr, width, height) => {
        log.verbose(`Drawing function triggered`, { place: props.place });

        // Force size again just to be sure
        widget.set_size_request(r, r);
        log.verbose(`Drawing corner`, { place, radius: `${r}px` });

        // Start with a completely clear surface (transparent background)
        cr.setOperator(cairo.Operator.CLEAR);
        cr.paint();

        // Switch to normal drawing mode
        cr.setOperator(cairo.Operator.OVER);

        // Set the color for our drawing
        cr.setSourceRGBA(c.red, c.green, c.blue, c.alpha); // Bar background color

        // Adapting the GTK3 working version with proper arcs
        switch (place) {
          case BarCornerPlace.TOP_LEFT:
            // Start at corner and add arc
            cr.arc(r, r, r, Math.PI, (3 * Math.PI) / 2);
            cr.lineTo(0, 0);
            break;

          case BarCornerPlace.TOP_RIGHT:

            cr.arc(0, r, r, (3 * Math.PI) / 2, 2 * Math.PI);
            cr.lineTo(r, 0);
            // Start at corner and add arc
            break;

          case BarCornerPlace.BOTTOM_LEFT:
            // Start at corner and add arc
            cr.arc(r, 0, r, Math.PI / 2, Math.PI);
            cr.lineTo(0, r);
            break;

          case BarCornerPlace.BOTTOM_RIGHT:
            // Start at corner and add arc
            break;
        }


        // Fill the path
        cr.closePath();
        cr.setSourceRGBA(c.red, c.green, c.blue, c.alpha);
        cr.fill();
        // print("Drawing corner:", place);
        // cr.setLineWidth(borderWidth);
        // cr.setSourceRGBA(borderColor.red, borderColor.green, borderColor.blue, borderColor.alpha);
        // cr.stroke();
      });
    });
  };

  const { place } = props;
  log.debug(`Creating DrawingArea`, { place });
  return (
    <DrawingArea
      cssName="corner"
      halign={place.includes("left") ? Gtk.Align.START : Gtk.Align.END}
      valign={place.includes("top") ? Gtk.Align.START : Gtk.Align.END}
      setup={setupDrawingArea}
      {...props}
    ></DrawingArea>
  );
};

export const BarCornerTopLeft = (props: BarCornerTopProps) => {
  log.debug(`Creating BarCornerTopLeft window`, { monitor: props.index });
  return (
    <window
      gdkmonitor={props.gdkmonitor}
      monitor={props.index}
      name={`bar-corner-left-${props.index}`}
      cssClasses={["corner-window"]}
      layer={Astal.Layer.TOP}
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      visible={true}
      // Just make sure the window is transparent
      default_width={24}
      default_height={24}
      {...props}
    >
      <RoundedCorner place={BarCornerPlace.TOP_LEFT} />
    </window>
  );
};

export const BarCornerTopRight = (props: BarCornerTopProps) => {
  log.debug(`Creating BarCornerTopRight window`, { monitor: props.index });
  return (
    <window
      gdkmonitor={props.gdkmonitor}
      monitor={props.index}
      name={`bar-corner-right-${props.index}`}
      layer={Astal.Layer.TOP}
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      visible={true}
      // Just make sure the window is transparent
      cssClasses={["bar-corner-right"]}
      default_width={24}
      default_height={24}
      {...props}
    >
      <RoundedCorner place={BarCornerPlace.TOP_RIGHT} />
    </window>
  );
};
