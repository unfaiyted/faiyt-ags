import { Widget, Gtk } from "astal/gtk4";
import config from "../../../../utils/config";
import Notifd from "gi://AstalNotifd";
import { Variable, Binding, bind } from "astal";
import {
  NotificationSilenceButton,
  NotificationClearButton,
} from "./notification-buttons";
import { NotificationList } from "./notification-list";
import getNotifd from "../../../../utils/notification-helper";
import { PhosphorIcon } from "../../../utils/icons/phosphor";
import { PhosphorIcons } from "../../../utils/icons/types";
import { createLogger } from "../../../../utils/logger";

const log = createLogger('NotificationModule');

const notifd = getNotifd();



export const NotificationListEmpty = (props: Widget.BoxProps) => {
  return (
    <box
      cssClasses={["notification-empty"]}
      valign={Gtk.Align.CENTER}
      halign={Gtk.Align.CENTER}
      hexpand
      vexpand
      {...props}
    >
      <box vertical halign={Gtk.Align.CENTER}>
        <PhosphorIcon
          iconName={PhosphorIcons.BellSlash}
          size={48}
          cssClasses={["empty-icon"]}
        />
        <label label="No notifications" cssClasses={["empty-text"]} />
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
      cssClasses={["notification-count"]}
      label={bind(count).as(
        (v) => v.toString() + (v == 1 ? " notification" : " notifications"),
      )}
    />
  );
};

export function NotificationModule(props: Widget.BoxProps) {
  const notifications = notifd.get_notifications();

  log.debug('Initial notification count', { count: notifications.length });

  const empty = Variable(notifications.length === 0);
  const count = Variable(notifications.length);

  notifd.connect("notified", (_notifd: Notifd.Notifd, id: number) => {
    const n = _notifd.get_notification(id);
    const notifications = _notifd.get_notifications();
    empty.set(notifications.length === 0);
    count.set(notifications.length);
    log.debug('New notification', { id, summary: n.summary, body: n.body });
  });

  notifd.connect("resolved", (_notifd: Notifd.Notifd, id: number) => {
    const n = _notifd.get_notification(id);
    const notifications = _notifd.get_notifications();
    empty.set(notifications.length === 0);
    count.set(notifications.length);
  });

  return (
    <box {...props} vertical>
      <stack
        vexpand
        transitionDuration={config.animations.durationLarge}
        transitionType={Gtk.StackTransitionType.CROSSFADE}
        visibleChildName={bind(empty).as((v) => (v ? "empty" : "list"))}
      >
        <NotificationListEmpty name="empty" />
        <NotificationList name="list" />
      </stack>
      <box cssClasses={["notification-list-controls"]} valign={Gtk.Align.END}>
        <NotificationCount count={bind(count)} />
        <box cssClasses={["spacing-h-5"]}>
          <NotificationSilenceButton />
          <NotificationClearButton />
        </box>
      </box>
    </box>
  );
}

export default NotificationModule;
