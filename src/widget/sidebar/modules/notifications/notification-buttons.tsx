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
import { createLogger } from "../../../../utils/logger";

const log = createLogger('NotificationButtons');

const notifd = getNotifd();

export interface ListActionButtonProps extends Widget.ButtonProps {
  icon: PhosphorIcons | Binding<PhosphorIcons>;
  action: (self: Gtk.Button) => void;
}

export const ListActionButton = (props: ListActionButtonProps) => {
  return (
    <button
      cssClasses={["notification-control-btn"]}
      onClicked={props.action}
      setup={setupCursorHover}
    >
      <box halign={Gtk.Align.CENTER} cssClasses={["spacing-h-5"]}>
        <PhosphorIcon iconName={props.icon} />
        <label label={props.name} />
      </box>
    </button>
  );
};

export const NotificationSilenceButton = (props: Widget.BoxProps) => (
  <ListActionButton
    icon={bind(notifd, "dontDisturb").as(dnd => dnd ? PhosphorIcons.BellSlash : PhosphorIcons.Bell)}
    marginEnd={4}
    name="Silence"
    action={(self) => {
      notifd.dontDisturb = !notifd.dontDisturb;
      log.debug('Toggled Do Not Disturb', { enabled: notifd.dontDisturb });
      self.set_css_classes(notifd.dontDisturb ? ["notification-control-btn", "active"] : ["notification-control-btn"]);
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
      marginStart={4}
      transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
      transitionDuration={config.animations.durationSmall}
      revealChild={notifications.length > 0}
    >
      <ListActionButton icon={PhosphorIcons.Broom} name="Clear" action={handleClear} />
    </revealer>
  );
};
