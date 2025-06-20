import { Widget, Gtk } from "astal/gtk4";
import AITab from "./ai";
import Audio from "./audio";
import Bluetooth from "./bluetooth";
import Calendar from "./calendar";
import Wifi from "./wifi";
import Configuration from "./configuration";
import Notifications from "./notifications";
import Tools from "./tools";
import Remote from "./remote";
import { PhosphorIcons } from "../../utils/icons/types";
import { TabContent } from "../../utils/containers/tabs";

export enum SidebarModule {
  AIS = "ais",
  TOOLS = "tools",
  REMOTE = "remote",
  AUDIO = "audio",
  BLUETOOTH = "bluetooth",
  WIFI = "wifi",
  CONFIG = "config",
  NOTIFICATIONS = "notifications",
}

export const SidebarModules: Record<string, TabContent> = {
  [SidebarModule.AIS]: {
    name: SidebarModule.AIS,
    content: AITab,
    icon: PhosphorIcons.OpenAiLogo,
  },
  [SidebarModule.NOTIFICATIONS]: {
    name: SidebarModule.NOTIFICATIONS,
    content: Notifications,
    icon: PhosphorIcons.Bell,
  },
  [SidebarModule.AUDIO]: {
    name: SidebarModule.AUDIO,
    content: Audio,
    icon: PhosphorIcons.SpeakerNone,
  },
  [SidebarModule.TOOLS]: {
    name: SidebarModule.TOOLS,
    content: Tools,
    icon: PhosphorIcons.Toolbox,
  },
  [SidebarModule.REMOTE]: {
    name: SidebarModule.REMOTE,
    content: Remote,
    icon: PhosphorIcons.GameController,
  },
  [SidebarModule.BLUETOOTH]: {
    name: SidebarModule.BLUETOOTH,
    content: Bluetooth,
    icon: PhosphorIcons.Bluetooth,
  },
  [SidebarModule.WIFI]: {
    name: SidebarModule.WIFI,
    content: Wifi,
    icon: PhosphorIcons.WifiMedium,
  },
  [SidebarModule.CONFIG]: {
    name: SidebarModule.CONFIG,
    content: Configuration,
    icon: PhosphorIcons.Gear,
  },
};
