import { Widget, Gtk } from "astal/gtk4";
import { TabContent } from "../utils/containers/tabs";

import { SidebarModules } from "./modules/types";

export const getSidebarTabs = () => {
  const tabs: TabContent[] = [];
  for (const key in SidebarModules) {
    tabs.push(SidebarModules[key]);
  }
  return tabs;
};

export const getSidebarTabByName = (name: string) => {
  let tab: TabContent | null = null;
  for (const key in SidebarModules) {
    if (SidebarModules[key].name === name) {
      tab = SidebarModules[key];
    }
  }

  if (tab == null) {
    throw new Error(`Tab with name ${name} not found`);
  }
  return tab;
};

export const getSidebarTabByKey = (key: string) => {
  return SidebarModules[key];
};
