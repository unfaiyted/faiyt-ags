import { Widget, Gtk, Gdk } from "astal/gtk4";
import { Variable, bind, interval } from "astal";
import { Fixed } from "../../utils/containers/drawing-area";
import Mpris from "gi://AstalMpris";
import { PhosphorIcon } from "../../utils/icons/phosphor";
import { PhosphorIcons, PhosphorIconStyle } from "../../utils/icons/types";
import { setupCursorHover } from "../../utils/buttons";
import { createLogger } from "../../../utils/logger";
import { truncateText } from "../../../utils";

const log = createLogger("MusicControls");

interface MusicControlsProps extends Widget.BoxProps {
  player: Mpris.Player;
  onClose?: () => void;
}

// Helper to convert art URL to file path
function getImagePath(url: string): string {
  if (!url) return "";

  // Handle file:// URLs
  if (url.startsWith("file://")) {
    return url.substring(7); // Remove "file://" prefix
  }

  // For HTTP URLs, we might need to download/cache them
  // For now, we'll just return empty and show placeholder
  if (url.startsWith("http://") || url.startsWith("https://")) {
    log.debug("HTTP album art not yet supported", { url });
    return "";
  }

  return url;
}

export default function MusicControls({ player, onClose, ...props }: MusicControlsProps) {
  // Player state
  const title = Variable(player.title || "Unknown");
  const artist = Variable(player.artist || "Unknown Artist");
  const album = Variable(player.album || "");
  const artUrl = Variable(player.artUrl || "");
  const canGoPrevious = Variable(player.canGoPrevious);
  const canGoNext = Variable(player.canGoNext);
  const canPlay = Variable(player.canPlay);
  const canPause = Variable(player.canPause);
  const playbackStatus = Variable(player.playbackStatus);
  const position = Variable(player.position);
  const length = Variable(player.length);

  // Track last known position when paused
  let lastPausedPosition = player.position;
  let positionInterval: ReturnType<typeof interval> | null = null;

  // Start or stop position polling based on playback status
  const updatePositionPolling = (status: Mpris.PlaybackStatus) => {
    if (status === Mpris.PlaybackStatus.PLAYING) {
      // Start polling position every 500ms when playing
      if (!positionInterval) {
        positionInterval = interval(500, () => {
          position.set(player.position);
        });
      }
    } else {
      // Stop polling when paused/stopped
      if (positionInterval) {
        positionInterval.cancel();
        positionInterval = null;
      }
      // Keep the last position when paused
      if (status === Mpris.PlaybackStatus.PAUSED) {
        lastPausedPosition = player.position;
        position.set(lastPausedPosition);
      }
    }
  };

  // Update bindings when player properties change
  player.connect("notify", (p, pspec) => {
    // Only update non-position properties here
    title.set(player.title || "Unknown");
    artist.set(player.artist || "Unknown Artist");
    album.set(player.album || "");
    artUrl.set(player.artUrl || "");
    canGoPrevious.set(player.canGoPrevious);
    canGoNext.set(player.canGoNext);
    canPlay.set(player.canPlay);
    canPause.set(player.canPause);
    length.set(player.length);

    // Handle playback status changes
    const newStatus = player.playbackStatus;
    if (newStatus !== playbackStatus.get()) {
      playbackStatus.set(newStatus);
      updatePositionPolling(newStatus);
    }

    // Only update position if we're playing or if it's a seek
    if (pspec?.name === "position" && player.playbackStatus === Mpris.PlaybackStatus.PLAYING) {
      position.set(player.position);
    }
  });

  // Initialize position polling based on current status
  updatePositionPolling(player.playbackStatus);

  const handlePlayPause = () => {
    if (player.playbackStatus === Mpris.PlaybackStatus.PLAYING) {
      player.pause();
    } else {
      player.play();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <box
      cssName="music-controls"
      halign={Gtk.Align.START}
      setup={(self) => {
        // Cleanup interval when widget is destroyed
        self.connect("destroy", () => {
          if (positionInterval) {
            positionInterval.cancel();
            positionInterval = null;
          }
        });
      }}
      {...props}
    >
      {/* Album Art */}
      <box cssName="music-album-art-container" valign={Gtk.Align.CENTER} overflow={Gtk.Overflow.HIDDEN}>
        {bind(artUrl).as((url) => {
          const imagePath = getImagePath(url);
          return imagePath ? (
            <image
              cssName="music-album-art"
              overflow={Gtk.Overflow.HIDDEN}
              file={imagePath}
            />
          ) : (
            <box cssName="music-album-art-placeholder">
              <PhosphorIcon iconName={PhosphorIcons.MusicNotes} size={40} />
            </box>
          );
        })}
      </box>

      {/* Track Info and Controls */}
      <box vertical cssName="music-info-controls" hexpand valign={Gtk.Align.CENTER}>
        {/* Track Info */}
        <box vertical cssName="music-track-info" vexpand valign={Gtk.Align.CENTER}>
          <label
            cssName="music-title"
            label={bind(title).as(v => truncateText(v, 40))}
            halign={Gtk.Align.START}
          />
          <label
            cssName="music-artist"
            label={bind(artist).as(v => truncateText(v, 35))}
            halign={Gtk.Align.START}
          />
          {bind(album).as((a) =>
            a ? (
              <label
                cssName="music-album"
                label={truncateText(a, 40)}
                halign={Gtk.Align.START}
              />
            ) : <label cssName="music-album"></label>
          )}
        </box>

        {/* Progress Bar and Controls */}
        <box cssName="music-progress-section" spacing={12} valign={Gtk.Align.START}>
          {/* Progress Bar with Time Labels */}
          <box cssName="music-progress-wrapper" vertical spacing={2} hexpand>
            <Fixed>
              <box cssName="music-progress-bar" />
              <box
                marginTop={1}
                cssName="music-progress-fill"
                halign={Gtk.Align.START}
                hexpand={false}
                widthRequest={bind(Variable.derive([position, length], (pos, len) => {
                  if (len === 0) return 0;
                  return Math.floor((pos / len) * 200); // Reduced to fit with buttons
                }))}
                setup={(self: Gtk.Box) => {
                }}
              />
            </Fixed>

            {/* Time Labels aligned with progress bar */}
            <box cssName="music-time-labels">
              <label
                cssName="music-time"
                label={bind(position).as(formatTime)}
              />
              <box hexpand />
              <label
                cssName="music-time"
                label={bind(length).as(formatTime)}
              />
            </box>
          </box>

          {/* Control Buttons */}
          <box cssName="music-control-buttons" spacing={6} valign={Gtk.Align.START} overflow={Gtk.Overflow.VISIBLE}>
            <button
              cssName="music-control-button-small"
              setup={setupCursorHover}
              sensitive={bind(canGoPrevious)}
              onClicked={() => player.previous()}
            >
              <box halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER}>
                <PhosphorIcon iconName={PhosphorIcons.SkipBack} style={PhosphorIconStyle.Fill} size={14} />
              </box>
            </button>

            <button
              cssName="music-control-button-small"
              cssClasses={["music-play-pause"]}
              overflow={Gtk.Overflow.VISIBLE}
              setup={setupCursorHover}
              sensitive={bind(Variable.derive([canPlay, canPause], (play, pause) => play || pause))}
              onClicked={handlePlayPause}
            >
              <box halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER}>
                {bind(playbackStatus).as((status) =>
                  status === Mpris.PlaybackStatus.PLAYING ? (
                    <PhosphorIcon iconName={PhosphorIcons.Pause} style={PhosphorIconStyle.Fill} size={16} />
                  ) : (
                    <PhosphorIcon iconName={PhosphorIcons.Play} style={PhosphorIconStyle.Fill} size={16} />
                  )
                )}
              </box>
            </button>

            <button
              cssName="music-control-button-small"
              sensitive={bind(canGoNext)}
              setup={setupCursorHover}
              onClicked={() => player.next()}
            >
              <box halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER}>
                <PhosphorIcon iconName={PhosphorIcons.SkipForward} style={PhosphorIconStyle.Fill} size={14} />
              </box>
            </button>
          </box>
        </box>
      </box>

      {/* Close Button */}
      <button
        cssName="music-close-button"
        setup={setupCursorHover}
        valign={Gtk.Align.START}
        onClicked={onClose}
      >
        <PhosphorIcon iconName={PhosphorIcons.X} size={14} />
      </button>
    </box>
  );
}
