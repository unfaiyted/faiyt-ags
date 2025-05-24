import { Widget, Gtk } from "astal/gtk4";
import { VarMap } from "../../../../types/var-map";
import Notification from "./notification";
import { Variable, Binding, bind } from "astal";
import getNotifd from "../../../../utils/notification-helper";
import Notifd from "gi://AstalNotifd";

const notifd = getNotifd();

export const NotificationList = () => {
  const notifications = notifd.get_notifications();
  const notificationDisplay = new VarMap<number, Notifd.Notification>([]);
  const changeCount = Variable(0);

  for (const n of notifications) {
    notificationDisplay.set(n.id, n);
  }

  notifd.connect("notified", (_notifd: Notifd.Notifd, id: number) => {
    const currentNotification = notifd.get_notification(id);

    notificationDisplay.set(id, currentNotification);

    changeCount.set(changeCount.get() + 1);
  });

  notifd.connect("resolved", (_notifd: Notifd.Notifd, id: number) => {
    notificationDisplay.delete(id);
  });

  return (
    <box
      hexpand
      // TODOL Fix scrollable
      // vscroll={Gtk.PolicyType.AUTOMATIC}
      // hscroll={Gtk.PolicyType.NEVER}
      vexpand
    >
      <box vexpand homogeneous>
        <box cssName="spacing-v-5-revealer" valign={Gtk.Align.START} vertical>
          {bind(notificationDisplay).as((v) => {
            return v.map(([num, w]) => (
              <Notification isPopup={false} notification={w} />
            ));
          })}
        </box>
      </box>
    </box>
  );
};
