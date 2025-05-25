import { Widget, Gtk, Astal } from "astal/gtk4";
import { BrightnessIndicator } from "./indicators/brightness";
import { KBBacklightBrightnessIndicator } from "./indicators/kb-backlight-brightness";
import { VolumeIndicator } from "./indicators/volume";
import Indicators from "./indicators/index";
import PopupNotifications from "./popup-notifications";
// import { MusicControls } from "./music";
// import { Notifications } from "./notifications";
// import { ColorSchemeSwitcher } from "./scheme-switcher";

export interface SystemOverlayProps extends Widget.WindowProps { }

export const SystemOverlays = (props: SystemOverlayProps) => {
  return (
    <window
      {...props}
      name={`system-overlays-${props.monitor}`}
      gdkmonitor={props.gdkmonitor}
      layer={Astal.Layer.OVERLAY}
      cssName="system-overlays"
      visible
      anchor={Astal.WindowAnchor.TOP}
    >
      <box>
        <box vertical>
          <Indicators>
            <BrightnessIndicator />
            <KBBacklightBrightnessIndicator />
            <VolumeIndicator />
          </Indicators>

          {/* <MusicControls /> */}

          {/* <ColorSchemeSwitcher /> */}
        </box>
      </box>
      {/* <PopupNotifications /> */}
    </window>
  );
};

export default SystemOverlays;
