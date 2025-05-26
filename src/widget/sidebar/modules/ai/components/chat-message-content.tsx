import { Widget, Gtk } from "astal/gtk4";
import { ChatCodeBlock } from "./chat-code-block";
import config from "../../../../../utils/config";
import { ClaudeMessage } from "../../../../../services/claude";
import GtkSource from "gi://GtkSource?version=5";
import { Binding, Variable, bind } from "astal";
import { sidebarLogger as log } from "../../../../../utils/logger";

export interface MessageContentProps extends Widget.BoxProps {
  content: string | Binding<string>;
}

const Divider = () => (
  <box cssName="sidebar-chat-divider" />
);

const md2pango = (content: string) => {
  // Basic markdown to pango conversion
  let formatted = content;
  
  // Bold
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  
  // Italic
  formatted = formatted.replace(/\*(.*?)\*/g, '<i>$1</i>');
  
  // Code
  formatted = formatted.replace(/`(.*?)`/g, '<tt>$1</tt>');
  
  return formatted;
};

export const ChatMessageContent = (props: MessageContentProps) => {
  const { content, ...boxProps } = props;
  
  const getLabel = () => {
    if (content instanceof Binding) {
      return content.as(text => md2pango(text));
    } else {
      return md2pango(content);
    }
  };
  
  return (
    <box
      {...boxProps}
      cssName="sidebar-chat-message-content"
      vertical
    >
      <label
        halign={Gtk.Align.FILL}
        cssName="txt sidebar-chat-txtblock sidebar-chat-txt"
        useMarkup={true}
        xalign={0}
        wrap={true}
        selectable={true}
        label={getLabel()}
      />
    </box>
  );
};

export default ChatMessageContent;