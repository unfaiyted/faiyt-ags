import { Widget, Gtk } from "astal/gtk4";
import GLib from "gi://GLib";
import Pango from "gi://Pango";
import { Variable, Binding, bind } from "astal";
import config from "../../../../utils/config";
import { getFriendlyTimeString } from "../../../../utils";
import { setupCursorHover } from "../../../utils/buttons";
import Notifd from "gi://AstalNotifd?version=0.1";
import getNotifd from "../../../../utils/notification-helper";
import { PhosphorIcon } from "../../../utils/icons/phosphor";
import { PhosphorIcons } from "../../../utils/icons/types";

export interface NotificationProps extends Widget.RevealerProps {
  notification: Notifd.Notification;
  isPopup: boolean;
}

export interface NotificationIconProps extends Widget.BoxProps {
  notification: Notifd.Notification;
}

export interface NotificationTextProps extends Widget.BoxProps {
  notification: Notifd.Notification;
  isExpanded: Binding<boolean>;
}

export interface NotificationExpandProps extends Widget.BoxProps {
  notification: Notifd.Notification;
  toggleExpand: () => void;
}

export const NotificationIcon = (props: NotificationIconProps) => {
  // Choose icon based on urgency or app
  const getIcon = () => {
    switch (props.notification.urgency) {
      case "critical":
        return PhosphorIcons.Warning;
      case "low":
        return PhosphorIcons.Info;
      default:
        return PhosphorIcons.Bell;
    }
  };
  
  return (
    <box 
      cssClasses={["notification-icon-wrapper", `urgency-${props.notification.urgency}`]}
      valign={Gtk.Align.CENTER}
    >
      <PhosphorIcon iconName={getIcon()} />
    </box>
  );
};

export const NotificationText = (props: NotificationTextProps) => {
  const time = getFriendlyTimeString(props.notification.time);
  const urgency = props.notification.urgency;
  const isExpanded = Variable(false);

  props.isExpanded.subscribe((status) => {
    isExpanded.set(status);
  });

  const NotifyTextSummary = () => {
    return (
      <label
        xalign={0}
        cssClasses={["notification-title"]}
        justify={Gtk.Justification.LEFT}
        hexpand
        maxWidthChars={1}
        ellipsize={Pango.EllipsizeMode.END}
        label={props.notification.summary}
      />
    );
  };

  const NotifyTime = () => {
    return (
      <label
        valign={Gtk.Align.CENTER}
        justify={Gtk.Justification.RIGHT}
        cssClasses={["notification-time"]}
        label={time ? time : ""}
      />
    );
  };

  const NotifyTextPreview = () => {
    return (
      <revealer
        revealChild={true}
        transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
        transitionDuration={config.animations.durationSmall}
      >
        <label
          xalign={0}
          cssClasses={["notification-body"]}
          useMarkup
          maxWidthChars={1}
          wrap
          label={props.notification.body.split("\n")[0]}
          justify={Gtk.Justification.LEFT}
        />
      </revealer>
    );
  };

  const NotifyTextExpanded = () => {
    return (
      <revealer
        revealChild={bind(isExpanded)}
        transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
        transitionDuration={config.animations.durationSmall}
      >
        <box cssClasses={["notification-actions"]}>
          <button
            hexpand
            cssClasses={["notification-action"]}
            onClicked={() => props.notification.dismiss()}
            setup={setupCursorHover}
          >
            <label>Dismiss</label>
          </button>

          {props.notification.actions.map((action) => {
            return (
              <button
                hexpand
                cssClasses={["notification-action"]}
                onClicked={() => props.notification.invoke(action.id)}
                setup={setupCursorHover}
              >
                <label>{action.label}</label>
              </button>
            );
          })}
        </box>
      </revealer>
    );
  };

  return (
    <box valign={Gtk.Align.CENTER} vertical hexpand cssClasses={["notification-content"]}>
      <box cssClasses={["notification-header"]}>
        <NotifyTextSummary />
        <NotifyTime />
      </box>
      <NotifyTextPreview />
      <NotifyTextExpanded />
    </box>
  );
};

export const NotificationExpandButton = (props: NotificationExpandProps) => {
  return (
    <button
      valign={Gtk.Align.START}
      cssClasses={["notification-expand-btn"]}
      setup={setupCursorHover}
      onClicked={props.toggleExpand}
    >
      <PhosphorIcon iconName={PhosphorIcons.DotsThreeVertical} size={16} />
    </button>
  );
};

export default function Notification(props: NotificationProps) {
  const close = Variable(false);
  const dragging = Variable(false);
  const held = Variable(false);
  const hovered = Variable(false);
  const id = props.notification.id;
  const notification = props.notification;
  const isExpanded = Variable(false);

  const toggleExpand = () => {
    isExpanded.set(!isExpanded.get());
  };

  return (
    <revealer
      revealChild={true}
      transitionDuration={config.animations.durationLarge}
      transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
      {...props}
    >
      <box cssClasses={["notification-container"]}>
        <NotificationIcon notification={props.notification} />
        <NotificationText
          notification={props.notification}
          isExpanded={bind(isExpanded)}
        />
        <NotificationExpandButton
          notification={props.notification}
          toggleExpand={toggleExpand}
        />
      </box>
    </revealer>
  );
}
