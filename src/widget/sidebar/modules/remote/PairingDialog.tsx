import { Widget, Gtk } from "astal/gtk4";
import { PhosphorIcons } from "../../../utils/icons/types";
import PhosphorIcon from "../../../utils/icons/phosphor";
import { setupCursorHover } from "../../../utils/buttons";
import { AppleTV } from "./types";

interface PairingDialogProps extends Widget.BoxProps {
    selectedDevice: AppleTV | null;
    isConnected: boolean;
    pairingStatus: string | null;
    pairingInProgress: boolean;
    showPinEntry: boolean;
    pairingPin: string;
    onStartPairing: () => void;
    onCancelPairing: () => void;
    onPinChange: (pin: string) => void;
    onSubmitPin: () => void;
}

export default function PairingDialog({
    selectedDevice,
    isConnected,
    pairingStatus,
    pairingInProgress,
    showPinEntry,
    pairingPin,
    onStartPairing,
    onCancelPairing,
    onPinChange,
    onSubmitPin,
    ...props
}: PairingDialogProps) {
    if (!selectedDevice) return <box />;

    return (
        <box {...props} vertical>
            {/* Connection Status */}
            <box
                cssName="remote-connection-status"
                cssClasses={[isConnected ? "connected" : "disconnected"]}
                spacing={8}
            >
                <PhosphorIcon
                    iconName={isConnected ? PhosphorIcons.WifiHigh : PhosphorIcons.WifiSlash}
                    size={16}
                />
                <label>{selectedDevice.name}</label>
                <box hexpand />
                {!isConnected && !pairingInProgress ? (
                    <button
                        cssName="remote-pair-button"
                        onClicked={onStartPairing}
                        setup={setupCursorHover}
                    >
                        <box spacing={6}>
                            <PhosphorIcon iconName={PhosphorIcons.Link} size={14} />
                            <label>Pair</label>
                        </box>
                    </button>
                ) : <box />}
            </box>

            {/* Pairing Status */}
            {pairingStatus ? (
                <box cssName="remote-pairing-status" spacing={8}>
                    <Gtk.Spinner spinning={true} />
                    <label>{pairingStatus}</label>
                    {pairingInProgress ? (
                        <box hexpand />
                    ) : <box />}
                    {pairingInProgress ? (
                        <button
                            onClicked={onCancelPairing}
                            setup={setupCursorHover}
                        >
                            <PhosphorIcon iconName={PhosphorIcons.X} size={14} />
                        </button>
                    ) : <box />}
                </box>
            ) : <box />}

            {/* PIN Entry */}
            {showPinEntry ? (
                <box cssName="remote-pin-entry" vertical spacing={12}>
                    <label>Enter the PIN shown on your Apple TV</label>
                    <box spacing={8}>
                        <entry
                            placeholderText="0000"
                            onNotifyText={(self) => {
                                onPinChange(self.text);
                            }}
                            onActivate={(self) => {
                                if (self.text.length === 4) {
                                    onSubmitPin();
                                }
                            }}
                            setup={(self) => {
                                // Set initial value
                                self.text = pairingPin;
                                setTimeout(() => self.grab_focus(), 100);
                            }}
                            hexpand
                        />
                        <button
                            cssClasses={["submit"]}
                            onClicked={onSubmitPin}
                            disabled={pairingPin.length !== 4}
                            setup={setupCursorHover}
                        >
                            <box spacing={6}>
                                <PhosphorIcon iconName={PhosphorIcons.Check} size={16} />
                                <label>Submit</label>
                            </box>
                        </button>
                        <button
                            cssClasses={["cancel"]}
                            onClicked={() => {
                                onPinChange("");
                                onCancelPairing();
                            }}
                            setup={setupCursorHover}
                        >
                            <PhosphorIcon iconName={PhosphorIcons.X} size={16} />
                        </button>
                    </box>
                </box>
            ) : <box />}

            {/* Help Text */}
            {selectedDevice && !isConnected && !pairingInProgress ? (
                <box cssName="remote-help" vertical spacing={8}>
                    <label cssName="remote-help-title">Pairing Required</label>
                    <label cssName="remote-help-text">Click the "Pair" button above to connect to your Apple TV. You'll need to enter the PIN that appears on your TV screen.</label>
                </box>
            ) : <box />}
        </box>
    );
}
