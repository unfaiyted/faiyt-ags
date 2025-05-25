import Gdk from "gi://Gdk?version=4.0";
import { Variable } from "astal";
import Hypr from "gi://AstalHyprland";
import { BarMode } from "./types";
import config from "../../utils/config";
import { barLogger as log } from "../../utils/logger";

const hypr = Hypr.get_default();

type ShellMode = {
  modes: BarMode[];
};

export const shellMode = new Variable<ShellMode>({ modes: [] }); // normal, focus

// Global vars for external control (through keybinds)
export const initialMonitorShellModes = () => {
  const monitors = Gdk.Display.get_default()?.get_monitors();
  const numberOfMonitors = monitors?.get_n_items() || 1;

  log.info(`Found ${numberOfMonitors} monitors`);
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
  log.debug(`Updating monitor ${monitor} shell mode`, { mode });
  const newValue = [...shellMode.get().modes];
  newValue[monitor] = mode;
  shellMode.set({ modes: newValue });
  log.debug("Updated shell modes", { modes: newValue });
};

export const cycleMode = () => {
  const monitor = hypr.get_focused_monitor().id || 0;

  log.debug(`Current shell mode for monitor ${monitor}`, { mode: shellMode.get().modes[monitor] });

  if (shellMode.get().modes.length === 0) {
    log.debug("Initial monitor shell modes not set, initializing");
    shellMode.set(initialMonitorShellModes());
  }

  if (shellMode.get().modes[monitor] === BarMode.Normal) {
    log.info("Cycling to focus mode");
    updateMonitorShellMode(monitor, BarMode.Focus);
  } else if (shellMode.get().modes[monitor] === BarMode.Focus) {
    log.info("Cycling to nothing mode");
    updateMonitorShellMode(monitor, BarMode.Nothing);
  } else {
    log.info("Cycling to normal mode");
    updateMonitorShellMode(monitor, BarMode.Normal);
  }
};

export const getFocusedShellMode = () => {
  log.debug("Getting focused shell mode");
  const monitor = hypr.get_focused_monitor().id || 0;

  // check if initial monitor modes are set
  if (shellMode.get().modes.length === 0) {
    log.debug("Initial monitor shell modes not set, initializing");
    shellMode.set(initialMonitorShellModes());
  }
  const monitorShellMode = shellMode.get().modes[monitor];
  log.debug(`Shell mode for monitor ${monitor}`, { mode: monitorShellMode });
  return monitorShellMode;
};

export const getMonitorShellMode = (monitor: number) => {
  log.debug(`Getting shell mode for monitor ${monitor}`);
  // check if initial monitor modes are set
  if (shellMode.get().modes.length === 0) {
    log.debug("Initial monitor shell modes not set, initializing");
    shellMode.set(initialMonitorShellModes());
  }
  return shellMode.get().modes[monitor];
};
