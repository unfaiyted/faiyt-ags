import { Widget, Gtk } from "astal/gtk4";
import { CircularProgressProps, CircularProgress } from "../../../utils/circular-progress"
import { Binding } from "astal";


export interface TrackProgressProps extends CircularProgressProps {
  value: Binding<number>;
  // startAt: Binding<number>;
  // endAt: Binding<number>;
}

export const TrackProgress = (props: TrackProgressProps) => {
  // const _updateProgress = (circprog: Widget.CircularProgress) => {
  //   // first player?
  //   const player = mpris.get_players()[0];
  //   if (!player) return;
  //   // Set circular progress value
  //   circprog.css = `font-size: ${Math.max((player.position / player.length) * 100, 0)}px;`;
  // };

  return (
    <CircularProgress
      percentage={props.percentage}
      opacity={0.4}
      cssName="bar-music-circprog"
      halign={Gtk.Align.START}
      valign={Gtk.Align.CENTER}
    ></CircularProgress>
  );
};

export default TrackProgress;
