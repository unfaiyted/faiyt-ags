import { Widget } from "astal/gtk4";
import SideModule from "./side";
import { actions } from "../../../utils/actions";
import { UIWindows } from "../../../types";
import { setupCursorHover } from "../../utils/buttons";

export interface LeftSideModuleProps extends Widget.BoxProps {
  monitorIndex?: number;
}

export default function LeftSideModule(
  leftSideModuleProps: LeftSideModuleProps,
) {
  const { setup, child, ...props } = leftSideModuleProps;

  props.onScrollUp = () => actions.brightness.increase();
  props.onScrollDown = () => actions.brightness.decrease();
  props.onPrimaryClick = () => actions.window.toggle(UIWindows.SIDEBAR_LEFT);

  const monitorSuffix = props.monitorIndex !== undefined ? `-${props.monitorIndex}` : '';
  const sideBarName: string = `sidebar-left${monitorSuffix}`;


  return (
    <box homogeneous={false}

    >

      <button
        setup={setupCursorHover}
        widthRequest={12}
        onClicked={() => actions.window.toggle(sideBarName)}
        cssName="bar-sidemodule-btn" />
      <box cssName="bar-corner-spacing" />
      <box hexpand={true} >
        <SideModule widthRequest={300}>
          <box vertical cssName="bar-space-button">
            {child}
          </box>
        </SideModule>
      </box>
    </box>
  );
}
//
// <eventbox onScroll={handleScroll} onClicked={handleClick}>
//   {/* <box homogeneous={false}> */}
//   <box className="bar-sidemodule">
//     ,{/* <box className="bar-corner-spacing" /> */}
//     {/* <overlay> */}
//     {/* <box hexpand={true} /> */}
//     {/* <box className="bar-sidemodule" hexpand={true}> */}
//     {/* <box className="bar-space-button" vertical={true}> */}
//     {child}
//     {/* </box> */}
//     {/* </box> */}
//     {/* </overlay> */}
//   </box>
// </eventbox>;
