import { Widget, Gtk, } from "astal/gtk4";
import { timeout } from "astal/time";

export const ChatView = (props: Widget.BoxProps) => {

  const scrollableSetup = (self: Gtk.Scrollable) => {
    self.set_hscroll_policy(Gtk.ScrollablePolicy.NATURAL);
    self.set_vscroll_policy(Gtk.ScrollablePolicy.NATURAL);

    const adjustment = self.get_vadjustment();
    if (adjustment) {
      adjustment.connect("changed", () =>
        timeout(1, () => {
          adjustment.set_value(
            adjustment.get_upper() - adjustment.get_page_size(),
          );
        }),
      );
    }
  };

  return (
    <box homogeneous>
      <Gtk.ScrolledWindow
        cssName="sidebar-chat-wrapper"
        vscrollbar_policy={Gtk.PolicyType.AUTOMATIC}
        hscrollbar_policy={Gtk.PolicyType.NEVER}
        vexpand
      // setup={scrollableSetup}
      >
        <box vertical>{props.children || props.child}</box>
      </Gtk.ScrolledWindow>
    </box>
  );
};

export default ChatView;
