import { Widget, Gtk, Astal } from "astal/gtk4";
import { enableClickthrough } from "../../../utils";

export interface BarCornerTopProps extends Widget.WindowProps {
  index?: number;
}

enum BarCornerPlace {
  TOP_LEFT = "top-left",
  TOP_RIGHT = "top-right",
  BOTTOM_LEFT = "bottom-left",
  BOTTOM_RIGHT = "bottom-right",
}

export interface RoundedCornerProps extends Widget.BoxProps {
  place: BarCornerPlace;
  radius?: number;
}

export const RoundedCorner = (props: RoundedCornerProps) => {
  const { place, radius = 24, ...rest } = props;

  // Calculate CSS classes based on corner position
  const cornerClass = `corner-${place}`;
  const cssClass = `corner ${cornerClass}`;

  // Create dynamic CSS for the corner radius
  const css = `
    .${cornerClass} {
      min-width: ${radius}px;
      min-height: ${radius}px;
    }
  `;

  return (
    <box
      cssName={cssClass}
      halign={place.includes("left") ? Gtk.Align.START : Gtk.Align.END}
      valign={place.includes("top") ? Gtk.Align.START : Gtk.Align.END}
      {...rest}
    />
  );
};

export const BarCornerTopLeft = (props: BarCornerTopProps) => {
  return (
    <window
      gdkmonitor={props.gdkmonitor}
      monitor={props.index}
      cssClasses={["bar-corner-left"]}
      name={`bar-corner-left-${props.index}`}
      layer={Astal.Layer.TOP}
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      visible={true}
      default_width={24}
      default_height={24}
      {...props}
    >
      <RoundedCorner place={BarCornerPlace.TOP_LEFT} />
    </window>
  );
};

export const BarCornerTopRight = (props: BarCornerTopProps) => {
  return (
    <window
      gdkmonitor={props.gdkmonitor}
      monitor={props.index}
      cssClasses={["bar-corner-right"]}
      name={`bar-corner-right-${props.index}`}
      layer={Astal.Layer.TOP}
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      visible={true}
      default_width={24}
      default_height={24}
      {...props}
    >
      <RoundedCorner place={BarCornerPlace.TOP_RIGHT} />
    </window>
  );
};
