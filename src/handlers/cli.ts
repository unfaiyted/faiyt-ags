import { App } from "astal/gtk4";
import { cycleMode } from "../widget/bar/utils";
import { Variable } from "astal";
import { execAsync } from "astal/process";

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
  console.log("CLI handler called with:", request);
  try {
    const [command, ...params] = request.split(" ");

    switch (command) {
      // Command ex: ags request "toggle-bar-mode"
      case "toggle-bar-mode":
        cycleMode();
        return res(
          JSON.stringify({ success: true, message: "Bar mode changed" }),
        );

      // Command ex: ags request "window toggle sidebar-left"
      case "window":
        return handleWindowCommand(params, res);

      // Command ex: ags request "system shutdown"
      case "system":
        return handleSystemCommand(params[0] as SystemAction, res);

      // Command ex: ags request "theme dark"
      case "theme":
        return handleThemeSwitch(params[0], res);

      // command ex: ags request "volume set 50"
      case "volume":
        return handleVolumeControl(params[0], parseInt(params[1]), res);

      // command ex: ags request "layout tiling"
      case "layout":
        return handleLayoutChange(params[0], res);

      default:
        return res(
          JSON.stringify({ success: false, message: "Unknown command" }),
        );
    }
  } catch (error) {
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
      break;
    case "show":
      window.visible = true;
      break;
    case "close":
    case "hide":
      window.visible = false;
      break;
    default:
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
    return res(
      JSON.stringify({
        success: false,
        message: "Invalid system action",
      }),
    );
  }

  try {
    await execAsync(commands[action]);
    return res(
      JSON.stringify({
        success: true,
        message: `System ${action} initiated`,
      }),
    );
  } catch (error) {
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
    return res(
      JSON.stringify({
        success: false,
        message: "Invalid theme",
      }),
    );
  }

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
  switch (action) {
    case "set":
      if (value < 0 || value > 100) {
        return res(
          JSON.stringify({
            success: false,
            message: "Volume must be between 0 and 100",
          }),
        );
      }
      volume.set(value);
      break;
    case "increase":
      volume.set(Math.min(100, volume.get() + (value || 5)));
      break;
    case "decrease":
      volume.set(Math.max(0, volume.get() - (value || 5)));
      break;
    default:
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
    return res(
      JSON.stringify({
        success: false,
        message: "Invalid layout",
      }),
    );
  }

  // Layout changing logic here

  return res(
    JSON.stringify({
      success: true,
      message: `Layout changed to ${layout}`,
    }),
  );
}
