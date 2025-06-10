import { App, Astal, Gtk, Gdk, Widget } from "astal/gtk4";
import { Variable, bind } from "astal";
import { exec, execAsync } from "astal/process";
import GLib from "gi://GLib";
import Gio from "gi://Gio";
import { ConfigManager } from "../../services/config-manager";
import { createLogger } from "../../utils/logger";

const log = createLogger("DesktopWallpaper");

interface WallpaperWindowProps extends Widget.WindowProps {
  gdkmonitor: Gdk.Monitor;
  monitor: number;
}

interface WallpaperItem {
  path: string;
  name: string;
  thumbnail?: string;
}

const WALLPAPERS_PER_PAGE = 5;
const THUMBNAIL_SIZE = 200;
const ANIMATION_DURATION = 300;

export default function DesktopWallpaperWindow(props: WallpaperWindowProps) {
  const { gdkmonitor, monitor } = props;
  const configManager = ConfigManager.getInstance();

  // State variables
  const wallpapers = Variable<WallpaperItem[]>([]);
  const currentPage = Variable(0);
  const selectedIndex = Variable(0);
  const isAnimating = Variable(false);

  // Computed page indicator
  const pageIndicator = Variable.derive(
    [wallpapers, currentPage],
    (items, page) => {
      const totalPages = Math.ceil(items.length / WALLPAPERS_PER_PAGE);
      return totalPages > 0 ? `Page ${page + 1} of ${totalPages}` : "No wallpapers";
    }
  );

  // Computed page items
  const pageItems = Variable.derive(
    [wallpapers, currentPage],
    (items, page) => {
      const startIdx = page * WALLPAPERS_PER_PAGE;
      return items.slice(startIdx, startIdx + WALLPAPERS_PER_PAGE);
    }
  );

  // Get wallpaper directory from config
  const wallpaperDir = configManager.getValue("wallpaper.directory") as string;
  const supportedFormats = configManager.getValue("wallpaper.supportedFormats") as string[];
  const sortBy = configManager.getValue("wallpaper.sortBy") as string;

  // Load wallpapers from directory
  const loadWallpapers = async () => {
    try {
      const dir = Gio.File.new_for_path(wallpaperDir);
      if (!dir.query_exists(null)) {
        log.warn(`Wallpaper directory does not exist: ${wallpaperDir}`);
        return;
      }

      const enumerator = dir.enumerate_children(
        "standard::*",
        Gio.FileQueryInfoFlags.NONE,
        null
      );

      const items: WallpaperItem[] = [];
      let fileInfo;

      while ((fileInfo = enumerator.next_file(null)) !== null) {
        const fileName = fileInfo.get_name();
        const extension = fileName.split('.').pop()?.toLowerCase();

        if (extension && supportedFormats.includes(extension)) {
          items.push({
            path: GLib.build_filenamev([wallpaperDir, fileName]),
            name: fileName,
          });
        }
      }

      // Sort wallpapers
      if (sortBy === "name") {
        items.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy === "date") {
        // TODO: Implement date sorting
      } else if (sortBy === "random") {
        items.sort(() => Math.random() - 0.5);
      }

      wallpapers.set(items);
      log.info(`Loaded ${items.length} wallpapers from ${wallpaperDir}`);
    } catch (error) {
      log.error("Failed to load wallpapers", error);
    }
  };

  // Set wallpaper using swaybg or swww
  const setWallpaper = async (wallpaperPath: string) => {
    try {
      // Get monitor name from Hyprland
      const monitorsOutput = await execAsync(["hyprctl", "monitors", "-j"]);
      const monitors = JSON.parse(monitorsOutput);
      const currentMonitor = monitors.find((m: any) => m.id === monitor);
      const monitorName = currentMonitor?.name || "eDP-1";
      
      log.info(`Setting wallpaper for monitor ${monitorName} (id: ${monitor})`);
      
      // First, let's check if swww is available and initialized
      try {
        await execAsync(["pgrep", "swww-daemon"]);
        // If swww is running, use it (it's more modern and feature-rich)
        await execAsync(["swww", "img", wallpaperPath, "-o", monitorName, "--transition-type", "fade", "--transition-duration", "0.5"]);
        log.info(`Set wallpaper using swww: ${wallpaperPath} on ${monitorName}`);
        return;
      } catch (e) {
        // swww not running, try to initialize it
        try {
          await execAsync(["swww", "init"]);
          // Wait a bit for daemon to start
          await new Promise(resolve => setTimeout(resolve, 500));
          await execAsync(["swww", "img", wallpaperPath, "-o", monitorName, "--transition-type", "fade", "--transition-duration", "0.5"]);
          log.info(`Initialized swww and set wallpaper: ${wallpaperPath} on ${monitorName}`);
          return;
        } catch (e2) {
          log.info("swww not available, falling back to swaybg");
        }
      }
      
      // Fallback to swaybg
      // Kill any existing swaybg processes for this output
      try {
        await execAsync(["pkill", "-f", `swaybg.*-o ${monitorName}`]);
      } catch (e) {
        // Ignore if no swaybg process exists
      }
      
      // Start swaybg with the new wallpaper for specific output
      execAsync(["swaybg", "-o", monitorName, "-i", wallpaperPath, "-m", "fill"]).catch(err => {
        log.error("Failed to start swaybg", err);
      });
      
      log.info(`Set wallpaper using swaybg: ${wallpaperPath} on ${monitorName}`);
    } catch (error) {
      log.error("Failed to set wallpaper", error);
    }
  };

  // Navigate carousel
  const navigateLeft = () => {
    if (isAnimating.get()) return;

    const totalPages = Math.ceil(wallpapers.get().length / WALLPAPERS_PER_PAGE);
    const newPage = currentPage.get() > 0 ? currentPage.get() - 1 : totalPages - 1;

    isAnimating.set(true);
    currentPage.set(newPage);

    setTimeout(() => {
      isAnimating.set(false);
    }, ANIMATION_DURATION);
  };

  const navigateRight = () => {
    if (isAnimating.get()) return;

    const totalPages = Math.ceil(wallpapers.get().length / WALLPAPERS_PER_PAGE);
    const newPage = currentPage.get() < totalPages - 1 ? currentPage.get() + 1 : 0;

    isAnimating.set(true);
    currentPage.set(newPage);

    setTimeout(() => {
      isAnimating.set(false);
    }, ANIMATION_DURATION);
  };

  // Create wallpaper item widget
  const WallpaperItem = ({ item, index }: { item: WallpaperItem; index: number }) => {
    const isSelected = bind(selectedIndex).as(idx => idx === index);

    return (
      <button
        cssClasses={bind(isSelected).as(selected =>
          ["wallpaper-item", selected ? "selected" : ""].filter(Boolean)
        )}
        onClicked={() => {
          selectedIndex.set(index);
          setWallpaper(item.path);
        }}
      >
        <box orientation={Gtk.Orientation.VERTICAL} spacing={8}>
          <image
            file={item.path}
            widthRequest={THUMBNAIL_SIZE}
            heightRequest={THUMBNAIL_SIZE}
            cssName="wallpaper-thumbnail"
          />
          {bind(isSelected).as(selected => selected && (
            <box
              cssName="wallpaper-selected-indicator"
              halign={Gtk.Align.CENTER}
              valign={Gtk.Align.CENTER}
            >
              <image iconName="object-select-symbolic" pixelSize={48} />
            </box>
          ))}
        </box>
      </button>
    );
  };


  return (
    <window
      {...props}
      name={`desktop-wallpaper-${monitor}`}
      gdkmonitor={gdkmonitor}
      layer={Astal.Layer.OVERLAY}
      anchor={Astal.WindowAnchor.BOTTOM}
      application={App}
      visible={false}
      cssName="desktop-wallpaper-window"
      keymode={Astal.Keymode.ON_DEMAND}
      exclusivity={Astal.Exclusivity.NORMAL}
      onKeyPressed={(self, keyval, keycode, state) => {
        switch (keyval) {
          case Gdk.KEY_Return:
          case Gdk.KEY_KP_Enter:
            setWallpaper(pageItems.get()[selectedIndex.get()].path);
            break;
          case Gdk.KEY_Escape:
            self.visible = false;
            break;
          case Gdk.KEY_Left:
            navigateLeft();
            break;
          case Gdk.KEY_Right:
            navigateRight();
            break;
        }
      }}
      setup={(self) => {
        // Load wallpapers when window is first shown
        self.connect("show", () => {
          loadWallpapers();
        });
      }}
    >
      <box
        cssName="desktop-wallpaper-container"
        orientation={Gtk.Orientation.VERTICAL}
        spacing={16}
      >
        <box cssName="wallpaper-header" spacing={12}>
          <label label="Desktop Wallpapers" cssName="wallpaper-title" />
          <box hexpand />
          <button
            cssName="wallpaper-close-btn"
            onClicked={() => {
              const window = App.get_window(`desktop-wallpaper-${monitor}`);
              if (window) window.visible = false;
            }}
          >
            <image iconName="window-close-symbolic" pixelSize={16} />
          </button>
        </box>

        <box cssName="wallpaper-carousel" spacing={12}>
          <button
            cssName="carousel-nav-btn"
            onClicked={navigateLeft}
            sensitive={bind(wallpapers).as(w => w.length > WALLPAPERS_PER_PAGE)}
          >
            <image iconName="go-previous-symbolic" pixelSize={24} />
          </button>

          <box
            cssName="wallpaper-items"
            spacing={12}
            homogeneous
          >
            {bind(pageItems).as(items => {
              const startIdx = currentPage.get() * WALLPAPERS_PER_PAGE;
              return items.map((item, idx) => (
                <WallpaperItem
                  item={item}
                  index={startIdx + idx}
                />
              ));
            })}
          </box>

          <button
            cssName="carousel-nav-btn"
            onClicked={navigateRight}
            sensitive={bind(wallpapers).as(w => w.length > WALLPAPERS_PER_PAGE)}
          >
            <image iconName="go-next-symbolic" pixelSize={24} />
          </button>
        </box>

        <box cssName="wallpaper-footer" spacing={8}>
          <label
            label={bind(pageIndicator)}
            cssName="page-indicator"
          />
        </box>
      </box>
    </window>
  );
}
