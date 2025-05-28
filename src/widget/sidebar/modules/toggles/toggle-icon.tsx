import { Widget, Gtk, Gdk } from "astal/gtk4";
import { Binding, bind } from "astal";
import { setupCursorHover } from "../../../utils/buttons";
import { sidebarLogger as log } from "../../../../utils/logger";

export interface TogglesModuleProps extends Widget.ButtonProps {
  handleClick: () => void;
  handleRightClick?: () => void;
  handleMiddleClick?: () => void;
  indicator: () => Gtk.Widget;
  active: Binding<boolean>;
  label?: string;
}

export const ToggleIcon = (props: TogglesModuleProps) => {
  const gestureClick = new Gtk.GestureClick();
  // Set to 0 to handle all mouse buttons
  gestureClick.set_button(0);


  const toggleButton = <button
    cssName="toggle-button"
    onClicked={props.handleClick}
    cssClasses={bind(props.active).as(active => active ? ['active'] : [""])}
    tooltipText={props.tooltipText}
    setup={setupCursorHover}
  >
    <box
      cssName="toggle-button-content"
      spacing={8}
      valign={Gtk.Align.CENTER}
    >
      <box
        cssName="toggle-icon-wrapper"
        cssClasses={bind(props.active).as(active => active ? ['active'] : [""])}
      >
        {<props.indicator />}
      </box>
      {props.label && (
        <label
          cssName="toggle-label"
          cssClasses={bind(props.active).as(active => active ? ['active'] : [""])}
          label={props.label}
          xalign={0}
        />
      )}
    </box>
  </button>


  gestureClick.connect('released', (gesture, nPress, x, y) => {
    const button = gesture.get_current_button();
    log.info("Toggle button released", { button, nPress, x, y });

    switch (button) {
      case Gdk.BUTTON_SECONDARY:
        log.info("Toggle secondary button released");
        if (props.handleRightClick) {
          props.handleRightClick();
        }
        break;
      case Gdk.BUTTON_MIDDLE:
        log.info("Toggle middle button released");
        if (props.handleMiddleClick) {
          props.handleMiddleClick();
        }
        break;
      default:
        log.info("Toggle button released with unknown button", { button });
        break;
    }
  })


  toggleButton.add_controller(gestureClick);

  return (
    <box
      cssName="toggle-container"
      vertical
      spacing={4}
    >
      {toggleButton}
      <box
        cssName="toggle-switch-container"
        halign={Gtk.Align.CENTER}
        widthRequest={20}
        cssClasses={bind(props.active).as(active => active ? ['active'] : [""])}
        heightRequest={8}
      />
    </box>
  );
};
