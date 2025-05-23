import { astalify, ConstructProps, Gtk, Gdk } from "astal/gtk4";
import cairo from "cairo"

// DrawingArea
type DrawingAreaSignals = {
  onDraw: [cr: cairo.Context]; // Cairo context
};

export type DrawingAreaProps = ConstructProps<
  Gtk.DrawingArea,
  Gtk.DrawingArea.ConstructorProps,
  DrawingAreaSignals
> & {
  setup?: (self: Gtk.DrawingArea) => void;
};

export const DrawingArea = astalify<
  Gtk.DrawingArea,
  Gtk.DrawingArea.ConstructorProps,
  DrawingAreaSignals
>(Gtk.DrawingArea, {});


// Fixed
export type FixedProps = ConstructProps<Gtk.Fixed, Gtk.Fixed.ConstructorProps>
export const Fixed = astalify<Gtk.Fixed, Gtk.Fixed.ConstructorProps>(Gtk.Fixed)

