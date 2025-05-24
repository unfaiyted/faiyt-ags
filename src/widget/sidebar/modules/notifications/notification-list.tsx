import { Widget, Gtk } from "astal/gtk4";
import { VarMap } from "../../../../types/var-map";
import Notification from "./notification";
import { Variable, Binding, bind } from "astal";
import getNotifd from "../../../../utils/notification-helper";
import { c } from "../../../../utils/style";
import Notifd from "gi://AstalNotifd";

const notifd = getNotifd();

export const NotificationList = (props: Widget.BoxProps) => {
  const notifications = notifd.get_notifications();
  const notificationDisplay = new VarMap<number, Notifd.Notification>([]);
  const changeCount = Variable(0);

  // Initialize with existing notifications
  for (const n of notifications) {
    notificationDisplay.set(n.id, n);
  }

  notifd.connect("notified", (_notifd: Notifd.Notifd, id: number) => {
    const currentNotification = notifd.get_notification(id);
    if (currentNotification) {
      notificationDisplay.set(id, currentNotification);
      changeCount.set(changeCount.get() + 1);
      print(`NotificationList: Added notification ${id}`);
    }
  });

  notifd.connect("resolved", (_notifd: Notifd.Notifd, id: number) => {
    notificationDisplay.delete(id);
    changeCount.set(changeCount.get() + 1);
    print(`NotificationList: Removed notification ${id}`);
  });

  return (
    <box
      {...props}
      hexpand
      vexpand
    >
      <Gtk.ScrolledWindow
        vscrollbar_policy={Gtk.PolicyType.AUTOMATIC}
        hscrollbar_policy={Gtk.PolicyType.NEVER}
        vexpand
        hexpand
      >
        <box valign={Gtk.Align.START} vertical>
          {bind(notificationDisplay).as((v) => {
            print(`NotificationList: Rendering ${v.length} notifications`);
            return v.map(([num, w]) => (
              <Notification key={num} isPopup={false} notification={w} />
            ));
          })}
        </box>
      </Gtk.ScrolledWindow>
    </box>
  );
};
