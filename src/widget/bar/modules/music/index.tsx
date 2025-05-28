import { Widget, Gtk } from "astal/gtk4";
import { Variable, bind, timeout, interval } from "astal";
import Mpris from "gi://AstalMpris";
import BarGroup from "../../utils/bar-group";
import PlayingState from "./playing-state";
import { Fixed } from "../../../utils/containers/drawing-area";
import TrackTitle from "./track-title";
import TrackProgress from "./progress-indicator";
import { barLogger as log } from "../../../../utils/logger";
import { showMusicOverlay } from "../../../overlays/music-window";
import { setupCursorHover } from "../../../utils/buttons";

const mpris = Mpris.get_default();

export interface MusicModuleProps extends Widget.BoxProps {
  monitorIndex?: number;
}

export default function Music(props: MusicModuleProps) {
  let lastPlayer: Mpris.Player | null = mpris.get_players()[0];
  let titleRevealTimeout: ReturnType<typeof timeout> | null = null;
  let positionInterval: ReturnType<typeof interval> | null = null;

  const player = new Variable<Mpris.Player | null>(mpris.get_players()[0] || null).poll(1000, () => {
    const currentPlayer = mpris.get_players()[0];

    if (!currentPlayer) {
      if (lastPlayer) {
        // Player was removed
        updatePlayer(null);
        lastPlayer = null;
      }
      return null;
    }

    log.debug("Current player", { identity: currentPlayer.identity });

    // Update if player changed or if we didn't have one before
    if (!lastPlayer || currentPlayer.identity !== lastPlayer.identity) {
      log.info("Player changed", { identity: currentPlayer.identity });
      updatePlayer(currentPlayer);
      lastPlayer = currentPlayer;
    }

    return currentPlayer;
  });

  const playerCount = new Variable(mpris.get_players().length);
  const hasPlayer = Variable(mpris.get_players().length > 0);

  // Track state
  const value = new Variable(0);
  const position = new Variable(0);
  const title = new Variable("");
  const artist = new Variable("");
  const album = new Variable("");

  // Initialize playback status with current player status if available
  const initialPlayer = mpris.get_players()[0];
  const playbackStatus = Variable<Mpris.PlaybackStatus | null>(
    initialPlayer ? initialPlayer.playbackStatus : null
  );

  // Revealer state for title
  const showTitle = Variable(false);
  const lastTitle = Variable("");

  if (mpris) {
    mpris.connect("player-closed", () => {
      log.info("Player closed");
      const players = mpris.get_players();
      hasPlayer.set(players.length > 0);
      updatePlayer(players[0] || null);
    });

    mpris.connect("player-added", () => {
      log.info("Player added");
      const players = mpris.get_players();
      hasPlayer.set(players.length > 0);
      updatePlayer(players[0]);
    });
  }

  const updatePositionPolling = (status: Mpris.PlaybackStatus | null) => {
    if (status === Mpris.PlaybackStatus.PLAYING) {
      if (!positionInterval) {
        positionInterval = interval(500, () => {
          const currentPlayer = player.get();
          if (currentPlayer && currentPlayer.length > 0) {
            position.set(currentPlayer.position);
            value.set(currentPlayer.position / currentPlayer.length);
          }
        });
      }
    } else {
      if (positionInterval) {
        positionInterval.cancel();
        positionInterval = null;
      }
    }
  };

  const updatePlayer = (currentPlayer: Mpris.Player | null) => {
    log.debug("Updating player");
    player.set(currentPlayer);
    playerCount.set(mpris.get_players().length);

    if (currentPlayer) {
      // Update initial values
      const pos = currentPlayer.length > 0 ? currentPlayer.position / currentPlayer.length : 0;
      value.set(pos);
      position.set(currentPlayer.position);
      title.set(currentPlayer.title || "");
      artist.set(currentPlayer.artist || "");
      album.set(currentPlayer.album || "");
      const initialStatus = currentPlayer.playbackStatus || Mpris.PlaybackStatus.STOPPED;
      playbackStatus.set(initialStatus);

      // Start or stop position polling based on initial status
      updatePositionPolling(initialStatus);

      log.debug("Initial player state", {
        title: currentPlayer.title,
        playbackStatus: currentPlayer.playbackStatus,
        position: currentPlayer.position,
        length: currentPlayer.length
      });

      // Listen for all property changes
      currentPlayer.connect("notify", (player, pspec) => {
        log.debug("Player property changed", { property: pspec?.name });

        // Update playback status and handle position polling
        const newStatus = player.playbackStatus;
        if (pspec?.name === "playback-status") {
          playbackStatus.set(newStatus);
          updatePositionPolling(newStatus);
        }

        // Only update position manually if not playing (playing uses interval)
        if (newStatus !== Mpris.PlaybackStatus.PLAYING) {
          const newPos = player.length > 0 ? player.position / player.length : 0;
          position.set(player.position);
          value.set(newPos);
        }

        // Check if track changed
        const newTitle = player.title || "";
        if (newTitle !== lastTitle.get() && newTitle !== "") {
          lastTitle.set(newTitle);
          title.set(newTitle);
          artist.set(player.artist || "");
          album.set(player.album || "");

          // Show title revealer for 5 seconds
          showTitle.set(true);

          // Cancel previous timeout if exists
          if (titleRevealTimeout) {
            titleRevealTimeout.cancel();
          }

          // Hide after 5 seconds
          titleRevealTimeout = timeout(5000, () => {
            showTitle.set(false);
            titleRevealTimeout = null;
          });
        }
      });
    } else {
      // No player, reset everything
      value.set(0);
      position.set(0);
      title.set("");
      artist.set("");
      album.set("");
      playbackStatus.set(null);
      showTitle.set(false);

      // Stop position polling
      updatePositionPolling(null);

      if (titleRevealTimeout) {
        titleRevealTimeout.cancel();
        titleRevealTimeout = null;
      }
    }
  };

  const handleClick = () => {
    // Show the music overlay
    let monitorIndex = props.monitorIndex || 0;
    showMusicOverlay(monitorIndex);
  };

  // Initialize with current player if available
  if (initialPlayer) {
    updatePlayer(initialPlayer);
  }

  return (
    <revealer
      transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}
      transitionDuration={300}
      revealChild={bind(hasPlayer)}
      onDestroy={() => {
        // Clean up intervals when widget is destroyed
        if (positionInterval) {
          positionInterval.cancel();
          positionInterval = null;
        }
        if (titleRevealTimeout) {
          titleRevealTimeout.cancel();
          titleRevealTimeout = null;
        }
      }}
    >
      <button
        setup={setupCursorHover}
        cssName="bar-music-btn"
        onClicked={handleClick}>
        <BarGroup>
          <box spacing={6}>
            {/* Playing state indicator - always visible when player exists */}
            <Fixed marginTop={3} widthRequest={24} heightRequest={24}>
              <TrackProgress value={bind(value)} />
              <PlayingState status={bind(playbackStatus)} />
            </Fixed>

            {/* Track title - only visible for 5 seconds after track change */}
            <revealer
              transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}
              transitionDuration={400}
              revealChild={bind(showTitle)}
            >
              <box marginEnd={10}>
                <TrackTitle title={bind(title)} artist={bind(artist)} />
              </box>
            </revealer>
          </box>
        </BarGroup>
      </button>
    </revealer>
  );
}
