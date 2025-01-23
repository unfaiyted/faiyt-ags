import { Variable, bind } from "astal";
import { Widget, Gtk } from "astal/gtk4";
import { PhosphorIcons } from "../../../utils/icons/types";
import PhosphorIcon from "../../../utils/icons/phosphor";
import { setupCursorHover } from "../../../utils/buttons";

interface RemoteControlProps extends Widget.BoxProps {
    isConnected: boolean;
    isLoading?: boolean;
    onCommand: (command: string) => Promise<void>;
}

const ControlButton = ({ 
    icon, 
    command, 
    size = 24, 
    primary = false, 
    power = false,
    disabled = false,
    onCommand
}: {
    icon: PhosphorIcons;
    command: string;
    size?: number;
    primary?: boolean;
    power?: boolean;
    disabled?: boolean;
    onCommand: (command: string) => Promise<void>;
}) => {
    const isProcessing = Variable(false);
    
    return (
        <button
            cssName="remote-control-button"
            cssClasses={bind(isProcessing).as(processing => {
                const classes = [];
                if (primary) classes.push("primary");
                if (power) classes.push("power");
                if (processing) classes.push("processing");
                return classes;
            })}
            disabled={disabled}
            onClicked={async () => {
                if (isProcessing.get()) return;
                
                isProcessing.set(true);
                await onCommand(command);
                
                // Keep processing state for a moment for visual feedback
                setTimeout(() => isProcessing.set(false), 150);
            }}
            setup={setupCursorHover}
        >
            <PhosphorIcon iconName={icon} size={size} />
        </button>
    );
};

export default function RemoteControl({ isConnected, isLoading = false, onCommand, ...props }: RemoteControlProps) {
    return (
        <box {...props} cssName="remote-control-card" vertical spacing={16}>
            {/* D-Pad Navigation */}
            <box cssName="remote-dpad">
                <button
                    cssClasses={["dpad-button", "up"]}
                    onClicked={() => onCommand("up")}
                    setup={setupCursorHover}
                >
                    <PhosphorIcon iconName={PhosphorIcons.CaretUp} size={20} />
                </button>
                <button
                    cssClasses={["dpad-button", "down"]}
                    onClicked={() => onCommand("down")}
                    setup={setupCursorHover}
                >
                    <PhosphorIcon iconName={PhosphorIcons.CaretDown} size={20} />
                </button>
                <button
                    cssClasses={["dpad-button", "left"]}
                    onClicked={() => onCommand("left")}
                    setup={setupCursorHover}
                >
                    <PhosphorIcon iconName={PhosphorIcons.CaretLeft} size={20} />
                </button>
                <button
                    cssClasses={["dpad-button", "right"]}
                    onClicked={() => onCommand("right")}
                    setup={setupCursorHover}
                >
                    <PhosphorIcon iconName={PhosphorIcons.CaretRight} size={20} />
                </button>
                <button
                    cssClasses={["dpad-center"]}
                    onClicked={() => onCommand("select")}
                    setup={setupCursorHover}
                >
                    <label>OK</label>
                </button>
            </box>

            {/* Menu Controls */}
            <box spacing={12} halign={Gtk.Align.CENTER}>
                <ControlButton 
                    icon={PhosphorIcons.ArrowLeft} 
                    command="menu" 
                    disabled={!isConnected}
                    onCommand={onCommand}
                />
                <ControlButton 
                    icon={PhosphorIcons.House} 
                    command="home" 
                    size={28} 
                    disabled={!isConnected}
                    onCommand={onCommand}
                />
                <ControlButton 
                    icon={PhosphorIcons.Television} 
                    command="tv" 
                    disabled={!isConnected}
                    onCommand={onCommand}
                />
            </box>

            {/* Playback Controls */}
            <box vertical spacing={12}>
                <box spacing={8} halign={Gtk.Align.CENTER}>
                    <ControlButton 
                        icon={PhosphorIcons.SkipBack} 
                        command="skip_backward" 
                        disabled={!isConnected}
                        onCommand={onCommand}
                    />
                    <ControlButton 
                        icon={PhosphorIcons.PlayPause} 
                        command="play_pause" 
                        size={32} 
                        primary={true} 
                        disabled={!isConnected}
                        onCommand={onCommand}
                    />
                    <ControlButton 
                        icon={PhosphorIcons.SkipForward} 
                        command="skip_forward" 
                        disabled={!isConnected}
                        onCommand={onCommand}
                    />
                </box>

                {/* Volume */}
                <box spacing={12} halign={Gtk.Align.CENTER}>
                    <ControlButton 
                        icon={PhosphorIcons.SpeakerSimpleLow} 
                        command="volume_down" 
                        disabled={!isConnected}
                        onCommand={onCommand}
                    />
                    <label>Volume</label>
                    <ControlButton 
                        icon={PhosphorIcons.SpeakerSimpleHigh} 
                        command="volume_up" 
                        disabled={!isConnected}
                        onCommand={onCommand}
                    />
                </box>
            </box>

            {/* Power */}
            <box halign={Gtk.Align.CENTER}>
                <ControlButton 
                    icon={PhosphorIcons.Power} 
                    command="suspend" 
                    power={true} 
                    disabled={!isConnected}
                    onCommand={onCommand}
                />
            </box>
        </box>
    );
}