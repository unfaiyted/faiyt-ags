import { Widget } from "astal/gtk3";
import Mpris from "gi://AstalMpris";
import { Binding } from "astal";

export interface TrackProgressProps extends Widget.CircularProgressProps {
  value: Binding<number>;
  startAt: Binding<number>;
  endAt: Binding<number>;
}

export interface PlayingStateProps extends Widget.LabelProps {
  status: Binding<string | Mpris.PlaybackStatus>;
}
export interface TrackTitleProps extends Widget.LabelProps {
  title: Binding<string>;
  artist: Binding<string>;
}
