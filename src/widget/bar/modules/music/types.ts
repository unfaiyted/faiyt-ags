import { Widget } from "astal/gtk4";
import Mpris from "gi://AstalMpris";
import { Binding } from "astal";
import { CircularProgressProps } from "../../../utils/circular-progress";

export interface TrackProgressProps extends CircularProgressProps {
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
