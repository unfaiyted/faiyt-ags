import { Gtk } from "astal/gtk4";
import config from "../../../../../utils/config";
import Hypr from "gi://AstalHyprland";
import { Variable, bind } from "astal";
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

  const workspaceMask = Variable(0);
  const workspaceGroup = Variable(0);

  const updateMask = (self: Gtk.DrawingArea) => {
    const offset =
      Math.floor((hypr.get_focused_workspace().id - 1) / shown) *
      config.workspaces.shown;
    const workspaces = hypr.get_workspaces();
    let mask = 0;
    for (let i = 0; i < workspaces.length; i++) {
      const ws = workspaces[i];
      if (ws.id <= offset || ws.id > offset + shown) continue; // Out of range, ignore
      if (workspaces[i].get_clients().length > 0) mask |= 1 << (ws.id - offset);
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

  const workspace = Variable(hypr.get_focused_workspace());

  hypr.connect("event", (_source, event, _args) => {
    // print("Hyprland event:", event);
    if (event === "workspace" || event === "workspacev2") {
      workspace.set(hypr.get_focused_workspace());
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

  const displayWorkspace = Variable(getWorkspacebyMode());

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
