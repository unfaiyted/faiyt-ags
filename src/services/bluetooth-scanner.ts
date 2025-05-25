import { GObject, register } from "astal/gobject";
import { subprocess } from "astal/process";
import { Variable } from "astal";
import { createLogger, PerformanceMonitor } from "../utils/logger";

const log = createLogger("BluetoothScanner");
const perf = new PerformanceMonitor("BluetoothScanner");

export interface ScannedDevice {
  address: string;
  name: string;
  rssi?: number;
  icon?: string;
  class?: string;
  uuids?: string[];
  manufacturerData?: Map<string, string>;
  serviceData?: Map<string, string>;
  lastSeen: number; // timestamp for sorting
}

@register({ GTypeName: "BluetoothScanner" })
export default class BluetoothScanner extends GObject.Object {
  private static _instance: BluetoothScanner | null = null;
  private _devices = new Map<string, ScannedDevice>();
  private _scanning = Variable(false);
  private _devicesVar = Variable<ScannedDevice[]>([]);
  private _proc: any = null;

  static get_default(): BluetoothScanner {
    if (!BluetoothScanner._instance) {
      log.debug("Creating new BluetoothScanner instance");
      BluetoothScanner._instance = new BluetoothScanner();
    }
    return BluetoothScanner._instance;
  }

  get devices() {
    return this._devicesVar.get();
  }

  get devicesVar() {
    return this._devicesVar;
  }

  get scanning() {
    return this._scanning;
  }

  constructor() {
    super();
    log.info("Initializing BluetoothScanner");
    this._startBluetoothctl();
  }

  private _startBluetoothctl() {
    try {
      log.info("Starting bluetoothctl subprocess");
      this._proc = subprocess({
        cmd: ["bluetoothctl"],
        stdout: (line) => this._parseLine(line),
        stderr: (line) => log.error("bluetoothctl stderr:", { error: line }),
      });
      log.debug("bluetoothctl subprocess started successfully");
    } catch (error) {
      log.error("Failed to start bluetoothctl", { error });
    }
  }

  private _parseLine(line: string) {
    const timer = perf.start("parseLine");
    
    // Debug log the line to see what we're getting
    if (line.includes("RSSI") || line.includes("Device")) {
      log.verbose(`Bluetoothctl output: ${line}`);
    }
    
    // Parse different bluetoothctl output patterns
    
    // New device discovery
    const newDeviceMatch = line.match(/\[NEW\] Device ([0-9A-F:]+) (.+)/);
    if (newDeviceMatch) {
      const [_, address, name] = newDeviceMatch;
      if (!this._devices.has(address)) {
        this._devices.set(address, { 
          address, 
          name,
          lastSeen: Date.now()
        });
        this._updateDevicesList();
        log.info(`New device discovered: ${name}`, { address, name });
      } else {
        // Update last seen time if device reappears
        const device = this._devices.get(address)!;
        device.lastSeen = Date.now();
        this._updateDevicesList();
      }
      timer();
      return;
    }

    // Device removal
    const delDeviceMatch = line.match(/\[DEL\] Device ([0-9A-F:]+)/);
    if (delDeviceMatch) {
      const address = delDeviceMatch[1];
      if (this._devices.has(address)) {
        const device = this._devices.get(address);
        log.info(`Device removed: ${device?.name}`, { address, name: device?.name });
        this._devices.delete(address);
        this._updateDevicesList();
      }
      timer();
      return;
    }

    // Device property changes
    const changeMatch = line.match(/\[CHG\] Device ([0-9A-F:]+) ([^:]+): (.+)/);
    if (changeMatch) {
      const [_, address, property, value] = changeMatch;
      let device = this._devices.get(address);
      
      // If device doesn't exist yet, create it
      if (!device) {
        log.debug(`Creating device from property change`, { address, property, value });
        device = {
          address,
          name: address, // Use address as temp name
          lastSeen: Date.now()
        };
        this._devices.set(address, device);
      }
      
      // Update last seen
      device.lastSeen = Date.now();
      
      switch (property) {
        case "Name":
          device.name = value;
          break;
        case "Alias":
          device.name = value; // Prefer alias over name
          break;
        case "RSSI":
          // RSSI format: "0xffffffc4 (-60)" or just "-60"
          let rssiValue: number | undefined;
          
          // Try to match the hex format first
          const hexMatch = value.match(/0x[0-9a-f]+\s+\((-?\d+)\)/);
          if (hexMatch) {
            rssiValue = parseInt(hexMatch[1]);
          } else {
            // Try direct number format
            const directMatch = value.match(/^(-?\d+)$/);
            if (directMatch) {
              rssiValue = parseInt(directMatch[1]);
            }
          }
          
          if (rssiValue !== undefined) {
            device.rssi = rssiValue;
            log.debug(`Updated RSSI for ${device.name}`, { name: device.name, rssi: rssiValue, address });
            this._updateDevicesList(); // Trigger UI update
          } else {
            log.warn(`Failed to parse RSSI value`, { value, address });
          }
          break;
        case "Icon":
          device.icon = value;
          break;
        case "Class":
          device.class = value;
          break;
        case "UUIDs":
          if (!device.uuids) device.uuids = [];
          if (!device.uuids.includes(value)) {
            device.uuids.push(value);
          }
          break;
      }
      this._updateDevicesList();
      timer();
      return;
    }

    // Discovery state changes
    if (line.includes("Discovery started")) {
      log.info("Bluetooth discovery started");
      this._scanning.set(true);
    } else if (line.includes("Discovery stopped")) {
      log.info("Bluetooth discovery stopped");
      this._scanning.set(false);
    }
    
    timer();
  }

  private _updateDevicesList() {
    const devicesList = Array.from(this._devices.values());
    
    log.verbose(`Updating devices list`, { 
      deviceCount: devicesList.length,
      withRSSI: devicesList.filter(d => d.rssi !== undefined).length 
    });
    
    // Sort by multiple criteria:
    // 1. Devices with RSSI (closer) first
    // 2. Among devices with RSSI, sort by signal strength (higher = closer)
    // 3. Among devices without RSSI, sort by most recently seen
    // 4. Finally by name as fallback
    devicesList.sort((a, b) => {
      // Both have RSSI - sort by signal strength (closer devices first)
      if (a.rssi !== undefined && b.rssi !== undefined) {
        return b.rssi - a.rssi; // Higher RSSI = stronger signal = closer
      }
      
      // Only one has RSSI - prioritize the one with RSSI
      if (a.rssi !== undefined && b.rssi === undefined) return -1;
      if (a.rssi === undefined && b.rssi !== undefined) return 1;
      
      // Neither has RSSI - sort by last seen (most recent first)
      const timeDiff = b.lastSeen - a.lastSeen;
      if (timeDiff !== 0) return timeDiff;
      
      // Finally sort by name
      return a.name.localeCompare(b.name);
    });

    this._devicesVar.set(devicesList);
  }

  async startScan() {
    if (!this._proc) {
      log.error("Cannot start scan: bluetoothctl process not running");
      return;
    }

    try {
      // Clear existing devices for fresh scan
      log.debug("Clearing device list for fresh scan");
      this._devices.clear();
      this._updateDevicesList();
      
      // Send scan on command
      log.info("Starting Bluetooth scan");
      this._proc.write("scan on\n");
      this._scanning.set(true);
      
      // Clean up stale devices periodically (devices not seen in 60 seconds)
      const cleanupInterval = setInterval(() => {
        const now = Date.now();
        const staleTimeout = 60000; // 60 seconds
        
        for (const [address, device] of this._devices) {
          if (now - device.lastSeen > staleTimeout) {
            log.debug(`Removing stale device`, { name: device.name, address, lastSeen: device.lastSeen });
            this._devices.delete(address);
          }
        }
        
        this._updateDevicesList();
      }, 10000); // Check every 10 seconds
      
      // Auto-stop after 30 seconds
      setTimeout(() => {
        if (this._scanning.get()) {
          log.info("Auto-stopping scan after 30 seconds");
          clearInterval(cleanupInterval);
          this.stopScan();
        }
      }, 30000);
    } catch (error) {
      log.error("Failed to start scan", { error });
      this._scanning.set(false);
    }
  }

  async stopScan() {
    if (!this._proc) {
      log.warn("Cannot stop scan: bluetoothctl process not running");
      return;
    }

    try {
      log.info("Stopping Bluetooth scan");
      this._proc.write("scan off\n");
      this._scanning.set(false);
    } catch (error) {
      log.error("Failed to stop scan", { error });
    }
  }

  destroy() {
    if (this._proc) {
      try {
        log.info("Destroying BluetoothScanner instance");
        this.stopScan();
        this._proc.write("quit\n");
        this._proc.kill();
        log.debug("BluetoothScanner cleanup completed");
      } catch (error) {
        log.error("Error cleaning up bluetoothctl", { error });
      }
    } else {
      log.debug("No bluetoothctl process to clean up");
    }
  }
}