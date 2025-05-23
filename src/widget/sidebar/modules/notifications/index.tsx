import { Widget, Gtk } from "astal/gtk4";
import config from "../../../../utils/config";
import gobject from "gi://GObject";
import MaterialIcon from "../../../utils/icons/material";
import { VarMap } from "../../../../types/var-map";
import Notification from "./notification";
import Notifd from "gi://AstalNotifd";
import { Variable, Binding, bind } from "astal";
import {
  NotificationSilenceButton,
  NotificationClearButton,
} from "./notification-buttons";
import { NotificationList } from "./notification-list";
import getNotifd from "../../../../utils/notification-helper";

const notifd = getNotifd();



export const NotificationListEmpty = (props: Widget.BoxProps) => {
  return (
    <box homogeneous {...props}>
      <box vertical valign={Gtk.Align.CENTER} cssName="txt spacing-v-10">
        <box vertical cssName="spacing-v-5 txt-subtext">
          <MaterialIcon icon="notifications_active" size="gigantic" />
          <label label="No notifications" cssName="txt-small" />
        </box>
      </box>
    </box>
  );
};

export interface NotificationCountProps extends Widget.BoxProps {
  count: Binding<number>;
}

export const NotificationCount = (props: NotificationCountProps) => {
  const count = Variable(props.count.get());

  props.count.subscribe((c) => {
    count.set(c);
  });

  return (
    <label
      hexpand
      xalign={0}
      cssName="txt-small margin-left-10"
      label={bind(count).as(
        (v) => v.toString() + (v == 1 ? " notification" : " notifications"),
      )}
    />
  );
};

export function NotificationModule(props: Widget.BoxProps) {
  const notifications = notifd.get_notifications();

  print("notifications.length", notifications.length);

  const empty = Variable(notifications.length === 0);
  const count = Variable(notifications.length);

  notifd.connect("notified", (_notifd: Notifd.Notifd, id: number) => {
    const n = _notifd.get_notification(id);
    const notifications = _notifd.get_notifications();
    empty.set(notifications.length === 0);
    count.set(notifications.length);
    print("Notification:", n.summary, n.body);
  });

  notifd.connect("resolved", (_notifd: Notifd.Notifd, id: number) => {
    const n = _notifd.get_notification(id);
    const notifications = _notifd.get_notifications();
    empty.set(notifications.length === 0);
    count.set(notifications.length);
  });

  return (
    <box {...props} cssName="spacing-v-5" vertical>
      <stack
        transitionDuration={config.animations.durationLarge}
        transitionType={Gtk.StackTransitionType.CROSSFADE}
        visibleChildName={bind(empty).as((v) => (v ? "empty" : "list"))}
      >
        <NotificationListEmpty name="empty" />
        <NotificationList name="list" />
      </stack>
      <box cssName="txt spacing-h-5" valign={Gtk.Align.START}>
        <NotificationCount count={bind(count)} />
        <NotificationSilenceButton />
        <NotificationClearButton />
      </box>
    </box>
  );
}

export default NotificationModule;
