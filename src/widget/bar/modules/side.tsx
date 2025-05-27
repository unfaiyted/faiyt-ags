import { Widget, Gtk, Gdk, Astal } from "astal/gtk4";
import { getScrollDirection } from "../../../utils";
// import { ClickButtonPressed } from "../../../types";
import { barLogger as log } from "../../../utils/logger";

export interface SideModuleProps extends Widget.BoxProps {
  onScrollUp?: () => void;
  onScrollDown?: () => void;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  onMiddleClick?: () => void;
}

export default function SideModule(sideModuleProps: SideModuleProps) {
  const { setup, child, children, ...props } = sideModuleProps;


  const handleScroll = (_self: Gtk.Box, dx: number, dy: number) => {
    const scrollDirection = getScrollDirection(dx, dy);

    if (scrollDirection === Gdk.ScrollDirection.UP) {
      log.debug("Scroll up detected");
      props.onScrollUp?.();
    } else if (scrollDirection === Gdk.ScrollDirection.DOWN) {
      log.debug("Scroll down detected");
      props.onScrollDown?.();
    }
  };

  const handleClick = () => {
    // 1 = left, 2 = middle, 3 = right
    // print("event.button: " + event.button);
    //
    // if (event.button === ClickButtonPressed.LEFT.valueOf()) {
    //   props.onPrimaryClick?.();
    // } else if (event.button === ClickButtonPressed.RIGHT.valueOf()) {
    //   props.onSecondaryClick?.();
    // } else if (event.button === ClickButtonPressed.MIDDLE.valueOf()) {
    //   props.onMiddleClick?.();
    // }
  };

  return (
    <box
      widthRequest={props.widthRequest}
      onScroll={handleScroll} >
      {/* <box homogeneous={false}> */}
      <box cssName="bar-sidemodule" hexpand={true}>
        {/* <box className="bar-corner-spacing" /> */}
        {/* <overlay> */}
        {/* <box hexpand={true} /> */}
        {/* <box className="bar-sidemodule" hexpand={true}> */}
        {/* <box className="bar-space-button" vertical={true}> */}
        {children || child}
        {/* </box> */}
        {/* </box> */}
        {/* </overlay> */}
      </box>
    </box>
  );
}
