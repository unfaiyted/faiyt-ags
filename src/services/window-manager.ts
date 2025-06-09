import { execAsync, subprocess } from "astal";
import GLib from "gi://GLib";
import { createLogger } from "../utils/logger";
import configManager from "./config-manager";

const log = createLogger("WindowManager");

interface WindowInfo {
  address: string;
  title: string;
  class: string;
  workspace: number;
  lastScreenshot: number;
  screenshotPath: string;
}

interface HyprlandWindow {
  address: string;
  title: string;
  class: string;
  workspace: { id: number };
  focusHistoryID: number;
}

interface MonitorInfo {
  id: number;
  name: string;
  description: string;
  make: string;
  model: string;
  serial: string;
  width: number;
  height: number;
  refreshRate: number;
  x: number;
  y: number;
  scale: number;
  transform: number;
  focused: boolean;
  dpmsStatus: boolean;
  vrr: boolean;
  disabled: boolean;
  currentFormat: string;
  availableModes: string[];
  activeWorkspace: {
    id: number;
    name: string;
  };
}

interface MonitorMode {
  width: number;
  height: number;
  refreshRate: number;
  formatted: string;
}

class WindowManagerService {
  private windows: Map<string, WindowInfo> = new Map();
  private activeWindowAddress: string | null = null;
  private screenshotInterval: number = 30000; // 30 seconds
  private screenshotTimer: number | null = null;
  private cleanupTimer: number | null = null;
  private ipcProcess: any = null;
  private tmpDir: string;
  private workspaceScreenshotDir: string;
  private isRunning: boolean = false;
  private monitorScreenshots: Map<string, string> = new Map(); // monitor name -> screenshot path

  constructor() {
    // Create tmp directory for screenshots
    this.tmpDir = GLib.build_filenamev([GLib.get_tmp_dir(), "ags-window-screenshots"]);
    this.workspaceScreenshotDir = GLib.build_filenamev([GLib.get_tmp_dir(), "ags-workspace-screenshots"]);
    this.ensureDirectory(this.tmpDir);
    this.ensureDirectory(this.workspaceScreenshotDir);
    
    log.info("WindowManager service initialized", { 
      tmpDir: this.tmpDir,
      workspaceScreenshotDir: this.workspaceScreenshotDir 
    });
  }

  private ensureDirectory(path: string) {
    try {
      GLib.mkdir_with_parents(path, 0o755);
    } catch (error) {
      log.error("Failed to create directory", { path, error });
    }
  }

  async start() {
    const config = configManager.getValue("windowManager");
    
    if (!config.enabled) {
      log.info("WindowManager service is disabled in config");
      return;
    }
    
    if (this.isRunning) {
      log.warn("WindowManager service already running");
      return;
    }

    this.isRunning = true;
    this.screenshotInterval = config.screenshotInterval;
    
    // Apply saved monitor configurations
    await this.applySavedMonitorConfigs();
    
    // Get initial window list
    await this.refreshWindowList();
    
    // Start IPC listener
    this.startIPCListener();
    
    // Start cleanup timer
    this.startCleanupTimer();
    
    log.info("WindowManager service started", { 
      screenshotInterval: this.screenshotInterval,
      cleanupInterval: config.cleanupInterval,
      captureOnFocus: config.captureOnFocus
    });
  }

  stop() {
    this.isRunning = false;
    
    if (this.ipcProcess) {
      this.ipcProcess.kill();
      this.ipcProcess = null;
    }
    
    if (this.screenshotTimer) {
      GLib.source_remove(this.screenshotTimer);
      this.screenshotTimer = null;
    }
    
    if (this.cleanupTimer) {
      GLib.source_remove(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    
    log.info("WindowManager service stopped");
  }

  private startIPCListener() {
    const signature = GLib.getenv("HYPRLAND_INSTANCE_SIGNATURE");
    if (!signature) {
      log.error("HYPRLAND_INSTANCE_SIGNATURE not found");
      return;
    }

    const socketPath = `${GLib.getenv("XDG_RUNTIME_DIR")}/hypr/${signature}/.socket2.sock`;
    
    try {
      this.ipcProcess = subprocess({
        cmd: ["socat", "-U", "-", `UNIX-CONNECT:${socketPath}`],
        out: (line) => this.handleIPCMessage(line),
        err: (error) => log.error("IPC error", { error }),
      });
      
      log.info("IPC listener started", { socketPath });
    } catch (error) {
      log.error("Failed to start IPC listener", { error });
    }
  }

  private handleIPCMessage(message: string) {
    const parts = message.split(">>");
    if (parts.length < 2) return;

    const [event, data] = parts;
    
    switch (event) {
      case "activewindowv2":
        this.handleActiveWindowChange(data);
        break;
      case "windowtitlev2":
        this.handleWindowTitleChange(data);
        break;
      case "openwindow":
        this.handleOpenWindow(data);
        break;
      case "closewindow":
        this.handleCloseWindow(data);
        break;
    }
  }

  private async handleActiveWindowChange(address: string) {
    if (!address) return;
    
    const normalizedAddr = this.normalizeAddress(address);
    if (normalizedAddr === this.activeWindowAddress) return;
    
    const config = configManager.getValue("windowManager");
    
    log.debug("Active window changed", { 
      from: this.activeWindowAddress, 
      to: normalizedAddr,
      rawAddress: address
    });
    
    this.activeWindowAddress = normalizedAddr;
    
    // If window not in our list, refresh the list
    if (!this.windows.has(normalizedAddr)) {
      log.debug("Window not in list, refreshing window list");
      await this.refreshWindowList();
    }
    
    // Reset screenshot timer
    if (this.screenshotTimer) {
      GLib.source_remove(this.screenshotTimer);
      this.screenshotTimer = null;
    }
    
    // Take immediate screenshot if enabled
    if (config.captureOnFocus) {
      this.captureWindowScreenshot(normalizedAddr).catch(err => {
        log.error("Error capturing screenshot on focus", { error: err });
      });
    }
    
    // Schedule periodic screenshots
    if (this.screenshotInterval > 0) {
      this.screenshotTimer = GLib.timeout_add(
        GLib.PRIORITY_DEFAULT,
        this.screenshotInterval,
        () => {
          if (this.activeWindowAddress === normalizedAddr) {
            this.captureWindowScreenshot(normalizedAddr).catch(err => {
              log.error("Error capturing periodic screenshot", { error: err });
            });
          }
          return true; // Continue timer
        }
      );
    }
  }

  private handleWindowTitleChange(data: string) {
    const [address, title] = data.split(",");
    const normalizedAddr = this.normalizeAddress(address);
    const window = this.windows.get(normalizedAddr);
    
    if (window) {
      window.title = title || "";
      log.debug("Window title updated", { address: normalizedAddr, title });
    }
  }

  private handleOpenWindow(data: string) {
    const [address, workspace, windowClass, title] = data.split(",");
    const normalizedAddr = this.normalizeAddress(address);
    
    const windowInfo: WindowInfo = {
      address: normalizedAddr,
      title: title || "",
      class: windowClass || "",
      workspace: parseInt(workspace) || 1,
      lastScreenshot: 0,
      screenshotPath: GLib.build_filenamev([this.tmpDir, `${normalizedAddr.replace("0x", "")}.png`]),
    };
    
    this.windows.set(normalizedAddr, windowInfo);
    log.info("Window opened", windowInfo);
  }

  private handleCloseWindow(address: string) {
    const normalizedAddr = this.normalizeAddress(address);
    const window = this.windows.get(normalizedAddr);
    if (window) {
      // Clean up screenshot
      this.deleteScreenshot(window.screenshotPath);
      this.windows.delete(normalizedAddr);
      log.info("Window closed", { address: normalizedAddr });
    }
  }

  private normalizeAddress(address: string): string {
    // Ensure consistent address format (with 0x prefix)
    return address.startsWith("0x") ? address : `0x${address}`;
  }

  private async refreshWindowList() {
    try {
      const result = await execAsync(["hyprctl", "clients", "-j"]);
      
      const windows: HyprlandWindow[] = JSON.parse(result);
      
      // Clear existing windows
      this.windows.clear();
      
      // Add all current windows
      for (const win of windows) {
        const normalizedAddr = this.normalizeAddress(win.address);
        const windowInfo: WindowInfo = {
          address: normalizedAddr,
          title: win.title || "",
          class: win.class || "",
          workspace: win.workspace.id,
          lastScreenshot: 0,
          screenshotPath: GLib.build_filenamev([this.tmpDir, `${normalizedAddr.replace("0x", "")}.png`]),
        };
        
        this.windows.set(normalizedAddr, windowInfo);
      }
      
      log.info("Window list refreshed", { 
        count: this.windows.size,
        windows: Array.from(this.windows.keys())
      });
    } catch (error) {
      log.error("Failed to refresh window list", { error });
    }
  }

  private async captureWindowScreenshot(address: string) {
    const normalizedAddr = this.normalizeAddress(address);
    const window = this.windows.get(normalizedAddr);
    if (!window) {
      log.warn("Window not found for screenshot", { address: normalizedAddr });
      return;
    }

    try {
      // First get window geometry
      const clientsJson = await execAsync(["hyprctl", "clients", "-j"]);
      
      const clients = JSON.parse(clientsJson);
      const targetWindow = clients.find((w: any) => {
        const wAddr = this.normalizeAddress(w.address);
        return wAddr === normalizedAddr;
      });
      
      if (!targetWindow) {
        log.warn("Window not found in hyprctl output", { 
          address: normalizedAddr,
          availableWindows: clients.map((w: any) => this.normalizeAddress(w.address))
        });
        return;
      }
      
      // Calculate geometry
      const x = targetWindow.at[0];
      const y = targetWindow.at[1];
      const width = targetWindow.size[0];
      const height = targetWindow.size[1];
      
      // Validate geometry
      if (width <= 0 || height <= 0) {
        log.warn("Invalid window geometry", { 
          address: normalizedAddr,
          geometry: { x, y, width, height }
        });
        return;
      }
      
      // Use grim directly for window screenshots
      const command = [
        "grim",
        "-g",
        `${x},${y} ${width}x${height}`,
        "-t",
        "png",
        window.screenshotPath
      ];
      
      log.debug("Running screenshot command", { 
        command: command.join(" "),
        geometry: { x, y, width, height }
      });
      
      let result;
      try {
        result = await execAsync(command);
        log.debug("Screenshot command executed", { result });
      } catch (cmdError) {
        log.error("Screenshot command failed", { 
          command: command.join(" "),
          error: cmdError,
          stderr: cmdError.stderr,
          stdout: cmdError.stdout
        });
        throw cmdError;
      }
      
      // Check if file was created
      if (!GLib.file_test(window.screenshotPath, GLib.FileTest.EXISTS)) {
        throw new Error("Screenshot file was not created");
      }
      
      window.lastScreenshot = Date.now();
      log.info("Screenshot captured successfully", { 
        address: normalizedAddr, 
        path: window.screenshotPath,
        geometry: { x, y, width, height }
      });
      
      // Emit event for other components
      this.emit("screenshot-updated", { address: normalizedAddr, path: window.screenshotPath });
    } catch (error) {
      log.error("Failed to capture screenshot", { 
        address: normalizedAddr,
        error: error instanceof Error ? error.message : error,
        windowInfo: {
          title: window.title,
          class: window.class,
          geometry: targetWindow ? {
            at: targetWindow.at,
            size: targetWindow.size
          } : null
        }
      });
    }
  }

  private deleteScreenshot(path: string) {
    try {
      if (GLib.file_test(path, GLib.FileTest.EXISTS)) {
        GLib.unlink(path);
        log.debug("Screenshot deleted", { path });
      }
    } catch (error) {
      log.error("Failed to delete screenshot", { path, error });
    }
  }

  private startCleanupTimer() {
    const config = configManager.getValue("windowManager");
    const interval = config.cleanupInterval || 300000; // Default 5 minutes
    
    this.cleanupTimer = GLib.timeout_add(GLib.PRIORITY_DEFAULT, interval, () => {
      this.cleanupOrphanedScreenshots();
      return true; // Continue timer
    });
  }

  private cleanupOrphanedScreenshots() {
    try {
      const dir = GLib.Dir.open(this.tmpDir, 0);
      let filename: string | null;
      
      const validFiles = new Set(
        Array.from(this.windows.values()).map(w => 
          GLib.path_get_basename(w.screenshotPath)
        )
      );
      
      while ((filename = dir.read_name()) !== null) {
        if (filename.endsWith(".png") && !validFiles.has(filename)) {
          const fullPath = GLib.build_filenamev([this.tmpDir, filename]);
          this.deleteScreenshot(fullPath);
          log.debug("Cleaned up orphaned screenshot", { filename });
        }
      }
      
      dir.close();
    } catch (error) {
      log.error("Failed to cleanup screenshots", { error });
    }
  }

  // Event emitter functionality
  private listeners: Map<string, Array<(data: any) => void>> = new Map();

  on(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: (data: any) => void) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(cb => cb(data));
    }
  }

  // Public API
  getWindowScreenshot(address: string): string | null {
    const window = this.windows.get(address);
    if (window && GLib.file_test(window.screenshotPath, GLib.FileTest.EXISTS)) {
      return window.screenshotPath;
    }
    return null;
  }

  getActiveWindow(): WindowInfo | null {
    if (this.activeWindowAddress) {
      return this.windows.get(this.activeWindowAddress) || null;
    }
    return null;
  }

  getAllWindows(): WindowInfo[] {
    return Array.from(this.windows.values());
  }

  setScreenshotInterval(interval: number) {
    this.screenshotInterval = Math.max(5000, interval); // Minimum 5 seconds
    log.info("Screenshot interval updated", { interval: this.screenshotInterval });
  }

  // Monitor management methods
  async getMonitors(): Promise<MonitorInfo[]> {
    try {
      const result = await execAsync(["hyprctl", "monitors", "-j"]);
      const monitors: MonitorInfo[] = JSON.parse(result);
      
      log.debug("Fetched monitors", { 
        count: monitors.length,
        monitors: monitors.map(m => ({
          name: m.name,
          position: { x: m.x, y: m.y },
          size: { width: m.width, height: m.height },
          scale: m.scale
        }))
      });
      return monitors;
    } catch (error) {
      log.error("Failed to get monitors", { error });
      return [];
    }
  }

  parseMonitorMode(modeString: string): MonitorMode {
    // Parse mode string like "3024x1890@60.00Hz"
    const match = modeString.match(/(\d+)x(\d+)@([\d.]+)Hz/);
    if (!match) {
      throw new Error(`Invalid mode string: ${modeString}`);
    }
    
    return {
      width: parseInt(match[1]),
      height: parseInt(match[2]),
      refreshRate: parseFloat(match[3]),
      formatted: modeString
    };
  }

  async setMonitorMode(monitorName: string, mode: string) {
    try {
      // Format: hyprctl keyword monitor NAME,MODE,POSITION,SCALE
      const monitors = await this.getMonitors();
      const monitor = monitors.find(m => m.name === monitorName);
      
      if (!monitor) {
        throw new Error(`Monitor not found: ${monitorName}`);
      }
      
      // Parse the mode to ensure it's in the correct format
      const parsedMode = this.parseMonitorMode(mode);
      const formattedMode = `${parsedMode.width}x${parsedMode.height}@${parsedMode.refreshRate}`;
      
      const command = [
        "hyprctl",
        "keyword",
        "monitor",
        `${monitorName},${formattedMode},${monitor.x}x${monitor.y},${monitor.scale}`
      ];
      
      log.info("Setting monitor mode", { 
        monitor: monitorName, 
        mode: formattedMode,
        position: `${monitor.x}x${monitor.y}`,
        scale: monitor.scale,
        command: command.join(" ")
      });
      
      await execAsync(command);
      
      // Small delay to let Hyprland process the change
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return true;
    } catch (error) {
      log.error("Failed to set monitor mode", { error });
      return false;
    }
  }

  async setMonitorPosition(monitorName: string, x: number, y: number) {
    try {
      const monitors = await this.getMonitors();
      const monitor = monitors.find(m => m.name === monitorName);
      
      if (!monitor) {
        throw new Error(`Monitor not found: ${monitorName}`);
      }
      
      const currentMode = `${monitor.width}x${monitor.height}@${monitor.refreshRate.toFixed(2)}Hz`;
      const command = [
        "hyprctl",
        "keyword",
        "monitor",
        `${monitorName},${currentMode},${x}x${y},${monitor.scale}`
      ];
      
      log.info("Setting monitor position", {
        monitor: monitorName,
        position: { x, y },
        currentMode,
        command: command.join(" ")
      });
      
      await execAsync(command);
      
      // Don't reload here - let the caller decide when to reload
      // This allows batching multiple monitor changes
      
      return true;
    } catch (error) {
      log.error("Failed to set monitor position", { error });
      return false;
    }
  }

  async setMonitorScale(monitorName: string, scale: number) {
    try {
      const monitors = await this.getMonitors();
      const monitor = monitors.find(m => m.name === monitorName);
      
      if (!monitor) {
        throw new Error(`Monitor not found: ${monitorName}`);
      }
      
      // Round scale to 2 decimal places
      const roundedScale = Math.round(scale * 100) / 100;
      
      const currentMode = `${monitor.width}x${monitor.height}@${monitor.refreshRate.toFixed(2)}`;
      const command = [
        "hyprctl",
        "keyword", 
        "monitor",
        `${monitorName},${currentMode},${monitor.x}x${monitor.y},${roundedScale}`
      ];
      
      log.info("Setting monitor scale", {
        monitor: monitorName,
        scale: roundedScale,
        mode: currentMode,
        position: `${monitor.x}x${monitor.y}`,
        command: command.join(" ")
      });
      
      await execAsync(command);
      
      // Small delay to let Hyprland process the change
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return true;
    } catch (error) {
      log.error("Failed to set monitor scale", { error });
      return false;
    }
  }

  async setMonitorTransform(monitorName: string, transform: number) {
    try {
      const command = [
        "hyprctl",
        "keyword",
        "monitor",
        `${monitorName},transform,${transform}`
      ];
      
      log.info("Setting monitor transform", {
        monitor: monitorName,
        transform,
        command: command.join(" ")
      });
      
      await execAsync(command);
      return true;
    } catch (error) {
      log.error("Failed to set monitor transform", { error });
      return false;
    }
  }

  async toggleMonitor(monitorName: string, enabled: boolean) {
    try {
      const command = enabled
        ? ["hyprctl", "keyword", "monitor", `${monitorName},enable`]
        : ["hyprctl", "keyword", "monitor", `${monitorName},disable`];
      
      log.info("Toggling monitor", {
        monitor: monitorName,
        enabled,
        command: command.join(" ")
      });
      
      await execAsync(command);
      return true;
    } catch (error) {
      log.error("Failed to toggle monitor", { error });
      return false;
    }
  }

  async setPrimaryMonitor(monitorName: string) {
    try {
      // In Hyprland, there's no explicit primary monitor, but we can move workspace 1 to it
      const command = ["hyprctl", "dispatch", "moveworkspacetomonitor", `1 ${monitorName}`];
      
      log.info("Setting primary monitor", {
        monitor: monitorName,
        command: command.join(" ")
      });
      
      await execAsync(command);
      return true;
    } catch (error) {
      log.error("Failed to set primary monitor", { error });
      return false;
    }
  }

  // Capture screenshot of a specific monitor
  async captureMonitorScreenshot(monitorName: string): Promise<string | null> {
    try {
      const monitors = await this.getMonitors();
      const monitor = monitors.find(m => m.name === monitorName);
      
      if (!monitor) {
        log.error("Monitor not found for screenshot", { monitorName });
        return null;
      }

      const screenshotPath = GLib.build_filenamev([
        this.workspaceScreenshotDir, 
        `monitor-${monitorName.replace(/[^a-zA-Z0-9]/g, '-')}.png`
      ]);

      // Use grim to capture the monitor
      const command = [
        "grim",
        "-o",
        monitorName,
        "-t",
        "png",
        screenshotPath
      ];

      log.debug("Capturing monitor screenshot", { 
        monitor: monitorName,
        path: screenshotPath,
        command: command.join(" ")
      });

      await execAsync(command);

      // Check if file was created
      if (!GLib.file_test(screenshotPath, GLib.FileTest.EXISTS)) {
        throw new Error("Screenshot file was not created");
      }

      // Store the screenshot path
      this.monitorScreenshots.set(monitorName, screenshotPath);

      log.info("Monitor screenshot captured", { 
        monitor: monitorName,
        path: screenshotPath
      });

      // Emit event for other components
      this.emit("monitor-screenshot-updated", { monitor: monitorName, path: screenshotPath });

      return screenshotPath;
    } catch (error) {
      log.error("Failed to capture monitor screenshot", { 
        monitor: monitorName,
        error: error instanceof Error ? error.message : error
      });
      return null;
    }
  }

  // Capture screenshots for all monitors
  async captureAllMonitorScreenshots() {
    try {
      const monitors = await this.getMonitors();
      const results = await Promise.all(
        monitors.map(monitor => this.captureMonitorScreenshot(monitor.name))
      );
      
      log.info("Captured screenshots for all monitors", {
        count: results.filter(r => r !== null).length,
        total: monitors.length
      });

      return results.filter(r => r !== null) as string[];
    } catch (error) {
      log.error("Failed to capture all monitor screenshots", { error });
      return [];
    }
  }

  // Get the screenshot path for a monitor
  getMonitorScreenshot(monitorName: string): string | null {
    const path = this.monitorScreenshots.get(monitorName);
    if (path && GLib.file_test(path, GLib.FileTest.EXISTS)) {
      return path;
    }
    return null;
  }

  // Clean up workspace screenshots
  private cleanupWorkspaceScreenshots() {
    try {
      const dir = GLib.Dir.open(this.workspaceScreenshotDir, 0);
      let filename: string | null;
      
      while ((filename = dir.read_name()) !== null) {
        if (filename.endsWith(".png")) {
          const fullPath = GLib.build_filenamev([this.workspaceScreenshotDir, filename]);
          const stat = GLib.stat(fullPath);
          const age = Date.now() - (stat.mtime * 1000);
          
          // Delete screenshots older than 1 hour
          if (age > 3600000) {
            this.deleteScreenshot(fullPath);
            log.debug("Cleaned up old workspace screenshot", { filename, age });
          }
        }
      }
      
      dir.close();
    } catch (error) {
      log.error("Failed to cleanup workspace screenshots", { error });
    }
  }

  // Apply saved monitor configurations from config
  async applySavedMonitorConfigs(): Promise<void> {
    try {
      const savedConfigs = configManager.getValue("monitors");
      if (!savedConfigs || Object.keys(savedConfigs).length === 0) {
        log.info("No saved monitor configurations found");
        return;
      }

      log.info("Applying saved monitor configurations", { 
        count: Object.keys(savedConfigs).length 
      });

      // Get current monitors to verify they exist
      const currentMonitors = await this.getMonitors();
      const currentMonitorNames = new Set(currentMonitors.map(m => m.name));

      // Apply configurations for each saved monitor
      for (const [monitorName, config] of Object.entries(savedConfigs)) {
        if (!currentMonitorNames.has(monitorName)) {
          log.warn("Saved monitor not currently connected", { monitorName });
          continue;
        }

        const monitorConfig = config as any;
        log.info("Applying configuration for monitor", { 
          monitor: monitorName,
          config: monitorConfig 
        });

        try {
          // Build the monitor command with all settings
          const mode = `${monitorConfig.resolution.width}x${monitorConfig.resolution.height}@${monitorConfig.refreshRate}`;
          const position = `${monitorConfig.position.x}x${monitorConfig.position.y}`;
          const scale = monitorConfig.scale || 1;

          const command = [
            "hyprctl",
            "keyword",
            "monitor",
            `${monitorName},${mode},${position},${scale}`
          ];

          log.debug("Executing monitor configuration command", { 
            command: command.join(" ") 
          });

          await execAsync(command);

          // Small delay between monitor configurations
          await new Promise(resolve => setTimeout(resolve, 100));

        } catch (error) {
          log.error("Failed to apply monitor configuration", { 
            monitor: monitorName,
            error 
          });
        }
      }

      log.info("Finished applying saved monitor configurations");

    } catch (error) {
      log.error("Failed to apply saved monitor configurations", { error });
    }
  }
}

// Export singleton instance
const windowManager = new WindowManagerService();


export default windowManager;