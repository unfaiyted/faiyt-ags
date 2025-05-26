import { Widget, Gtk, Gdk, astalify } from "astal/gtk4";
import Notifd from "gi://AstalNotifd";
import { bind, Variable } from "astal";
import GLib from "gi://GLib";
import getNotifd from "../../utils/notification-helper";
import { createLogger } from "../../utils/logger";
import { PhosphorIcon } from "../utils/icons/phosphor";

const Fixed = astalify(Gtk.Fixed);

const log = createLogger("PopupNotifications");
const notifd = getNotifd();

interface PopupNotificationProps extends Widget.BoxProps {
  notification: Notifd.Notification;
  onClose: () => void;
  stackPosition: number;
}

const PopupNotification = ({ notification, onClose, stackPosition, ...props }: PopupNotificationProps) => {
  const urgency = notification.urgency;
  const urgencyClass = urgency === 2 ? "critical" : urgency === 0 ? "low" : "normal";
  let timeoutId: number | null = null;

  // Auto-dismiss after timeout (except critical)
  if (urgency !== 2) {
    const timeout = notification.timeout || 5000;
    timeoutId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, timeout, () => {
      onClose();
      return false;
    });
  }

  return (
    <box
      {...props}
      cssClasses={["popup-notification", urgencyClass, "notification-stack-item"]}
      setup={(self) => {
        // Add click handler to dismiss
        const clickGesture = new Gtk.GestureClick();
        clickGesture.connect("pressed", () => {
          if (timeoutId) {
            GLib.source_remove(timeoutId);
          }
          onClose();
        });
        self.add_controller(clickGesture);
      }}
    >
      <box cssClasses={["popup-notification-content"]} spacing={12}>
        {/* Icon */}
        <box cssClasses={["popup-notification-icon"]} valign={Gtk.Align.START}>
          {notification.app_icon ? (
            <image iconName={notification.app_icon} pixelSize={24} />
          ) : (
            <PhosphorIcon icon="bell" size={24} />
          )}
        </box>

        {/* Content */}
        <box vertical cssClasses={["popup-notification-text"]} hexpand>
          {/* Header */}
          <box cssClasses={["popup-notification-header"]} spacing={8}>
            <label
              cssClasses={["popup-notification-title"]}
              label={notification.summary || notification.appName || "Notification"}
              xalign={0}
              truncate
              maxWidthChars={30}
            />
            <box hexpand />
            <button
              cssClasses={["popup-notification-close"]}
              onClicked={() => {
                if (timeoutId) {
                  GLib.source_remove(timeoutId);
                }
                onClose();
              }}
            >
              <PhosphorIcon icon="x" size={16} />
            </button>
          </box>

          {/* Body */}
          {notification.body && (
            <label
              cssClasses={["popup-notification-body"]}
              label={notification.body}
              xalign={0}
              wrap
              maxWidthChars={40}
            />
          )}

          {/* Actions */}
          {notification.actions && notification.actions.length > 0 && (
            <box cssClasses={["popup-notification-actions"]} spacing={8}>
              {notification.actions.map((action, i) => (
                <button
                  key={i}
                  cssClasses={["popup-notification-action"]}
                  onClicked={() => {
                    if (timeoutId) {
                      GLib.source_remove(timeoutId);
                    }
                    notification.invoke(action.id);
                    onClose();
                  }}
                >
                  <label label={action.label} />
                </button>
              ))}
            </box>
          )}
        </box>
      </box>
    </box>
  );
};

export const PopupNotifications = (props: Widget.BoxProps) => {
  log.debug("Creating popup notifications widget");
  const notifications = Variable<Array<[number, Notifd.Notification]>>([]);
  const fixedRef = Variable<Gtk.Fixed | null>(null);

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

      // Add to notifications array
      notifications.set([...notifications.get(), [id, notification]]);
    });

    notifd.connect("resolved", (_notifd: Notifd.Notifd, id: number) => {
      log.debug("Removing notification popup", { id });
      notifications.set(notifications.get().filter(([nId]) => nId !== id));
    });
  } else {
    log.warn("Notification service not available");
  }

  // Map to track widget references
  const widgetMap = new Map<number, Gtk.Widget>();

  // Update Fixed container when notifications change
  notifications.subscribe((notifs) => {
    const fixed = fixedRef.get();
    if (!fixed) return;

    // Remove widgets for notifications that no longer exist
    const currentIds = new Set(notifs.map(([id]) => id));
    for (const [id, widget] of widgetMap.entries()) {
      if (!currentIds.has(id)) {
        fixed.remove(widget);
        widgetMap.delete(id);
      }
    }

    // Add only the last 5 notifications
    const startIndex = Math.max(0, notifs.length - 5);
    const visibleNotifs = notifs.slice(startIndex);
    
    // Clear all widgets if we're showing a different set
    if (notifs.length > 5) {
      widgetMap.forEach((widget) => fixed.remove(widget));
      widgetMap.clear();
    }

    visibleNotifs.forEach(([id, notification], index) => {
      // Only create widget if it doesn't exist
      if (!widgetMap.has(id)) {
        const widget = (
          <PopupNotification
            notification={notification}
            stackPosition={index}
            onClose={() => {
              log.debug("Closing notification", { id });
              // Remove from our tracking immediately
              notifications.set(notifications.get().filter(([nId]) => nId !== id));
              notification.dismiss();
            }}
          />
        ) as Gtk.Widget;

        widgetMap.set(id, widget);
        fixed.put(widget, 10, 10 + (index * 10));
      } else {
        // Reposition existing widget
        const widget = widgetMap.get(id)!;
        fixed.move(widget, 10, 10 + (index * 10));
      }
    });
  });

  return (
    <Fixed
      halign={Gtk.Align.CENTER}
      valign={Gtk.Align.START}
      cssClasses={["popup-notifications-container"]}
      setup={(self) => {
        self.set_size_request(450, 150);
        fixedRef.set(self);
      }}
      onDestroy={() => {
        // Clean up all widgets
        widgetMap.forEach((widget) => {
          widget.destroy();
        });
        widgetMap.clear();
      }}
      {...props}
    />
  );
};

export default PopupNotifications;
