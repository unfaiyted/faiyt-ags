import { Widget, Gtk } from "astal/gtk4";
import GLib from "gi://GLib";
import Pango from "gi://Pango";
import { Variable, Binding, bind } from "astal";
import config from "../../../../utils/config";
import { getFriendlyTimeString } from "../../../../utils";
import { setupCursorHover } from "../../../utils/buttons";
import Notifd from "gi://AstalNotifd";
import getNotifd from "../../../../utils/notification-helper";

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
  return (
    <box valign={Gtk.Align.START} homogeneous>
      <overlay>
        <box
          valign={Gtk.Align.CENTER}
          hexpand
          cssName={`notif-icon notif-icon-material-${props.notification.urgency}`}
        ></box>
      </overlay>
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
        cssName="txt-small txt-semibold titlefont"
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
        cssName="txt-smaller txt-semibold"
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
          cssName={`txt-smallie notif-body-${urgency}`}
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
        transitionType={Gtk.RevealerTransitionType.SLIDE_UP}
        transitionDuration={config.animations.durationSmall}
      >
        <box>
          <button
            hexpand
            cssName={`notif-action notif-action-${urgency}`}
            onClicked={() => { }}
            setup={setupCursorHover}
          >
            <label>Close</label>
          </button>

          {props.notification.actions.map((action) => {
            return (
              <button
                hexpand
                cssName={`notif-action notif-action-${urgency}`}
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
    <box valign={Gtk.Align.CENTER} vertical hexpand>
      <box>
        <NotifyTextSummary />
        <NotifyTime />
      </box>
      <NotifyTextPreview />
      <NotifyTextExpanded />
    </box>
  );
};

export const NotificationExpandButton = (props: NotificationExpandProps) => {
  // onClicked={() => props.notification.expand()}
  //
  return (
    <button
      valign={Gtk.Align.START}
      cssName="notif-expand-btn"
      setup={setupCursorHover}
      onClicked={props.toggleExpand}
    >
      <box cssName="spacing-h-5">
        {/* <MaterialIcon */}
        {/*   icon="expand_more" */}
        {/*   size="normal" */}
        {/*   valign={Gtk.Align.CENTER} */}
        {/* /> */}
      </box>
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
  // notification.dismiss();

  return (
    <revealer
      revealChild={true}
      transitionDuration={config.animations.durationLarge}
      transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
      {...props}
    >
      <box homogeneous>
        <box homogeneous>
          <box
            cssName={`${props.isPopup ? "popup-" : ""}notif-${props.notification.urgency} spacing-h-10`}
          >
            <NotificationIcon notification={props.notification} />
            <box cssName="spacing-h-5">
              <NotificationText
                notification={props.notification}
                isExpanded={bind(isExpanded)}
              />
              <NotificationExpandButton
                notification={props.notification}
                toggleExpand={toggleExpand}
              />
            </box>
          </box>
        </box>
      </box>
    </revealer>
  );
}
