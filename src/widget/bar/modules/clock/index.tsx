import { Gtk } from "astal/gtk4";
import config from "../../../../utils/config";
// import { ClockModuleProps } from "./types";
import { Variable, bind } from "astal";
import GLib from "gi://GLib";
import BarGroup from "../../utils/bar-group";


// export interface ClockModuleProps extends Widget.BoxProps {}

export default function ClockModule() {
  const time = Variable("").poll(
    config.time.interval,
    () => GLib.DateTime.new_now_local().format(config.time.format) || "",
  );

  const date = Variable("").poll(
    config.time.dateInterval,
    () =>
      GLib.DateTime.new_now_local().format(config.time.dateFormatLong) || "",
  );

  return (
    <BarGroup>
      <box valign={Gtk.Align.CENTER} cssName="bar-clock-box">
        <label cssName="bar-time" label={bind(time)} />
        <label cssName="txt-norm txt-onLayer1" label="•" />
        <label cssName="txt-smallie bar-date" label={bind(date)} />
      </box>
    </BarGroup>
  );
}
