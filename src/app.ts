import { App } from "astal/gtk4";
import { cycleMode, initialMonitorShellModes } from "./widget/bar/utils";
import appCSS from "./app.scss";
// import iconStyles from "./node_modules/@phosphor-icons/web/src/regular/style.css";
import Bar from "./widget/bar";
import { BarMode } from "./widget/bar/types";
import SideLeft from "./widget/sidebar/views/left";
import SideRight from "./widget/sidebar/views/right";
import PopupNotificationsWindow from "./widget/overlays/popup-notifications-window";
import IndicatorsWindow from "./widget/overlays/indicators-window";
import cliRequestHandler from "./handlers/cli";
import LauncherBar from "./widget/launcher";
import {
  BarCornerTopLeft,
  BarCornerTopRight,
} from "./widget/bar/utils/bar-corners";
import { systemLogger, log, setLogLevel, LogLevel } from "./utils/logger";
import { logSystemInfo } from "./services/logger";

// Set log level from environment or default to info
import { GLib } from "astal";
setLogLevel(GLib.getenv("LOG_LEVEL") || LogLevel.DEBUG);

// Init shell modes for all active monitors
initialMonitorShellModes();

App.start({
  css: appCSS,
  main() {
    const timer = systemLogger.time("App Initialization");

    // Log system info on startup
    log.info("AGS Application Starting");
    logSystemInfo();

    // Windows
    const monitors = App.get_monitors();
    log.info(`Found ${monitors.length} monitors`);

    monitors.map((gdkmonitor, index) => {
      log.debug(`Setting up widgets for monitor ${index}`);

      try {
        Bar({ gdkmonitor: gdkmonitor, index, mode: BarMode.Normal });
        BarCornerTopLeft({ gdkmonitor: gdkmonitor, index });
        BarCornerTopRight({ gdkmonitor: gdkmonitor, index });

        SideRight({ gdkmonitor: gdkmonitor, monitorIndex: index });
        SideLeft({ gdkmonitor: gdkmonitor, monitorIndex: index });
        PopupNotificationsWindow({ gdkmonitor: gdkmonitor, monitor: index });
        IndicatorsWindow({ gdkmonitor: gdkmonitor, monitor: index });
        LauncherBar({ gdkmonitor, monitorIndex: index });

        log.info(`Monitor ${index} setup complete`);
      } catch (error) {
        // Pass the error object directly to leverage source mapping
        if (error instanceof Error) {
          log.error(error, { monitor: index });
        } else {
          log.error(`Failed to setup monitor ${index}`, {
            error: String(error),
          });
        }
      }
    });

    timer.end("All widgets initialized");
  },
  requestHandler(request: string, res: (response: any) => void) {
    log.debug("CLI request received", { request });
    cliRequestHandler(request, res);
  },
});
