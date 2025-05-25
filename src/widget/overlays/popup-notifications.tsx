import { Widget, Gtk } from "astal/gtk4";
import { VarMap } from "../../types/var-map";
import Notifd from "gi://AstalNotifd";
import { bind } from "astal";
import Notification from "../sidebar/modules/notifications/notification";
import getNotifd from "../../utils/notification-helper";
import { createLogger } from "../../utils/logger";

const log = createLogger("PopupNotifications");
const notifd = getNotifd();

export const PopupNotifications = (props: Widget.BoxProps) => {
  log.debug("Creating popup notifications widget");
  const notificationDisplay = new VarMap<number, Gtk.Widget>([]);

  // Only set up notification handling if notifd was initialized successfully
  if (notifd) {
    notifd.connect("notified", (_notifd: Notifd.Notifd, id: number) => {
      if (_notifd.dontDisturb || !id) {
        log.debug("Notification suppressed", { dontDisturb: _notifd.dontDisturb, id });
        return;
      };
      const notification = _notifd.get_notification(id);
      if (!notification) {
        log.warn("Notification not found", { id });
        return;
      }

      log.debug("Showing notification popup", { 
        id, 
        summary: notification.summary,
        appName: notification.appName 
      });
      
      notificationDisplay.set(
        id,
        <Notification
          notification={notification}
          isPopup={true}
        />,
      );
    });

    notifd.connect("resolved", (_notifd: Notifd.Notifd, id: number) => {
      log.debug("Removing notification popup", { id });
      notificationDisplay.delete(id);
    });
  } else {
    log.warn("Notification service not available");
  }

  return (
    <box
      vertical
      halign={Gtk.Align.END}
      valign={Gtk.Align.START}
      cssClasses={["osd-notifs"]}
      {...props}
    >
      {bind(notificationDisplay).as((v) => {
        return v.map(([_num, w]) => w);
      })}
    </box>
  );
};

export default PopupNotifications;
