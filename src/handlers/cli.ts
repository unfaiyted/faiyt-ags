import { App } from "astal/gtk4";
import { cycleMode } from "../widget/bar/utils";
import { Variable } from "astal";
import { execAsync } from "astal/process";
import { serviceLogger as log } from "../utils/logger";
import Hypr from "gi://AstalHyprland";
import desktopScanner from "../services/desktop-scanner";
import {
  showMusicOverlay,
  hideMusicOverlay,
} from "../widget/overlays/music-window";
import { SEARCH_PREFIXES } from "../widget/launcher/utils";
import { SearchType } from "../widget/launcher/types";
import launcherState from "../services/launcher-state";

type WindowPosition = "left" | "right" | "top" | "bottom";
type SystemAction = "sleep" | "shutdown" | "restart" | "logout";

interface CliResponse {
  success: boolean;
  message: string;
  data?: any;
}

// TODO: move to config
const currentTheme = new Variable<string>("dark");
const volume = new Variable<number>(50);

export default async function cliRequestHandler(
  request: string,
  // args: string[] = [],
  res: (response: string) => void,
) {
  log.info("CLI request received", { request });
  try {
    const [command, ...params] = request.split(" ");
    log.debug("Parsed command", { command, params });

    switch (command) {
      // Command ex: ags request "toggle-bar-mode"
      case "toggle-bar-mode":
        log.info("Toggling bar mode");
        cycleMode();
        return res(
          JSON.stringify({ success: true, message: "Bar mode changed" }),
        );

      // Command ex: ags request "window toggle sidebar-left"
      case "window":
        log.debug("Handling window command", { params });
        return handleWindowCommand(params, res);

      case "launcher":
        log.debug("Handling launcher command", { params });
        return handleLauncherCommand(params, res);

      // Command ex: ags request "system shutdown"
      case "system":
        log.info("Handling system command", { action: params[0] });
        return handleSystemCommand(params[0] as SystemAction, res);

      // Command ex: ags request "theme dark"
      case "theme":
        log.info("Switching theme", { theme: params[0] });
        return handleThemeSwitch(params[0], res);

      // command ex: ags request "volume set 50"
      case "volume":
        log.info("Handling volume control", {
          action: params[0],
          value: params[1],
        });
        return handleVolumeControl(params[0], parseInt(params[1]), res);

      // command ex: ags request "layout tiling"
      case "layout":
        log.info("Changing layout", { layout: params[0] });
        return handleLayoutChange(params[0], res);

      // command ex: ags request "desktop scan"
      // command ex: ags request "desktop create-appimage-entries"
      case "desktop":
        log.info("Handling desktop command", { action: params[0] });
        return handleDesktopCommand(params[0], res);

      // command ex: ags request "music show"
      // command ex: ags request "music hide"
      case "music":
        log.info("Handling music overlay command", { action: params[0] });
        return handleMusicCommand(params[0], res);

      default:
        log.warn("Unknown command received", { command });
        return res(
          JSON.stringify({ success: false, message: "Unknown command" }),
        );
    }
  } catch (error) {
    log.error("Error executing CLI command", { error, request });
    return res(
      JSON.stringify({
        success: false,
        message: `Error executing command: ${(error as Error).message}`,
      }),
    );
  }
}

function handleWindowCommand(
  [action, position]: string[],
  res: (response: string) => void,
) {
  if (action == "list") {
    const windows = App?.get_windows().map((window) => {
      return {
        name: window.name,
      };
    });
    log.debug("Listing windows", { count: windows.length });
    return res(
      JSON.stringify({
        success: true,
        message: `Window list`,
        data: windows,
      }),
    );
  }

  let windowName = `${position}`;

  // For toggle/show/hide actions, if window name doesn't include monitor suffix, add it based on focused monitor
  if (
    (action === "toggle" ||
      action === "show" ||
      action === "hide" ||
      action === "close") &&
    position &&
    !position.match(/-\d+$/)
  ) {
    try {
      const hypr = Hypr.get_default();
      const focusedMonitor = hypr.get_focused_monitor();
      const monitorId = focusedMonitor?.id ?? 0;
      windowName = `${position}-${monitorId}`;
      log.debug("Added monitor suffix to window name", {
        originalName: position,
        windowName,
        monitorId,
        action,
      });
    } catch (error) {
      log.error("Failed to get focused monitor", { error });
      // Fall back to monitor 0 if we can't get the focused monitor
      windowName = `${position}-0`;
    }
  }

  let window = App?.get_window(windowName);

  if (!window) {
    log.warn("Window not found", { windowName });
    // try without the monitor number
    window = App?.get_window(`${position}`);
    if (!window) {
      log.warn("Window not found, trying without monitor number", {
        windowName,
      });
      return res(
        JSON.stringify({
          success: true,
          message: `Window ${windowName} not found`,
          data: {
            windowName,
          },
        }),
      );
    }
  }

  // Add a small delay to prevent Wayland protocol errors from rapid toggling
  const setVisibility = (visible: boolean) => {
    setTimeout(() => {
      window.visible = visible;
    }, 10);
  };

  switch (action) {
    case "toggle":
      setVisibility(!window.visible);
      log.info("Toggled window visibility", {
        windowName,
        visible: !window.visible,
      });
      break;
    case "show":
      setVisibility(true);
      log.info("Showing window", { windowName });
      break;
    case "close":
    case "hide":
      setVisibility(false);
      log.info("Hiding window", { windowName });
      break;
    default:
      log.warn("Invalid window action", { action });
      return res(
        JSON.stringify({
          success: false,
          message: "Invalid window action",
        }),
      );
  }

  return res(
    JSON.stringify({
      success: true,
      message: `Window ${windowName} ${action}d`,
    }),
  );
}

function handleLauncherCommand(
  params: string[],
  res: (response: string) => void,
) {
  const [activity, ...searchWords] = params;
  const searchQuery = searchWords.join(" ");
  
  log.debug("Handling launcher command", { activity, searchQuery, params });
  
  let initialText = "";
  
  if (activity) {
    // Map activity keywords to SearchType
    const activityToSearchType: Record<string, SearchType> = {
      "screencapture": SearchType.SCREENCAPTURE,
      "screenshot": SearchType.SCREENCAPTURE,
      "screen": SearchType.SCREENCAPTURE,
      "record": SearchType.SCREENCAPTURE,
      "recording": SearchType.SCREENCAPTURE,
      "app": SearchType.APPS,
      "apps": SearchType.APPS,
      "command": SearchType.COMMANDS,
      "cmd": SearchType.COMMANDS,
      "system": SearchType.SYSTEM,
      "sys": SearchType.SYSTEM,
      "clipboard": SearchType.CLIPBOARD,
      "clip": SearchType.CLIPBOARD,
      "search": SearchType.EXTERNAL_SEARCH,
      "directory": SearchType.DIRECTORY,
      "dir": SearchType.DIRECTORY,
      "hyprland": SearchType.HYPRLAND,
      "window": SearchType.HYPRLAND,
      "win": SearchType.HYPRLAND,
    };
    
    const searchType = activityToSearchType[activity.toLowerCase()];
    
    if (searchType) {
      // Find the first prefix for this search type
      const prefix = Object.entries(SEARCH_PREFIXES).find(([_, type]) => type === searchType)?.[0];
      
      if (prefix) {
        initialText = prefix;
        // Add search query if provided
        if (searchQuery) {
          initialText += " " + searchQuery;
        }
      }
    } else {
      // If activity is not recognized as a type, treat entire params as search
      initialText = params.join(" ");
    }
  }
  
  // If we have initial text to set, set it before toggling the launcher
  if (initialText) {
    launcherState.setInitialText(initialText);
  }
  
  // Toggle the launcher window
  handleWindowCommand(["toggle", "launcher"], res);
}

async function handleSystemCommand(
  action: SystemAction,
  res: (response: string) => void,
) {
  const commands = {
    sleep: "systemctl suspend",
    shutdown: "shutdown now",
    restart: "reboot",
    logout: "loginctl terminate-session $XDG_SESSION_ID",
  };

  if (!commands[action]) {
    log.warn("Invalid system action", { action });
    return res(
      JSON.stringify({
        success: false,
        message: "Invalid system action",
      }),
    );
  }

  try {
    log.warn(`Executing system action: ${action}`, {
      command: commands[action],
    });
    await execAsync(commands[action]);
    log.info(`System ${action} initiated successfully`);
    return res(
      JSON.stringify({
        success: true,
        message: `System ${action} initiated`,
      }),
    );
  } catch (error) {
    log.error(`Failed to execute system action`, { action, error });
    return res(
      JSON.stringify({
        success: false,
        message: `Failed to ${action}: ${(error as Error).message}`,
      }),
    );
  }
}

function handleThemeSwitch(theme: string, res: (response: string) => void) {
  const validThemes = ["dark", "light", "custom"];

  if (!validThemes.includes(theme)) {
    log.warn("Invalid theme requested", { theme, validThemes });
    return res(
      JSON.stringify({
        success: false,
        message: "Invalid theme",
      }),
    );
  }

  log.info("Theme switched", {
    previousTheme: currentTheme.get(),
    newTheme: theme,
  });
  currentTheme.set(theme);
  // Additional theme switching logic here

  return res(
    JSON.stringify({
      success: true,
      message: `Theme switched to ${theme}`,
      data: { currentTheme: theme },
    }),
  );
}

function handleVolumeControl(
  action: string,
  value: number,
  res: (response: string) => void,
) {
  const previousVolume = volume.get();

  switch (action) {
    case "set":
      if (value < 0 || value > 100) {
        log.warn("Invalid volume value", { value });
        return res(
          JSON.stringify({
            success: false,
            message: "Volume must be between 0 and 100",
          }),
        );
      }
      volume.set(value);
      log.info("Volume set", { previousVolume, newVolume: value });
      break;
    case "increase":
      volume.set(Math.min(100, volume.get() + (value || 5)));
      log.info("Volume increased", { previousVolume, newVolume: volume.get() });
      break;
    case "decrease":
      volume.set(Math.max(0, volume.get() - (value || 5)));
      log.info("Volume decreased", { previousVolume, newVolume: volume.get() });
      break;
    default:
      log.warn("Invalid volume action", { action });
      return res(JSON.stringify({ success: false, message: "Invalid volume" }));
  }

  return res(
    JSON.stringify({
      success: true,
      message: `Volume ${action}d to ${volume.get()}%`,
      data: { volume: volume.get() },
    }),
  );
}

function handleLayoutChange(layout: string, res: (response: string) => void) {
  const validLayouts = ["tiling", "floating", "stacking"];

  if (!validLayouts.includes(layout)) {
    log.warn("Invalid layout requested", { layout, validLayouts });
    return res(
      JSON.stringify({
        success: false,
        message: "Invalid layout",
      }),
    );
  }

  log.info("Layout changed", { layout });
  // Layout changing logic here

  return res(
    JSON.stringify({
      success: true,
      message: `Layout changed to ${layout}`,
    }),
  );
}

function handleDesktopCommand(action: string, res: (response: string) => void) {
  switch (action) {
    case "scan":
      log.info("Scanning for desktop files and AppImages");
      desktopScanner.scan();
      const apps = desktopScanner.applications;
      const appImages = apps.filter((app) => app.isAppImage);
      return res(
        JSON.stringify({
          success: true,
          message: `Found ${apps.length} applications (${appImages.length} AppImages)`,
          data: {
            totalApps: apps.length,
            appImages: appImages.length,
            desktopFiles: apps.length - appImages.length,
          },
        }),
      );

    case "create-appimage-entries":
      log.info("Creating desktop entries for AppImages");
      desktopScanner.createDesktopFilesForAllAppImages();
      return res(
        JSON.stringify({
          success: true,
          message: "Desktop entries created for AppImages",
        }),
      );

    default:
      log.warn("Invalid desktop action", { action });
      return res(
        JSON.stringify({
          success: false,
          message:
            "Invalid desktop action. Use 'scan' or 'create-appimage-entries'",
        }),
      );
  }
}

function handleMusicCommand(action: string, res: (response: string) => void) {
  switch (action) {
    case "show":
      log.info("Showing music overlay");
      try {
        // Get focused monitor
        const hypr = Hypr.get_default();
        const focusedMonitor = hypr.get_focused_monitor();
        const monitorId = focusedMonitor?.id ?? 0;

        showMusicOverlay(monitorId);
        return res(
          JSON.stringify({
            success: true,
            message: "Music overlay shown",
          }),
        );
      } catch (error) {
        log.error("Failed to show music overlay", { error });
        return res(
          JSON.stringify({
            success: false,
            message: "Failed to show music overlay",
          }),
        );
      }

    case "hide":
      log.info("Hiding music overlay");
      try {
        // Get focused monitor
        const hypr = Hypr.get_default();
        const focusedMonitor = hypr.get_focused_monitor();
        const monitorId = focusedMonitor?.id ?? 0;

        hideMusicOverlay(monitorId);
        return res(
          JSON.stringify({
            success: true,
            message: "Music overlay hidden",
          }),
        );
      } catch (error) {
        log.error("Failed to hide music overlay", { error });
        return res(
          JSON.stringify({
            success: false,
            message: "Failed to hide music overlay",
          }),
        );
      }

    case "toggle":
      log.info("Toggling music overlay");
      try {
        // For toggle, we need to check current state
        // Since we don't have a direct way to check, we'll just show it
        const hypr = Hypr.get_default();
        const focusedMonitor = hypr.get_focused_monitor();
        const monitorId = focusedMonitor?.id ?? 0;

        showMusicOverlay(monitorId);
        return res(
          JSON.stringify({
            success: true,
            message: "Music overlay toggled",
          }),
        );
      } catch (error) {
        log.error("Failed to toggle music overlay", { error });
        return res(
          JSON.stringify({
            success: false,
            message: "Failed to toggle music overlay",
          }),
        );
      }

    default:
      log.warn("Invalid music action", { action });
      return res(
        JSON.stringify({
          success: false,
          message: "Invalid music action. Use 'show', 'hide', or 'toggle'",
        }),
      );
  }
}

