import { Widget, App, Astal, Gtk, Gdk } from "astal/gtk4";
import PopupWindow, { PopupWindowProps } from "../../utils/popup-window";
import SideBar from "../index";
import { SideBarProps, ScreenSide } from "../types";
import types from "../../bar/types";
import Tabs from "../../utils/containers/tabs";
import { getSidebarTabs } from "../modules";
import PhosphorIcon from "../../utils/icons/phosphor";
import { PhosphorIcons, PhosphorWeight } from "../../utils/icons/types";

interface LeftSideBarProps extends PopupWindowProps {
  screenSide?: ScreenSide.LEFT;
}
// name = sidebar-left

export default function LeftSideBar(sideBarProps: LeftSideBarProps) {
  const { setup, child, ...props } = sideBarProps;

  const enabledTabs = ["ais", "tools"];

  const sidebarTabs = getSidebarTabs().filter((tab) =>
    enabledTabs.includes(tab.name.toLowerCase()),
  );

  // print("Sidebar tabs:", sidebarTabs);

  sidebarTabs.map((tab) => print("Tab name:", tab.name));

  return (
    <SideBar {...props} screenSide={ScreenSide.LEFT} application={App}>
      <box className="sidebar-left spacing-v-10">
        <box vexpand={true} css="min-width: 2px;">
          <Tabs tabs={sidebarTabs} active={0} />
        </box>
      </box>
    </SideBar>
  );
}
