import { Widget, Gtk } from "astal/gtk4";
import { Variable, Binding, bind } from "astal";
import { TrackTitleProps } from "./types";
import { barLogger as log } from "../../../../utils/logger";
import { truncateText } from "../../../../utils";
import { c } from "../../../../utils/style";

export const TrackTitle = (props: TrackTitleProps) => {
  function trimTrackTitle(title: string) {
    if (!title || typeof title !== "string") return "";
    const cleanPatterns = [
      /【[^】]*】/, // Touhou n weeb stuff
      " [FREE DOWNLOAD]", // F-777
    ];
    cleanPatterns.forEach((expr) => (title = title.replace(expr, "")));
    return truncateText(title, 20);
  }

  const trimmedTitle = new Variable(trimTrackTitle(props.title.get()));
  const artist = new Variable(props.artist.get());

  props.title.subscribe((title: string) => {
    log.debug("Track title changed", { title });
    trimmedTitle.set(trimTrackTitle(title));
    artist.set(props.artist.get());
  });

  return (
    <label
      cssClasses={c`txt-smallie bar-music-txt`}
      marginStart={8}
      label={bind(trimmedTitle).as((v) => {
        if (!v) return "";
        // Add artist to track title if present 
        if (artist.get()) {
          return `${v} - ${artist.get()}`;
        }
        return v;
      })}
    ></label >
  );
};

export default TrackTitle;
