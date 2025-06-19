import { Gtk } from "astal/gtk4";
import { Variable, bind } from "astal";
import config from "../../../../utils/config";
import { ClockModuleProps } from "./types";
import GLib from "gi://GLib";
import BarGroup from "../../utils/bar-group";
import { PhosphorIcon } from "../../../utils/icons/phosphor";
import { ThemeColor } from "../../../../styles/themes";

export default function ClockModule(props: ClockModuleProps) {
  const time = new Variable("").poll(
    config.time.interval,
    () => GLib.DateTime.new_now_local().format(config.time.format) || "",
  );

  const date = new Variable("").poll(
    config.time.dateInterval,
    () =>
      GLib.DateTime.new_now_local().format(config.time.dateFormatLong) || "",
  );

  const dayOfWeek = new Variable("").poll(
    config.time.dateInterval,
    () =>
      GLib.DateTime.new_now_local().format("%A") || "", // Full day name (e.g., "Monday")
  );

  return (
    <BarGroup>
      <box
        valign={Gtk.Align.CENTER}
        cssName="bar-clock-box"
        marginStart={10}
        marginEnd={10}
        tooltipText={bind(date)}
        setup={(box) => {
          const motionController = new Gtk.EventControllerMotion();

          motionController.connect("enter", () => {
            // Show full date and day of week on hover
            const dayName = dayOfWeek.get();
            const dateStr = date.get();
            box.set_tooltip_text(`${dayName}, ${dateStr}`);
          });

          motionController.connect("leave", () => {
            // Revert to just date
            box.set_tooltip_text(date.get());
          });

          box.add_controller(motionController);
        }}
      >
        <PhosphorIcon
          iconName="clock"
          style="duotone"
          size={16}
          color={ThemeColor.Foreground}
          marginEnd={6}
        />
        <label cssName="bar-time" label={bind(time)} />
      </box>
    </BarGroup>
  );
}
