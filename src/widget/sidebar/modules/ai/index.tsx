import { Widget, Gtk, Astal } from "astal/gtk4";
import TabContainer, {
  TabContent,
} from "../../../utils/containers/tabs";
import ClaudeAI from "./claude";
import { PhosphorIcons } from "../../../utils/icons/types";

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
  tabIcon: Widget.ImageProps;
  placeholderText: string;
}

export const EXPAND_INPUT_THRESHOLD = 30;

export const AI_TABS: Record<AIName, TabContent> = {
  [AIName.CLAUDE]: {
    name: AIName.CLAUDE,
    content: <ClaudeAI />,
    icon: PhosphorIcons.Brain,
  },
  [AIName.GEMINI]: {
    name: AIName.GEMINI,
    content: <ClaudeAI />,
    icon: PhosphorIcons.Diamond,
  },
  [AIName.GPT]: {
    name: AIName.GPT,
    content: <ClaudeAI />,
    icon: PhosphorIcons.Chat,
  },
  [AIName.WAIFU]: {
    name: AIName.WAIFU,
    content: <ClaudeAI />,
    icon: PhosphorIcons.Onigiri,
  },
  [AIName.OLLAMA]: {
    name: AIName.OLLAMA,
    content: <ClaudeAI />,
    icon: PhosphorIcons.Alien,
  },
};

export const ChatSendButton = (props: Widget.ButtonProps) => {
  return (
    <button
      valign={Gtk.Align.END}
      tooltipText={props.name}
      onClicked={props.onClick}
      label="arrow_upward"
      cssName={`sidebar-chat-send txt-norm icon-material ${props.cssName}`}
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
