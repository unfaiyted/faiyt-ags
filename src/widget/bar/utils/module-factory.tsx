import { Widget } from "astal/gtk4";
import WindowTitle from "../modules/window-title";
import System from "../modules/system";
import Music from "../modules/music/index";
import Workspaces from "../modules/workspaces";
import Clock from "../modules/clock";
import Tray from "../modules/tray";
import Battery from "../modules/battery";
import Utilities from "../modules/utilities";
import Weather from "../modules/weather";
import StatusIndicators from "../modules/indicators";
import { createLogger } from "../../../utils/logger";
import { BarMode } from "../types";
import config from "../../../utils/config";

const log = createLogger('ModuleFactory');

export interface ModuleFactoryProps {
  monitorIndex?: number;
  gdkmonitor?: any;
  mode?: BarMode;
}

/**
 * Factory function to create bar modules based on their name
 */
export function createModule(moduleName: string, props: ModuleFactoryProps): Widget.Widget | null {
  switch (moduleName.toLowerCase()) {
    case "windowtitle":
      return <WindowTitle />;
    
    case "system":
      return <System />;
    
    case "music":
      return <Music monitorIndex={props.monitorIndex} />;
    
    case "workspaces":
      return <Workspaces
        mode={props.mode || BarMode.Normal}
        shown={config.workspaces.shown}
        initilized={false}
        gdkmonitor={props.gdkmonitor}
      />;
    
    case "clock":
      return <Clock />;
    
    case "tray":
      return <Tray />;
    
    case "battery":
      return <Battery />;
    
    case "utilities":
      return <Utilities />;
    
    case "weather":
      return <Weather />;
    
    case "statusindicators":
      return <StatusIndicators />;
    
    default:
      log.warn(`Unknown module: ${moduleName}`);
      return null;
  }
}

/**
 * Create multiple modules from a list of module names
 */
export function createModules(moduleNames: string[], props: ModuleFactoryProps): (Widget.Widget | null)[] {
  return moduleNames.map(name => createModule(name, props));
}