import { Widget, Gtk } from "astal/gtk4";
import { IndicatorCard, showIndicators } from "./index";
import Wp from "gi://AstalWp";
import { Variable, bind } from "astal";
import { PhosphorIcon } from "../../utils/icons/phosphor";
import { PhosphorIcons } from "../../utils/icons/types";

const audio = Wp.get_default()?.audio;

export const VolumeIndicator = (props: Widget.BoxProps) => {
  // Convert from 0-1 range to 0-100 for the progress bar
  const value = Variable(audio?.defaultSpeaker?.volume ? audio.defaultSpeaker.volume * 100 : 0);
  const iconName = Variable(PhosphorIcons.SpeakerHigh);

  const updateIcon = (volumePercent: number, muted: boolean = false) => {
    if (muted || volumePercent === 0) {
      iconName.set(PhosphorIcons.SpeakerX);
    } else if (volumePercent < 33) {
      iconName.set(PhosphorIcons.SpeakerLow);
    } else if (volumePercent < 66) {
      iconName.set(PhosphorIcons.SpeakerHigh);
    } else {
      iconName.set(PhosphorIcons.SpeakerHigh);
    }
  };

  if (audio?.defaultSpeaker) {
    // Initial icon update
    const initialVolume = Math.round(audio.defaultSpeaker.volume * 100);
    updateIcon(initialVolume, audio.defaultSpeaker.mute || false);

    // Connect to the specific speaker's notify signal for volume changes
    audio.defaultSpeaker.connect("notify::volume", (speaker: Wp.Endpoint) => {
      const volumePercent = Math.round(speaker.volume * 100);
      print("Volume changed:", volumePercent + "%");
      value.set(volumePercent);
      updateIcon(volumePercent, speaker.mute || false);
      showIndicators();
    });

    // Listen for mute changes
    audio.defaultSpeaker.connect("notify::mute", (speaker: Wp.Endpoint) => {
      const volumePercent = Math.round(speaker.volume * 100);
      updateIcon(volumePercent, speaker.mute || false);
      showIndicators();
    });

    // Also listen for default speaker changes
    audio.connect("notify::default-speaker", () => {
      if (audio.defaultSpeaker) {
        const volumePercent = Math.round(audio.defaultSpeaker.volume * 100);
        value.set(volumePercent);
        updateIcon(volumePercent, audio.defaultSpeaker.mute || false);

        // Re-connect to the new speaker's volume changes
        audio.defaultSpeaker.connect("notify::volume", (speaker: Wp.Endpoint) => {
          const volumePercent = Math.round(speaker.volume * 100);
          print("Volume changed:", volumePercent + "%");
          value.set(volumePercent);
          updateIcon(volumePercent, speaker.mute || false);
          showIndicators();
        });

        audio.defaultSpeaker.connect("notify::mute", (speaker: Wp.Endpoint) => {
          const volumePercent = Math.round(speaker.volume * 100);
          updateIcon(volumePercent, speaker.mute || false);
          showIndicators();
        });
      }
    });
  }

  return (
    <IndicatorCard
      {...props}
      cssName={`osd-volume`}
      icon={<PhosphorIcon iconName={bind(iconName)} size={16} />}
      value={bind(value)}
    />
  );
};
