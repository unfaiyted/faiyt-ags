import { Widget, Gtk, Gdk, Astal } from "astal/gtk4";
import { sidebarLogger as log } from "../../../../../utils/logger";

export interface ChatContentProps extends Widget.BoxProps {
  content: Array<Gtk.Widget>;
  setUpdateCompleted: () => void;
}

export const ChatContent = (props: ChatContentProps) => {
  log.debug("ChatContent component created", { contentCount: props.content.length });

  const updateContent = () => {
    props.setUpdateCompleted();
  };

  return (
    <box cssClasses={["spacing-v-5"]} vertical>
      {props.content}
    </box>
  );
}
