import { Widget, Gtk } from "astal/gtk4";
import SideModule from "./side";
import { actions } from "../../../utils/actions";
import { UIWindows } from "../../../types";
import { barLogger as log } from "../../../utils/logger";
import { setupCursorHover } from "../../utils/buttons";

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

  log.debug("RightSideModule created", { monitorIndex: props.monitorIndex });

  const monitorSuffix = props.monitorIndex !== undefined ? `-${props.monitorIndex}` : '';
  const sideBarName: string = `sidebar-right${monitorSuffix}`;

  return (
    <box homogeneous={false}>
      <box
        valign={Gtk.Align.CENTER}
        halign={Gtk.Align.CENTER}
        cssName="bar-corner-spacing" />
      <box
        valign={Gtk.Align.CENTER}
        halign={Gtk.Align.CENTER}
        hexpand={true}>

        <SideModule

          halign={Gtk.Align.START}
          widthRequest={300}>
          <box vertical cssName="bar-space-button"
            halign={Gtk.Align.START}
          >
            {child}
          </box>
        </SideModule>
      </box>
      <button
        setup={setupCursorHover}
        widthRequest={12}
        onClicked={() => actions.window.toggle(sideBarName)}
        cssName="bar-sidemodule-btn" />
    </box >
  );
}
