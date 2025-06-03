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

class WindowManagerService {
  private windows: Map<string, WindowInfo> = new Map();
  private activeWindowAddress: string | null = null;
  private screenshotInterval: number = 30000; // 30 seconds
  private screenshotTimer: number | null = null;
  private cleanupTimer: number | null = null;
  private ipcProcess: any = null;
  private tmpDir: string;
  private isRunning: boolean = false;

  constructor() {
    // Create tmp directory for screenshots
    this.tmpDir = GLib.build_filenamev([GLib.get_tmp_dir(), "ags-window-screenshots"]);
    this.ensureDirectory(this.tmpDir);
    
    log.info("WindowManager service initialized", { tmpDir: this.tmpDir });
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
}

// Export singleton instance
const windowManager = new WindowManagerService();


export default windowManager;