import { Widget, Gtk, astalify } from "astal/gtk4";
import Notifd from "gi://AstalNotifd";
import { setupCursorHover } from "../utils/buttons";
import { Variable, bind } from "astal";
import GLib from "gi://GLib";
import { PhosphorIcons } from "../utils/icons/types";
import getNotifd from "../../utils/notification-helper";
import { createLogger } from "../../utils/logger";
import { PhosphorIcon } from "../utils/icons/phosphor";

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
    const timeout = 5000;
    timeoutId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, timeout, () => {
      onClose();
      return false;
    });
  }

  return (
    <box
      {...props}
      cssClasses={["popup-notification", urgencyClass, "notification-stack-item"]}
      cssName="popup-notification-wrapper"
      setup={(self) => {
        // Add click handler to dismiss
        const clickGesture = new Gtk.GestureClick();
        clickGesture.connect("pressed", () => {
          if (timeoutId) {
            GLib.source_remove(timeoutId);
            timeoutId = null;
          }
          onClose();
        });
        self.add_controller(clickGesture);

        // Clean up timeout on destroy
        self.connect("destroy", () => {
          if (timeoutId) {
            GLib.source_remove(timeoutId);
            timeoutId = null;
          }
        });
      }}
    >
      <box cssClasses={["popup-notification-content"]} spacing={12}>
        {/* Icon */}
        <box cssClasses={["popup-notification-icon"]} valign={Gtk.Align.START}>
          {notification.app_icon ? (
            <image iconName={notification.app_icon} pixelSize={24} />
          ) : (
            <PhosphorIcon iconName={PhosphorIcons.Bell} size={24} />
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
              maxWidthChars={30}
            />
            <box hexpand />
            <button
              cssClasses={["popup-notification-close"]}
              onClicked={() => {
                if (timeoutId) {
                  GLib.source_remove(timeoutId);
                  timeoutId = null;
                }
                onClose();
              }}
            >
              <PhosphorIcon iconName={PhosphorIcons.X} size={16} />
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
              {notification.actions.map((action, _i) => (
                <button
                  setup={setupCursorHover}
                  cssClasses={["popup-notification-action"]}
                  onClicked={() => {
                    if (timeoutId) {
                      GLib.source_remove(timeoutId);
                      timeoutId = null;
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

const NotificationOverlay = astalify(Gtk.Overlay);

interface PopupNotificationsProps extends Widget.BoxProps {
  handleHoverChanged?: (hovered: boolean) => void;
  onNotificationCountChanged?: (count: number) => void;
}

export const PopupNotifications = ({ handleHoverChanged, onNotificationCountChanged, ...props }: PopupNotificationsProps) => {
  log.debug("Creating popup notifications widget");
  const notifications = Variable<Array<[number, Notifd.Notification]>>([]);
  const isHovered = Variable(false);

  // Transition timing
  let transitionTimeout: number | null = null;

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
      const newNotifications = [...notifications.get(), [id, notification]];
      notifications.set(newNotifications);
      onNotificationCountChanged?.(newNotifications.length);
    });

    notifd.connect("resolved", (_notifd: Notifd.Notifd, id: number) => {
      log.debug("Removing notification popup", { id });
      const newNotifications = notifications.get().filter(([nId]) => nId !== id);
      notifications.set(newNotifications);
      onNotificationCountChanged?.(newNotifications.length);
    });
  } else {
    log.warn("Notification service not available");
  }

  return (
    <box
      halign={Gtk.Align.FILL}
      valign={Gtk.Align.START}
      cssClasses={bind(isHovered).as(hovered =>
        ["popup-notifications-container", hovered ? "fanned-out" : "stacked"]
      )}
      onDestroy={() => {
        if (transitionTimeout) {
          GLib.source_remove(transitionTimeout);
          transitionTimeout = null;
        }
      }}
      {...props}
    >
      {bind(notifications).as(notifs => {
        // Show only the last 4 notifications
        const startIndex = Math.max(0, notifs.length - 5);
        const visibleNotifs = notifs.slice(startIndex);

        if (visibleNotifs.length === 0) {
          return <box />;
        }

        // Create overlay stack
        let overlayStack = (
          <NotificationOverlay
            halign={Gtk.Align.END}
            valign={Gtk.Align.START}
            cssClasses={["notification-hover-container"]}
            setup={(self) => {
              // Set up hover detection for the entire notification area
              const motionController = new Gtk.EventControllerMotion();
              motionController.connect("enter", () => {
                log.info("Mouse entered notification container");

                // Cancel any pending transition
                if (transitionTimeout) {
                  GLib.source_remove(transitionTimeout);
                  transitionTimeout = null;
                }

                isHovered.set(true);
                handleHoverChanged?.(true);
              });

              motionController.connect("leave", () => {
                log.info("Mouse left notification container");

                // Delay the collapse slightly for smoother UX
                if (transitionTimeout) {
                  GLib.source_remove(transitionTimeout);
                }

                transitionTimeout = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 300, () => {
                  isHovered.set(false);
                  handleHoverChanged?.(false);
                  transitionTimeout = null;
                  return false;
                });
              });

              self.add_controller(motionController);
            }}
          >
            <box /> {/* Base child required for overlay */}
          </NotificationOverlay>
        ) as Gtk.Overlay;

        // Add notifications as overlay children
        visibleNotifs.forEach(([id, notification], index) => {
          const notificationWidget = (
            <box
              halign={Gtk.Align.END}
              valign={Gtk.Align.START}
              cssClasses={bind(isHovered).as(hovered =>
                hovered ? [`notification-position-${index}`, "fanned"] : [`notification-position-${index}`, "stacked"]
              )}
            >
              <PopupNotification
                notification={notification}
                stackPosition={index}
                onClose={() => {
                  log.debug("Closing notification", { id });
                  // Remove from our tracking
                  const newNotifications = notifications.get().filter(([nId]) => nId !== id);
                  notifications.set(newNotifications);
                  onNotificationCountChanged?.(newNotifications.length);
                  // Dismiss from notification daemon
                  notification.dismiss();
                  // Don't manually remove overlay - let reactive binding handle it
                }}
              />
            </box>
          ) as Gtk.Widget;

          overlayStack.add_overlay(notificationWidget);
        });

        return overlayStack;
      })}
    </box>
  );
};

export default PopupNotifications;
