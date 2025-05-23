import { Widget, Gtk, Astal } from "astal/gtk3";
import TabContainer, {
  TabContent,
} from "../../../utils/containers/tabs";
import ClaudeAI from "./claude";

export enum AIName {
  CLAUDE = "claude",
  GEMINI = "gemini",
  GPT = "gpt",
  OLLAMA = "ollama",
  WAIFU = "waifu",
}

export interface AIItem {
  label: string;
  name: AIName;
  sendCommand: (message: string) => void;
  contentWidget: Widget.BoxProps;
  commandBar: Widget.BoxProps;
  tabIcon: Widget.IconProps;
  placeholderText: string;
}

export const EXPAND_INPUT_THRESHOLD = 30;

export const AI_TABS: Record<AIName, TabContent> = {
  [AIName.CLAUDE]: {
    name: AIName.CLAUDE,
    content: ClaudeAI,
    icon: PhosphorIcons.brain,
  },
  [AIName.GEMINI]: {
    name: AIName.GEMINI,
    content: ClaudeAI,
    icon: "diamond",
  },
  [AIName.GPT]: {
    name: AIName.GPT,
    content: ClaudeAI,
    icon: PhosphorIcons.chat,
  },
  [AIName.WAIFU]: {
    name: AIName.WAIFU,
    content: ClaudeAI,
    icon: PhosphorIcons.onigiri,
  },
  [AIName.OLLAMA]: {
    name: AIName.OLLAMA,
    content: ClaudeAI,
    icon: PhosphorIcons.alien,
  },
};

export const ChatSendButton = (props: Widget.ButtonProps) => {
  return (
    <button
      valign={Gtk.Align.END}
      tooltipText={props.name}
      onClick={props.onClick}
      label="arrow_upward"
      className={`sidebar-chat-send txt-norm icon-material ${props.className}`}
    />
  );
};

export interface AIModulesProps extends Widget.BoxProps { }

export default function AIModules(props: AIModulesProps) {
  const aiTabsArray: TabContent[] = Object.values(AI_TABS);

  return (
    <box>
      <TabContainer
        {...props}
        cssName="margin-top-5"
        orientation={Gtk.Orientation.VERTICAL}
        tabs={aiTabsArray}
        hideLabels
        active={0}
      />
    </box>
  );
}
