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
  const handleKeyPress = (self: Gtk.Window, keyval: number, keycode: number, state: Gdk.ModifierType) => {
    if (keyval === Gdk.KEY_Escape) {
      self.hide();
      self.visible = false;
      return true;
    }
  };

  print("PopupWindow - name:", name);
  print("PopupWindow - cssName:", props.cssName);

  const windowSetup = (self: Gtk.Window) => {
    print(`PopupWindow setup called for ${name}`);
    // Call the passed setup function if it exists
    if (setup) {
      print(`PopupWindow calling custom setup for ${name}`);
      setup(self);
    }
  };

  return (
    <window
      {...props}
      name={name}
      decorated={false}
      layer={props.layer || Astal.Layer.TOP}
      onKeyPressed={props.onKeyPressed || handleKeyPress}
      cssName={props.cssName || "popup-window"}
      setup={windowSetup}
    >
      <box setup={boxSetup}>{child}</box>
    </window>
  );
};
