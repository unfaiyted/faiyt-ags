import { Variable, bind } from "astal";
import Astal from "gi://AstalIO";
import { Widget, Gtk } from "astal/gtk4";
import { PhosphorIcons } from "../../../utils/icons/types";
import PhosphorIcon from "../../../utils/icons/phosphor";
import { execAsync } from "astal/process";
import AppleTVService from "../../../../services/apple-tv";
import { sidebarLogger as log } from "../../../../utils/logger";

// Import types and components
import { RemoteState, AppleTV } from "./types";
import DeviceList from "./DeviceList";
import RemoteControl from "./RemoteControl";
import PairingDialog from "./PairingDialog";
import NowPlaying from "./NowPlaying";
import { setupRemoteKeyboardHandler, removeRemoteKeyboardHandler } from "./keyboard-handler";

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

    const scanIP = async (ip: string) => {
        const ipToScan = ip.trim();
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

    const handleRestart = async () => {
        state.set({ ...state.get(), isLoading: true, error: null });
        await appleTVService.restart();
        state.set({ ...state.get(), isLoading: false });

        // Re-discover devices after restart
        setTimeout(() => discoverDevices(), 1000);
    };

    // Initial device discovery
    discoverDevices();

    // Store keyboard controller reference
    let keyboardController: Gtk.EventControllerKey | null = null;
    let parentWindow: Gtk.Window | null = null;

    // Function to set up keyboard handler
    const setupKeyboardHandler = (widget: Gtk.Widget) => {
        // Find the parent window
        let parent = widget.get_parent();
        while (parent && !(parent instanceof Gtk.Window)) {
            parent = parent.get_parent();
        }

        if (parent instanceof Gtk.Window) {
            parentWindow = parent;

            // Subscribe to connection state changes to update keyboard handler
            state.subscribe((currentState) => {
                if (keyboardController && parentWindow) {
                    removeRemoteKeyboardHandler(parentWindow, keyboardController);
                    keyboardController = null;
                }

                if (currentState.isConnected && currentState.selectedDevice && parentWindow) {
                    keyboardController = setupRemoteKeyboardHandler(parentWindow, {
                        isConnected: currentState.isConnected,
                        onCommand: sendRemoteCommand
                    });
                    log.debug("Remote keyboard handler set up for connected device", {
                        device: currentState.selectedDevice.name
                    });
                }
            });
        } else {
            log.warn("Could not find parent window for remote keyboard handler");
        }
    };

    return (
        <box {...props} cssName="remote-module" vertical spacing={16}
            setup={(self) => {
                // Set up keyboard handler after widget is realized
                self.connect('realize', () => {
                    log.info("Setting up keyboard handler");
                    setupKeyboardHandler(self);
                });
            }}
        >
            {/* Device Selection */}
            {bind(state).as(s => (
                <DeviceList
                    devices={s.devices}
                    selectedDevice={s.selectedDevice}
                    isConnected={s.isConnected}
                    isLoading={s.isLoading}
                    onDeviceSelect={connectToDevice}
                    onDiscoverDevices={discoverDevices}
                    onScanIP={scanIP}
                    onRestart={handleRestart}
                />
            ))}

            {/* Remote Control and Pairing */}
            {bind(state).as(s => s.selectedDevice ? (
                <>
                    <PairingDialog
                        selectedDevice={s.selectedDevice}
                        isConnected={s.isConnected}
                        pairingStatus={s.pairingStatus}
                        pairingInProgress={s.pairingInProgress}
                        showPinEntry={s.showPinEntry}
                        pairingPin={s.pairingPin}
                        onStartPairing={startPairing}
                        onCancelPairing={cancelPairing}
                        onPinChange={(pin) => state.set({ ...state.get(), pairingPin: pin })}
                        onSubmitPin={submitPin}
                    />

                    <box
                        halign={Gtk.Align.CENTER}
                        valign={Gtk.Align.CENTER}
                    >
                        <RemoteControl
                            isConnected={s.isConnected}
                            isLoading={s.isLoading}
                            onCommand={sendRemoteCommand}
                        />
                    </box>
                    <NowPlaying
                        playingInfo={s.playingInfo}
                        isConnected={s.isConnected}
                    />


                </>
            ) : <box />)}

            {/* Error Display */}
            {bind(state).as(s => s.error ? (
                <box cssName="remote-error" spacing={8}>
                    <PhosphorIcon iconName={PhosphorIcons.Warning} size={16} />
                    <label>{s.error}</label>
                </box>
            ) : <box />)}
        </box>
    );
}
