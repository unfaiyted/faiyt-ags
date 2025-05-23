import { Widget, Gtk } from "astal/gtk3";
import { TabContent } from "../utils/containers/tabs";

import { SIDEBAR_MODULES } from "./modules/types";

export const getSidebarTabs = () => {
  const tabs: TabContent[] = [];
  for (const key in SIDEBAR_MODULES) {
    tabs.push(SIDEBAR_MODULES[key]);
  }
  return tabs;
};

export const getSidebarTabByName = (name: string) => {
  let tab: TabContent | null = null;
  for (const key in SIDEBAR_MODULES) {
    if (SIDEBAR_MODULES[key].name === name) {
      tab = SIDEBAR_MODULES[key];
    }
  }

  if (tab == null) {
    throw new Error(`Tab with name ${name} not found`);
  }
  return tab;
};

export const getSidebarTabByKey = (key: string) => {
  return SIDEBAR_MODULES[key];
};
