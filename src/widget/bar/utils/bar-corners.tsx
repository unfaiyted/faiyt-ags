import { DrawingAreaProps, DrawingArea } from "../../utils/containers/drawing-area";
import { Widget, Gtk, Astal } from "astal/gtk4";
import { enableClickthrough } from "../../../utils";
import { timeout } from "astal/time";
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
  // print("RoundedCorner props:", props.place);
  const setupDrawingArea = (self: Gtk.DrawingArea) => {
    timeout(1, () => {
      const c = self
        .get_style_context()
        .get_property("background-color", Gtk.StateFlags.NORMAL);
      const r = parseFloat(
        self
          .get_style_context()
          .get_property("border-radius", Gtk.StateFlags.NORMAL) as string,
      );

      self.set_size_request(r, r);
      self.set_draw_func((widget, cr, width, height) => {
        const c = widget
          .get_style_context()
          .get_property("background-color", Gtk.StateFlags.NORMAL) as RgbaColor;
        const r = parseFloat(
          widget
            .get_style_context()
            .get_property("border-radius", Gtk.StateFlags.NORMAL) as string,
        );
        // const borderColor = widget.get_style_context().get_property('color', Gtk.StateFlags.NORMAL);
        // const borderWidth = widget.get_style_context().get_border(Gtk.StateFlags.NORMAL).left; // ur going to write border-width: something anyway
        widget.set_size_request(r, r);

        switch (place) {
          case BarCornerPlace.TOP_LEFT:
            cr.arc(r, r, r, Math.PI, (3 * Math.PI) / 2);
            cr.lineTo(0, 0);
            break;

          case BarCornerPlace.TOP_RIGHT:
            cr.arc(0, r, r, (3 * Math.PI) / 2, 2 * Math.PI);
            cr.lineTo(r, 0);
            break;

          case BarCornerPlace.BOTTOM_LEFT:
            cr.arc(r, 0, r, Math.PI / 2, Math.PI);
            cr.lineTo(0, r);
            break;

          case BarCornerPlace.BOTTOM_RIGHT:
            cr.arc(0, 0, r, 0, Math.PI / 2);
            cr.lineTo(r, r);
            break;
        }

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
  // print("BarCornerTopLeft props:", props.index);
  return (
    <window
      gdkmonitor={props.gdkmonitor}
      monitor={props.index}
      name={`bar-corner-left-${props.index}`}
      layer={Astal.Layer.TOP}
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      visible={true}
      setup={enableClickthrough}
      {...props}
    >
      <RoundedCorner place={BarCornerPlace.TOP_LEFT} />
    </window>
  );
};

export const BarCornerTopRight = (props: BarCornerTopProps) => (
  <window
    gdkmonitor={props.gdkmonitor}
    monitor={props.index}
    name={`bar-corner-right-${props.index}`}
    layer={Astal.Layer.TOP}
    anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
    exclusivity={Astal.Exclusivity.EXCLUSIVE}
    visible={true}
    setup={enableClickthrough}
    {...props}
  >
    <RoundedCorner place={BarCornerPlace.TOP_RIGHT} />
  </window>
);
