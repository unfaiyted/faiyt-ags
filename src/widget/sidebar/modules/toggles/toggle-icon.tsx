import { Widget, Astal, Gtk, Gdk } from "astal/gtk4";
import { Binding, bind } from "astal";
import { setupCursorHover } from "../../../utils/buttons";
import { sidebarLogger as log } from "../../../../utils/logger";

export interface TogglesModuleProps extends Widget.ButtonProps {
  handleClick: () => void;
  handleRightClick?: () => void;
  indicator: () => Gtk.Widget;
  active: Binding<boolean>;
  label?: string;
}

export const ToggleIcon = (props: TogglesModuleProps) => {
  const gestureClick = new Gtk.GestureClick();

  gestureClick.connect('pressed', (gesture, nPress, x, y) => {
    const button = gesture.get_button();

    switch (button) {
      case Gdk.BUTTON_PRIMARY:
        log.debug("Toggle primary button pressed");
        props.handleClick();
        break;
      case Gdk.BUTTON_SECONDARY:
        log.debug("Toggle secondary button pressed");
        if (props.handleRightClick) {
          props.handleRightClick();
        }
        break;
      case Gdk.BUTTON_MIDDLE:
        break;
      default:
        break;
    }
  })


  gestureClick.connect('released', (gesture, nPress, x, y) => {
  });


  const toggleButton = <button
    cssName="toggle-button"
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

  toggleButton.add_controller(gestureClick);

  // Create a gesture for the toggle switch as well
  const switchGesture = new Gtk.GestureClick();
  switchGesture.connect('pressed', () => {
    log.debug("Toggle switch clicked");
    props.handleClick();
  });

  const toggleSwitch = <box
    cssName="toggle-switch"
    cssClasses={bind(props.active).as(active => active ? ['active'] : [""])}

  >
    <box
      cssName="toggle-switch-thumb"
      cssClasses={bind(props.active).as(active => active ? ['active'] : [""])}
    />
  </box>

  toggleSwitch.add_controller(switchGesture);

  return (
    <box
      cssName="toggle-container"
      vertical
      spacing={4}
    >
      {toggleButton}
      <box cssName="toggle-switch-container" halign={Gtk.Align.CENTER}>
        {toggleSwitch}
      </box>
    </box>
  );
};
