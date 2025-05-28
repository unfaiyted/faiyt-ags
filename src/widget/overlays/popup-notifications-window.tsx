import { Widget, Gtk, Astal } from "astal/gtk4";
import PopupNotifications from "./popup-notifications";
import { createLogger } from "../../utils/logger";

const log = createLogger("PopupNotificationsWindow");

export interface PopupNotificationsWindowProps extends Widget.WindowProps { }

export const PopupNotificationsWindow = (props: PopupNotificationsWindowProps) => {
  log.debug("Creating popup notifications window", { monitor: props.monitor });

  return (
    <window
      {...props}
      name={`popup-notifications-${props.monitor}`}
      gdkmonitor={props.gdkmonitor}
      layer={Astal.Layer.OVERLAY}
      cssName="popup-notifications-window"
      visible
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
    >
      <PopupNotifications />
    </window>
  );
};

export default PopupNotificationsWindow;
