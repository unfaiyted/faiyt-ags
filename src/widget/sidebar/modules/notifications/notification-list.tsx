import { Widget, Gtk } from "astal/gtk4";
import { VarMap } from "../../../../types/var-map";
import Notification from "./notification";
import { Variable, Binding, bind } from "astal";
import getNotifd from "../../../../utils/notification-helper";

const notifd = getNotifd();

export const NotificationList = (props: Widget.ScrollableProps) => {
  const notifications = notifd.get_notifications();
  const notificationDisplay = new VarMap<number, Notifd.Notification>([]);
  const changeCount = Variable(0);

  for (const n of notifications) {
    notificationDisplay.set(n.id, n);
  }

  notifd.connect("notified", (_notifd, id) => {
    const currentNotification = notifd.get_notification(id);

    notificationDisplay.set(id, currentNotification);

    changeCount.set(changeCount.get() + 1);
  });

  notifd.connect("resolved", (_notifd, id) => {
    notificationDisplay.delete(id);
  });

  return (
    <scrollable
      hexpand
      vscroll={Gtk.PolicyType.AUTOMATIC}
      hscroll={Gtk.PolicyType.NEVER}
      vexpand
      {...props}
    >
      <box vexpand homogeneous>
        <box className="spacing-v-5-revealer" valign={Gtk.Align.START} vertical>
          {bind(notificationDisplay).as((v) => {
            return v.map(([num, w]) => (
              <Notification isPopup={false} notification={w} />
            ));
          })}
        </box>
      </box>
    </scrollable>
  );
};
