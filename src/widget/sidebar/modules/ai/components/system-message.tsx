import { Widget, Gtk } from "astal/gtk4";
import { ChatMessageContent } from "./chat-message-content";
import { c } from "../../../../../utils/style";

export interface SystemMessageProps extends Widget.BoxProps {
  commandName: string;
  content: string;
}

export const SystemMessage = (props: SystemMessageProps) => {
  return (
    <box cssName="sidebar-chat-message">
      <box vertical>
        <label
          xalign={0}
          halign={Gtk.Align.START}
          wrap
          label={`System  •  ${props.commandName}`}
          cssName="sidebar-chat-name"
          cssClasses={c`chat-name-system`}
        />
        {<ChatMessageContent content={props.content} />}
      </box>
    </box>
  );
};

export default SystemMessage;
