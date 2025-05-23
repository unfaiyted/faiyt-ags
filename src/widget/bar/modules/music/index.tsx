import { Widget, Gtk, Gdk } from "astal/gtk4";
import { Variable, bind } from "astal";
import Mpris from "gi://AstalMpris";
import BarGroup from "../../utils/bar-group";
import PlayingState from "./playing-state";
import TrackTitle from "./track-title";
import TrackProgress from "./progress-indicator";

// TODO: Would be good if we could use a reveal animation to hide the playing text and
// double click the icon to expand it out and again to hide it so only the play icon is present.
//export interface MusicModuleProps extends Widget.BoxProps {}

const mpris = Mpris.get_default();

export default function Music() {
  // const { setup, child, } = musicModuleProps;

  let lastPlayer: Mpris.Player | null = mpris.get_players()[0];

  const player = new Variable(mpris.get_players()[0]).poll(1000, () => {
    const currentPlayer = mpris.get_players()[0];

    if (!currentPlayer) return lastPlayer;
    print("Current player:", currentPlayer.identity);
    if (lastPlayer && currentPlayer.identity === lastPlayer.identity)
      return currentPlayer;

    print("Player changed:", currentPlayer.identity);
    updatePlayer(currentPlayer);
    return mpris.get_players()[0];
  });

  const playerCount = new Variable(mpris.get_players().length);

  const value = new Variable(0);
  const title = new Variable("");
  const artist = new Variable("");
  const album = new Variable("");
  const playbackStatus = Variable<Mpris.PlaybackStatus | string>("unknown");

  if (mpris) {
    mpris.connect("player-closed", () => {
      print("Player closed");
      updatePlayer(player.get());
    });

    mpris.connect("player-added", () => {
      print("Player added");
      updatePlayer(player.get());
    });
  }

  const updatePlayer = (currentPlayer: Mpris.Player) => {
    print(`Updating player`);
    player.set(currentPlayer || mpris.get_players()[0]);
    playerCount.set(mpris.get_players().length);

    player.get().connect("notify", (p) => {
      value.set(p.position / p.length);
      title.set(p.title);
      artist.set(p.artist);
      album.set(p.album);
      playbackStatus.set(p.playbackStatus);
    });
  };

  const handleClick = () => {

    // what button did the click?
    // TODO:
    //
    // if (event.button == Gdk.BUTTON_PRIMARY) {
    //   print("Clicked");
    //   player.get().playback_status == Mpris.PlaybackStatus.PAUSED
    //     ? player.get().play()
    //     : player.get().pause();
    // } else if (event.button == Gdk.BUTTON_SECONDARY) {
    //   print("Clicked right");
    //   player.get().next();
    // } else if (event.button == Gdk.BUTTON_MIDDLE) {
    //   print("Clicked middle");
    //   player.get().previous();
    // }
  };

  if (player.get()) {
    updatePlayer(player.get());
  }

  const cssName = bind(playbackStatus).as((v) => {
    switch (v) {
      case Mpris.PlaybackStatus.PLAYING:
        return "bar-music-playstate-playing";
      case Mpris.PlaybackStatus.PAUSED:
      case Mpris.PlaybackStatus.STOPPED:
      default:
        return "bar-music-playstate";
    }
  })


  return (
    <button cssName="bar-music-btn" onClicked={handleClick}>
      <BarGroup>
        <box homogeneous={true}>
          <overlay>
            <TrackProgress value={bind(value)} />
            <box
              valign={Gtk.Align.CENTER}
              visible={bind(player).as((v) => v != null)}
              cssName={cssName.get()}
              hexpand={true}
              widthRequest={2}
              marginStart={8}
            >
              <PlayingState status={bind(playbackStatus)} />
              <TrackTitle title={bind(title)} artist={bind(artist)} />
            </box>
          </overlay>
        </box>
      </BarGroup>
    </button>

  );
}
