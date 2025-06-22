import { Variable, bind } from "astal";
import Astal from "gi://AstalIO";
import { Widget, Gtk } from "astal/gtk4";
import { PhosphorIcons } from "../../../utils/icons/types";
import PhosphorIcon from "../../../utils/icons/phosphor";
import { execAsync } from "astal/process";
import AppleTVService from "../../../../services/apple-tv";
import { setupCursorHover } from "../../../utils/buttons";
import { sidebarLogger as log } from "../../../../utils/logger";

interface AppleTV {
    name: string;
    address: string;
    identifier: string;
    services: string[];
}

interface PlayingInfo {
    title: string;
    artist: string;
    album: string;
    genre: string;
    total_time: number;
    position: number;
    repeat: string;
    shuffle: string;
    device_state: string;
    power_state: string;
}

interface RemoteState {
    devices: AppleTV[];
    selectedDevice: AppleTV | null;
    isConnected: boolean;
    isLoading: boolean;
    playingInfo: PlayingInfo | null;
    error: string | null;
    showManualAdd: boolean;
    manualIP: string;
    pairingStatus: string | null;
    showPinEntry: boolean;
    pairingPin: string;
    pairingInProgress: boolean;
}

// Separate component for manual IP entry to avoid re-render issues
const ManualIPEntry = ({ onScan, isLoading }: { onScan: (ip: string) => void, isLoading: boolean }) => {
    const ipText = Variable("");
    
    return (
        <box cssName="remote-manual-add" vertical spacing={8}>
            <box spacing={8}>
                <entry
                    cssName="remote-ip-input"
                    placeholderText="192.168.1.100"
                    onNotifyText={(self) => {
                        ipText.set(self.text);
                    }}
                    onActivate={(self) => {
                        if (self.text.trim()) {
                            onScan(self.text);
                        }
                    }}
                    hexpand
                    setup={(self) => {
                        // Focus the entry when shown
                        setTimeout(() => self.grab_focus(), 50);
                    }}
                />
                <button
                    setup={setupCursorHover}
                    onClicked={() => {
                        const ip = ipText.get().trim();
                        if (ip) {
                            onScan(ip);
                        }
                    }}
                    disabled={bind(ipText).as(ip => isLoading || !ip.trim())}
                >
                    <box spacing={6}>
                        <PhosphorIcon iconName={PhosphorIcons.MagnifyingGlass} size={16} />
                        <label>Scan</label>
                    </box>
                </button>
            </box>
        </box>
    );
};

export default function Remote(props: Widget.BoxProps) {
    const state = Variable<RemoteState>({
        devices: [],
        selectedDevice: null,
        isConnected: false,
        isLoading: false,
        playingInfo: null,
        error: null,
        showManualAdd: false,
        manualIP: "",
        pairingStatus: null,
        showPinEntry: false,
        pairingPin: "",
        pairingInProgress: false
    });

    // Separate variable for showManualAdd to avoid re-rendering the input
    const showManualAdd = Variable(false);

    const scriptPath = "/home/faiyt/.config/ags/scripts/remote-control/apple-tv.py";
    const fastScriptPath = "/home/faiyt/.config/ags/scripts/remote-control/apple-tv-fast.py";

    // Store the pairing process
    let pairingProcess: Astal.Process | null = null;

    // Get Apple TV service instance
    const appleTVService = AppleTVService.getInstance();

    // Bind connection status
    appleTVService.isConnected.subscribe((connected) => {
        state.set({ ...state.get(), isConnected: connected });
    });

    const executeCommand = async (command: string, args: string[] = []) => {
        try {
            state.set({ ...state.get(), isLoading: true, error: null });

            // Determine which script to use based on command
            const isRemoteCommand = ["up", "down", "left", "right", "select", "menu", "home",
                                   "play", "pause", "play_pause", "skip_forward", "skip_backward",
                                   "volume_up", "volume_down", "suspend", "tv"].includes(command);
            
            const script = isRemoteCommand ? fastScriptPath : scriptPath;

            // Check if script exists
            try {
                await execAsync(["test", "-f", script]);
            } catch {
                state.set({ ...state.get(), isLoading: false, error: "Python script not found" });
                return null;
            }

            // Execute the command
            const result = await execAsync(["python3", script, command, ...args]);

            // Try to parse JSON response
            try {
                const lines = result.trim().split('\n');
                let lastValidData = null;

                for (const line of lines) {
                    if (line.trim()) {
                        try {
                            const data = JSON.parse(line);
                            lastValidData = data;

                            if (data.pairing === "waiting_for_pin" || data.requires_pin) {
                                state.set({ ...state.get(), isLoading: false });
                                return data;
                            }
                        } catch (e) {
                            console.error(`Failed to parse line: ${line}`);
                        }
                    }
                }

                if (lastValidData) {
                    if (lastValidData.error) {
                        state.set({ ...state.get(), isLoading: false, error: lastValidData.error });
                        return null;
                    }
                    state.set({ ...state.get(), isLoading: false });
                    return lastValidData;
                }

                throw new Error("No valid JSON found");
            } catch (parseError) {
                state.set({ ...state.get(), isLoading: false, error: `Invalid response: ${result}` });
                return null;
            }
        } catch (error) {
            const errorMsg = (error as Error).toString();
            const cleanError = errorMsg.includes("GError") ?
                "Failed to execute command. Check Python installation." :
                errorMsg;
            state.set({ ...state.get(), isLoading: false, error: cleanError });
            return null;
        }
    };

    const discoverDevices = async () => {
        const result = await executeCommand("discover");
        if (result?.devices) {
            state.set({ ...state.get(), devices: result.devices, error: null });
        }
    };

    const connectToDevice = async (device: AppleTV) => {
        state.set({ ...state.get(), selectedDevice: device, error: null, isLoading: true });

        // Use the persistent service for connection
        const connected = await appleTVService.connect(device.identifier);

        state.set({
            ...state.get(),
            isLoading: false,
            isConnected: connected,
            error: connected ? null : "Failed to connect. Make sure Apple TV is on and reachable."
        });

        if (connected) {
            await updateStatus();
        }
    };

    // Track last command time for debouncing
    let lastCommandTime = 0;
    const COMMAND_DEBOUNCE_MS = 200; // Minimum time between commands

    const sendRemoteCommand = async (command: string) => {
        // Debounce rapid commands
        const now = Date.now();
        if (now - lastCommandTime < COMMAND_DEBOUNCE_MS) {
            log.debug("Command debounced", { command, timeSince: now - lastCommandTime });
            return;
        }
        lastCommandTime = now;

        const currentState = state.get();
        if (!currentState.selectedDevice) {
            state.set({ ...currentState, error: "No device selected" });
            return;
        }

        // Don't show loading for quick commands to keep UI responsive
        // state.set({ ...state.get(), isLoading: true });

        try {
            // Use the persistent service for instant response
            const success = await appleTVService.sendRemoteCommand(command);

            if (!success) {
                // Check connection status
                if (!appleTVService.isConnected.get()) {
                    state.set({ ...state.get(), error: "Connection lost. Please reconnect." });
                } else {
                    state.set({ ...state.get(), error: "Command failed. Apple TV may be busy." });
                }
                
                setTimeout(() => {
                    state.set({ ...state.get(), error: null });
                }, 3000);
            }
        } catch (error) {
            const errorMsg = error.message || "Command failed";
            
            // Handle specific error types
            if (errorMsg.includes("is blocked")) {
                state.set({ 
                    ...state.get(), 
                    error: "Apple TV is not responding. It may be asleep or in a menu." 
                });
            } else if (errorMsg.includes("not supported")) {
                state.set({ 
                    ...state.get(), 
                    error: "This command is not available right now." 
                });
            } else if (errorMsg.includes("timeout")) {
                state.set({ 
                    ...state.get(), 
                    error: "Command timed out. Checking connection..." 
                });
                // Try to update status
                updateStatus();
            } else {
                state.set({ ...state.get(), error: errorMsg });
            }
            
            setTimeout(() => {
                state.set({ ...state.get(), error: null });
            }, 3000);
        }
    };

    const updateStatus = async () => {
        const result = await executeCommand("status");
        if (result && !result.error) {
            state.set({ ...state.get(), playingInfo: result });
        }
    };

    const scanIP = async (ip?: string) => {
        const ipToScan = ip || state.get().manualIP.trim();
        if (!ipToScan) {
            state.set({ ...state.get(), error: "Please enter an IP address" });
            return;
        }

        const result = await executeCommand("scan-ip", [ipToScan]);
        if (result?.device) {
            const currentDevices = state.get().devices;
            const exists = currentDevices.some(d => d.identifier === result.device.identifier);
            if (!exists) {
                state.set({
                    ...state.get(),
                    devices: [...currentDevices, result.device],
                    manualIP: "",
                    error: null
                });
                showManualAdd.set(false);
            }
        }
    };

    const startPairing = async () => {
        const device = state.get().selectedDevice;
        if (!device) {
            state.set({ ...state.get(), error: "No device selected" });
            return;
        }

        try {
            if (pairingProcess) {
                pairingProcess.kill();
                pairingProcess = null;
            }

            const { subprocess } = await import("astal");

            state.set({
                ...state.get(),
                pairingStatus: "Starting pairing process...",
                error: null,
                pairingInProgress: true
            });

            pairingProcess = subprocess(
                ["python3", scriptPath, "pair", device.identifier],
                (stdout, stderr) => {
                    if (stdout) {
                        const lines = stdout.trim().split('\n');
                        for (const line of lines) {
                            if (line.trim()) {
                                try {
                                    const data = JSON.parse(line);

                                    if (data.pairing === "started") {
                                        state.set({
                                            ...state.get(),
                                            pairingStatus: data.message || "Starting pairing...",
                                        });
                                    } else if (data.pairing === "waiting_for_pin") {
                                        state.set({
                                            ...state.get(),
                                            pairingStatus: data.message || "Enter PIN from Apple TV",
                                            showPinEntry: true,
                                            pairingPin: "",
                                            error: null,
                                            pairingInProgress: true
                                        });
                                    } else if (data.pairing === "complete") {
                                        state.set({
                                            ...state.get(),
                                            pairingStatus: "Pairing successful!",
                                            showPinEntry: false,
                                            pairingPin: "",
                                            error: null,
                                            pairingInProgress: false,
                                            isConnected: true
                                        });
                                        setTimeout(() => {
                                            state.set({ ...state.get(), pairingStatus: null });
                                        }, 3000);
                                        pairingProcess = null;
                                    } else if (data.error) {
                                        state.set({
                                            ...state.get(),
                                            error: data.error,
                                            pairingStatus: null,
                                            pairingInProgress: false,
                                            showPinEntry: false
                                        });
                                        pairingProcess = null;
                                    }
                                } catch (e) {
                                    console.error("Failed to parse pairing output:", line, e);
                                }
                            }
                        }
                    }
                }
            );
        } catch (error) {
            state.set({
                ...state.get(),
                error: "Failed to start pairing process",
                pairingInProgress: false
            });
        }
    };

    const submitPin = async () => {
        const pin = state.get().pairingPin.trim();

        if (!pin || pin.length !== 4) {
            state.set({ ...state.get(), error: "Please enter a 4-digit PIN" });
            return;
        }

        if (!pairingProcess) {
            state.set({ ...state.get(), error: "No active pairing session. Please restart pairing." });
            return;
        }

        state.set({ ...state.get(), pairingStatus: "Completing pairing...", error: null });

        try {
            pairingProcess.write(pin + "\n");
        } catch (error) {
            state.set({
                ...state.get(),
                error: "Failed to submit PIN. Please try again.",
                pairingStatus: null
            });
        }
    };

    const cancelPairing = () => {
        if (pairingProcess) {
            pairingProcess.kill();
            pairingProcess = null;
        }
        state.set({
            ...state.get(),
            pairingInProgress: false,
            pairingStatus: null,
            showPinEntry: false,
            pairingPin: "",
            error: null
        });
    };

    // Initial device discovery
    discoverDevices();

    const ControlButton = ({ icon, command, size = 24, primary = false, power = false }: {
        icon: PhosphorIcons,
        command: string,
        size?: number,
        primary?: boolean,
        power?: boolean
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
                disabled={bind(state).as(s => !s.isConnected)}
                onClicked={async () => {
                    if (isProcessing.get()) return;
                    
                    isProcessing.set(true);
                    await sendRemoteCommand(command);
                    
                    // Keep processing state for a moment for visual feedback
                    setTimeout(() => isProcessing.set(false), 150);
                }}
                setup={setupCursorHover}
            >
                <PhosphorIcon iconName={icon} size={size} />
            </button>
        );
    };

    return (
        <box {...props} cssName="remote-module" vertical spacing={16}>
            {/* Device Selection Card */}
            <box cssName="remote-device-card" vertical>
                <box cssName="remote-device-header" spacing={12}>
                    <box cssName="remote-device-icon-wrapper">
                        <PhosphorIcon iconName={PhosphorIcons.Television} size={24} />
                    </box>
                    <label cssName="remote-section-title">Apple TV Devices</label>
                    <box hexpand />
                    <box cssName="remote-header-actions" spacing={8}>
                        <button
                            setup={setupCursorHover}
                            onClicked={discoverDevices}
                            disabled={bind(state).as(s => s.isLoading)}
                            tooltip_text="Search for devices"
                        >
                            <PhosphorIcon
                                iconName={PhosphorIcons.MagnifyingGlass}
                                size={16}
                                cssClasses={bind(state).as(s => s.isLoading ? ["spinning"] : [])}
                            />
                        </button>
                        <button
                            setup={setupCursorHover}
                            onClicked={() => showManualAdd.set(!showManualAdd.get())}
                            tooltip_text="Add by IP address"
                        >
                            <PhosphorIcon iconName={PhosphorIcons.Plus} size={16} />
                        </button>
                        <button
                            setup={setupCursorHover}
                            onClicked={async () => {
                                state.set({ ...state.get(), isLoading: true, error: null });
                                await appleTVService.restart();
                                state.set({ ...state.get(), isLoading: false });
                                
                                // Re-discover devices after restart
                                setTimeout(() => discoverDevices(), 1000);
                            }}
                            tooltip_text="Restart Apple TV service"
                        >
                            <PhosphorIcon iconName={PhosphorIcons.ArrowClockwise} size={16} />
                        </button>
                    </box>
                </box>

                <box cssName="remote-device-list" vertical spacing={4}>
                    {bind(state).as(s =>
                        s.isLoading && s.devices.length === 0 ? (
                            <box cssName="remote-loading-state" vertical>
                                <Gtk.Spinner spinning={true} />
                                <label>Searching for devices...</label>
                            </box>
                        ) : s.devices.length === 0 ? (
                            <box cssName="remote-empty-state" vertical>
                                <PhosphorIcon iconName={PhosphorIcons.WifiSlash} size={48} />
                                <label>No Apple TV devices found</label>
                            </box>
                        ) : (
                            <Gtk.ScrolledWindow
                                hscrollbarPolicy={Gtk.PolicyType.NEVER}
                                vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
                                heightRequest={Math.min(200, s.devices.length * 70)}
                            >
                                <box vertical spacing={4}>
                                    {s.devices.map(device => (
                                        <button
                                            cssName="remote-device-item"
                                            cssClasses={s.selectedDevice?.identifier === device.identifier ? ["selected"] : []}
                                            onClicked={() => connectToDevice(device)}
                                            setup={setupCursorHover}
                                        >
                                            <box spacing={12}>
                                                <box cssName="remote-device-icon">
                                                    <PhosphorIcon iconName={PhosphorIcons.Television} size={20} />
                                                </box>
                                                <box vertical>
                                                    <label cssName="remote-device-name">{device.name}</label>
                                                    <label cssName="remote-device-address">{device.address}</label>
                                                </box>
                                                <box hexpand />
                                                {s.selectedDevice?.identifier === device.identifier && s.isConnected && (
                                                    <box cssName="remote-connected-indicator">
                                                        <PhosphorIcon iconName={PhosphorIcons.CheckCircle} size={20} />
                                                    </box>
                                                )}
                                            </box>
                                        </button>
                                    ))}
                                </box>
                            </Gtk.ScrolledWindow>
                        )
                    )}

                    {/* Manual IP Add */}
                    {bind(showManualAdd).as(show => show ? (
                        <ManualIPEntry 
                            onScan={scanIP} 
                            isLoading={state.get().isLoading}
                        />
                    ) : <box />)}
                </box>
            </box>

            {/* Remote Control */}
            {bind(state).as(s => s.selectedDevice ? (
                <box cssName="remote-control-card" vertical spacing={16}>
                    {/* Connection Status */}
                    <box
                        cssName="remote-connection-status"
                        cssClasses={[s.isConnected ? "connected" : "disconnected"]}
                        spacing={8}
                    >
                        <PhosphorIcon
                            iconName={s.isConnected ? PhosphorIcons.WifiHigh : PhosphorIcons.WifiSlash}
                            size={16}
                        />
                        <label>{s.selectedDevice.name}</label>
                        <box hexpand />
                        {!s.isConnected && !s.pairingInProgress ? (
                            <button
                                cssName="remote-pair-button"
                                onClicked={() => startPairing()}
                                disabled={s.isLoading}
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
                    {s.pairingStatus ? (
                        <box cssName="remote-pairing-status" spacing={8}>
                            <Gtk.Spinner spinning={true} />
                            <label>{s.pairingStatus}</label>
                            {s.pairingInProgress ? (
                                <box hexpand />
                            ) : <box />}
                            {s.pairingInProgress ? (
                                <button
                                    onClicked={cancelPairing}
                                    setup={setupCursorHover}
                                >
                                    <PhosphorIcon iconName={PhosphorIcons.X} size={14} />
                                </button>
                            ) : <box />}
                        </box>
                    ) : <box />}

                    {/* PIN Entry */}
                    {s.showPinEntry ? (
                        <box cssName="remote-pin-entry" vertical spacing={12}>
                            <label>Enter the PIN shown on your Apple TV</label>
                            <box spacing={8}>
                                <entry
                                    placeholderText="0000"
                                    onNotifyText={(self) => {
                                        state.set({ ...state.get(), pairingPin: self.text });
                                    }}
                                    onActivate={(self) => {
                                        if (self.text.length === 4) {
                                            submitPin();
                                        }
                                    }}
                                    setup={(self) => {
                                        // Set initial value
                                        self.text = state.get().pairingPin;
                                        setTimeout(() => self.grab_focus(), 100);
                                    }}
                                    hexpand
                                />
                                <button
                                    cssClasses={["submit"]}
                                    onClicked={submitPin}
                                    disabled={s.pairingPin.length !== 4}
                                    setup={setupCursorHover}
                                >
                                    <box spacing={6}>
                                        <PhosphorIcon iconName={PhosphorIcons.Check} size={16} />
                                        <label>Submit</label>
                                    </box>
                                </button>
                                <button
                                    cssClasses={["cancel"]}
                                    onClicked={() => state.set({ ...state.get(), showPinEntry: false, pairingPin: "" })}
                                    setup={setupCursorHover}
                                >
                                    <PhosphorIcon iconName={PhosphorIcons.X} size={16} />
                                </button>
                            </box>
                        </box>
                    ) : <box />}

                    {/* Now Playing */}
                    {s.playingInfo && s.isConnected ? (
                        <box cssName="remote-now-playing" vertical spacing={4}>
                            <box spacing={8}>
                                <PhosphorIcon iconName={PhosphorIcons.MusicNote} size={16} />
                                <label cssName="remote-now-playing-title">{s.playingInfo.title}</label>
                            </box>
                            {s.playingInfo.artist ? (
                                <label cssName="remote-now-playing-artist">{s.playingInfo.artist}</label>
                            ) : <box />}
                        </box>
                    ) : <box />}

                    {/* D-Pad Navigation */}
                    <box cssName="remote-dpad">
                        <button
                            cssClasses={["dpad-button", "up"]}
                            onClicked={() => sendRemoteCommand("up")}
                            // disabled={!s.isConnected || s.isLoading}
                            setup={setupCursorHover}
                        >
                            <PhosphorIcon iconName={PhosphorIcons.CaretUp} size={20} />
                        </button>
                        <button
                            cssClasses={["dpad-button", "down"]}
                            onClicked={() => sendRemoteCommand("down")}
                            // disabled={!s.isConnected || s.isLoading}
                            setup={setupCursorHover}
                        >
                            <PhosphorIcon iconName={PhosphorIcons.CaretDown} size={20} />
                        </button>
                        <button
                            cssClasses={["dpad-button", "left"]}
                            onClicked={() => sendRemoteCommand("left")}
                            // disabled={!s.isConnected || s.isLoading}
                            setup={setupCursorHover}
                        >
                            <PhosphorIcon iconName={PhosphorIcons.CaretLeft} size={20} />
                        </button>
                        <button
                            cssClasses={["dpad-button", "right"]}
                            onClicked={() => sendRemoteCommand("right")}
                            // disabled={!s.isConnected || s.isLoading}
                            setup={setupCursorHover}
                        >
                            <PhosphorIcon iconName={PhosphorIcons.CaretRight} size={20} />
                        </button>
                        <button
                            cssClasses={["dpad-center"]}
                            // disabled={!s.isConnected || s.isLoading}
                            onClicked={() => sendRemoteCommand("select")}
                            setup={setupCursorHover}
                        >
                            <label>OK</label>
                        </button>
                    </box>

                    {/* Menu Controls */}
                    <box spacing={12} halign={Gtk.Align.CENTER}>
                        <ControlButton icon={PhosphorIcons.ArrowLeft} command="menu" />
                        <ControlButton icon={PhosphorIcons.House} command="home" size={28} />
                        <ControlButton icon={PhosphorIcons.Television} command="tv" />
                    </box>

                    {/* Playback Controls */}
                    <box vertical spacing={12}>
                        <box spacing={8} halign={Gtk.Align.CENTER}>
                            <ControlButton icon={PhosphorIcons.SkipBack} command="skip_backward" />
                            <ControlButton icon={PhosphorIcons.PlayPause} command="play_pause" size={32} primary={true} />
                            <ControlButton icon={PhosphorIcons.SkipForward} command="skip_forward" />
                        </box>

                        {/* Volume */}
                        <box spacing={12} halign={Gtk.Align.CENTER}>
                            <ControlButton icon={PhosphorIcons.SpeakerSimpleLow} command="volume_down" />
                            <label>Volume</label>
                            <ControlButton icon={PhosphorIcons.SpeakerSimpleHigh} command="volume_up" />
                        </box>
                    </box>

                    {/* Power */}
                    <box halign={Gtk.Align.CENTER}>
                        <ControlButton icon={PhosphorIcons.Power} command="suspend" power={true} />
                    </box>
                </box>
            ) : <box />)}

            {/* Error Display */}
            {bind(state).as(s => s.error ? (
                <box cssName="remote-error" spacing={8}>
                    <PhosphorIcon iconName={PhosphorIcons.Warning} size={16} />
                    <label>{s.error}</label>
                </box>
            ) : <box />)}

            {/* Help Text */}
            {bind(state).as(s => s.selectedDevice && !s.isConnected && !s.pairingInProgress ? (
                <box cssName="remote-help" vertical spacing={8}>
                    <label cssName="remote-help-title">Pairing Required</label>
                    <label cssName="remote-help-text">Click the "Pair" button above to connect to your Apple TV. You'll need to enter the PIN that appears on your TV screen.</label>
                </box>
            ) : <box />)}
        </box>
    );
}
