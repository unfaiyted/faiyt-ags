import { astalify, ConstructProps, Gtk, Gdk } from "astal/gtk4";

// DrawingArea
type DrawingAreaSignals = {
  onDraw: [cr: any]; // Cairo context
};

export type DrawingAreaProps = ConstructProps<
  Gtk.DrawingArea,
  Gtk.DrawingArea.ConstructorProps,
  DrawingAreaSignals
>;

export const DrawingArea = astalify<
  Gtk.DrawingArea,
  Gtk.DrawingArea.ConstructorProps,
  DrawingAreaSignals
>(Gtk.DrawingArea, {
  create(props) {
    const widget = new Gtk.DrawingArea();

    // Set up the drawing function if onDraw is provided
    if (props.onDraw) {
      widget.set_draw_func((area, cr, width, height) => {
        // Call the user-provided onDraw handler
        props.onDraw(cr, width, height);
      });
    }

    return widget;
  },

  connect(widget, signal, callback) {
    if (signal === "onDraw") {
      // DrawingArea in GTK4 uses set_draw_func instead of the 'draw' signal
      widget.set_draw_func((area, cr, width, height) => {
        callback(cr, width, height);
      });
      return 0; // Return a placeholder signal ID
    }

    // For other signals, use the default implementation
    return widget.connect(signal.replace(/^on/, "").toLowerCase(), callback);
  },

  disconnect(widget, signal, id) {
    if (signal === "onDraw") {
      // For onDraw, we need to clear the draw function
      widget.set_draw_func(null);
      return;
    }

    // For other signals, use the default implementation
    widget.disconnect(id);
  },
});
