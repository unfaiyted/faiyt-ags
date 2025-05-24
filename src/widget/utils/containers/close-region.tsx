import { Widget, Gtk, Gdk, Astal } from "astal/gtk4";
import { Variable, Binding, bind } from "astal";
import { getScrollDirection } from "../../../utils";
import PhosphorIcon from "../../utils/icons/phosphor";
import { PhosphorIcons } from "../../utils/icons/types";
import Hyprland from "gi://AstalHyprland";

const hypr = Hyprland.get_default();

const calulatePixelFromPercent = (percent: number, dimension: number) => {
  return Math.round((percent * dimension) / 100);
};

export interface CloseRegionProps extends Widget.BoxProps {
  multimonitor: boolean;
  monitor: number;
  handleClose: () => void;
  hexpand?: boolean;
  vexpand?: boolean;
  height?: string;
  width?: string;
}

export default function CloseRegion(props: CloseRegionProps) {
  const monitor = hypr.monitors[props.monitor];
  let width = 0;
  let height = 0;

  if (props.height && props.height.includes("%")) {
    const cleanHeight = props.height.replace("%", "");
    height = calulatePixelFromPercent(parseFloat(cleanHeight), monitor.height);
  } else {
    if (props.height) {
      const cleanHeight = props.height.replace("px", "");
      height = parseInt(cleanHeight);
    }
  }
  if (props.width && props.width.includes("%")) {
    const cleanWidth = props.width.replace("%", "");
    width = calulatePixelFromPercent(parseFloat(cleanWidth), monitor.width);
  } else {
    if (props.width) {
      const cleanWidth = props.width.replace("px", "");
      width = parseInt(cleanWidth);
    }
  }

  return (
    <button onClicked={props.handleClose}>
      <box>
        <box
          vexpand={props.vexpand || true}
          heightRequest={props.hexpand ? monitor.height : height}
          widthRequest={props.hexpand ? monitor.width : width}
        ></box>
      </box>
    </button>
  );
}
