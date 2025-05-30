import { App, Widget } from "astal/gtk4";
import { getSidebarTabs } from "../utils";
import { ScreenSide } from "../types";
import SideBar from "../";
import Tabs, { TabContent } from "../../utils/containers/tabs";
import { c } from "../../../utils/style";
import { createLogger } from "../../../utils/logger";
import QuickToggles from "../modules/toggles";
import { SidebarModule } from "../modules/types";
import HeaderModule from "../modules/header";

const log = createLogger('RightSidebar');

interface RighSideBarProps extends Widget.WindowProps {
  screenSide?: ScreenSide.RIGHT;
  monitorIndex: number;
}

export default function RightSideBar(sideBarProps: RighSideBarProps) {
  const { setup, child, ...props } = sideBarProps;

  log.debug('Creating right sidebar', { monitorIndex: props.monitorIndex, gdkmonitor: props.gdkmonitor });

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

  log.debug('Enabled tabs', { tabs: sidebarTabs.map(tab => tab.name) });

  return (
    <SideBar {...props} monitorIndex={props.monitorIndex} screenSide={ScreenSide.RIGHT} application={App}>
      <box
        cssName="sidebar-right-box"
        cssClasses={c`spacing-v-10`}
        vertical
        vexpand>
        <box vertical cssClasses={["spacing-v-5"]}>
          <HeaderModule gdkmonitor={props.gdkmonitor} monitorIndex={props.monitorIndex} />
          <QuickToggles />
        </box>
        <box cssName="sidebar-group">
          <Tabs tabs={sidebarTabs} active={0} />
        </box>
      </box>
    </SideBar>
  );
}
