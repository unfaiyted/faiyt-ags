import { Variable, bind } from "astal";
import { Widget, Gtk } from "astal/gtk4";
import { PhosphorIcons } from "../../../utils/icons/types";
import PhosphorIcon from "../../../utils/icons/phosphor";
import { execAsync } from "astal/process";

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

    const scriptPath = "/home/faiyt/.config/ags/scripts/remote-control/apple-tv.py";
    
    // Store the pairing process
    let pairingProcess = null;

    const executeCommand = async (command: string, args: string[] = []) => {
        try {
            state.set({ ...state.get(), isLoading: true, error: null });

            // Check if script exists
            try {
                await execAsync(["test", "-f", scriptPath]);
            } catch {
                state.set({ ...state.get(), isLoading: false, error: "Python script not found" });
                return null;
            }

            // Log the command being executed
            console.log(`Executing: python3 ${scriptPath} ${command} ${args.join(' ')}`);

            // Execute the command
            const result = await execAsync(["python3", scriptPath, command, ...args]);

            // Try to parse JSON response - handle multiple JSON objects
            try {
                // Split by newlines and parse each line as JSON
                const lines = result.trim().split('\n');
                let lastValidData = null;

                for (const line of lines) {
                    if (line.trim()) {
                        try {
                            const data = JSON.parse(line);
                            console.log(`Parsed JSON:`, data);
                            lastValidData = data;

                            // For pairing, return immediately on waiting_for_pin
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
                // If JSON parsing fails, show the raw output as error
                console.error("Parse error:", parseError);
                state.set({ ...state.get(), isLoading: false, error: `Invalid response: ${result}` });
                return null;
            }
        } catch (error) {
            const errorMsg = error.toString();
            // Extract meaningful error message
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
            state.set({ ...state.get(), devices: result.devices });
        }
    };

    const connectToDevice = async (device: AppleTV) => {
        state.set({ ...state.get(), selectedDevice: device, error: "Connecting..." });
        const result = await executeCommand("connect", [device.identifier]);
        if (result?.connected) {
            state.set({
                ...state.get(),
                selectedDevice: device,
                isConnected: true,
                error: null
            });
            await updateStatus();
        } else {
            state.set({
                ...state.get(),
                isConnected: false,
                error: "Failed to connect. Make sure Apple TV is on and reachable."
            });
        }
    };

    const sendRemoteCommand = async (command: string) => {
        const currentState = state.get();
        if (!currentState.selectedDevice) {
            state.set({ ...currentState, error: "No device selected" });
            return;
        }

        // Don't check isConnected since we reconnect for each command
        console.log(`Sending command: ${command}`);
        const result = await executeCommand(command);

        if (result?.success) {
            state.set({ ...state.get(), error: null });
            if (command === "play" || command === "pause" || command === "play_pause") {
                setTimeout(updateStatus, 500);
            }
        } else if (result?.error) {
            // Only show error briefly, don't persist it
            state.set({ ...state.get(), error: result.error });
            setTimeout(() => {
                if (state.get().error === result.error) {
                    state.set({ ...state.get(), error: null });
                }
            }, 3000);
        }
    };

    const updateStatus = async () => {
        const result = await executeCommand("status");
        if (result && !result.error) {
            state.set({ ...state.get(), playingInfo: result });
        }
    };

    const scanIP = async () => {
        const ip = state.get().manualIP.trim();
        if (!ip) {
            state.set({ ...state.get(), error: "Please enter an IP address" });
            return;
        }

        const result = await executeCommand("scan-ip", [ip]);
        if (result?.device) {
            // Add the device to the list
            const currentDevices = state.get().devices;
            const exists = currentDevices.some(d => d.identifier === result.device.identifier);
            if (!exists) {
                state.set({
                    ...state.get(),
                    devices: [...currentDevices, result.device],
                    showManualAdd: false,
                    manualIP: ""
                });
            }
        }
    };

    // Track if pairing was cancelled
    let pairingCancelled = false;

    // Import Subprocess for handling the pairing process
    const startPairingWithProcess = async (device: AppleTV) => {
        try {
            if (pairingProcess) {
                console.log("Killing existing pairing process");
                pairingProcess.kill();
                pairingProcess = null;
            }

            // Use Astal's subprocess API
            const { subprocess } = await import("astal");
            
            console.log("Starting pairing subprocess for device:", device.identifier);
            
            // Set initial state
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
                        // Parse each line of output
                        const lines = stdout.trim().split('\n');
                        for (const line of lines) {
                            if (line.trim()) {
                                try {
                                    const data = JSON.parse(line);
                                    console.log("Pairing output:", data);
                                    
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
                                            pairingStatus: "Pairing successful! Verifying...",
                                            showPinEntry: false,
                                            pairingPin: "",
                                            error: null,
                                            pairingInProgress: false
                                        });
                                        // Verify pairing
                                        setTimeout(async () => {
                                            const verifyResult = await executeCommand("verify-pairing");
                                            if (verifyResult?.paired) {
                                                state.set({
                                                    ...state.get(),
                                                    pairingStatus: "Pairing successful! Remote is ready.",
                                                    isConnected: true,
                                                    error: null
                                                });
                                                setTimeout(() => {
                                                    state.set({ ...state.get(), pairingStatus: null });
                                                }, 3000);
                                            } else {
                                                state.set({
                                                    ...state.get(),
                                                    pairingStatus: null,
                                                    isConnected: false,
                                                    error: "Pairing verification failed. Please try again."
                                                });
                                            }
                                        }, 1000);
                                        pairingProcess = null;
                                    } else if (data.error) {
                                        state.set({
                                            ...state.get(),
                                            error: data.error,
                                            pairingStatus: null,
                                            pairingInProgress: false
                                        });
                                        pairingProcess = null;
                                    }
                                } catch (e) {
                                    console.error("Failed to parse pairing output:", line, e);
                                }
                            }
                        }
                    }
                    
                    if (stderr) {
                        console.error("Pairing stderr:", stderr);
                    }
                }
            );
        } catch (error) {
            console.error("Failed to start pairing process:", error);
            state.set({
                ...state.get(),
                error: "Failed to start pairing process",
                pairingInProgress: false
            });
        }
    };

    const startPairing = async () => {
        const device = state.get().selectedDevice;
        if (!device) {
            state.set({ ...state.get(), error: "No device selected" });
            return;
        }

        // Use the new process-based pairing
        pairingCancelled = false;
        await startPairingWithProcess(device);
    };

    const cancelPairing = () => {
        pairingCancelled = true;
        if (pairingProcess) {
            console.log("Killing pairing process");
            pairingProcess.kill();
            pairingProcess = null;
        }
        state.set({
            ...state.get(),
            pairingInProgress: false,
            pairingStatus: null,
            error: "Pairing cancelled"
        });
    };

    const submitPin = async () => {
        const device = state.get().selectedDevice;
        const pin = state.get().pairingPin.trim();

        console.log("Submit PIN clicked - Device:", device?.name, "PIN length:", pin.length);

        if (!device || !pin) {
            state.set({ ...state.get(), error: "Please enter the PIN" });
            return;
        }

        if (pin.length !== 4) {
            state.set({ ...state.get(), error: "PIN must be exactly 4 digits" });
            return;
        }

        if (!pairingProcess) {
            state.set({ ...state.get(), error: "No active pairing session. Please restart pairing." });
            return;
        }

        console.log("Submitting PIN to pairing process:", pin);
        state.set({ ...state.get(), pairingStatus: "Completing pairing...", error: null });
        
        try {
            // Send the PIN to the pairing process via stdin
            console.log("Writing PIN to process stdin");
            pairingProcess.write(pin + "\n");
            console.log("PIN sent to process");
        } catch (error) {
            console.error("Failed to send PIN:", error);
            state.set({
                ...state.get(),
                error: "Failed to submit PIN. Please try again.",
                pairingStatus: null
            });
        }
    };

    // Initial device discovery
    discoverDevices();

    const ControlButton = ({ icon, command, size = 28, primary = false }: {
        icon: PhosphorIcons,
        command: string,
        size?: number,
        primary?: boolean
    }) => (
        <button
            cssName={primary ? "control-button-primary" : "control-button"}
            disabled={bind(state).as(s => !s.selectedDevice || s.isLoading)}
            onClicked={() => sendRemoteCommand(command)}
        >
            <PhosphorIcon iconName={icon} size={size} />
        </button>
    );

    return (
        <box {...props} cssName="remote-module" vertical spacing={16}>
            {/* Device Selection Card */}
            <box cssName="device-card" vertical>
                <box cssName="device-header" spacing={12}>
                    <PhosphorIcon iconName={PhosphorIcons.Television} size={20} />
                    <label cssName="section-title">Apple TV Devices</label>
                    <box hexpand />
                    <box cssName="header-actions" spacing={8}>
                        <button
                            cssName="icon-button"
                            onClicked={discoverDevices}
                            disabled={bind(state).as(s => s.isLoading)}
                            tooltip-text="Search network"
                        >
                            <PhosphorIcon iconName={PhosphorIcons.MagnifyingGlass} size={18} />
                        </button>
                        <button
                            cssName="icon-button"
                            onClicked={() => state.set({ ...state.get(), showManualAdd: !state.get().showManualAdd })}
                            tooltip-text="Add by IP"
                        >
                            <PhosphorIcon iconName={PhosphorIcons.Plus} size={18} />
                        </button>
                    </box>
                </box>

                <box cssName="device-content" vertical spacing={12}>
                    {bind(state).as(s =>
                        s.isLoading ? (
                            <box cssName="loading-state">
                                <Gtk.Spinner spinning={true} />
                                <label>Searching for devices...</label>
                            </box>
                        ) : s.devices.length === 0 ? (
                            <box cssName="empty-state" vertical>
                                <PhosphorIcon iconName={PhosphorIcons.WifiSlash} size={48} />
                                <label>No devices found</label>
                                <label cssName="empty-hint">Click search or add manually</label>
                            </box>
                        ) : (
                            <Gtk.ScrolledWindow
                                cssName="device-scroll"
                                vexpand={false}
                                heightRequest={150}
                                hscrollbarPolicy={Gtk.PolicyType.NEVER}
                                vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
                            >
                                <box cssName="device-list" vertical spacing={8} heightRequest={150}>
                                    {s.devices.map(device => (
                                        <button
                                            cssName="device-item"
                                            cssClasses={s.selectedDevice?.identifier === device.identifier ? ["selected"] : []}
                                            onClicked={() => connectToDevice(device)}
                                        >
                                            <box spacing={12}>
                                                <box cssName="device-icon">
                                                    <PhosphorIcon iconName={PhosphorIcons.Television} size={24} />
                                                </box>
                                                <box vertical>
                                                    <label cssName="device-name">{device.name}</label>
                                                    <label cssName="device-address">{device.address}</label>
                                                </box>
                                                <box hexpand />
                                                {s.selectedDevice?.identifier === device.identifier && s.isConnected && (
                                                    <box cssName="connected-indicator">
                                                        <PhosphorIcon iconName={PhosphorIcons.WifiHigh} size={16} />
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
                    {bind(state).as(s => s.showManualAdd && (
                        <box cssName="manual-add-section" vertical spacing={8}>
                            <box cssName="input-group" spacing={8}>
                                <entry
                                    cssName="ip-input"
                                    placeholderText="192.168.1.100"
                                    text={bind(state).as(s => s.manualIP)}
                                    onChanged={(self) => state.set({ ...state.get(), manualIP: self.text })}
                                    hexpand
                                />
                                <button
                                    cssName="action-button"
                                    onClicked={scanIP}
                                    disabled={bind(state).as(s => s.isLoading || !s.manualIP.trim())}
                                >
                                    <box spacing={6}>
                                        <PhosphorIcon iconName={PhosphorIcons.MagnifyingGlass} size={16} />
                                        <label>Scan</label>
                                    </box>
                                </button>
                            </box>
                        </box>
                    ))}
                </box>
            </box>

            {/* Remote Control */}
            {bind(state).as(s => s.selectedDevice && (
                <box cssName="remote-card" vertical spacing={20}>
                    {/* Connection Status */}
                    <box cssName="connection-status" spacing={8}>
                        <PhosphorIcon
                            iconName={s.isConnected ? PhosphorIcons.WifiHigh : PhosphorIcons.WifiSlash}
                            size={16}
                        />
                        <label cssName={s.selectedDevice ? "status-connected" : "status-disconnected"}>
                            {s.selectedDevice ? `Selected: ${s.selectedDevice.name}` : "No Device Selected"}
                        </label>
                        <box hexpand />
                        {!s.isConnected && !s.pairingInProgress && (
                            <button
                                cssName="pair-button"
                                onClicked={() => {
                                    // Clear any previous errors when starting new pairing
                                    state.set({ ...state.get(), error: null });
                                    startPairing(0);
                                }}
                                disabled={s.isLoading || s.showPinEntry}
                                tooltip-text="Pair with Apple TV"
                            >
                                <box spacing={6}>
                                    <PhosphorIcon iconName={PhosphorIcons.Link} size={14} />
                                    <label>Pair</label>
                                </box>
                            </button>
                        )}
                    </box>

                    {/* Pairing Status */}
                    {s.pairingStatus && (
                        <box cssName="pairing-status" spacing={8}>
                            <Gtk.Spinner spinning={true} />
                            <label>{s.pairingStatus}</label>
                            {s.pairingInProgress && (
                                <button
                                    cssName="cancel-pairing-button"
                                    onClicked={cancelPairing}
                                    tooltip-text="Cancel pairing"
                                >
                                    <PhosphorIcon iconName={PhosphorIcons.X} size={14} />
                                </button>
                            )}
                        </box>
                    )}

                    {/* PIN Entry */}
                    {s.showPinEntry && (
                        <box cssName="pin-entry-section" vertical spacing={12}>
                            <label cssName="pin-instructions">Enter the PIN shown on your Apple TV</label>
                            <box cssName="pin-input-group" spacing={8}>
                                <entry
                                    cssName="pin-input"
                                    placeholderText="Enter 4-digit PIN"
                                    text={s.pairingPin}
                                    setup={(self) => {
                                        self.connect("changed", () => {
                                            state.set({ ...state.get(), pairingPin: self.text });
                                        });
                                        self.connect("activate", () => {
                                            if (self.text.length === 4) {
                                                submitPin();
                                            }
                                        });
                                    }}
                                    hexpand
                                />
                                <button
                                    cssName="submit-pin-button"
                                    onClicked={submitPin}
                                    disabled={s.isLoading || s.pairingPin.length !== 4}
                                >
                                    <box spacing={6}>
                                        <PhosphorIcon iconName={PhosphorIcons.Check} size={16} />
                                        <label>Submit</label>
                                    </box>
                                </button>
                                <button
                                    cssName="cancel-pin-button"
                                    onClicked={() => state.set({ ...state.get(), showPinEntry: false, pairingPin: "", pairingStatus: null })}
                                >
                                    <PhosphorIcon iconName={PhosphorIcons.X} size={16} />
                                </button>
                            </box>
                        </box>
                    )}

                    {/* Now Playing */}
                    {s.playingInfo && (
                        <box cssName="now-playing" vertical spacing={8}>
                            <box spacing={8}>
                                <PhosphorIcon iconName={PhosphorIcons.MusicNote} size={16} />
                                <label cssName="now-playing-label">Now Playing</label>
                            </box>
                            <label cssName="now-playing-title">{s.playingInfo.title}</label>
                            {s.playingInfo.artist && (
                                <label cssName="now-playing-artist">{s.playingInfo.artist}</label>
                            )}
                        </box>
                    )}

                    {/* Navigation */}
                    <box cssName="navigation-section" vertical spacing={16}>
                        {/* D-Pad */}
                        <box cssName="dpad-wrapper" halign={Gtk.Align.CENTER}>
                            <box cssName="dpad-container">
                                <button
                                    cssName="dpad-button dpad-up"
                                    onClicked={() => sendRemoteCommand("up")}
                                    disabled={!s.selectedDevice || s.isLoading}
                                >
                                    <PhosphorIcon iconName={PhosphorIcons.CaretUp} size={24} />
                                </button>
                                <button
                                    cssName="dpad-button dpad-down"
                                    onClicked={() => sendRemoteCommand("down")}
                                    disabled={!s.selectedDevice || s.isLoading}
                                >
                                    <PhosphorIcon iconName={PhosphorIcons.CaretDown} size={24} />
                                </button>
                                <button
                                    cssName="dpad-button dpad-left"
                                    onClicked={() => sendRemoteCommand("left")}
                                    disabled={!s.selectedDevice || s.isLoading}
                                >
                                    <PhosphorIcon iconName={PhosphorIcons.CaretLeft} size={24} />
                                </button>
                                <button
                                    cssName="dpad-button dpad-right"
                                    onClicked={() => sendRemoteCommand("right")}
                                    disabled={!s.selectedDevice || s.isLoading}
                                >
                                    <PhosphorIcon iconName={PhosphorIcons.CaretRight} size={24} />
                                </button>
                                <button
                                    cssName="dpad-center"
                                    disabled={!s.selectedDevice || s.isLoading}
                                    onClicked={() => sendRemoteCommand("select")}
                                >
                                    <label>OK</label>
                                </button>
                            </box>
                        </box>

                        {/* Menu Controls */}
                        <box cssName="menu-controls" spacing={12} halign={Gtk.Align.CENTER}>
                            <ControlButton icon={PhosphorIcons.ArrowLeft} command="menu" />
                            <ControlButton icon={PhosphorIcons.House} command="home" size={32} />
                            <ControlButton icon={PhosphorIcons.Television} command="tv" />
                        </box>
                    </box>

                    {/* Playback Controls */}
                    <box cssName="playback-section" vertical spacing={12}>
                        <box cssName="playback-controls" spacing={8} halign={Gtk.Align.CENTER}>
                            <ControlButton icon={PhosphorIcons.SkipBack} command="skip_backward" />
                            <ControlButton icon={PhosphorIcons.Play} command="play_pause" size={36} primary={true} />
                            <ControlButton icon={PhosphorIcons.SkipForward} command="skip_forward" />
                        </box>

                        {/* Volume */}
                        <box cssName="volume-controls" spacing={12} halign={Gtk.Align.CENTER}>
                            <ControlButton icon={PhosphorIcons.SpeakerSimpleLow} command="volume_down" />
                            <label cssName="volume-label">Volume</label>
                            <ControlButton icon={PhosphorIcons.SpeakerSimpleHigh} command="volume_up" />
                        </box>
                    </box>

                    {/* Power */}
                    <box cssName="power-controls" halign={Gtk.Align.CENTER}>
                        <button
                            cssName="power-button"
                            disabled={bind(state).as(s => !s.selectedDevice || s.isLoading)}
                            onClicked={() => sendRemoteCommand("suspend")}
                            tooltip-text="Power"
                        >
                            <PhosphorIcon iconName={PhosphorIcons.Power} size={24} />
                        </button>
                    </box>
                </box>
            ))}

            {/* Error Display */}
            {bind(state).as(s => s.error && (
                <box cssName="error-message" vertical spacing={12}>
                    <box spacing={8}>
                        <PhosphorIcon iconName={PhosphorIcons.Warning} size={16} />
                        <label>{s.error}</label>
                    </box>
                    {s.error.includes("failed after multiple attempts") && s.selectedDevice && (
                        <button
                            cssName="retry-pairing-button"
                            onClicked={() => {
                                state.set({ ...state.get(), error: null });
                                startPairing(0);
                            }}
                        >
                            <box spacing={6}>
                                <PhosphorIcon iconName={PhosphorIcons.ArrowClockwise} size={16} />
                                <label>Retry Pairing</label>
                            </box>
                        </button>
                    )}
                </box>
            ))}

            {/* Help Text */}
            {bind(state).as(s => s.selectedDevice && !s.isConnected && (
                <box cssName="help-section" vertical spacing={8}>
                    <label cssName="help-title">Pairing Required</label>
                    <label cssName="help-text">To use the remote, you need to pair with your Apple TV:</label>
                    <box cssName="help-steps" vertical spacing={4}>
                        <label cssName="help-step-title">Option 1: Quick Pairing (Recommended)</label>
                        <label>1. Open terminal and run:</label>
                        <label cssName="help-code">atvremote --id {s.selectedDevice.identifier} pair</label>
                        <label>2. Enter the PIN when prompted</label>
                        <label>3. Return here and the remote will work</label>
                        
                        <label cssName="help-step-title">Option 2: UI Pairing</label>
                        <label>1. Click the "Pair" button above</label>
                        <label>2. Quickly enter the PIN that appears on TV</label>
                        <label>3. Note: The PIN expires very quickly!</label>
                        
                        <label cssName="help-step-title">Option 3: Apple TV Settings</label>
                        <label>1. Go to Settings → Remotes and Devices</label>
                        <label>2. Select "Remote App and Devices"</label>
                        <label>3. Your computer should appear there</label>
                    </box>
                </box>
            ))}
        </box>
    );
}
