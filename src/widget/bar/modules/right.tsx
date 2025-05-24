import { Widget, Gtk } from "astal/gtk4";
import SideModule from "./side";
import { actions } from "../../../utils/actions";
import { UIWindows } from "../../../types";

export interface RightSideModuleProps extends Widget.BoxProps {

  monitorIndex?: number;
}

export default function RightSideModule(
  rightSideModuleProps: RightSideModuleProps,
) {
  const { setup, child, ...props } = rightSideModuleProps;

  props.onScrollUp = () => actions.audio.increase();
  props.onScrollDown = () => actions.audio.decrease();
  props.onPrimaryClick = () => actions.window.toggle(UIWindows.SIDEBAR_RIGHT);

  print("RightSideModule - Monitor Index:", props.monitorIndex);

  const monitorSuffix = props.monitorIndex !== undefined ? `-${props.monitorIndex}` : '';
  const sideBarName: string = `sidebar-right${monitorSuffix}`;

  return (
    <box homogeneous={false}>
      <box
        valign={Gtk.Align.CENTER}
        halign={Gtk.Align.CENTER}
        cssName="bar-corner-spacing" />
      <overlay>
        <box
          valign={Gtk.Align.CENTER}
          halign={Gtk.Align.CENTER}
          hexpand={true}>

          <SideModule>
            <box vertical cssName="bar-space-button">
              {child}
            </box>
          </SideModule>
        </box>
      </overlay >
      <button onClicked={() => actions.window.toggle(sideBarName)}>
      </button>
    </box >
  );
}
