import { Gdk } from "astal/gtk4";
import { Variable } from "astal";
import Hypr from "gi://AstalHyprland";
import { BarMode } from "./types";
import config from "../../utils/config";

const hypr = Hypr.get_default();

type ShellMode = {
  modes: BarMode[];
};

export const shellMode = Variable<ShellMode>({ modes: [] }); // normal, focus

// Global vars for external control (through keybinds)
export const initialMonitorShellModes = () => {
  const monitors = Gdk.Display.get_default()?.get_monitors();
  const numberOfMonitors = monitors?.get_n_items() || 1;

  print("Number of monitors:", numberOfMonitors);
  const monitorBarConfigs = [];
  for (let i = 0; i < numberOfMonitors; i++) {
    if (config.bar.modes[i]) {
      monitorBarConfigs.push(config.bar.modes[i]);
    } else {
      monitorBarConfigs.push(BarMode.Normal);
    }
  }
  return { modes: monitorBarConfigs };
};

// Mode switching
const updateMonitorShellMode = (monitor: number, mode: BarMode) => {
  print(`Updating monitor ${monitor} shell mode to:`, mode);
  const newValue = [...shellMode.get().modes];
  newValue[monitor] = mode;
  shellMode.set({ modes: newValue });
  print("Monitor shell mode:", newValue);
};

export const cycleMode = () => {
  const monitor = hypr.get_focused_monitor().id || 0;

  // print(`Monitor ${monitor} shell mode:`, shellMode.get().modes[monitor]);

  if (shellMode.get().modes.length === 0) {
    // print("Initial monitor shell modes not set.");
    shellMode.set(initialMonitorShellModes());
  }

  if (shellMode.get().modes[monitor] === BarMode.Normal) {
    // print("Cycling to focus mode.");
    updateMonitorShellMode(monitor, BarMode.Focus);
  } else if (shellMode.get().modes[monitor] === BarMode.Focus) {
    // print("Cycling to nothing mode.");
    updateMonitorShellMode(monitor, BarMode.Nothing);
  } else {
    // print("Cycling to normal mode, end.");
    updateMonitorShellMode(monitor, BarMode.Normal);
  }
};

export const getFocusedShellMode = () => {
  // print("Getting focused shell mode.");
  const monitor = hypr.get_focused_monitor().id || 0;

  // check if initial monitor modes are set
  if (shellMode.get().modes.length === 0) {
    // print("Initial monitor shell modes not set.");
    shellMode.set(initialMonitorShellModes());
  }
  const monitorShellMode = shellMode.get().modes[monitor];
  // print(`Shell mode for monitor ${monitor} is:`, monitorShellMode);
  return monitorShellMode;
};

export const getMonitorShellMode = (monitor: number) => {
  // print("Getting monitor shell mode.", monitor);
  // check if initial monitor modes are set
  if (shellMode.get().modes.length === 0) {
    // print("Initial monitor shell modes not set.");
    shellMode.set(initialMonitorShellModes());
  }
  return shellMode.get().modes[monitor];
};
