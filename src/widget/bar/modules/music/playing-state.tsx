import { Widget, Gtk } from "astal/gtk4";
import { Binding } from "astal";
import Mpris from "gi://AstalMpris";
import { PhosphorIcons, PhosphorIconStyle } from "../../../utils/icons/types";
import { PhosphorIcon } from "../../../utils/icons/phosphor";


export interface PlayingStateProps extends Widget.LabelProps {
  status: Binding<Mpris.PlaybackStatus | null>;
}

export default function PlayingState(props: PlayingStateProps) {
  return (
    <PhosphorIcon
      style={PhosphorIconStyle.Duotone}
      marginTop={4}
      cssName="bar-music-playstate-icon"
      cssClasses={props.status.as(
        (v: Mpris.PlaybackStatus | null) => {
          return v === Mpris.PlaybackStatus.PLAYING
            ? ["playing-animation"]
            : [];
        })}
      marginStart={4}
      valign={Gtk.Align.CENTER}
      iconName={props.status.as(
        (v: Mpris.PlaybackStatus | null) => {
          print("Playback status:", v);
          switch (v) {
            case Mpris.PlaybackStatus.PLAYING:
              print("Playing");
              return PhosphorIcons.MusicNoteSimple;
            case Mpris.PlaybackStatus.PAUSED:
              print("Paused");
              return PhosphorIcons.Pause;
            case Mpris.PlaybackStatus.STOPPED:
              print("Stopped");
              return PhosphorIcons.Stop;
            case null:
            default:
              // Log unexpected status
              console.log("Unexpected playback status:", v);
              return PhosphorIcons.QuestionMark;
          }
        })}
    />
  );
}
