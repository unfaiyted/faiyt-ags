import { Widget, Gdk } from "astal/gtk4";
import { Variable, Binding } from "astal";

import * as WorkspaceTypes from "./modules/workspaces/types";
import * as TrayTypes from "./modules/tray/types";
import * as ClockTypes from "./modules/clock/types";

export enum BarMode {
  Normal = "normal",
  Focus = "focus",
  Nothing = "nothing",
}

export interface RgbaColor {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

export enum BarModule {
  Workspaces = "workspaces",
  Clock = "clock",
  Tray = "tray",
  Music = "music",
  Utilities = "utilities",
  Weather = "weather",
  Battery = "battery",
  Indicators = "indicators",
  System = "system",
}

const mainBoxClasses = {
  [BarMode.Normal]: "bar-group-margin",
  [BarMode.Focus]: "",
  [BarMode.Nothing]: "",
};

const nestedBoxClasses = {
  [BarMode.Normal]: "bar-group bar-group-standalone bar-group-pad",
  [BarMode.Focus]: "",
  [BarMode.Nothing]: "",
};

export interface BaseBarContentProps extends Widget.BoxProps {
  mode: Binding<BarMode>;
  gdkmonitor?: Gdk.Monitor;
}

export interface FocusBarContentProps extends BaseBarContentProps { }
export interface NothingBarContentProps extends BaseBarContentProps { }

export default {
  ...WorkspaceTypes,
  ...ClockTypes,
  ...TrayTypes,
};
