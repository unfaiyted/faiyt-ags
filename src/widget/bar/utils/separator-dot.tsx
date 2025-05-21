import { Widget, Gtk } from "astal/gtk4";
import { Variable } from "astal";
import SystemTray from "gi://AstalTray";

//
// const SeparatorDot = () => Widget.Revealer({
//     transition: 'slide_left',
//     revealChild: false,
//     attribute: {
//         'count': SystemTray.items.length,
//         'update': (self, diff) => {
//             self.attribute.count += diff;
//             self.revealChild = (self.attribute.count > 0);
//         }
//     },
//     child: Widget.Box({
//         vpack: 'center',
//         className: 'separator-circle',
//     }),
//     setup: (self) => self
//         .hook(SystemTray, (self) => self.attribute.update(self, 1), 'added')
//         .hook(SystemTray, (self) => self.attribute.update(self, -1), 'removed')
//     ,

export interface SeperatorDotProps extends Widget.BoxProps { }

export default function SeperatorDot() {

  const count = new Variable(0);

  const tray = SystemTray.get_default();

  tray.connect("item-added", () => {
    count.set(count.get() + 1);
  });

  tray.connect("item-removed", () => {
    count.set(count.get() - 1);
  });

  return (
    <revealer
      transition-type={Gtk.RevealerTransitionType.SLIDE_LEFT}
      reveal-child={false}
    >
      <box valign={Gtk.Align.CENTER} cssName="separator-circle" />
    </revealer>
  );
}
