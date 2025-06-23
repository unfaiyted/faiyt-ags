import { Widget } from "astal/gtk4";
import { PhosphorIcons } from "../../../utils/icons/types";
import PhosphorIcon from "../../../utils/icons/phosphor";
import { PlayingInfo } from "./types";

interface NowPlayingProps extends Widget.BoxProps {
    playingInfo: PlayingInfo | null;
    isConnected: boolean;
}

export default function NowPlaying({ playingInfo, isConnected, ...props }: NowPlayingProps) {
    if (!playingInfo || !isConnected) return <box />;

    return (
        <box {...props} cssName="remote-now-playing" vertical >
            <box spacing={8}>
                <PhosphorIcon iconName={PhosphorIcons.MusicNote} size={16} />
                <label cssName="remote-now-playing-title">{playingInfo.title}</label>
            </box>
            {playingInfo.artist ? (
                <label cssName="remote-now-playing-artist">{playingInfo.artist}</label>
            ) : <box />}
        </box>
    );
}
