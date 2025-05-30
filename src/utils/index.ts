import { Gdk } from "astal/gtk4";
import { Binding } from "astal";
import Cairo from "gi://cairo";
import GLib from "gi://GLib";
import config from "./config";

export const dummyRegion = new Cairo.Region();

//this is because direction does not seem to work in event.direction
export const getScrollDirection = (
  _dx: number,
  dy: number,
): Gdk.ScrollDirection => {
  if (dy > 0) {
    return Gdk.ScrollDirection.UP;
  } else {
    return Gdk.ScrollDirection.DOWN;
  }
};

// export const isIcon = (icon: string) => !!Astal.Icon.lookup_icon(icon);

export const fileExists = (path: string) =>
  GLib.file_test(path, GLib.FileTest.EXISTS);

export const time = (time: number, format = "%H:%M") =>
  GLib.DateTime.new_from_unix_local(time).format(format)!;

/**
 * Parses a command from a message.
 * @param message The message to parse.
 * @returns An object containing the command and its arguments.
 */
export const parseCommand = (
  message: string,
): { command: string; args: string } => {
  if (!message.startsWith("/")) return { command: "", args: "" };

  const parts = message.split(" ");
  const command = parts[0].slice(1); // Remove the '/'
  const args = parts.slice(1).join(" ");

  return { command, args };
};

export const getFriendlyTimeString = (timeObject: number) => {
  const messageTime = GLib.DateTime.new_from_unix_local(timeObject);
  const oneMinuteAgo = GLib.DateTime.new_now_local().add_seconds(-60);
  if (oneMinuteAgo != null && messageTime.compare(oneMinuteAgo) > 0)
    return "Now";
  else if (
    messageTime.get_day_of_year() ==
    GLib.DateTime.new_now_local().get_day_of_year()
  )
    return messageTime.format(config.time.format);
  else if (
    messageTime.get_day_of_year() ==
    GLib.DateTime.new_now_local().get_day_of_year() - 1
  )
    return "Yesterday";
  else return messageTime.format(config.time.dateFormat);
};

// Helper function to truncate text
export function truncateText(
  text: string | undefined | Binding<string>,
  maxLength: number = 20,
): string {
  if (!text) {
    return "";
  }

  if (typeof text !== "string") {
    text = text.get();
  }

  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + "...";
}
