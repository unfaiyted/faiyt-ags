import { Variable, bind } from "astal";
import { Widget, Gtk } from "astal/gtk4";
import { PhosphorIcons } from "../../../utils/icons/types";
import PhosphorIcon from "../../../utils/icons/phosphor";
import { setupCursorHover } from "../../../utils/buttons";
import { AppleTV } from "./types";

interface DeviceListProps extends Widget.BoxProps {
    devices: AppleTV[];
    selectedDevice: AppleTV | null;
    isConnected: boolean;
    isLoading: boolean;
    onDeviceSelect: (device: AppleTV) => void;
    onDiscoverDevices: () => void;
    onScanIP: (ip: string) => void;
    onRestart: () => void;
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

export default function DeviceList({
    devices,
    selectedDevice,
    isConnected,
    isLoading,
    onDeviceSelect,
    onDiscoverDevices,
    onScanIP,
    onRestart,
    ...props
}: DeviceListProps) {
    // Separate variable for showManualAdd to avoid re-rendering the input
    const showManualAdd = Variable(false);

    return (
        <box {...props} cssName="remote-device-card" vertical>
            <box cssName="remote-device-header" spacing={12}>
                <box cssName="remote-device-icon-wrapper" >
                    <PhosphorIcon
                        marginStart={12}
                        iconName={PhosphorIcons.Television} size={24} />
                </box>
                <label cssName="remote-section-title">Apple TV Devices</label>
                <box hexpand />
                <box cssName="remote-header-actions" spacing={8}>
                    <button
                        setup={setupCursorHover}
                        onClicked={onDiscoverDevices}
                        disabled={isLoading}
                        tooltip_text="Search for devices"
                    >
                        <PhosphorIcon
                            iconName={PhosphorIcons.MagnifyingGlass}
                            size={16}
                            cssClasses={isLoading ? ["spinning"] : []}
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
                        onClicked={onRestart}
                        tooltip_text="Restart Apple TV service"
                    >
                        <PhosphorIcon iconName={PhosphorIcons.ArrowClockwise} size={16} />
                    </button>
                </box>
            </box>

            <box cssName="remote-device-list" vertical spacing={4}>
                {isLoading && devices.length === 0 ? (
                    <box cssName="remote-loading-state" vertical>
                        <Gtk.Spinner spinning={true} />
                        <label>Searching for devices...</label>
                    </box>
                ) : devices.length === 0 ? (
                    <box cssName="remote-empty-state" vertical>
                        <PhosphorIcon iconName={PhosphorIcons.WifiSlash} size={48} />
                        <label>No Apple TV devices found</label>
                    </box>
                ) : (
                    <Gtk.ScrolledWindow
                        hscrollbarPolicy={Gtk.PolicyType.NEVER}
                        vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
                        heightRequest={Math.min(200, devices.length * 75)}
                    >
                        <box vertical spacing={4}>
                            {devices.map(device => (
                                <button
                                    cssName="remote-device-item"
                                    cssClasses={selectedDevice?.identifier === device.identifier ? ["selected"] : []}
                                    onClicked={() => onDeviceSelect(device)}
                                    setup={setupCursorHover}
                                >
                                    <box spacing={12}>
                                        <box cssName="remote-device-icon">
                                            <PhosphorIcon
                                                marginStart={9}
                                                iconName={PhosphorIcons.Television} size={20} />
                                        </box>
                                        <box vertical>
                                            <label cssName="remote-device-name">{device.name}</label>
                                            <label cssName="remote-device-address">{device.address}</label>
                                        </box>
                                        <box hexpand />
                                        {selectedDevice?.identifier === device.identifier && isConnected && (
                                            <box cssName="remote-connected-indicator">
                                                <PhosphorIcon iconName={PhosphorIcons.CheckCircle} size={20} />
                                            </box>
                                        )}
                                    </box>
                                </button>
                            ))}
                        </box>
                    </Gtk.ScrolledWindow>
                )}

                {/* Manual IP Add */}
                {bind(showManualAdd).as(show => show ? (
                    <ManualIPEntry
                        onScan={onScanIP}
                        isLoading={isLoading}
                    />
                ) : <box />)}
            </box>
        </box>
    );
}
