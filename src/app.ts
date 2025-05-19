import Astal from "gi://Astal";
import Gtk from "gi://Gtk?version=4.0";
import Gdk from "gi://Gdk?version=4.0";
const { App } = Astal;
// import { cycleMode, initialMonitorShellModes } from "./widget/bar/utils";
import "../style.scss";
// import iconStyles from "./node_modules/@phosphor-icons/web/src/regular/style.css";
import Bar from "./widget/bar";
import { BarMode } from "./widget/bar/types";
// import SideLeft from "./widget/sidebar/views/left";
// import SideRight from "./widget/sidebar/views/right";
// import SystemOverlays from "./widget/overlays";
// import cliRequestHandler from "./handlers/cli";
// import LauncherBar from "./widget/launcher";
// import {
//   BarCornerTopLeft,
//   BarCornerTopRight,
// } from "./widget/bar/utils/bar-corners";

// Init shell modes for all active monitors
// initialMonitorShellModes();

App.start({
  css: "", // Styles are imported directly
  main() {
    // Windows
    App.get_monitors().map((gdkmonitor, index) =>
      Bar({ gdkmonitor: gdkmonitor, index, mode: BarMode.Normal }),
    );

    // App.get_monitors().map((gdkmonitor, index, array) =>
    // SystemOverlays({ gdkmonitor: gdkmonitor, monitor: index }),
    // );

    // LauncherBar({ gdkmonitor: App.get_monitors()[0], monitor: 0 });

    // SideLeft({ gdkmonitor: App.get_monitors()[0] });
    // SideRight({ gdkmonitor: App.get_monitors()[0] });

    //Draws edges on corners
    // BarCornerTopLeft({ gdkmonitor: App.get_monitors()[0], index: 0 });
    // BarCornerTopRight({ gdkmonitor: App.get_monitors()[0], index: 0 });
    // App.get_monitors().map((gdkmonitor, index, array) =>
    //   // BarCornerTopLeft({ gdkmonitor: gdkmonitor, index }),
    // );
    // App.get_monitors().map((gdkmonitor, index, array) =>
    //   BarCornerTopRight({ gdkmonitor: gdkmonitor, index }),
    // );
  },
  // requestHandler(request: string, res: (response: any) => void) {
  //   cliRequestHandler(request, res);
  // },
});
