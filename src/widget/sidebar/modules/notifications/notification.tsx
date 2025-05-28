import { Widget, Gtk, Gdk } from "astal/gtk4";
import Gio from "gi://Gio";
import Pango from "gi://Pango";
import { Variable, Binding, bind, execAsync } from "astal";
import config from "../../../../utils/config";
import { getFriendlyTimeString } from "../../../../utils";
import { setupCursorHover } from "../../../utils/buttons";
import Notifd from "gi://AstalNotifd?version=0.1";
import getNotifd from "../../../../utils/notification-helper";
import { PhosphorIcon } from "../../../utils/icons/phosphor";
import { PhosphorIcons } from "../../../utils/icons/types";
import { createLogger } from "../../../../utils/logger";

const log = createLogger('Notification');

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
  imagePath?: string | null;
}

export interface NotificationExpandProps extends Widget.BoxProps {
  notification: Notifd.Notification;
  toggleExpand: () => void;
}

interface NotificationIconWithDetectionProps extends NotificationIconProps {
  handleImageDetected?: (path: string | null) => void;
}

const NotificationIconWithDetection = (props: NotificationIconWithDetectionProps) => {
  const result = NotificationIcon(props);

  // Extract the detected image path from the icon detection logic
  const notification = props.notification;
  let detectedPath = null;

  // Check all the same sources as NotificationIcon
  if (notification.image && notification.image.length > 0) {
    detectedPath = notification.image;
  } else {
    try {
      const imagePathHint = notification.get_str_hint("image-path");
      if (imagePathHint && imagePathHint.length > 0) {
        detectedPath = imagePathHint;
      }
    } catch (e) {
      try {
        const imagePathHint = notification.get_str_hint("image_path");
        if (imagePathHint && imagePathHint.length > 0) {
          detectedPath = imagePathHint;
        }
      } catch (e2) { }
    }
  }

  // Check body for image paths
  if (!detectedPath && notification.body) {
    const pathRegex = /(?:^|\s)(\/[^\s]+(?:\.png|\.jpg|\.jpeg|\.gif|\.bmp|\.svg|\.webp))(?:\s|$)/gi;
    const matches = notification.body.match(pathRegex);
    if (matches && matches.length > 0) {
      const potentialPath = matches[0].trim();
      try {
        const file = Gio.File.new_for_path(potentialPath);
        if (file.query_exists(null)) {
          detectedPath = potentialPath;
        }
      } catch (e) { }
    }
  }

  // Check app_icon
  if (!detectedPath && notification.app_icon && notification.app_icon.startsWith("/")) {
    try {
      const file = Gio.File.new_for_path(notification.app_icon);
      if (file.query_exists(null)) {
        detectedPath = notification.app_icon;
      }
    } catch (e) { }
  }

  // Report detected path
  if (props.handleImageDetected) {
    props.handleImageDetected(detectedPath);
  }

  return result;
};

export const NotificationIcon = (props: NotificationIconProps) => {
  const notification = props.notification;

  // Debug: Log notification with image info
  const hasImageProperty = notification.image && notification.image.length > 0;
  const hasFilePathInBody = notification.body && notification.body.match(/\/[^\s]+\.(png|jpg|jpeg|gif|bmp|svg|webp)/i);

  if (hasImageProperty || hasFilePathInBody) {
    log.debug('Notification with potential image', {
      summary: notification.summary,
      hasImageProperty,
      image: hasImageProperty ? notification.image : undefined,
      hasFilePathInBody,
      body: hasFilePathInBody ? notification.body : undefined
    });
  }

  // Try to get image from hints
  let imagePath = null;

  // Check direct image property first
  if (notification.image && notification.image.length > 0) {
    imagePath = notification.image;
  } else {
    // Try to get image path from hints
    try {
      const imagePathHint = notification.get_str_hint("image-path");
      if (imagePathHint && imagePathHint.length > 0) {
        imagePath = imagePathHint;
      }
    } catch (e) {
      // Try alternate naming
      try {
        const imagePathHint = notification.get_str_hint("image_path");
        if (imagePathHint && imagePathHint.length > 0) {
          imagePath = imagePathHint;
        }
      } catch (e2) {
        // No hints found
      }
    }
  }

  // If still no image, try to extract file path from notification body
  if (!imagePath && notification.body) {
    // Common image extensions
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg', '.webp'];

    // Try to find file paths in the body
    // Match absolute paths that start with / and contain image extensions
    const pathRegex = /(?:^|\s)(\/[^\s]+(?:\.png|\.jpg|\.jpeg|\.gif|\.bmp|\.svg|\.webp))(?:\s|$)/gi;
    const matches = notification.body.match(pathRegex);

    if (matches && matches.length > 0) {
      // Clean up the first match (remove whitespace)
      const potentialPath = matches[0].trim();
      log.debug('Found potential image path in body', { path: potentialPath });

      // Check if file exists
      try {
        const file = Gio.File.new_for_path(potentialPath);
        if (file.query_exists(null)) {
          imagePath = potentialPath;
          log.debug('Confirmed image file exists', { imagePath });
        }
      } catch (e) {
        log.warn('Could not check file existence', { error: e });
      }
    }
  }

  // If we have an image path, try to display it
  if (imagePath) {
    log.debug('Attempting to display image', { imagePath });

    // Create the image widget
    const imageWidget = new Gtk.Image({
      cssClasses: ["notification-image"],
      widthRequest: 64,
      heightRequest: 64,
    });

    // Set the image file
    try {
      imageWidget.set_from_file(imagePath);
    } catch (e) {
      log.error('Failed to load notification image', { error: e, imagePath });
      // Fall back to icon if image fails to load
      return NotificationIconFallback(props);
    }

    return (
      <box
        cssClasses={["notification-image-wrapper", `urgency-${notification.urgency}`]}
        valign={Gtk.Align.START}
      >
        {imageWidget}
      </box>
    );
  }

  // Check if we have an app icon that might be a file path
  if (notification.app_icon && notification.app_icon.startsWith("/")) {
    log.debug('App icon looks like a file path', { appIcon: notification.app_icon });

    const imageWidget = new Gtk.Image({
      cssClasses: ["notification-image"],
      widthRequest: 64,
      heightRequest: 64,
    });

    try {
      imageWidget.set_from_file(notification.app_icon);
      return (
        <box
          cssClasses={["notification-image-wrapper", `urgency-${notification.urgency}`]}
          valign={Gtk.Align.START}
        >
          {imageWidget}
        </box>
      );
    } catch (e) {
      log.warn('Failed to load app icon as image', { error: e, appIcon: notification.app_icon });
    }
  }

  return NotificationIconFallback(props);
};

const NotificationIconFallback = (props: NotificationIconProps) => {
  // Choose icon based on urgency or app
  const getIcon = () => {
    switch (props.notification.urgency) {
      case Notifd.Urgency.CRITICAL:
        return PhosphorIcons.Warning;
      case Notifd.Urgency.LOW:
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
      <PhosphorIcon marginStart={14} iconName={getIcon()} />
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
        revealChild={bind(isExpanded).as(exp => !exp)}
        transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
        transitionDuration={config.animations.durationSmall}
      >
        <label
          xalign={0}
          cssClasses={["notification-body"]}
          useMarkup
          maxWidthChars={50}
          wrap
          label={props.notification.body}
          justify={Gtk.Justification.LEFT}
          lines={2}
          ellipsize={Pango.EllipsizeMode.END}
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
        <label
          xalign={0}
          cssClasses={["notification-body-expanded"]}
          useMarkup
          wrap
          label={props.notification.body}
          justify={Gtk.Justification.LEFT}
        />
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
      setup={setupCursorHover}
      valign={Gtk.Align.START}
      cssClasses={["notification-expand-btn"]}
      onClicked={props.toggleExpand}
    >
      <PhosphorIcon iconName={PhosphorIcons.DotsThreeVertical} size={16} />
    </button>
  );
};

export default function Notification(props: NotificationProps) {
  const isExpanded = Variable(false);

  // Track detected image path
  const detectedImagePath = Variable<string | null>(null);

  const toggleExpand = () => {
    isExpanded.set(!isExpanded.get());
  };

  const gestureClick = new Gtk.GestureClick();
  gestureClick.set_button(Gdk.BUTTON_PRIMARY);
  gestureClick.set_exclusive(true);

  gestureClick.connect('pressed', () => {
    toggleExpand();
  });

  return (
    <revealer
      revealChild={true}
      transitionDuration={config.animations.durationLarge}
      transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
      {...props}
    >
      <box cssClasses={["notification-container"]} vertical>
        <box
          cssClasses={["notification-clickable-area"]}
          setup={(self) => {
            self.add_controller(gestureClick);
            // setupCursorHover(self);
          }}
        >
          <NotificationIconWithDetection
            notification={props.notification}
            handleImageDetected={(path) => detectedImagePath.set(path)}
          />
          <NotificationText
            notification={props.notification}
            isExpanded={bind(isExpanded)}
            imagePath={detectedImagePath.get()}
          />
          <NotificationExpandButton
            notification={props.notification}
            toggleExpand={toggleExpand}
          />
        </box>

        {/* Action buttons outside clickable area */}
        <revealer
          revealChild={bind(isExpanded)}
          transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
          transitionDuration={config.animations.durationSmall}
        >
          <box vertical spacing={12} cssClasses={["notification-actions-container"]}>
            {/* Image-specific actions if we have an image path */}
            {bind(detectedImagePath).as(imagePath => imagePath ? (
              <box cssClasses={["notification-image-actions"]}>
                <button
                  hexpand
                  setup={setupCursorHover}
                  cssClasses={["notification-action", "image-action"]}
                  onClicked={async () => {
                    try {
                      // Copy image to clipboard using wl-copy
                      await execAsync(['bash', '-c', `wl-copy -t image/png < "${imagePath}"`]);
                      log.info('Copied image to clipboard', { imagePath });
                    } catch (e) {
                      log.error('Failed to copy image', { error: e, imagePath });
                    }
                  }}
                  marginEnd={8}
                >
                  <box spacing={6}>
                    <PhosphorIcon iconName={PhosphorIcons.Copy} size={16} />
                    <label>Copy Image</label>
                  </box>
                </button>

                <button
                  hexpand
                  cssClasses={["notification-action", "image-action"]}
                  onClicked={async () => {
                    try {
                      // Get the directory of the image
                      const file = Gio.File.new_for_path(imagePath);
                      const parent = file.get_parent();
                      if (parent) {
                        const folderPath = parent.get_path();
                        // Open folder in file manager
                        await execAsync(['xdg-open', folderPath || ""]);
                        log.info('Opened folder', { folderPath });
                      }
                    } catch (e) {
                      log.error('Failed to open folder', { error: e });
                    }
                  }}
                  setup={setupCursorHover}
                >
                  <box spacing={6}>
                    <PhosphorIcon iconName={PhosphorIcons.FolderOpen} size={16} />
                    <label>Open Folder</label>
                  </box>
                </button>
              </box>
            ) : <label></label>)}

            <box cssClasses={["notification-actions"]}>
              <button
                hexpand
                cssClasses={["notification-action"]}
                onClicked={() => {
                  props.notification.dismiss();
                }}
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
          </box>
        </revealer>
      </box>
    </revealer>
  );
}
