import { App } from "astal/gtk4";
import { cycleMode, initialMonitorShellModes } from "./widget/bar/utils";
import appCSS from "./app.scss";
// import iconStyles from "./node_modules/@phosphor-icons/web/src/regular/style.css";
import Bar from "./widget/bar";
import { BarMode } from "./widget/bar/types";
// import SideLeft from "./widget/sidebar/views/left";
import SideRight from "./widget/sidebar/views/right";
import SystemOverlays from "./widget/overlays";
import cliRequestHandler from "./handlers/cli";
import LauncherBar from "./widget/launcher";
import {
  BarCornerTopLeft,
  BarCornerTopRight,
} from "./widget/bar/utils/bar-corners";

// Init shell modes for all active monitors
initialMonitorShellModes();

App.start({
  css: appCSS,
  main() {
    // Windows
    App.get_monitors().map((gdkmonitor, index) => {
      Bar({ gdkmonitor: gdkmonitor, index, mode: BarMode.Normal });
      SideRight({ gdkmonitor: gdkmonitor, monitorIndex: index });
      BarCornerTopLeft({ gdkmonitor: gdkmonitor, index });
      BarCornerTopRight({ gdkmonitor: gdkmonitor, index });
      SystemOverlays({ gdkmonitor: gdkmonitor, monitor: index });
    });
    LauncherBar({ gdkmonitor: App.get_monitors()[0], monitor: 0 });

    // SideLeft({ gdkmonitor: App.get_monitors()[0] });
  },
  requestHandler(request: string, res: (response: any) => void) {
    cliRequestHandler(request, res);
  },
});
