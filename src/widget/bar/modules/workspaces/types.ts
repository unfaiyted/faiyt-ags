import { Gtk, Gdk } from "astal/gtk4";
import { Variable, Binding } from "astal";

import Hypr from "gi://AstalHyprland";
import { DrawingAreaProps } from "../../../utils/containers/drawing-area";
import { BarMode } from "../../types";

export interface BaseWorkspacesProps extends DrawingAreaProps {
  mode: Binding<BarMode>;
  shown: number;
  initilized: Boolean;
  gdkmonitor?: Gdk.Monitor;
}

export interface NormalModeWorkspacesProps extends BaseWorkspacesProps {
  // Normal mode specific props
  workspace: Variable<Hypr.Workspace>;
  workspaceMask: Variable<number>;
  workspaceGroup: Variable<number>;
  updateMask: (self: Gtk.DrawingArea) => void;
  toggleMask: (self: Gtk.DrawingArea, occupied: boolean, name: string) => void;
}

export interface FocusModeWorkspacesProps extends BaseWorkspacesProps {
  // Focus mode specific props
  workspace: Variable<Hypr.Workspace>;
  workspaceMask: Variable<number>;
  workspaceGroup: Variable<number>;
  updateMask: (self: Gtk.DrawingArea) => void;
  toggleMask: (self: Gtk.DrawingArea, occupied: boolean, name: string) => void;
}

export interface NothingWorkspaceContentsProps extends BaseWorkspacesProps {}

export interface NormalWorkspacesContentsProps extends WorkspaceContentsProps {
  workspace: Hypr.Workspace;
  shown: number;
  workspaceGroup: number;
  self: Gtk.DrawingArea;
  updateMask: (self: Gtk.DrawingArea) => void;
  toggleMask: (self: Gtk.DrawingArea, occupied: boolean, name: string) => void;
}

export interface WorkspaceContentsProps extends DrawingAreaProps {
  shown: number;
  mode: BarMode;
  initilized: Boolean;
  workspaceMask: number;
  workspaceGroup: number;
}
