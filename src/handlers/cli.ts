import { App } from "astal/gtk4";
import { cycleMode } from "../widget/bar/utils";
import { Variable } from "astal";
import { execAsync } from "astal/process";
import { serviceLogger as log } from "../utils/logger";

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
        log.info("Handling volume control", { action: params[0], value: params[1] });
        return handleVolumeControl(params[0], parseInt(params[1]), res);

      // command ex: ags request "layout tiling"
      case "layout":
        log.info("Changing layout", { layout: params[0] });
        return handleLayoutChange(params[0], res);

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

  const windowName = `${position}`;
  const window = App?.get_window(windowName);

  if (!window) {
    log.warn("Window not found", { windowName });
    return res(
      JSON.stringify({
        success: false,
        message: `Window ${windowName} not found`,
      }),
    );
  }

  switch (action) {
    case "toggle":
      window.visible = !window.visible;
      log.info("Toggled window visibility", { windowName, visible: window.visible });
      break;
    case "show":
      window.visible = true;
      log.info("Showing window", { windowName });
      break;
    case "close":
    case "hide":
      window.visible = false;
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
    log.warn(`Executing system action: ${action}`, { command: commands[action] });
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

  log.info("Theme switched", { previousTheme: currentTheme.get(), newTheme: theme });
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
