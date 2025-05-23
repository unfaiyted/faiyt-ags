import { Widget, Gtk, Gdk, Astal } from "astal/gtk4";

export interface ChatContentProps extends Widget.BoxProps {
  content: Array<Gtk.Widget>;
  setUpdateCompleted: () => void;
}

export const ChatContent = (props: ChatContentProps) => {
  print("ChatContent");

  const updateContent = () => {
    props.setUpdateCompleted();
  };

  return (
    <box className="spacing-v-5" vertical>
      {props.content}
    </box>
  );
}
