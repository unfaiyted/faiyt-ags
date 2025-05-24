import { Widget, Gtk, Gdk, Astal } from "astal/gtk4";
import { AIName } from "../index";
import { Variable, bind } from "astal";

export interface ChatEntryProps extends Widget.EntryProps {
  aiName: AIName;
  handleSubmit?: () => void;
  autoFocus: boolean;
  // onReturn?: (self: Widget.Entry, event: Gdk.Event) => void;
}

export const ChatInput = (props: ChatEntryProps) => {
  const hasFocused = Variable(false);

  const handleKeyPress = () => {
    // // print(self);
    // const key = event.get_keyval()[1];
    //
    // if (key === Gdk.KEY_Return || key === Gdk.KEY_KP_Enter) {
    //   if (event.get_state()[1] !== Gdk.KEY_Shift_L) {
    //     print("ChatInput: Sending message:", self.get_text());
    //     props.handleSubmit?.();
    //     self.set_text("");
    //   }
    // }
  };

  const handleDraw = (self: Gtk.Entry) => {
    if (!hasFocused.get() && props.autoFocus) {
      self.grab_focus();
      hasFocused.set(true);
    }
  };

  return (
    <entry>
      {/* <scrollable */}
      {/*   className="sidebar-chat-wrapper" */}
      {/*   hscroll={Gtk.PolicyType.NEVER} */}
      {/*   vscroll={Gtk.PolicyType.ALWAYS} */}
      {/* > */}
      {/*   <entry */}
      {/*     onKeyPressEvent={handleKeyPress} */}
      {/*     onDraw={handleDraw} */}
      {/*     wrap-mode={Gtk.WrapMode.WORD_CHAR} */}
      {/*     cssName="sidebar-chat-entry txt txt-smallie" */}
      {/*     {...props} */}
      {/*   /> */}
      {/* </scrollable> */}
    </entry>
  );
};

export default ChatInput;
