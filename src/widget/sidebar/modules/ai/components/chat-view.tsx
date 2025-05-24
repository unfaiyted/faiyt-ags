import { Widget, Gtk, Gdk, Astal } from "astal/gtk4";
import { Variable, bind } from "astal";
import { timeout } from "astal/time";

export const ChatView = (props: Widget.BoxProps) => {

  const scrollableSetup = (self: Gtk.Scrollable) => {
    self.set_hscroll_policy(Gtk.ScrollablePolicy.NATURAL);
    self.set_vscroll_policy(Gtk.ScrollablePolicy.NATURAL);

    // get_style_context().add_class("sidebar-scrollbar");
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
      {/* <scrollable */}
      {/*   vexpand */}
      {/*   // setup={scrollableSetup} */}
      {/*   className="sidebar-chat-viewport" */}
      {/* > */}
      {/*   <box vertical>{props.children || props.child}</box> */}
      {/* </scrollable> */}
    </box>
  );
};

export default ChatView;
