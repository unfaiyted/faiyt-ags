import { Widget } from "astal/gtk4";
import GLib from "gi://GLib";
import config from "./config";
import { Time } from "../types";

export const timeBefore = (time1: Time, time2: Time) => {
  // Arrays of [hour, minute]
  if (time1[0] == time2[0]) return time1[1] < time2[1];
  return time1[0] < time2[0];
};

export const timeSame = (
  time1: Time,
  time2: Time, // Arrays of [hour, minute]
) => time1[0] == time2[0] && time1[1] == time2[1];

export const timeBeforeOrSame = (
  time1: Time,
  time2: Time, // Arrays of [hour, minute]
) => timeBefore(time1, time2) || timeSame(time1, time2);

export const timeInRange = (time: Time, rangeStart: Time, rangeEnd: Time) => {
  // Arrays of [hour, minute]
  if (timeBefore(rangeStart, rangeEnd))
    return (
      timeBeforeOrSame(rangeStart, time) && timeBeforeOrSame(time, rangeEnd)
    );
  else {
    // rangeEnd < rangeStart, meaning it ends the following day
    rangeEnd[0] += 24;
    if (timeBefore(time, rangeStart)) time[0] += 24;
    return (
      timeBeforeOrSame(rangeStart, time) && timeBeforeOrSame(time, rangeEnd)
    );
  }
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
