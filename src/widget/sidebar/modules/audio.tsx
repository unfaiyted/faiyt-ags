import { Widget, Gtk } from "astal/gtk4";
import { Variable, bind, execAsync } from "astal";
import Wp from "gi://AstalWp";
import { PhosphorIcon } from "../../utils/icons/phosphor";
import { PhosphorIcons } from "../../utils/icons/types";
import { truncateText } from "../../../utils";
import { createLogger } from "../../../utils/logger";
import { setupCursorHover } from "../../utils/buttons";

const log = createLogger("AudioModule");

const wp = Wp.get_default();
const audio = wp?.audio;

// Debug: Check what's available
if (wp) {
  log.info("WirePlumber available");
  log.debug("Audio service status", { available: !!audio });
  if (audio) {
    log.debug("Audio devices", {
      defaultSpeaker: audio.default_speaker?.description || "none",
      defaultMicrophone: audio.default_microphone?.description || "none",
      speakerCount: audio.speakers?.length || 0,
      microphoneCount: audio.microphones?.length || 0,
      streamCount: audio.streams?.length || 0
    });
  }
} else {
  log.warn("WirePlumber not available");
}

// Get volume icon based on level and mute state
const getVolumeIcon = (volume: number, muted: boolean = false): PhosphorIcons => {
  if (muted || volume === 0) return PhosphorIcons.SpeakerX;
  if (volume < 33) return PhosphorIcons.SpeakerLow;
  if (volume < 66) return PhosphorIcons.SpeakerHigh;
  return PhosphorIcons.SpeakerHigh;
};

const getMicIcon = (volume: number, muted: boolean = false): PhosphorIcons => {
  if (muted || volume === 0) return PhosphorIcons.MicrophoneSlash;
  return PhosphorIcons.Microphone;
};

// Volume slider component
const VolumeSlider = ({
  value,
  onChanged,
  muted = false,
  onMuteToggle,
  icon
}: {
  value: number | any; // Can be number or binding
  onChanged: (value: number) => void;
  muted?: boolean | any; // Can be boolean or binding
  onMuteToggle?: () => void;
  icon?: PhosphorIcons | any; // Can be icon or binding
}) => {
  return (
    <box cssName="volume-control" spacing={8}>
      {onMuteToggle && (
        <button
          cssName="volume-mute-btn"
          setup={setupCursorHover}
          onClicked={onMuteToggle}
          tooltip_text={muted ? "Unmute" : "Mute"}
        >
          <PhosphorIcon
            iconName={icon || getVolumeIcon(value, muted)}
            size={16}
          />
        </button>
      )}
      <box cssName="volume-slider-container">
        <slider
          cssName="volume-slider"
          hexpand
          drawValue={false}
          min={0}
          max={1.5}
          value={value}
          onValueChanged={(self) => onChanged(self.value)}
        />
      </box>
      <label
        cssName="volume-label"
        label={typeof value === 'number' ? `${Math.round(value * 100)}%` : bind(value).as(v => `${Math.round(v * 100)}%`)}
        widthChars={4}
      />
    </box>
  );
};

// Audio device section (speakers and microphones)
const AudioDevices = () => {
  // Use IDs instead of objects for more reliable reactivity
  const defaultSpeakerId = Variable<number | null>(audio?.default_speaker?.id || null);
  const defaultMicrophoneId = Variable<number | null>(audio?.default_microphone?.id || null);
  const speakers = Variable(audio?.speakers || []);
  const microphones = Variable(audio?.microphones || []);

  // Initialize defaults if not set
  const initializeDefaults = async () => {
    if (audio) {
      log.debug("Initializing audio defaults");
      log.debug("Available devices", {
        speakers: audio.speakers?.map(s => ({ id: s.id, name: s.description })),
        microphones: audio.microphones?.map(m => ({ id: m.id, name: m.description }))
      });

      // First check if AstalWp already has defaults
      if (audio.default_speaker) {
        log.debug("AstalWp default speaker", {
          name: audio.default_speaker.description,
          id: audio.default_speaker.id
        });
        defaultSpeakerId.set(audio.default_speaker.id);
      } else {
        log.debug("No default speaker from AstalWp");
      }

      if (audio.default_microphone) {
        log.debug("AstalWp default microphone", {
          name: audio.default_microphone.description,
          id: audio.default_microphone.id
        });
        defaultMicrophoneId.set(audio.default_microphone.id);
      } else {
        log.debug("No default microphone from AstalWp");
      }

      // Always get wpctl status to find defaults
      try {
        const wpctlStatus = await execAsync(["wpctl", "status"]);
        const lines = wpctlStatus.split('\n');

        let inSinks = false;
        let inSources = false;

        for (const line of lines) {
          // Track sections
          if (line.includes("Sinks:")) {
            inSinks = true;
            inSources = false;
          } else if (line.includes("Sources:")) {
            inSinks = false;
            inSources = true;
          } else if (line.includes("Sink endpoints:") || line.includes("Source endpoints:") || line.includes("Video")) {
            inSinks = false;
            inSources = false;
          }

          // Look for default devices (marked with *)
          if (line.includes("*") && (inSinks || inSources)) {
            const match = line.match(/\*?\s*(\d+)\./);
            if (match) {
              const id = match[1];
              log.debug("Found default device in wpctl", { line: line.trim(), id });

              if (inSinks) {
                const speaker = audio.speakers?.find(s => String(s.id) === id);
                if (speaker) {
                  log.info("Setting default speaker", {
                    name: speaker.description,
                    id: speaker.id
                  });
                  defaultSpeakerId.set(speaker.id);
                } else {
                  log.warn("Speaker not found", { id, availableIds: audio.speakers?.map(s => s.id) });
                }
              } else if (inSources) {
                // Skip monitor sources
                if (!line.toLowerCase().includes("monitor")) {
                  const mic = audio.microphones?.find(m => String(m.id) === id);
                  if (mic) {
                    log.debug("Setting default microphone", {
                      name: mic.description,
                      id: mic.id
                    });
                    defaultMicrophoneId.set(mic.id);
                  } else {
                    log.debug("Microphone not found", { id, availableIds: audio.microphones?.map(m => m.id) });
                  }
                }
              }
            }
          }
        }
      } catch (e) {
        log.error("Failed to get defaults from wpctl status", { error: e });
      }

      log.debug("Audio defaults initialized", {
        defaultSpeakerId: defaultSpeakerId.get() || "none",
        defaultMicrophoneId: defaultMicrophoneId.get() || "none"
      });
    }
  };

  // Initialize on creation
  initializeDefaults();

  // Try multiple times with increasing delays
  const retryDelays = [100, 500, 1000];
  retryDelays.forEach(delay => {
    setTimeout(() => {
      if (!defaultSpeakerId.get() || !defaultMicrophoneId.get()) {
        log.debug("Retrying audio initialization", { delay });
        initializeDefaults();
      }
    }, delay);
  });

  // Subscribe to changes
  audio?.connect("notify", () => {
    const prevSpeakerId = defaultSpeakerId.get();
    const prevMicId = defaultMicrophoneId.get();

    defaultSpeakerId.set(audio.default_speaker?.id || null);
    defaultMicrophoneId.set(audio.default_microphone?.id || null);
    speakers.set(audio.speakers || []);
    microphones.set(audio.microphones || []);

    // Log changes
    if (prevSpeakerId !== audio.default_speaker?.id) {
      log.debug("Default speaker changed", {
        from: prevSpeakerId,
        to: audio.default_speaker?.id,
        name: audio.default_speaker?.description || "none"
      });
    }
    if (prevMicId !== audio.default_microphone?.id) {
      log.debug("Default microphone changed", {
        from: prevMicId,
        to: audio.default_microphone?.id,
        name: audio.default_microphone?.description || "none"
      });
    }
  });

  // Also listen for when new devices are added
  audio?.connect("device-added", () => {
    speakers.set(audio.speakers || []);
    microphones.set(audio.microphones || []);
    // Re-check defaults when devices are added
    if (!defaultSpeakerId.get() || !defaultMicrophoneId.get()) {
      initializeDefaults();
    }
  });

  const DeviceItem = ({ device, type }: { device: any; type: "speaker" | "microphone" }) => {
    // Create reactive variables for device properties
    const deviceVolume = Variable(device.volume);
    const deviceMuted = Variable(device.muted);

    // Subscribe to device changes
    device.connect("notify", () => {
      deviceVolume.set(device.volume);
      deviceMuted.set(device.muted);
    });

    const isDefault = bind(type === "speaker" ? defaultSpeakerId : defaultMicrophoneId).as(defId => {
      const result = defId === device.id;
      if (result) {
        log.debug("Device is default", {
          name: device.description,
          id: device.id,
          type
        });
      }
      return result;
    });

    const handleSetDefault = async () => {
      try {
        log.debug("Setting default device", {
          type,
          name: device.description,
          id: device.id
        });

        if (type === "speaker") {
          // Try to set via the audio object first
          try {
            audio.default_speaker = device;
            defaultSpeakerId.set(device.id);
          } catch (e) {
            // Fallback to wpctl command
            log.debug("Falling back to wpctl for speaker", { id: device.id });
            await execAsync(["wpctl", "set-default", String(device.id)]);
            // Update our variable directly
            defaultSpeakerId.set(device.id);
          }
        } else {
          // For microphones, use wpctl directly since the property might not be writable
          log.debug("Using wpctl to set default microphone", { id: device.id });
          await execAsync(["wpctl", "set-default", String(device.id)]);
          // Update our variable directly
          defaultMicrophoneId.set(device.id);
        }

        // Also re-initialize to ensure sync
        setTimeout(() => initializeDefaults(), 100);
      } catch (error) {
        log.error("Failed to set default device", { type, error });
      }
    };

    const handleVolumeChange = (value: number) => {
      device.volume = value;
    };

    const handleMuteToggle = () => {
      device.muted = !device.muted;
    };

    return (
      <box cssName="audio-device-item" vertical spacing={8}>
        <box spacing={12}>
          <button
            setup={setupCursorHover}
            cssName="audio-device-select"
            cssClasses={bind(isDefault).as(def => def ? ["default"] : [])}
            onClicked={handleSetDefault}
            hexpand
          >
            <box spacing={12}>
              <box cssName="audio-device-icon-wrapper" >
                <PhosphorIcon
                  marginStart={8}
                  iconName={type === "speaker" ? PhosphorIcons.SpeakerHigh : PhosphorIcons.Microphone}
                  size={20}
                />
              </box>
              <box vertical hexpand>
                <label
                  cssName="audio-device-name"
                  xalign={0}
                  label={truncateText(device.description || device.name, 15)}
                />
                {bind(isDefault).as(def => def ? (
                  <label
                    cssName="audio-device-status"
                    xalign={0}
                    label="Default"
                  />
                ) : <label></label>)}
              </box>
              {bind(isDefault).as(def => def ? (
                <PhosphorIcon
                  iconName={PhosphorIcons.Check}
                  size={16}
                  cssClasses={["audio-device-check"]}
                />
              ) : <label></label>)}
            </box>
          </button>
        </box>
        {bind(isDefault).as(def => def ? (
          <VolumeSlider
            value={bind(deviceVolume)}
            onChanged={handleVolumeChange}
            muted={bind(deviceMuted)}
            onMuteToggle={handleMuteToggle}
            icon={type === "speaker"
              ? bind(deviceVolume).as(v => bind(deviceMuted).as(m => getVolumeIcon(v * 100, m)))
              : bind(deviceVolume).as(v => bind(deviceMuted).as(m => getMicIcon(v * 100, m)))
            }
          />
        ) : <label />)}
      </box>
    );
  };

  return (
    <box cssName="audio-devices-container" spacing={16}>
      {/* Speakers Section - Left Side */}
      <box cssName="audio-devices-column" vertical spacing={12} hexpand>
        <label cssName="audio-section-title" xalign={0} label="Output Devices" />
        <box vertical spacing={8}>
          {bind(speakers).as(spkrs =>
            spkrs.length > 0 ? (
              spkrs.map(speaker => <DeviceItem device={speaker} type="speaker" />)
            ) : (
              <label cssName="audio-no-devices" label="No output devices found" />
            )
          )}
        </box>
      </box>

      {/* Microphones Section - Right Side */}
      <box cssName="audio-devices-column" vertical spacing={12} hexpand>
        <label cssName="audio-section-title" xalign={0} label="Input Devices" />
        <box vertical spacing={8}>
          {bind(microphones).as(mics =>
            mics.length > 0 ? (
              mics.map(mic => <DeviceItem device={mic} type="microphone" />)
            ) : (
              <label cssName="audio-no-devices" label="No input devices found" />
            )
          )}
        </box>
      </box>
    </box>
  );
};

// App volume mixer
const AppVolumeMixer = () => {
  const streams = Variable(audio?.streams || []);
  const showAll = Variable(false);

  // Debug: Log initial streams
  log.debug("Initial streams", {
    count: audio?.streams?.length || 0,
    streams: audio?.streams?.map(s => ({
      name: s.name,
      description: s.description,
      volume: s.volume
    }))
  });

  // Subscribe to stream changes
  audio?.connect("notify::streams", () => {
    const newStreams = audio.streams || [];
    log.debug("Streams updated", {
      count: newStreams.length,
      streams: newStreams.map(s => ({
        name: s.name,
        description: s.description,
        volume: s.volume
      }))
    });
    streams.set(newStreams);
  });

  // Also listen for stream-added and stream-removed events
  audio?.connect("stream-added", (_, stream) => {
    log.debug("Stream added", {
      name: stream.name,
      description: stream.description
    });
    streams.set(audio.streams || []);
  });

  audio?.connect("stream-removed", (_, stream) => {
    log.debug("Stream removed", {
      name: stream.name,
      description: stream.description
    });
    streams.set(audio.streams || []);
  });

  const StreamItem = ({ stream }: { stream: any }) => {
    // Create reactive variables for stream properties
    const streamVolume = Variable(stream.volume);
    const streamMuted = Variable(stream.muted || false);

    // Subscribe to stream changes
    stream.connect("notify", () => {
      streamVolume.set(stream.volume);
      streamMuted.set(stream.muted || false);
    });

    const handleVolumeChange = (value: number) => {
      stream.volume = value;
    };

    const handleMuteToggle = () => {
      stream.muted = !stream.muted;
    };

    // Get app icon based on name
    const getAppIcon = () => {
      const name = stream.name?.toLowerCase() || "";
      const description = stream.description?.toLowerCase() || "";

      if (name.includes("firefox") || description.includes("firefox")) return PhosphorIcons.FireFox;
      if (name.includes("chrome") || description.includes("chrome")) return PhosphorIcons.ChromeLogo;
      if (name.includes("spotify") || description.includes("spotify")) return PhosphorIcons.SpotifyLogo;
      if (name.includes("discord") || description.includes("discord")) return PhosphorIcons.DiscordLogo;
      if (name.includes("video") || name.includes("mpv") || description.includes("video")) return PhosphorIcons.VideoCamera;
      if (name.includes("music") || name.includes("audio")) return PhosphorIcons.MusicNote;
      if (name.includes("game")) return PhosphorIcons.GameController;
      return PhosphorIcons.SpeakerHigh;
    };

    return (
      <box cssName="audio-stream-item" vertical spacing={8}>
        <box spacing={12}>
          <box cssName="audio-stream-icon-wrapper">
            <PhosphorIcon
              marginStart={8}
              iconName={getAppIcon()}
              size={18}
            />
          </box>
          <label
            cssName="audio-stream-name"
            hexpand
            xalign={0}
            label={truncateText(stream.description || stream.name || "Unknown App")}
          />
        </box>
        <VolumeSlider
          value={bind(streamVolume)}
          onChanged={handleVolumeChange}
          muted={bind(streamMuted)}
          onMuteToggle={handleMuteToggle}
        />
      </box>
    );
  };

  return (
    <box vertical spacing={12}>
      <box cssName="audio-section-header">
        <label cssName="audio-section-title" xalign={0} label="App Volume" hexpand />
        <button
          setup={setupCursorHover}
          cssName="audio-filter-btn"
          onClicked={() => showAll.set(!showAll.get())}
          tooltip_text={bind(showAll).as(s => s ? "Show playing only" : "Show all streams")}
        >
          <PhosphorIcon
            iconName={bind(showAll).as(s => s ? PhosphorIcons.Eye : PhosphorIcons.EyeSlash)}
            size={16}
          />
        </button>
      </box>
      <Gtk.ScrolledWindow
        cssName="audio-streams-scroll"
        vscrollbar_policy={Gtk.PolicyType.AUTOMATIC}
        hscrollbar_policy={Gtk.PolicyType.NEVER}
        heightRequest={320}
      >
        <box vertical spacing={8}>
          {bind(streams).as(strms => {
            // Filter out monitor streams and other system streams unless showing all
            let appStreams = strms;

            // Also check for recording streams if regular streams are empty
            if (appStreams.length === 0 && audio?.recorders) {
              log.debug("No playback streams, using recorders", {
                recorderCount: audio.recorders.length
              });
              appStreams = audio.recorders;
            }

            if (!showAll.get()) {
              appStreams = appStreams.filter(s =>
                s.name &&
                !s.name.toLowerCase().includes("monitor") &&
                !s.name.toLowerCase().includes("system") &&
                !s.name.toLowerCase().includes("peak detect")
              );
            }

            return appStreams.length > 0 ? (
              appStreams.map(stream => <StreamItem stream={stream} />)
            ) : (
              <box cssName="audio-no-streams" vertical spacing={8}>
                <PhosphorIcon iconName={PhosphorIcons.SpeakerNone} size={48} />
                <label label="No applications playing audio" />
              </box>
            );
          })}
        </box>
      </Gtk.ScrolledWindow>
    </box>
  );
};

export default function AudioModules(props: Widget.BoxProps) {
  const { cssName, ...restProps } = props;
  log.debug("Creating audio module widget");

  if (!audio) {
    return (
      <box cssName="audio-module" vertical spacing={16} {...restProps}>
        <box cssName="audio-error" vertical spacing={8}>
          <PhosphorIcon iconName={PhosphorIcons.Warning} size={48} />
          <label label="WirePlumber service not available" />
        </box>
      </box>
    );
  }

  return (
    <box cssName="audio-module" {...restProps}>
      <Gtk.ScrolledWindow
        vscrollbar_policy={Gtk.PolicyType.AUTOMATIC}
        hscrollbar_policy={Gtk.PolicyType.NEVER}
        vexpand
      >
        <box vertical spacing={16} cssName="audio-module-content">
          <AudioDevices />
          <AppVolumeMixer />
        </box>
      </Gtk.ScrolledWindow>
    </box>
  );
}
