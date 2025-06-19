import { Gtk } from "astal/gtk4";
import { Variable, bind } from "astal";

import config from "../../../../../utils/config";
import Hypr from "gi://AstalHyprland";
import { BarMode } from "../../../types";
import NormalContent from "./normal";
import FocusContent from "./focus";
import NothingContent from "./nothing";
import { BaseWorkspacesProps } from "../types";

export default function WorkspacesModeContent(
  baseWorkspacesProps: BaseWorkspacesProps,
) {
  const { setup, shown, initilized: init, ...props } = baseWorkspacesProps;

  const hypr = Hypr.get_default();

  const workspaceMask = new Variable(0);
  const workspaceGroup = new Variable(0);

  const updateMask = (self: Gtk.DrawingArea) => {
    const currentWorkspace = getMonitorWorkspace();
    const offset =
      Math.floor((currentWorkspace.id - 1) / shown) *
      config.workspaces.shown;
    const workspaces = hypr.get_workspaces();
    let mask = 0;
    for (let i = 0; i < workspaces.length; i++) {
      const ws = workspaces[i];
      if (ws.id <= offset || ws.id > offset + shown) continue; // Out of range, ignore
      if (workspaces[i].get_clients().length > 0) mask |= 1 << (ws.id - offset - 1);
    }
    // console.log('Mask:', workspaceMask.toString(2));
    workspaceMask.set(mask);
    self.queue_draw();
  };

  const toggleMask = (
    self: Gtk.DrawingArea,
    occupied: boolean,
    name: string,
  ) => {
    const currentMask = workspaceMask.get();
    const newMask = occupied
      ? currentMask | (1 << parseInt(name))
      : currentMask & ~(1 << parseInt(name));
    workspaceMask.set(newMask);
    self.queue_draw();
  };

  // Function to get workspace for this specific monitor
  const getMonitorWorkspace = () => {
    if (!baseWorkspacesProps.gdkmonitor) {
      // Fallback to globally focused workspace if no monitor specified
      return hypr.get_focused_workspace();
    }

    // Get the monitor name from GDK monitor
    const monitorName = baseWorkspacesProps.gdkmonitor.get_connector();

    // Find the Hyprland monitor that matches this GDK monitor
    const hyprMonitors = hypr.get_monitors();
    const hyprMonitor = hyprMonitors.find(m => m.name === monitorName);

    if (hyprMonitor) {
      // Get the active workspace for this specific monitor
      return hyprMonitor.get_active_workspace();
    }

    // Fallback to globally focused workspace
    return hypr.get_focused_workspace();
  };

  const workspace = new Variable(getMonitorWorkspace());

  hypr.connect("event", (_source, event, _args) => {
    // print("Hyprland event:", event);
    if (event === "workspace" || event === "workspacev2" || event === "focusedmon") {
      workspace.set(getMonitorWorkspace());
    }
  });

  const getWorkspacebyMode = () => {
    switch (props.mode.get()) {
      case BarMode.Normal:
        return (
          <NormalContent
            {...props}
            shown={shown}
            initilized={init}
            toggleMask={toggleMask}
            workspace={workspace}
            updateMask={updateMask}
            workspaceGroup={workspaceGroup}
            workspaceMask={workspaceMask}
          />
        );
      case BarMode.Focus:
        return (
          <FocusContent
            {...props}
            shown={shown}
            initilized={init}
            toggleMask={toggleMask}
            workspace={workspace}
            updateMask={updateMask}
            workspaceGroup={workspaceGroup}
            workspaceMask={workspaceMask}
          />
        );
      case BarMode.Nothing:
      default:
        return <NothingContent {...props} shown={shown} initilized={init} />;
    }
  };

  const displayWorkspace = new Variable(getWorkspacebyMode());

  props.mode.subscribe((_mode) => {
    displayWorkspace.set(getWorkspacebyMode());
  });

  return (
    <box homogeneous={true}>
      <box
        widthRequest={2}
      >
        {bind(displayWorkspace).as((v) => v)}
      </box>
    </box>
  );
}
