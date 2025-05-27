import { Widget, Gtk } from "astal/gtk4";
import TabContainer, {
  TabContent,
} from "../../../utils/containers/tabs";
import ClaudeAI from "./claude";
import AISettings from "./settings";
import { PhosphorIcons } from "../../../utils/icons/types";
import PhosphorIcon from "../../../utils/icons/phosphor";

export enum AIName {
  CLAUDE = "claude",
  GEMINI = "gemini",
  GPT = "gpt",
  OLLAMA = "ollama",
  SETTINGS = "settings",
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
    content: ClaudeAI,
    icon: PhosphorIcons.Brain,
  },
  [AIName.GEMINI]: {
    name: AIName.GEMINI,
    content: ClaudeAI,
    icon: PhosphorIcons.Diamond,
  },
  [AIName.GPT]: {
    name: AIName.GPT,
    content: ClaudeAI,
    icon: PhosphorIcons.Chat,
  },
  [AIName.OLLAMA]: {
    name: AIName.OLLAMA,
    content: ClaudeAI,
    icon: PhosphorIcons.Alien,
  },
  [AIName.SETTINGS]: {
    name: AIName.SETTINGS,
    content: (props) => AISettings(props),
    icon: PhosphorIcons.Gear,
  },
};

export const ChatSendButton = (props: Widget.ButtonProps) => {
  return (
    <button
      valign={Gtk.Align.CENTER}
      tooltipText={props.name || "Send message"}
      marginStart={10}
      marginEnd={10}
      onClicked={props.onClicked}
      cssName={`sidebar-chat-send`}
    >
      <PhosphorIcon iconName={PhosphorIcons.PaperPlaneTilt} size={32} />
    </button>
  );
};

export interface AIModulesProps extends Widget.BoxProps { }

export default function AIModules(props: AIModulesProps) {
  const aiTabsArray: TabContent[] = Object.values(AI_TABS);

  return (
    <box
      cssName="ai-module"
    >
      <TabContainer
        {...props}
        cssClasses={["margin-top-5"]}
        orientation={Gtk.Orientation.HORIZONTAL}
        tabs={aiTabsArray}
        // hideLabels
        active={0}
      />
    </box>
  );
}
