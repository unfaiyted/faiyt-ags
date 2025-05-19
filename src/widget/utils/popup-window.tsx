import { Widget, App, Gtk, Gdk, Astal } from "astal/gtk3";
const { Box, Window } = Widget;
import { bind } from "astal";
import { Variable } from "astal";

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

  const boxSetup = (self: Widget.Box) => {
    // setup?.(self);
    // if (showClassName != "" && hideClassName !== "") {
    // self.hook(App, (self, currentName, visible) => {
    //   if (currentName === name) {
    //     self.toggleClassName(hideClassName, !visible);
    //   }
    // });

    if (showClassName !== "" && hideClassName !== "")
      self.className = `${showClassName} ${hideClassName}`;
  };
  //

  const handleDraw = (self: Widget.Window) => {
    if (self.visible) {
      // print("popup window is Visible");
      self.className = showClassName;
    } else {
      // print("popup window is Not visible");
      self.className = hideClassName;
    }
  };

  const handleKeyPress = (self: Widget.Window, event: Gdk.Event) => {
    // print("Key press event.keyval:", event.get_keyval());
    // print("Key press event.keycode:", event.get_keycode());
    // print("Gdk.Key.Escape:", Gdk.KEY_Escape);

    if (event.get_keyval()[1] === Gdk.KEY_Escape) {
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
      className={props.className}
      {...props}
    >
      <box setup={boxSetup}>{child}</box>
    </window>
  );
};
