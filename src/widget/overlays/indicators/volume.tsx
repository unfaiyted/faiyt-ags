import { Widget, Gtk } from "astal/gtk4";
import { IndicatorCard } from "./index";
import Wp from "gi://AstalWp";
import { Variable, bind } from "astal";

const audio: Wp.Audio | undefined = Wp.get_default()?.audio;

export const VolumeIndicator = (props: Widget.BoxProps) => {
  const value = Variable(0);
  const name = Variable("Volume");

  if (audio != null)
    audio.connect("notify", (audio: Wp.Audio) => {
      print("Volume:", audio.defaultSpeaker.volume);
      value.set(audio.defaultSpeaker.volume);
    });

  return (
    <IndicatorCard
      {...props}
      cssName={`osd-volume ${props.cssName}`}
      name={bind(name)}
      value={bind(value)}
    />
  );
};
