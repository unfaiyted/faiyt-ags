import { Widget, Gtk, Astal } from "astal/gtk4";
import { bind } from "astal";
import { BrightnessIndicator } from "./indicators/brightness";
import { KBBacklightBrightnessIndicator } from "./indicators/kb-backlight-brightness";
import { VolumeIndicator } from "./indicators/volume";
import Indicators, { indicatorVisibility } from "./indicators/index";
import { createLogger } from "../../utils/logger";

const log = createLogger("IndicatorsWindow");

export interface IndicatorsWindowProps extends Widget.WindowProps { }

export const IndicatorsWindow = (props: IndicatorsWindowProps) => {
  log.debug("Creating indicators window", { monitor: props.monitor });

  return (
    <window
      {...props}
      name={`indicators-${props.monitor}`}
      gdkmonitor={props.gdkmonitor}
      layer={Astal.Layer.OVERLAY}
      cssName="indicators-window"
      visible={bind(indicatorVisibility)}
      anchor={Astal.WindowAnchor.BOTTOM}
    >
      <box halign={Gtk.Align.CENTER} valign={Gtk.Align.END}>
        <Indicators>
          <BrightnessIndicator />
          <KBBacklightBrightnessIndicator />
          <VolumeIndicator />
        </Indicators>
      </box>
    </window>
  );
};

export default IndicatorsWindow;