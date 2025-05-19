import { Widget, App, Gtk, Gdk, Astal } from "astal/gtk4";
// import { Variable, Binding } from "astal"
// const { Box, Window } = Widget;

export interface PopupWindowProps extends Widget.WindowProps {
  hideClassName?: string;
  showClassName?: string;
}

export default ({
  name,
  child,
  setup,
  showClassName = "",
  hideClassName = "",
  ...props
}: PopupWindowProps) => {
  // Register ESC key to close window
  const closeWindow = () => {
    // App.closeWindow(name);
    try {
      if (typeof name === "string") App?.get_window(name)?.close();
    } catch (error) {
      print(error);
    }
  };

  // print("Popup window name:", name);

  const boxSetup = (self: Gtk.Box) => {
    // setup?.(self);
    // if (showClassName != "" && hideClassName !== "") {
    // self.hook(App, (self, currentName, visible) => {
    //   if (currentName === name) {
    //     self.toggleClassName(hideClassName, !visible);
    //   }
    // });

    if (showClassName !== "" && hideClassName !== "")
      self.set_css_classes([showClassName, hideClassName]);
  };
  //

  const handleDraw = (self: Gtk.Window) => {
    if (self.visible) {
      // print("popup window is Visible");
      self.set_css_classes([showClassName]);
    } else {
      // print("popup window is Not visible");
      self.set_css_classes([hideClassName]);
    }
  };

  const handleKeyPress = (self: Gtk.Window, event: Gdk.KeyEvent) => {
    // print("Key press event.keyval:", event.get_keyval());
    // print("Key press event.keycode:", event.get_keycode());
    // print("Gdk.Key.Escape:", Gdk.KEY_Escape);

    if (event.get_keycode() === Gdk.KEY_Escape) {
      // print("Closing popup-window, event.keycode[1]:", event.get_keycode()[1]);
      self.hide();
      self.visible = false;
      return true;
    }

    // print("Key press event:", event.get_keycode());
    // if (event.get_keycode()) {
    // self.hide();
    // return true;
    // }
  };

  return (
    <window
      name={name}
      layer={Astal.Layer.TOP}
      onDraw={handleDraw}
      onKeyPressEvent={handleKeyPress}
      cssName={props.cssName}
      {...props}
    >
      <box setup={boxSetup}>{child}</box>
    </window>
  );
};
