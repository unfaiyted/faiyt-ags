import { Widget, Gtk } from "astal/gtk4";
import { IndicatorCard, showIndicators } from "./index";
import Wp from "gi://AstalWp";
import { Variable, bind } from "astal";
import { PhosphorIcon } from "../../utils/icons/phosphor";
import { PhosphorIcons } from "../../utils/icons/types";
import { createLogger } from "../../../utils/logger";

const log = createLogger("VolumeIndicator");

const audio = Wp.get_default()?.audio;

export const VolumeIndicator = (props: Widget.BoxProps) => {
  log.debug("Creating volume indicator widget");
  
  // Convert from 0-1 range to 0-100 for the progress bar
  const value = Variable(audio?.defaultSpeaker?.volume ? audio.defaultSpeaker.volume * 100 : 0);
  const iconName = Variable(PhosphorIcons.SpeakerHigh);

  const updateIcon = (volumePercent: number, muted: boolean = false) => {
    let newIcon: string;
    if (muted || volumePercent === 0) {
      newIcon = PhosphorIcons.SpeakerX;
    } else if (volumePercent < 33) {
      newIcon = PhosphorIcons.SpeakerLow;
    } else if (volumePercent < 66) {
      newIcon = PhosphorIcons.SpeakerHigh;
    } else {
      newIcon = PhosphorIcons.SpeakerHigh;
    }
    log.debug("Updating volume icon", { volumePercent, muted, icon: newIcon });
    iconName.set(newIcon);
  };

  if (audio?.defaultSpeaker) {
    // Initial icon update
    const initialVolume = Math.round(audio.defaultSpeaker.volume * 100);
    log.debug("Initial volume", { volume: initialVolume, muted: audio.defaultSpeaker.mute });
    updateIcon(initialVolume, audio.defaultSpeaker.mute || false);

    // Connect to the specific speaker's notify signal for volume changes
    audio.defaultSpeaker.connect("notify::volume", (speaker: Wp.Endpoint) => {
      const volumePercent = Math.round(speaker.volume * 100);
      log.debug("Volume changed", { volume: volumePercent });
      value.set(volumePercent);
      updateIcon(volumePercent, speaker.mute || false);
      showIndicators();
    });

    // Listen for mute changes
    audio.defaultSpeaker.connect("notify::mute", (speaker: Wp.Endpoint) => {
      const volumePercent = Math.round(speaker.volume * 100);
      log.debug("Mute state changed", { muted: speaker.mute });
      updateIcon(volumePercent, speaker.mute || false);
      showIndicators();
    });

    // Also listen for default speaker changes
    audio.connect("notify::default-speaker", () => {
      log.debug("Default speaker changed");
      if (audio.defaultSpeaker) {
        const volumePercent = Math.round(audio.defaultSpeaker.volume * 100);
        value.set(volumePercent);
        updateIcon(volumePercent, audio.defaultSpeaker.mute || false);

        // Re-connect to the new speaker's volume changes
        audio.defaultSpeaker.connect("notify::volume", (speaker: Wp.Endpoint) => {
          const volumePercent = Math.round(speaker.volume * 100);
          log.debug("Volume changed on new speaker", { volume: volumePercent });
          value.set(volumePercent);
          updateIcon(volumePercent, speaker.mute || false);
          showIndicators();
        });

        audio.defaultSpeaker.connect("notify::mute", (speaker: Wp.Endpoint) => {
          const volumePercent = Math.round(speaker.volume * 100);
          updateIcon(volumePercent, speaker.mute || false);
          showIndicators();
        });
      } else {
        log.warn("No default speaker available");
      }
    });
  } else {
    log.warn("Audio service not available");
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
