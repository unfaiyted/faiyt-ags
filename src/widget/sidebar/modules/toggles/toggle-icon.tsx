import { Widget, Astal, Gtk } from "astal/gtk4";
import { Binding } from "astal";
import { setupCursorHover } from "../../../utils/buttons";

export interface TogglesModuleProps extends Widget.ButtonProps {
  handleClick: (self: Gtk.Button) => void;
  handleRightClick: (self: Gtk.Button) => void;
  indicator: () => Gtk.Widget;
  active: Binding<boolean>;
}

export const ToggleIcon = (props: TogglesModuleProps) => {
  const handleClick = () => {
    // if (event.button === Astal.MouseButton.PRIMARY) {
    //   props.handleClick(self);
    // } else if (event.button === Astal.MouseButton.SECONDARY) {
    //   props.handleRightClick(self);
    // }
  };

  const buttonSetup = (self: Gtk.Button) => {
    setupCursorHover(self);

    props.active.subscribe((active) => {
      self.set_css_classes(active ? ["sidebar-button-active"] : []);
    });

    if (props.active.get()) {
      self.set_css_classes(props.active.get() ? ["sidebar-button-active"] : []);
    }
  };

  return (
    <button
      cssName="txt-small sidebar-iconbutton"
      tooltipText={props.tooltipText}
      onClicked={handleClick}
      setup={buttonSetup}
    >
      {<props.indicator />}
    </button>
  );
};