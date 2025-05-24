import { Widget, Gtk } from "astal/gtk4";
import config from "../../../../utils/config";
import gobject from "gi://GObject";
import { VarMap } from "../../../../types/var-map";
import Notification from "./notification";
import { Variable, Binding, bind } from "astal";
import { setupCursorHover } from "../../../utils/buttons";
import getNotifd from "../../../../utils/notification-helper";
import { PhosphorIcon } from "../../../utils/icons/phosphor";
import { PhosphorIcons } from "../../../utils/icons/types";

const notifd = getNotifd();

export interface ListActionButtonProps extends Widget.ButtonProps {
  icon: PhosphorIcons;
  action: (self: Gtk.Button) => void;
}

export const ListActionButton = (props: ListActionButtonProps) => {
  return (
    <button
      cssName="sidebar-centermodules-bottombar-button"
      onClicked={props.action}
      setup={setupCursorHover}
    >
      <box halign={Gtk.Align.CENTER} cssName="spacing-h-5">
        <PhosphorIcon iconName={props.icon} />
        {/* <MaterialIcon icon={props.icon} size="normal" /> */}
        <label cssName="txt-small" label={props.name} />
      </box>
    </button>
  );
};

export const NotificationSilenceButton = (props: Widget.BoxProps) => (
  <ListActionButton
    icon={PhosphorIcons.BellSlash}
    name="Silence"
    action={(self) => {
      notifd.dontDisturb = !notifd.dontDisturb;
      self.set_css_classes(notifd.dontDisturb ? ["notif-listaction-btn-enabled"] : []);
    }}
  />
);


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
      <ListActionButton icon={PhosphorIcons.Broom} name="Clear" action={handleClear} />
    </revealer>
  );
};
