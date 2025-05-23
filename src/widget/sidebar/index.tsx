import { Widget, App, Astal, Gtk, Gdk } from "astal/gtk4";
import PopupWindow, { PopupWindowProps } from "../utils/popup-window";
import { ScreenSide } from "./types";
import { Variable, bind } from "astal";


export interface SideBarProps extends PopupWindowProps {
  screenSide: ScreenSide;
}

export default function SideBar(sideBarProps: SideBarProps) {
  const { setup, child, ...props } = sideBarProps;

  const keymode: Astal.Keymode = Astal.Keymode.ON_DEMAND;

  const isVisible = Variable(true);

  // TODO: handle all 4 sides
  let anchor: Astal.WindowAnchor = Astal.WindowAnchor.NONE;

  switch (sideBarProps.screenSide) {
    case ScreenSide.LEFT:
      anchor =
        Astal.WindowAnchor.LEFT |
        Astal.WindowAnchor.TOP |
        Astal.WindowAnchor.BOTTOM;
      break;
    case ScreenSide.RIGHT:
      anchor =
        Astal.WindowAnchor.RIGHT |
        Astal.WindowAnchor.TOP |
        Astal.WindowAnchor.BOTTOM;

      break;
    case ScreenSide.TOP:
      anchor =
        Astal.WindowAnchor.LEFT |
        Astal.WindowAnchor.TOP |
        Astal.WindowAnchor.RIGHT;
      break;
    case ScreenSide.BOTTOM:
      Astal.WindowAnchor.RIGHT |
        Astal.WindowAnchor.BOTTOM |
        Astal.WindowAnchor.LEFT;
      break;
    default:
  }

  const name: string = `sidebar-${sideBarProps.screenSide}`;
  const layer: Astal.Layer = Astal.Layer.TOP;
  print("Sidebar name:", name);

  return (
    <PopupWindow
      name={name}
      cssName={props.cssName}
      layer={layer}
      visible={bind(isVisible).as((v) => v)}
      keymode={keymode}
      anchor={anchor}
      {...props}
    >
      {child}
    </PopupWindow>
  );
}
