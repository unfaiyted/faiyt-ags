import { DrawingAreaProps, DrawingArea } from "../../utils/containers/drawing-area";
import { Widget, Gtk, Astal } from "astal/gtk4";
import { enableClickthrough } from "../../../utils";
import { timeout } from "astal/time";
import "../bar.scss"
import cairo from "cairo";
import { RgbaColor } from "../types";

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
  print("RoundedCorner creating:", props.place);
  const setupDrawingArea = (self: Gtk.DrawingArea) => {
    print(`Setting up corner drawing area for ${props.place}`);

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
      print(`Timeout triggered for ${props.place}`);

      // Since we can't directly access CSS properties in GTK4's style context,
      // we'll use hardcoded values that match our CSS

      // Get the standard background color from our SCSS (.corner class)
      const c = { red: 30 / 255, green: 30 / 255, blue: 30 / 255, alpha: 0.95 };
      const r = 24; // Standard corner radius

      print(`Theme values - Corner radius: ${r}px`);
      print(`Theme values - Corner color: rgba(${c.red * 255}, ${c.green * 255}, ${c.blue * 255}, ${c.alpha})`);

      self.set_draw_func((widget, cr, width, height) => {
        print(`Drawing function triggered for ${props.place}`);

        // Force size again just to be sure
        widget.set_size_request(r, r);
        print(`Drawing corner: ${place} with radius: ${r}px`);

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
  print(`Creating DrawingArea for ${place}`);
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
  print(`Creating BarCornerTopLeft window for monitor ${props.index}`);
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
  print(`Creating BarCornerTopRight window for monitor ${props.index}`);
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
