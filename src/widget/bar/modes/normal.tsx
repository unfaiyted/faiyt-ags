import config from "../../../utils/config";
import { NormalBarContentProps } from "../types";
import WindowTitle from "../modules/window-title";
import SideModule from "../modules/side";
import System from "../modules/system";
import Music from "../modules/music/index";
import Workspaces from "../modules/workspaces";
import Clock from "../modules/clock";
import Tray from "../modules/tray";
import LeftModule from "../modules/left";
import RightModule from "../modules/right";
import Battery from "../modules/battery";
import Utilities from "../modules/utilities";
import Weather from "../modules/weather";
import StatusIndicators from "../modules/indicators";

export default function NormalBarMode(barModeProps: NormalBarContentProps) {
  const { setup, child, ...props } = barModeProps;

  return (
    <centerbox
      startWidget={
        <LeftModule>
          <WindowTitle />
        </LeftModule>
      }
      centerWidget={
        <box className="spacing-h-4">
          <SideModule>
            <System />
            <Music />
          </SideModule>
          <Workspaces
            mode={props.mode}
            shown={config.workspaces.shown}
            initilized={false}
          />
          <SideModule>
            <Clock />
            <Battery />
            <Utilities />
            <Weather />
          </SideModule>
        </box>
      }
      endWidget={
        <RightModule>
          <StatusIndicators />
          <Tray />
        </RightModule>
      }
      className="bar-bg"
    ></centerbox>
  );
}
