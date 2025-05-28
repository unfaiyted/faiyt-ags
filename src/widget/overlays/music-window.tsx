import { Widget, Gtk, Astal, App } from "astal/gtk4";
import { Variable, bind, timeout } from "astal";
import Mpris from "gi://AstalMpris";
import { createLogger } from "../../utils/logger";
import MusicControls from "./music/music-controls";
import { PhosphorIcon } from "../utils/icons/phosphor";
import { PhosphorIcons } from "../utils/icons/types";

const log = createLogger("MusicWindow");

export interface MusicWindowProps extends Widget.WindowProps { }

// Store overlay instances for external access
const overlayInstances = new Map<number, {
  showOverlay: () => void;
  hideOverlay: () => void;
}>();

export const MusicWindow = (props: MusicWindowProps) => {
  log.debug("Creating music window", { monitor: props.monitor });

  const mpris = Mpris.get_default();
  const visible = Variable(false);
  const revealed = Variable(false);
  let hideTimeout: ReturnType<typeof timeout> | null = null;

  // Get the first available player
  const player = Variable(mpris.get_players()[0] || null);

  // Update player when players change
  mpris.connect("player-added", () => {
    const players = mpris.get_players();
    if (players.length > 0 && !player.get()) {
      player.set(players[0]);
    }
  });

  mpris.connect("player-closed", () => {
    const players = mpris.get_players();
    if (players.length > 0) {
      player.set(players[0]);
    } else {
      player.set(null);
    }
  });

  // Track when song changes
  const currentTitle = Variable("");
  const currentArtist = Variable("");

  player.subscribe((p) => {
    if (p) {
      p.connect("notify::title", () => {
        const newTitle = p.title || "";
        const newArtist = p.artist || "";

        // Show overlay when song changes
        if (newTitle !== currentTitle.get() && newTitle !== "") {
          currentTitle.set(newTitle);
          currentArtist.set(newArtist);
          showOverlay();
        }
      });
    }
  });

  const showOverlay = () => {
    log.debug("Showing music overlay");

    // Cancel any pending hide
    if (hideTimeout) {
      hideTimeout.cancel();
      hideTimeout = null;
    }

    // Show window
    visible.set(true);

    // Animate in after a brief delay
    timeout(50, () => revealed.set(true));

    // Auto-hide after 5 seconds
    hideTimeout = timeout(5000, () => {
      hideOverlay();
    });
  };

  const hideOverlay = () => {
    log.debug("Hiding music overlay");

    // Animate out
    revealed.set(false);

    // Hide window after animation
    timeout(300, () => {
      visible.set(false);
    });
  };

  // Handle mouse hover to prevent auto-hide
  const handleHover = (hovering: boolean) => {
    if (hovering && hideTimeout) {
      hideTimeout.cancel();
      hideTimeout = null;
    } else if (!hovering && visible.get()) {
      // Resume auto-hide when mouse leaves
      hideTimeout = timeout(2000, () => {
        hideOverlay();
      });
    }
  };

  // Store instance methods for external access
  overlayInstances.set(props.monitor || 0, {
    showOverlay,
    hideOverlay
  });

  return (
    <window
      {...props}
      name={`music-${props.monitor}`}
      gdkmonitor={props.gdkmonitor}
      layer={Astal.Layer.OVERLAY}
      exclusivity={Astal.Exclusivity.NORMAL}
      anchor={Astal.WindowAnchor.TOP}
      visible={bind(visible)}
      cssName="music-overlay-window"
      application={App}
    >
      <box
        setup={(self) => {
          const motionController = new Gtk.EventControllerMotion();
          motionController.connect("enter", () => handleHover(true));
          motionController.connect("leave", () => handleHover(false));
          self.add_controller(motionController);
        }}
      >
        <revealer
          transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
          transitionDuration={300}
          revealChild={bind(revealed)}
        >
          <box
            cssName="music-overlay-container"
            marginTop={10}
            halign={Gtk.Align.START}
          >
            {bind(player).as((p) =>
              p ? (
                <MusicControls
                  player={p}
                  onClose={hideOverlay}
                />
              ) : (
                <box cssName="music-overlay-empty" spacing={12}>
                  <PhosphorIcon iconName={PhosphorIcons.MusicNotes} size={24} />
                  <label label="No music playing" />
                </box>
              )
            )}
          </box>
        </revealer>
      </box>
    </window>
  );
};

export default MusicWindow;

// Export functions to show/hide the overlay manually
export function showMusicOverlay(monitor: number = 0) {
  const instance = overlayInstances.get(monitor);
  if (instance) {
    instance.showOverlay();
  }
}

export function hideMusicOverlay(monitor: number = 0) {
  const instance = overlayInstances.get(monitor);
  if (instance) {
    instance.hideOverlay();
  }
}
