import { Gtk } from "astal/gtk4";
import { Binding } from "astal";
import { CircularProgressProps, CircularProgress } from "../../../utils/circular-progress";


export interface TrackProgressProps extends CircularProgressProps {
  value: Binding<number>;
}

export const TrackProgress = (props: TrackProgressProps) => {
  // Use the value prop that's already being passed from the parent
  return (
    <CircularProgress
      percentage={props.value}
      opacity={0.4}
      cssName="bar-music-circprog"
      halign={Gtk.Align.START}
      valign={Gtk.Align.CENTER}
    ></CircularProgress>
  );
};

export default TrackProgress;
