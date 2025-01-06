import config from "../../../utils/config";
import { BaseBarContentProps } from "./index";
import { Gtk } from "astal/gtk4";
import SideModule from "../modules/side";
import LeftModule from "../modules/left";
import RightModule from "../modules/right";
import { createModule, createModules } from "../utils/module-factory";
import { createLogger } from "../../../utils/logger";

const log = createLogger('NormalBarMode');

export interface NormalBarContentProps extends BaseBarContentProps {
  monitorIndex?: number;
}

export default function NormalBarMode(barModeProps: NormalBarContentProps) {
  const { setup, child, ...props } = barModeProps;
  
  // Get module configuration
  const moduleConfig = config.bar.modules;
  const moduleProps = {
    monitorIndex: props.monitorIndex,
    gdkmonitor: props.gdkmonitor,
    mode: props.mode
  };

  return (
    <centerbox
      hexpand={true}
      vexpand={false}
      halign={Gtk.Align.FILL}
      valign={Gtk.Align.START}
      heightRequest={40}
      startWidget={
        <LeftModule>
          {createModules(moduleConfig.left, moduleProps).filter(m => m !== null)}
        </LeftModule>
      }
      centerWidget={
        <box
          hexpand={true}
          vexpand={false}
          halign={Gtk.Align.CENTER}
        >
          <SideModule>
            {createModules(moduleConfig.center.left, moduleProps).filter(m => m !== null)}
          </SideModule>
          {createModules(moduleConfig.center.middle, moduleProps).filter(m => m !== null)}
          <SideModule>
            {createModules(moduleConfig.center.right, moduleProps).filter(m => m !== null)}
          </SideModule>
        </box>
      }
      endWidget={
        <RightModule monitorIndex={props.monitorIndex}>
          <box hexpand={true}
            spacing={4}
            vexpand={false}
            halign={Gtk.Align.START}
            valign={Gtk.Align.CENTER}>
            {createModules(moduleConfig.right, moduleProps).filter(m => m !== null)}
          </box>
        </RightModule>
      }
      cssName="bar-bg"
    ></centerbox>
  );
}
