import { App } from "astal/gtk4";
import { PopupWindowProps } from "../../utils/popup-window";
import SideBar from "../index";
import { ScreenSide } from "../types";
import { SidebarModule } from "../modules/types";
import Tabs from "../../utils/containers/tabs";
import { getSidebarTabs } from "../utils";
import { createLogger } from "../../../utils/logger";
import { c } from "../../../utils/style";

const log = createLogger('LeftSidebar');

interface LeftSideBarProps extends PopupWindowProps {
  screenSide?: ScreenSide.LEFT;
  monitorIndex: number;
}

export default function LeftSideBar(sideBarProps: LeftSideBarProps) {
  const { setup, child, ...props } = sideBarProps;

  const enabledTabs = [
    SidebarModule.AIS,
    SidebarModule.TOOLS,
    SidebarModule.REMOTE,
  ];

  const sidebarTabs = getSidebarTabs().filter((tab) => {
    const name = tab.name.toLowerCase() as SidebarModule;
    return enabledTabs.includes(name)
  });

  log.debug('Enabled tabs', { tabs: sidebarTabs.map(tab => tab.name) });

  return (
    <SideBar {...props} monitorIndex={props.monitorIndex} screenSide={ScreenSide.LEFT} application={App}>
      <box cssName="sidebar-left"
        cssClasses={c``}
      >
        <box vexpand={true} >
          <Tabs tabs={sidebarTabs} active={0} />
        </box>
      </box>
    </SideBar>
  );
}
