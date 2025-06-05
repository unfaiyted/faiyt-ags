import { App } from "astal/gtk4";
import { initialMonitorShellModes } from "./widget/bar/utils";
import appCSS from "./app.scss";
// import iconStyles from "./node_modules/@phosphor-icons/web/src/regular/style.css";
import Bar from "./widget/bar";
import { BarMode } from "./widget/bar/types";
import SideLeft from "./widget/sidebar/views/left";
import SideRight from "./widget/sidebar/views/right";
import PopupNotificationsWindow from "./widget/overlays/popup-notifications-window";
import IndicatorsWindow from "./widget/overlays/indicators-window";
import MusicWindow from "./widget/overlays/music-window";
import cliRequestHandler from "./handlers/cli";
import LauncherBar from "./widget/launcher";
import {
  BarCornerTopLeft,
  BarCornerTopRight,
} from "./widget/bar/utils/bar-corners";
import { systemLogger, log, setLogLevel, LogLevel } from "./utils/logger";
import { logSystemInfo } from "./services/logger";
import "./services/clipboard-manager"; // Initialize clipboard manager
import windowManager from "./services/window-manager";
import configManager from "./services/config-manager"; // Initialize config manager
import SettingsWindow from "./widget/settings";
import MonitorsWindow from "./widget/settings/monitors";

// Set log level from environment or default to info
import { GLib } from "astal";
setLogLevel(GLib.getenv("LOG_LEVEL") || LogLevel.INFO);

// Ensure ConfigManager is initialized
log.info("Initializing ConfigManager");
const configInstance = configManager; // This will trigger the singleton initialization

// Init shell modes for all active monitors
initialMonitorShellModes();

App.start({
  css: appCSS,
  main() {
    const timer = systemLogger.time("App Initialization");

    // Log system info on startup
    log.info("AGS Application Starting");
    logSystemInfo();
    
    // Start window manager service
    try {
      windowManager.start();
      log.info("Window Manager service started");
    } catch (error) {
      log.error("Failed to start Window Manager service", { error });
    }

    // Windows
    const monitors = App.get_monitors();
    log.info(`Found ${monitors.length} monitors`);

    monitors.map((gdkmonitor, index) => {
      log.debug(`Setting up widgets for monitor ${index}`);

      try {
        // Top bars
        Bar({ gdkmonitor: gdkmonitor, index, mode: BarMode.Normal });
        BarCornerTopLeft({ gdkmonitor: gdkmonitor, index });
        BarCornerTopRight({ gdkmonitor: gdkmonitor, index });

        // Side windows
        SideRight({ gdkmonitor: gdkmonitor, monitorIndex: index });
        SideLeft({ gdkmonitor: gdkmonitor, monitorIndex: index });

        // Launcher bar
        LauncherBar({ gdkmonitor, monitorIndex: index });

        // Overlay windows
        PopupNotificationsWindow({ gdkmonitor: gdkmonitor, monitor: index });
        IndicatorsWindow({ gdkmonitor: gdkmonitor, monitor: index });
        MusicWindow({ gdkmonitor: gdkmonitor, monitor: index });
        
        // Settings window
        SettingsWindow({ gdkmonitor: gdkmonitor, monitor: index });
        
        // Monitors window
        MonitorsWindow({ gdkmonitor: gdkmonitor, monitor: index });

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
