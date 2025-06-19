import { Widget, Gtk, Gdk } from "astal/gtk4";
import { Variable, bind } from "astal";
import { setupCursorHover } from "../../../utils/buttons";
import { PhosphorIcon } from "../../../utils/icons/phosphor";
import "./utililies-button.scss";
import { ThemeColor } from "../../../../styles/themes";
import { PhosphorIcons, PhosphorIconStyle } from "../../../utils/icons/types";
import { actions } from "../../../../utils/actions";
import { interval } from "astal/time";

export interface RecordingButtonProps extends Widget.ButtonProps {
  cssName?: string;
}

export default function RecordingButton(props: RecordingButtonProps) {
  const { cssName, ...rest } = props;
  const cursor = Gdk.Cursor.new_from_name("pointer", null);

  // Variable to track recording state
  const isRecording = Variable(false);

  // Check recording status every 500ms
  interval(500, () => {
    isRecording.set(actions.app.record.isActive());
  });

  return (
    <button
      {...rest}
      valign={Gtk.Align.CENTER}
      tooltipText={bind(isRecording).as(recording => recording ? "Stop Recording" : "Start Recording")}
      onClicked={() => actions.app.record.toggle()}
      setup={setupCursorHover}
      cursor={cursor}
      cssName="bar-util-btn"
      cssClasses={bind(isRecording).as(recording => recording ? ["recording"] : [""])}
      marginStart={8}
      marginEnd={8}
    >
      <PhosphorIcon
        iconName={bind(isRecording).as(recording => recording ? PhosphorIcons.Record : PhosphorIcons.VideoCamera)}
        style={PhosphorIconStyle.Duotone}
        size={18}
        color={bind(isRecording).as(recording => recording ? ThemeColor.Error : ThemeColor.Foreground)}
      />
    </button>
  );
}
