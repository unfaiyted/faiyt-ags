import { Widget, Gtk } from "astal/gtk4";
import SideModule from "./side";
import { actions } from "../../../utils/actions";
import { UIWindows } from "../../../types";

export interface RightSideModuleProps extends Widget.BoxProps { }

export default function RightSideModule(
  rightSideModuleProps: RightSideModuleProps,
) {
  const { setup, child, ...props } = rightSideModuleProps;

  props.onScrollUp = () => actions.audio.increase();
  props.onScrollDown = () => actions.audio.decrease();
  props.onPrimaryClick = () => actions.window.toggle(UIWindows.SIDEBAR_RIGHT);

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
    </box >
  );
}
