import { App, Astal, Gtk, Gdk } from "astal/gtk4";
import { bind, Variable } from "astal";

import { getSidebarTabs } from "../utils";
import { ScreenSide } from "../types";
import PhosphorIcon from "../../utils/icons/phosphor";
import { PhosphorIcons } from "../../utils/icons/types";
import SideBar from "../";
import Tabs from "../../utils/containers/tabs";
import { TabContent } from "./../../utils/containers/tabs";
import { getSidebarTabByName } from "../utils";

import QuickToggles from "../modules/toggles";
import { PopupWindowProps } from "../../utils/popup-window";
import { SidebarModule } from "../modules/types";
import HeaderModule from "../modules/header";
import { monitorFile } from "astal";

interface RighSideBarProps extends PopupWindowProps {
  screenSide?: ScreenSide.RIGHT;
  monitorIndex: number;
}
// name = sidebar-right

export default function RightSideBar(sideBarProps: RighSideBarProps) {
  const { setup, child, ...props } = sideBarProps;
  
  print(`RightSideBar - Monitor Index: ${props.monitorIndex}, GdkMonitor: ${props.gdkmonitor}`);

  const enabledTabs = [
    SidebarModule.NOTIFICATIONS,
    SidebarModule.AUDIO,
    SidebarModule.BLUETOOTH,
    SidebarModule.WIFI,
  ];

  const sidebarTabs = getSidebarTabs().filter((tab: TabContent) =>
    enabledTabs.includes(tab.name.toLowerCase()),
  );

  print("Sidebar tabs:", sidebarTabs);

  sidebarTabs.map((tab) => print("Tab name:", tab.name));

  return (
    <SideBar {...props} monitorIndex={props.monitorIndex} screenSide={ScreenSide.RIGHT} application={App} cssName="sidebar-right">
      <box cssName="sidebar-right spacing-v-15" vertical vexpand>
        <box vertical cssName="spacing-v-5">
          <HeaderModule />
          <QuickToggles />
        </box>
        <box cssName="sidebar-group">
          <Tabs tabs={sidebarTabs} active={0} />
        </box>
      </box>
    </SideBar>
  );
}
