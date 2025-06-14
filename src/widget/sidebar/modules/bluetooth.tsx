import { Widget, Gtk } from "astal/gtk4";
import { Variable, bind, execAsync } from "astal";
import Bluetooth from "gi://AstalBluetooth";
import { PhosphorIcon } from "../../utils/icons/phosphor";
import { PhosphorIcons } from "../../utils/icons/types";
import BluetoothScanner from "../../../services/bluetooth-scanner";
import { setupCursorHover } from "../../utils/buttons";
import { createLogger } from "../../../utils/logger";
import { actions } from "../../../utils/actions";

const log = createLogger('BluetoothModule');

const bluetooth = Bluetooth.get_default();
const scanner = BluetoothScanner.get_default();

interface BluetoothDevice {
  address: string;
  name: string;
  alias: string;
  paired: boolean;
  connected: boolean;
  trusted: boolean;
  battery_percentage?: number;
  icon_name?: string;
  type?: string;
  connecting?: boolean;
  rssi?: number; // Signal strength for scanned devices
}

// Map device types to Phosphor icons
const getDeviceIcon = (device: BluetoothDevice): PhosphorIcons => {
  const iconName = device.icon_name?.toLowerCase() || "";
  const name = device.name?.toLowerCase() || "";

  if (iconName.includes("headphone") || iconName.includes("headset") || name.includes("headphone")) {
    return PhosphorIcons.Headphones;
  } else if (iconName.includes("speaker") || name.includes("speaker")) {
    return PhosphorIcons.SpeakerHigh;
  } else if (iconName.includes("phone") || name.includes("phone")) {
    return PhosphorIcons.DeviceMobile;
  } else if (iconName.includes("computer") || iconName.includes("laptop")) {
    return PhosphorIcons.Laptop;
  } else if (iconName.includes("keyboard")) {
    return PhosphorIcons.Keyboard;
  } else if (iconName.includes("mouse")) {
    return PhosphorIcons.Mouse;
  } else if (iconName.includes("gamepad") || iconName.includes("controller")) {
    return PhosphorIcons.GameController;
  } else if (iconName.includes("watch")) {
    return PhosphorIcons.Watch;
  }

  return PhosphorIcons.Bluetooth;
};

// Bluetooth status component
const BluetoothStatus = () => {
  const connectedDevices = Variable(0);
  const isEnabled = actions.bluetooth.getBluetoothEnabled();


  // Subscribe to changes
  bluetooth.connect("notify", () => {

    // Count connected devices
    const connected = bluetooth.get_devices().filter(d => d.connected).length;
    connectedDevices.set(connected);
  });

  return (
    <box cssName="bluetooth-status" vertical>
      <box spacing={12}>
        <box cssName="bluetooth-icon-wrapper">
          <PhosphorIcon
            marginStart={12}
            cssName="bluetooth-icon"
            iconName={bind(isEnabled).as(p => p ? PhosphorIcons.Bluetooth : PhosphorIcons.BluetoothX)}
            size={24}
          />
        </box>
        <box vertical hexpand>
          <label cssName="bluetooth-status-title" xalign={0} label="Bluetooth" />
          <label
            cssName="bluetooth-status-subtitle"
            xalign={0}
            label={bind(connectedDevices).as(count =>
              count > 0 ? `${count} connected` : "Not connected"
            )}
          />
        </box>
        <box marginBottom={24} cssName="bluetooth-switch">
          <switch
            setup={setupCursorHover}
            active={bind(isEnabled)}
            onStateSet={(self, state) => {
              // Only toggle if the state is different from current state
              // This prevents recursion when the switch updates from the bound variable
              if (state !== isEnabled.get()) {
                if (state) {
                  actions.bluetooth.enable();
                } else {
                  actions.bluetooth.disable();
                }
              }
              // Return true to accept the state change
              return true;
            }}
          />
        </box>
      </box>
    </box>
  );
};

// Individual Bluetooth device item
const BluetoothDeviceItem = ({ device }: { device: BluetoothDevice }) => {
  const connecting = Variable(false);
  const removing = Variable(false);

  const handleConnect = async () => {
    connecting.set(true);
    try {
      // Find the actual device object from bluetooth service
      const btDevice = bluetooth.get_devices().find(d => d.address === device.address);
      if (!btDevice) {
        // Device not in AstalBluetooth, use bluetoothctl
        log.debug('Device not in AstalBluetooth, using bluetoothctl', { device: device.name });

        if (device.connected) {
          await execAsync(["bluetoothctl", "disconnect", device.address]);
        } else {
          // Try to connect (will pair if needed)
          await execAsync(["bluetoothctl", "connect", device.address]);
        }
      } else {
        // Use bluetoothctl for connect/disconnect as AstalBluetooth methods need specific arguments
        if (device.connected) {
          await execAsync(["bluetoothctl", "disconnect", device.address]);
        } else {
          // Pair first if not paired
          if (!device.paired) {
            log.info('Pairing with device', { name: device.name });
            await execAsync(["bluetoothctl", "pair", device.address]);
            await execAsync(["bluetoothctl", "trust", device.address]);
          }
          // Then connect
          log.info('Connecting to device', { name: device.name });
          await execAsync(["bluetoothctl", "connect", device.address]);
        }
      }
    } catch (error) {
      log.error('Failed to connect to device', { name: device.name, error });
    }
    connecting.set(false);
  };

  const handleRemove = async () => {
    removing.set(true);
    try {
      // Disconnect first if connected
      if (device.connected) {
        log.debug('Disconnecting device before removal', { name: device.name });
        await execAsync(["bluetoothctl", "disconnect", device.address]);
        // Wait a bit for disconnect to complete
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Remove the device
      log.info('Removing device', { name: device.name });
      await execAsync(["bluetoothctl", "remove", device.address]);
    } catch (error) {
      log.error('Failed to remove device', { name: device.name, error });
    }
    removing.set(false);
  };

  return (
    <box cssName="bluetooth-item" spacing={12}>
      <button
        cssName="bluetooth-item-button"
        cssClasses={[device.connected ? "connected" : "", device.paired ? "paired" : ""]}
        setup={setupCursorHover}
        onClicked={handleConnect}
        hexpand
      >
        <box spacing={12}>
          <box cssName="bluetooth-item-icon">
            <PhosphorIcon
              iconName={getDeviceIcon(device)}
              size={20}
            />
          </box>
          <box vertical hexpand>
            <label
              cssName="bluetooth-item-name"
              xalign={0}
              label={`${device.alias || device.name}${device.rssi !== undefined ? ` (${device.rssi} dBm)` : ""}`}
            />
            <box cssName="bluetooth-item-info" spacing={8}>
              {device.connected && (
                <label cssName="bluetooth-item-status" label="Connected" />
              )}
              {device.paired && !device.connected && (
                <label cssName="bluetooth-item-status" label="Paired" />
              )}
              {device.battery_percentage !== undefined && device.battery_percentage >= 0 && (
                <box spacing={4}>
                  <PhosphorIcon
                    iconName={
                      device.battery_percentage > 80 ? PhosphorIcons.BatteryFull :
                        device.battery_percentage > 60 ? PhosphorIcons.BatteryHigh :
                          device.battery_percentage > 40 ? PhosphorIcons.BatteryMedium :
                            device.battery_percentage > 20 ? PhosphorIcons.BatteryLow :
                              PhosphorIcons.BatteryWarning
                    }
                    size={12}
                  />
                  <label label={`${device.battery_percentage}%`} />
                </box>
              )}
              {device.rssi !== undefined && (
                <box spacing={4}>
                  <PhosphorIcon
                    iconName={
                      device.rssi > -60 ? PhosphorIcons.WifiHigh :
                        device.rssi > -70 ? PhosphorIcons.WifiMedium :
                          device.rssi > -80 ? PhosphorIcons.WifiLow :
                            PhosphorIcons.WifiNone
                    }
                    size={12}
                  />
                  <label label={`${device.rssi} dBm`} />
                </box>
              )}
            </box>
          </box>
          {bind(connecting).as(c =>
            c ? <Gtk.Spinner cssName="bluetooth-connecting" /> : <box />
          )}
        </box>
      </button>
      {device.paired && (
        <button
          cssName="bluetooth-remove-btn"
          setup={setupCursorHover}
          onClicked={handleRemove}
          tooltip_text="Remove device"
        >
          {bind(removing).as(r =>
            r ? (
              <Gtk.Spinner cssName="bluetooth-removing" />
            ) : (
              <PhosphorIcon iconName={PhosphorIcons.Trash} size={16} />
            )
          )}
        </button>
      )}
    </box>
  );
};

// Bluetooth device list component
const BluetoothDeviceList = () => {
  const showAll = Variable(false);

  const updateDevices = () => {
    // Get devices from AstalBluetooth service
    const pairedDevices = bluetooth.get_devices().map(d => ({
      address: d.address,
      name: d.name,
      alias: d.alias || d.name,
      paired: d.paired,
      connected: d.connected,
      trusted: d.trusted,
      // battery_percentage: d.battery_percentage,
      icon_name: d.icon,
      // type: d.type,
    }));

    // Sort devices: connected first, then paired
    pairedDevices.sort((a, b) => {
      if (a.connected && !b.connected) return -1;
      if (!a.connected && b.connected) return 1;
      return 0;
    });

    return pairedDevices;
  };

  const toggleDiscovery = async () => {
    try {
      // Ensure bluetooth is powered on
      if (!bluetooth.is_powered) {
        log.debug('Bluetooth is off, turning it on first');
        bluetooth.is_powered = true;
        // Wait a bit for bluetooth to power on
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (scanner.scanning.get()) {
        await scanner.stopScan();
      } else {
        await scanner.startScan();
      }
    } catch (error) {
      log.error('Failed to toggle discovery', { error });
    }
  };

  return (
    <box vertical cssName="bluetooth-list">
      <box cssName="bluetooth-list-header" spacing={8}>
        <label label="Devices" hexpand />
        <button
          cssName="bluetooth-filter-btn"
          setup={setupCursorHover}
          onClicked={() => showAll.set(!showAll.get())}
          tooltip_text={bind(showAll).as(s => s ? "Show paired only" : "Show all devices")}
        >
          <PhosphorIcon
            iconName={bind(showAll).as(s => s ? PhosphorIcons.Eye : PhosphorIcons.EyeSlash)}
            size={16}
          />
        </button>
        <button
          cssName="bluetooth-scan-btn"
          cssClasses={bind(scanner.scanning).as(d => d ? ["scanning"] : [])}
          setup={setupCursorHover}
          onClicked={toggleDiscovery}
          tooltip_text={bind(scanner.scanning).as(d => d ? "Stop scanning" : "Scan for devices")}
        >
          <PhosphorIcon
            iconName={bind(scanner.scanning).as(d => d ? PhosphorIcons.MagnifyingGlass : PhosphorIcons.MagnifyingGlassPlus)}
            size={16}
            cssClasses={bind(scanner.scanning).as(d => d ? ["spinning"] : [])}
          />
        </button>
      </box>
      <Gtk.ScrolledWindow
        cssName="bluetooth-list-scroll"
        vscrollbar_policy={Gtk.PolicyType.AUTOMATIC}
        hscrollbar_policy={Gtk.PolicyType.NEVER}
        heightRequest={300}
      >
        <box vertical spacing={4}>
          {bind(scanner.devicesVar).as(scannedDevices => {
            const pairedDevices = updateDevices();

            // Create a combined list
            const allDevices = [...pairedDevices];

            // Debug: Log scanned devices with RSSI
            if (scannedDevices.length > 0) {
              log.debug('Scanned devices', {
                count: scannedDevices.length,
                devices: scannedDevices.filter(d => d.rssi !== undefined).map(d => ({
                  name: d.name,
                  address: d.address,
                  rssi: d.rssi
                }))
              });
            }

            // Process scanned devices
            if (showAll.get()) {
              scannedDevices.forEach(scanned => {
                const existingDevice = allDevices.find(d => d.address === scanned.address);
                if (existingDevice) {
                  // Update RSSI for existing paired devices
                  // existingDevice.rssi = scanned.rssi;
                  log.debug('Updated RSSI for existing device', { name: existingDevice.name, rssi: scanned.rssi });
                } else {
                  // Add new unpaired device
                  allDevices.push({
                    address: scanned.address,
                    name: scanned.name,
                    alias: scanned.name,
                    paired: false,
                    connected: false,
                    trusted: false,
                    // battery_percentage: undefined,
                    icon_name: scanned.icon || PhosphorIcons.Bluetooth,
                    // type: undefined,
                    // rssi: scanned.rssi,
                  });
                }
              });
            } else if (scanner.scanning.get()) {
              // Even when not showing all, update RSSI for paired devices during scan
              scannedDevices.forEach(scanned => {
                const pairedDevice = allDevices.find(d => d.address === scanned.address);
                if (pairedDevice) {
                  // pairedDevice.rssi = scanned.rssi;
                  log.debug('Updated RSSI for paired device', { name: pairedDevice.name, rssi: scanned.rssi });
                }
              });
            }

            const filteredDevices = showAll.get() ? allDevices : pairedDevices;

            return filteredDevices.length > 0 ? (
              <>
                {filteredDevices.map(d => <BluetoothDeviceItem device={d} />)}
                {scanner.scanning.get() && (
                  <box cssName="bluetooth-scanning-info" spacing={8}>
                    <Gtk.Spinner cssName="bluetooth-scan-spinner" />
                    <label label={`Scanning... Found ${scannedDevices.length} new devices`} />
                  </box>
                )}
              </>
            ) : (
              <box cssName="bluetooth-empty" vertical spacing={8}>
                <PhosphorIcon
                  iconName={showAll.get() ? PhosphorIcons.BluetoothX : PhosphorIcons.Bluetooth}
                  size={48}
                />
                <label label={showAll.get() ? "No devices found" : "No paired devices"} />
                {!showAll.get() && (
                  <label
                    cssName="bluetooth-hint"
                    label="Tap the eye icon to show all devices"
                  />
                )}
              </box>
            );
          })}
          {/* Force re-render when scanning state changes */}
          {bind(scanner.scanning).as(() => <box />)}
        </box>
      </Gtk.ScrolledWindow>
    </box>
  );
};

export default function BluetoothModules(props: Widget.BoxProps) {
  const { cssName, ...restProps } = props;

  return (
    <box cssName="bluetooth-module" vertical spacing={16} {...restProps}>
      <BluetoothStatus />
      <BluetoothDeviceList />
    </box>
  );
}
