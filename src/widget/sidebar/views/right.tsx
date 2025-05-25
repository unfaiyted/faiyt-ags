import { App, Gtk, Gdk, Widget } from "astal/gtk4";
import { getSidebarTabs } from "../utils";
import { ScreenSide } from "../types";
import SideBar from "../";
import Tabs, { TabContent } from "../../utils/containers/tabs";
import { c } from "../../../utils/style";

import QuickToggles from "../modules/toggles";
import { SidebarModule } from "../modules/types";
import HeaderModule from "../modules/header";

interface RighSideBarProps extends Widget.WindowProps {
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

  const sidebarTabs = getSidebarTabs().filter((tab: TabContent) => {
    const name = tab.name.toLowerCase() as SidebarModule;
    return enabledTabs.includes(name)
  }
  );

  print("Sidebar tabs:", sidebarTabs);

  sidebarTabs.map((tab) => print("Tab name:", tab.name));

  return (
    <SideBar {...props} monitorIndex={props.monitorIndex} screenSide={ScreenSide.RIGHT}>
      <box
        cssName="sidebar-right-box"
        cssClasses={c`spacing-v-10`}
        vertical
        vexpand>
        <box vertical cssClasses={["spacing-v-5"]}>
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
