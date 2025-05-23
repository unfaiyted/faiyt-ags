import { Widget, Gtk } from "astal/gtk4";
import config from "../../../../utils/config";
import gobject from "gi://GObject";
import MaterialIcon from "../../../utils/icons/material";
import { VarMap } from "../../../../types/var-map";
import Notification from "./notification";
import { Variable, Binding, bind } from "astal";
import { setupCursorHover } from "../../../utils/buttons";
import getNotifd from "../../../../utils/notification-helper";

const notifd = getNotifd();

export interface ListActionButtonProps extends Widget.ButtonProps {
  icon: string;
  action: (self: Widget.Button) => void;
}

export const ListActionButton = (props: ListActionButtonProps) => {
  return (
    <button
      className="sidebar-centermodules-bottombar-button"
      onClicked={props.action}
      setup={setupCursorHover}
    >
      <box halign={Gtk.Align.CENTER} className="spacing-h-5">
        <MaterialIcon icon={props.icon} size="normal" />
        <label className="txt-small" label={props.name} />
      </box>
    </button>
  );
};

export const NotificationSilenceButton = (props: Widget.BoxProps) => (
  <ListActionButton
    icon="notifications_paused"
    name="Silence"
    action={(self) => {
      notifd.dontDisturb = !notifd.dontDisturb;
      self.toggleClassName("notif-listaction-btn-enabled", notifd.dontDisturb);
    }}
  />
);

// export interface NotificationClearButtonProps extends Widget.ButtonProps {
//   handleClear: () => void;
// }

export const NotificationClearButton = (props: Widget.ButtonProps) => {
  const notifications = notifd.get_notifications();

  const handleClear = () => {
    const notifications = notifd.get_notifications();
    for (const notification of notifications) {
      notification.dismiss();
    }
  };

  return (
    <revealer
      transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
      transitionDuration={config.animations.durationSmall}
      revealChild={notifications.length > 0}
    >
      <ListActionButton icon="clear_all" name="Clear" action={handleClear} />
    </revealer>
  );
};
