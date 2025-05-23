import { Widget, Gtk } from "astal/gtk4";
import { VarMap } from "../../types/var-map";
import Notifd from "gi://AstalNotifd";
import { bind } from "astal";
// TODO: Needto move these notification objects somewhere that makes more sense for a shared component
import Notification from "../sidebar/modules/notifications/notification";
import getNotifd from "../../utils/notification-helper";

const notifd = getNotifd();

export const PopupNotifications = (props: Widget.BoxProps) => {
  const notificationDisplay = new VarMap<number, Gtk.Widget>([]);

  // Only set up notification handling if notifd was initialized successfully
  if (notifd) {
    notifd.connect("notified", (_notifd: Notifd.Notifd, id: number) => {
      if (_notifd.dontDisturb || !id) return;
      if (!_notifd.get_notification(id)) return;

      notificationDisplay.set(
        id,
        <Notification
          notification={_notifd.get_notification(id)}
          isPopup={true}
        />,
      );
    });

    notifd.connect("resolved", (_notifd: Notifd.Notifd, id: number) => {
      notificationDisplay.delete(id);
    });
  }

  return (
    <box
      vertical
      halign={Gtk.Align.CENTER}
      cssName="osd-notifs spacing-v-5-revealer"
      {...props}
    >
      {bind(notificationDisplay).as((v) => {
        return v.map(([_num, w]) => w);
      })}
    </box>
  );
};

export default PopupNotifications;
