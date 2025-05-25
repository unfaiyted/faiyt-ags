import { Widget, App, Astal, Gtk, Gdk } from "astal/gtk4";
import PopupWindow, { PopupWindowProps } from "../../utils/popup-window";
import SideBar from "../index";
import { ScreenSide } from "../types";
import types from "../../bar/types";
import Tabs from "../../utils/containers/tabs";
import { getSidebarTabs } from "../utils";
import PhosphorIcon from "../../utils/icons/phosphor";
import { PhosphorIcons, PhosphorIconStyle } from "../../utils/icons/types";
import { createLogger } from "../../../utils/logger";

const log = createLogger('LeftSidebar');

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

  log.debug('Enabled tabs', { tabs: sidebarTabs.map(tab => tab.name) });

  return (
    <SideBar {...props} screenSide={ScreenSide.LEFT} application={App}>
      <box cssName="sidebar-left spacing-v-10">
        <box vexpand={true} >
          <Tabs tabs={sidebarTabs} active={0} />
        </box>
      </box>
    </SideBar>
  );
}
