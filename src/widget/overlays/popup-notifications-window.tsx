import { Widget, Gtk, Gdk, Astal } from "astal/gtk4";
import PopupNotifications from "./popup-notifications";
import { createLogger } from "../../utils/logger";
import { Variable } from "astal";

const log = createLogger("PopupNotificationsWindow");

export interface PopupNotificationsWindowProps extends Widget.WindowProps { }

export const PopupNotificationsWindow = (props: PopupNotificationsWindowProps) => {
  log.debug("Creating popup notifications window", { monitor: props.monitor });
  const isHovered = Variable(false);
  const hasNotifications = Variable(false);
  let windowRef: Gtk.Window | null = null;

  return (
    <window
      {...props}
      name={`popup-notifications-${props.monitor}`}
      gdkmonitor={props.gdkmonitor}
      layer={Astal.Layer.OVERLAY}
      cssName="popup-notifications-window"
      visible={hasNotifications()}
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
      keymode={Astal.Keymode.NONE}
      exclusivity={Astal.Exclusivity.NORMAL}
      setup={(self: Gtk.Window) => {
        windowRef = self;
        
        // Subscribe to visibility changes
        hasNotifications.subscribe((shouldShow) => {
          log.debug("Notification visibility changed", { shouldShow });
          if (shouldShow) {
            self.show();
          } else {
            self.hide();
          }
        });
      }}
    >
      <PopupNotifications
        handleHoverChanged={(hovered: boolean) => {
          isHovered.set(hovered);

          if (windowRef) {
            if (hovered) {
              // Restore normal input on hover
              // (windowRef as any).input_shape_combine_region(null);
              log.debug("Hover detected: input enabled");
            } else {
              // Make click-through when not hovered
              log.debug("Hover ended: click-through enabled");
            }
          }
        }}
        onNotificationCountChanged={(count: number) => {
          log.debug("Notification count changed", { count });
          hasNotifications.set(count > 0);
        }}
      />
    </window>
  );
};

export default PopupNotificationsWindow;
