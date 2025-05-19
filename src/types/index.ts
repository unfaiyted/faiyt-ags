export enum UIWindows {
  SIDEBAR_LEFT = "sidebar-left",
  SIDEBAR_RIGHT = "sidebar-right",
  TOP_BAR = "bar",
}

export type Time = [hour: number, minute: number];

export interface RgbaColor {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

export enum ClickButtonPressed {
  LEFT = 1,
  MIDDLE = 2,
  RIGHT = 3,
}
