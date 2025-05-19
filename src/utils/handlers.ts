import Gio from "gi://Gio";
import Hypr from "gi://AstalHyprland";

export const handleHyprResponse: Gio.AsyncReadyCallback<Hypr.Hyprland> = (
  _source,
  _response,
  data,
) => {
  print(data);
};
