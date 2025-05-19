import { Widget, Gtk, Gdk } from "astal/gtk4";

export function setupCursorHover(button: Gtk.Button) {
  // Hand pointing cursor on hover
  const display = Gdk.Display.get_default();
  button.connect("enter-notify-event", () => {
    if (display) {
      const cursor = Gdk.Cursor.new_from_name(display, "pointer");
      const win = button.get_window();
      if (win) win.set_cursor(cursor);
    } else {
      throw new Error("Could not get display");
    }
  });

  button.connect("leave-notify-event", () => {
    if (display) {
      const cursor = Gdk.Cursor.new_from_name(display, "default");
      const win = button.get_window();
      if (win) win.set_cursor(cursor);
    }
  });
}

export function setupCursorHoverAim(button: Gtk.Button) {
  // Crosshair cursor on hover
  const display = Gdk.Display.get_default();
  button.connect("enter-notify-event", () => {
    if (display) {
      const cursor = Gdk.Cursor.new_from_name(display, "crosshair");
      const win = button.get_window();
      if (win) win.set_cursor(cursor);
    } else {
      throw new Error("Could not get display");
    }
  });

  button.connect("leave-notify-event", () => {
    if (display) {
      const cursor = Gdk.Cursor.new_from_name(display, "default");
      const win = button.get_window();
      if (win) win.set_cursor(cursor);
    }
  });
}

export function setupCursorHoverGrab(button: Widget.Button) {
  // Hand ready to grab on hover
  const display = Gdk.Display.get_default();
  button.connect("enter-notify-event", () => {
    if (display) {
      const cursor = Gdk.Cursor.new_from_name(display, "grab");
      const win = button.get_window();
      if (win) win.set_cursor(cursor);
    } else {
      throw new Error("Could not get display");
    }
  });

  button.connect("leave-notify-event", () => {
    if (display) {
      const cursor = Gdk.Cursor.new_from_name(display, "default");
      const win = button.get_window();
      if (win) win.set_cursor(cursor);
    }
  });
}

export function setupCursorHoverInfo(button: Widget.Button) {
  // "?" mark cursor on hover
  const display = Gdk.Display.get_default();
  button.connect("enter-notify-event", () => {
    if (display) {
      const cursor = Gdk.Cursor.new_from_name(display, "help");
      const win = button.get_window();
      if (win) win.set_cursor(cursor);
    } else {
      throw new Error("Could not get display");
    }
  });

  button.connect("leave-notify-event", () => {
    if (display) {
      const cursor = Gdk.Cursor.new_from_name(display, "default");
      const win = button.get_window();
      if (win) win.set_cursor(cursor);
    }
  });
}
