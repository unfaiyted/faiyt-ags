// Notification daemon helper to prevent multiple initialization errors
import Notifd from "gi://AstalNotifd";

// Singleton for notification daemon
let notifdInstance: any = null;
let initialized = false;

export const getNotifd = () => {
  if (!initialized) {
    try {
      notifdInstance = Notifd.get_default();
    } catch (e) {
      console.error(
        "Failed to initialize notification daemon. It may already be running:",
        e,
      );
      // Return a dummy object that will no-op all operations
      notifdInstance = {
        connect: () => 0, // Return a dummy signal ID
        get_notifications: () => [],
        get_notification: () => null,
        notify: () => {},
      };
    } finally {
      initialized = true;
    }
  }
  return notifdInstance;
};

export default getNotifd;
