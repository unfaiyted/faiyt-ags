import { Widget, Gtk, Gdk } from "astal/gtk4";

export function setupCursorHover(button: Gtk.Button | Gtk.Switch) {
  const motionController = new Gtk.EventControllerMotion();
  // Hand pointing cursor on hover
  const display = Gdk.Display.get_default();

  motionController.connect("enter", () => {
    if (display) {
      const cursor = Gdk.Cursor.new_from_name("pointer", null);
      button.set_cursor(cursor);
    } else {
      throw new Error("Could not get display");
    }
  });

  motionController.connect("leave", () => {
    if (display) {
      const cursor = Gdk.Cursor.new_from_name("default", null);
      button.set_cursor(cursor);
    }
  });

  button.add_controller(motionController);
}

export function setupCursorHoverAim(button: Gtk.Button) {
  const motionController = new Gtk.EventControllerMotion();
  // Hand pointing cursor on hover
  const display = Gdk.Display.get_default();
  // Crosshair cursor on hover
  motionController.connect("enter", () => {
    if (display) {
      const cursor = Gdk.Cursor.new_from_name("crosshair");
      button.set_cursor(cursor);
    } else {
      throw new Error("Could not get display");
    }
  });

  motionController.connect("leave", () => {
    if (display) {
      const cursor = Gdk.Cursor.new_from_name("default");
      button.set_cursor(cursor);
    }
  });
}

export function setupCursorHoverGrab(button: Gtk.Button) {
  const motionController = new Gtk.EventControllerMotion();
  // Hand pointing cursor on hover
  const display = Gdk.Display.get_default();

  motionController.connect("enter", () => {
    if (display) {
      const cursor = Gdk.Cursor.new_from_name("grab");
      button.set_cursor(cursor);
    } else {
      throw new Error("Could not get display");
    }
  });

  motionController.connect("leave", () => {
    if (display) {
      const cursor = Gdk.Cursor.new_from_name("default");
      button.set_cursor(cursor);
    }
  });
}

export function setupCursorHoverInfo(button: Gtk.Button) {
  // "?" mark cursor on hover
  const motionController = new Gtk.EventControllerMotion();
  // Hand pointing cursor on hover
  const display = Gdk.Display.get_default();
  motionController.connect("enter", () => {
    if (display) {
      const cursor = Gdk.Cursor.new_from_name("help");
      button.set_cursor(cursor);
    } else {
      throw new Error("Could not get display");
    }
  });

  motionController.connect("leave", () => {
    if (display) {
      const cursor = Gdk.Cursor.new_from_name("default");
      button.set_cursor(cursor);
    }
  });
}
