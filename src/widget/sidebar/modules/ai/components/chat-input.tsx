import { Widget, Gtk, Gdk } from "astal/gtk4";
import { AIName } from "../index";
import { Variable, bind } from "astal";

export interface ChatEntryProps extends Widget.BoxProps {
  aiName: AIName;
  handleSubmit?: () => void;
  handleChanged?: (text: string) => void;
  autoFocus: boolean;
  entryRef?: Variable<Gtk.Entry | null>;
  value?: Variable<string>;
}

export const ChatInput = (props: ChatEntryProps) => {
  const { aiName, handleSubmit, autoFocus, handleChanged, entryRef, value, ...boxProps } = props;
  const hasFocused = Variable(false);
  const text = value || Variable("");
  const isTyping = Variable(false);

  const handleKeyPress = (self: Gtk.Entry, keyval: number) => {
    // Check for Enter key without Shift
    if (keyval === Gdk.KEY_Return || keyval === Gdk.KEY_KP_Enter) {
      const currentText = self.get_text();
      if (currentText.trim().length > 0) {
        // Call handleSubmit first, then clear
        handleSubmit?.();
        // The parent component should handle clearing the input
      }
      return true;
    }
    return false;
  };

  const handleTextChanged = (self: Gtk.Entry) => {
    const newText = self.get_text();
    text.set(newText);
    isTyping.set(newText.length > 0);
    handleChanged?.(newText);
  };

  const setupEntry = (self: Gtk.Entry) => {
    // Set reference if provided
    if (entryRef) {
      entryRef.set(self);
    }

    if (!hasFocused.get() && autoFocus) {
      self.grab_focus();
      hasFocused.set(true);
    }

    // Connect key press event
    const keyController = new Gtk.EventControllerKey();
    keyController.connect("key-pressed", (controller, keyval, keycode, state) => {
      return handleKeyPress(self, keyval);
    });
    self.add_controller(keyController);

    // Connect text changed event
    self.connect("changed", () => {
      handleTextChanged(self);
    });

    // Sync with external value if provided
    if (value) {
      value.subscribe((val) => {
        if (self.get_text() !== val) {
          self.set_text(val);
        }
      });
    }
  };

  return (
    <box {...boxProps} cssName="sidebar-chat-input-container" hexpand>
      <box cssName="sidebar-chat-input-wrapper" hexpand valign={Gtk.Align.CENTER}>
        <entry
          cssName="sidebar-chat-entry"
          cssClasses={bind(isTyping).as(typing => typing ? ["txt", "typing"] : ["txt"])}
          placeholderText="Type a message... (/ for commands)"
          hexpand
          onActivate={() => {
            if (text.get().trim().length > 0) {
              handleSubmit?.();
            }
          }}
          setup={setupEntry}
        />
      </box>
    </box>
  );
};

export default ChatInput;
