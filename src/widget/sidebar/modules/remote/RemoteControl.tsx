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
    iconSize = 24,
    size = "medium",
    primary = false,
    power = false,
    disabled = false,
    onCommand
}: {
    icon: PhosphorIcons;
    command: string;
    iconSize?: number;
    size?: "small" | "large" | "medium";
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
                classes.push(size);
                if (primary) classes.push("primary");
                if (power) classes.push("power");
                if (processing) classes.push("processing");
                return classes;
            })}
            // disabled={disabled}
            onClicked={async () => {
                if (isProcessing.get()) return;

                isProcessing.set(true);
                await onCommand(command);

                // Keep processing state for a moment for visual feedback
                setTimeout(() => isProcessing.set(false), 150);
            }}
            setup={setupCursorHover}
        >
            <PhosphorIcon iconName={icon} size={iconSize} />
        </button>
    );
};

export default function RemoteControl({ isConnected, isLoading = false, onCommand, ...props }: RemoteControlProps) {
    return (
        <box {...props} cssName="remote-control-card"
            widthRequest={200}
            vertical spacing={12}>
            {/* Power Button - Top Right */}
            <box halign={Gtk.Align.END}>
                <ControlButton
                    icon={PhosphorIcons.Power}
                    command="suspend"
                    iconSize={16}
                    size="small"
                    power={true}
                    disabled={!isConnected}
                    onCommand={onCommand}
                />
            </box>

            {/* Circular D-Pad Navigation - Apple TV Style */}
            <box cssName="apple-remote-dpad" halign={Gtk.Align.CENTER} vertical>
                <button
                    cssClasses={["apple-dpad-button", "up"]}
                    onClicked={() => onCommand("up")}
                    // disabled={!isConnected}
                    setup={setupCursorHover}
                >
                    <PhosphorIcon iconName={PhosphorIcons.Dot} size={24} />
                </button>
                <box
                // marginTop={8}
                // marginBottom={8}
                // spacing={10}
                >
                    <button
                        cssClasses={["apple-dpad-button", "left"]}
                        onClicked={() => onCommand("left")}
                        // disabled={!isConnected}
                        setup={setupCursorHover}
                    >
                        <PhosphorIcon iconName={PhosphorIcons.Dot} size={24} />
                    </button>

                    <button
                        cssClasses={["apple-dpad-center"]}
                        onClicked={() => onCommand("select")}
                        // disabled={!isConnected}
                        setup={setupCursorHover}
                        widthRequest={80}
                        heightRequest={80}
                    >
                        {/* <PhosphorIcon iconName={PhosphorIcons.Circle} size={80} /> */}
                    </button>

                    <button
                        cssClasses={["apple-dpad-button", "right"]}
                        onClicked={() => onCommand("right")}
                        // disabled={!isConnected}
                        setup={setupCursorHover}
                    >

                        <PhosphorIcon iconName={PhosphorIcons.Dot} size={24} />
                    </button>
                </box>
                <button
                    cssClasses={["apple-dpad-button", "down"]}
                    onClicked={() => onCommand("down")}
                    // disabled={!isConnected}
                    setup={setupCursorHover}
                >

                    <PhosphorIcon iconName={PhosphorIcons.Dot} size={24} />
                </button>

            </box>

            {/* Back and Home Buttons */}
            <box spacing={25} halign={Gtk.Align.CENTER}>
                <ControlButton
                    icon={PhosphorIcons.ArrowLeft}
                    command="menu"
                    iconSize={32}
                    disabled={!isConnected}
                    onCommand={onCommand}
                />
                <ControlButton
                    icon={PhosphorIcons.Monitor}
                    command="home"
                    iconSize={32}
                    disabled={!isConnected}
                    onCommand={onCommand}
                />
            </box>

            {/* Play/Pause and Volume Controls */}
            <box spacing={20} halign={Gtk.Align.CENTER}>
                {/* Left side - Play/Pause and Mute */}
                <box vertical spacing={20} marginTop={3}>
                    <ControlButton
                        icon={PhosphorIcons.PlayPause}
                        command="play_pause"
                        iconSize={32}
                        primary={true}
                        disabled={!isConnected}
                        onCommand={onCommand}
                    />
                    <ControlButton

                        icon={PhosphorIcons.SpeakerSimpleX}
                        command="mute"
                        iconSize={32}
                        disabled={!isConnected}
                        onCommand={onCommand}
                    />
                </box>

                {/* Right side - Vertical Volume Control */}
                <box cssName="apple-volume-control" vertical>
                    <button
                        cssClasses={["apple-volume-button", "volume-up"]}
                        onClicked={() => onCommand("volume_up")}
                        // disabled={!isConnected}
                        setup={setupCursorHover}
                    >
                        <PhosphorIcon iconName={PhosphorIcons.Plus} size={32} />
                    </button>
                    <button
                        marginTop={10}
                        cssClasses={["apple-volume-button", "volume-down"]}
                        onClicked={() => onCommand("volume_down")}
                        // disabled={!isConnected}
                        setup={setupCursorHover}
                    >
                        <PhosphorIcon iconName={PhosphorIcons.Minus} size={32} />
                    </button>
                </box>
            </box>
            <box heightRequest={40} />
        </box>
    );
}
