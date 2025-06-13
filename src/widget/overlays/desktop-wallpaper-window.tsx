import { App, Astal, Gtk, Gdk, Widget } from "astal/gtk4";
import { Variable, bind } from "astal";
import { execAsync } from "astal/process";
import GLib from "gi://GLib";
import Gio from "gi://Gio";
import GdkPixbuf from "gi://GdkPixbuf";
import { ConfigManager } from "../../services/config-manager";
import { DrawingArea } from "../utils/containers/drawing-area";
import { createLogger } from "../../utils/logger";
import { WallpaperThumbnailService } from "../../services/wallpaper-thumbnail-service";
import KeyboardShortcut from "../utils/keyboard-shortcut";

const log = createLogger("DesktopWallpaper");

interface WallpaperWindowProps extends Widget.WindowProps {
  gdkmonitor: Gdk.Monitor;
  monitor: number;
}

interface WallpaperItem {
  path: string;
  name: string;
  thumbnail?: string;
  pixbuf?: GdkPixbuf.Pixbuf | null;
  isLoaded?: boolean;
}

// Get values from config service
const configManager = ConfigManager.getInstance();
const WALLPAPERS_PER_PAGE = configManager.getValue("wallpaper.itemsPerPage") as number;
const THUMBNAIL_SIZE = configManager.getValue("wallpaper.thumbnailSize") as number;
const ANIMATION_DURATION = configManager.getValue("wallpaper.animationDuration") as number;
const WIN_ACTIVE_OPACITY = configManager.getValue("wallpaper.winActiveOpacity") as number;
const WIN_INACTIVE_OPACITY = configManager.getValue("wallpaper.winInactiveOpacity") as number;

export default function DesktopWallpaperWindow(props: WallpaperWindowProps) {
  const { gdkmonitor, monitor } = props;

  // State variables
  const wallpapers = Variable<WallpaperItem[]>([]);
  const currentPage = Variable(0);
  const selectedIndex = Variable(0);
  const isAnimating = Variable(false);

  // Thumbnail service
  const thumbnailService = WallpaperThumbnailService.getInstance();

  // Store original opacity values
  let originalActiveOpacity: number | null = null;
  let originalInactiveOpacity: number | null = null;

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

  // Hyprland opacity management
  const setHyprlandOpacity = async (activeOpacity: number, inactiveOpacity: number) => {
    try {
      // Set active window opacity
      await execAsync([
        "hyprctl", "keyword", "decoration:active_opacity", activeOpacity.toString()
      ]);

      // Set inactive window opacity
      await execAsync([
        "hyprctl", "keyword", "decoration:inactive_opacity", inactiveOpacity.toString()
      ]);

      log.info(`Set Hyprland opacity - active: ${activeOpacity}, inactive: ${inactiveOpacity}`);
    } catch (error) {
      log.error("Failed to set Hyprland opacity", error);
    }
  };

  const saveOriginalOpacity = async () => {
    try {
      // Get current Hyprland config
      const decorations = await execAsync(["hyprctl", "getoption", "decoration:active_opacity"]);
      const inactiveDecorations = await execAsync(["hyprctl", "getoption", "decoration:inactive_opacity"]);

      // Parse the output to get the float value
      const activeMatch = decorations.match(/float:\s*([\d.]+)/);
      const inactiveMatch = inactiveDecorations.match(/float:\s*([\d.]+)/);

      if (activeMatch) {
        originalActiveOpacity = parseFloat(activeMatch[1]);
      }
      if (inactiveMatch) {
        originalInactiveOpacity = parseFloat(inactiveMatch[1]);
      }

      log.info(`Saved original opacity - active: ${originalActiveOpacity}, inactive: ${originalInactiveOpacity}`);
    } catch (error) {
      log.error("Failed to get original opacity", error);
      // Set defaults if we can't get the values
      originalActiveOpacity = 1.0;
      originalInactiveOpacity = 1.0;
    }
  };

  const applyWallpaperModeOpacity = async () => {
    await setHyprlandOpacity(WIN_ACTIVE_OPACITY, WIN_INACTIVE_OPACITY);
  };

  const restoreOriginalOpacity = async () => {
    if (originalActiveOpacity !== null && originalInactiveOpacity !== null) {
      await setHyprlandOpacity(originalActiveOpacity, originalInactiveOpacity);
    }
  };



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

      // Initialize selected index to first wallpaper of current page
      if (items.length > 0 && selectedIndex.get() === 0) {
        const pageStart = currentPage.get() * WALLPAPERS_PER_PAGE;
        selectedIndex.set(pageStart);
      }
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
        // Use --resize crop to ensure the image fills the screen
        await execAsync(["swww", "img", wallpaperPath, "-o", monitorName, "--transition-type", "fade", "--transition-duration", "0.5", "--resize", "crop"]);
        log.info(`Set wallpaper using swww: ${wallpaperPath} on ${monitorName}`);
        return;
      } catch (e) {
        // swww not running, try to initialize it
        try {
          await execAsync(["swww", "init"]);
          // Wait a bit for daemon to start
          await new Promise(resolve => setTimeout(resolve, 500));
          await execAsync(["swww", "img", wallpaperPath, "-o", monitorName, "--transition-type", "fade", "--transition-duration", "0.5", "--resize", "crop"]);
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
      // Use "stretch" mode to ensure the image fills the entire screen
      execAsync(["swaybg", "-o", monitorName, "-i", wallpaperPath, "-m", "stretch"]).catch(err => {
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

    // Update selected index to last item of new page (coming from right)
    const newPageStartIdx = newPage * WALLPAPERS_PER_PAGE;
    const newPageItems = wallpapers.get().slice(newPageStartIdx, newPageStartIdx + WALLPAPERS_PER_PAGE);
    const lastItemIdx = newPageStartIdx + newPageItems.length - 1;
    selectedIndex.set(lastItemIdx);

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

    // Update selected index to first item of new page (coming from left)
    const newPageStartIdx = newPage * WALLPAPERS_PER_PAGE;
    selectedIndex.set(newPageStartIdx);

    setTimeout(() => {
      isAnimating.set(false);
    }, ANIMATION_DURATION);
  };

  // Fast thumbnail component using pre-generated thumbnails
  const FastThumbnail = ({ path }: { path: string }) => {
    const width = Math.round(THUMBNAIL_SIZE * 16 / 9);
    const height = THUMBNAIL_SIZE;
    const radius = 14;
    const thumbnailPath = thumbnailService.getThumbnailForWallpaper(path);

    return (
      <DrawingArea
        cssClasses={["wallpaper-image"]}
        widthRequest={width}
        heightRequest={height}
        setup={(self) => {
          let pixbuf: GdkPixbuf.Pixbuf | null = null;
          let loadAttempted = false;

          const drawFunc = () => {
            self.set_draw_func((widget, cr) => {
              const allocation = widget.get_allocation();
              const w = allocation.width;
              const h = allocation.height;

              // Create rounded rectangle path
              const degrees = Math.PI / 180.0;

              cr.newSubPath();
              cr.arc(w - radius, radius, radius, -90 * degrees, 0 * degrees);
              cr.arc(w - radius, h - radius, radius, 0 * degrees, 90 * degrees);
              cr.arc(radius, h - radius, radius, 90 * degrees, 180 * degrees);
              cr.arc(radius, radius, radius, 180 * degrees, 270 * degrees);
              cr.closePath();

              // Clip to the rounded rectangle
              cr.clip();

              // Try to load the thumbnail if not already loaded
              if (!pixbuf && thumbnailPath && !loadAttempted) {
                loadAttempted = true;
                try {
                  pixbuf = GdkPixbuf.Pixbuf.new_from_file(thumbnailPath);
                  if (pixbuf) {
                    self.queue_draw();
                  }
                } catch (error) {
                  log.error(`Failed to load thumbnail: ${thumbnailPath}`, error);
                }
              }

              if (pixbuf) {
                // Center the image
                const pixbufWidth = pixbuf.get_width();
                const pixbufHeight = pixbuf.get_height();
                const offsetX = (w - pixbufWidth) / 2;
                const offsetY = (h - pixbufHeight) / 2;

                Gdk.cairo_set_source_pixbuf(cr, pixbuf, offsetX, offsetY);
                cr.paint();
              } else {
                // Draw loading state
                cr.setSourceRGBA(0.3, 0.3, 0.3, 0.5);
                cr.paint();

                // Check for thumbnail availability periodically
                if (!thumbnailPath) {
                  setTimeout(() => {
                    const newPath = thumbnailService.getThumbnailForWallpaper(path);
                    if (newPath) {
                      loadAttempted = false;
                      self.queue_draw();
                    }
                  }, 500);
                }
              }

              return true;
            });
          };

          drawFunc();
        }}
      />
    );
  };

  // Create wallpaper item widget
  const WallpaperItem = ({ item, index }: { item: WallpaperItem; index: number }) => {
    const isSelected = bind(selectedIndex).as(idx => idx === index);

    return (
      <button
        marginBottom={0}
        marginEnd={0}
        marginStart={0}
        marginTop={0}
        cssName="wallpaper-item"
        cssClasses={bind(isSelected).as(selected =>
          ["wallpaper-item", selected ? "selected" : ""].filter(Boolean)
        )}
        onClicked={() => {
          selectedIndex.set(index);
          setWallpaper(item.path);
        }}
        onKeyPressed={(self, keyval, keycode, state) => {
          if (keyval === Gdk.KEY_Return || keyval === Gdk.KEY_KP_Enter) {
            selectedIndex.set(index);
            setWallpaper(item.path);
          }
        }}
        setup={(self) => {
          // Focus the button when it becomes selected
          isSelected.subscribe((selected) => {
            if (selected && self.get_mapped()) {
              self.grab_focus();
            }
          });
        }}
      >
        <box
          overflow={Gtk.Overflow.HIDDEN}
          orientation={Gtk.Orientation.VERTICAL}
          cssName="wallpaper-thumbnail-container">

          <FastThumbnail path={item.path} />

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
      marginBottom={10}
      keymode={Astal.Keymode.ON_DEMAND}
      exclusivity={Astal.Exclusivity.NORMAL}
      onKeyPressed={(self, keyval, keycode, state) => {
        const isCtrl = (state & Gdk.ModifierType.CONTROL_MASK) !== 0;
        const currentPageItems = pageItems.get();
        const currentIdx = selectedIndex.get();
        const pageStartIdx = currentPage.get() * WALLPAPERS_PER_PAGE;

        switch (keyval) {
          // case Gdk.KEY_Return:
          // case Gdk.KEY_KP_Enter:
          //   // Get the actual wallpaper based on the selected index
          //   const selectedWallpaper = wallpapers.get()[currentIdx];
          //   if (selectedWallpaper) {
          //     setWallpaper(selectedWallpaper.path);
          //   }
          //   break;
          case Gdk.KEY_Escape:
            self.visible = false;
            break;
          case Gdk.KEY_Left:
            navigateLeft();
            break;
          case Gdk.KEY_Right:
            navigateRight();
            break;
          case Gdk.KEY_h:
            if (isCtrl) {
              // Ctrl+h - previous page
              navigateLeft();
            } else {
              // h - previous wallpaper
              if (currentIdx > 0) {
                selectedIndex.set(currentIdx - 1);
                // Check if we need to go to previous page
                if (currentIdx - 1 < pageStartIdx && currentPage.get() > 0) {
                  navigateLeft();
                }
              } else if (wallpapers.get().length > 0) {
                // Wrap to last wallpaper
                selectedIndex.set(wallpapers.get().length - 1);
                const lastPage = Math.floor((wallpapers.get().length - 1) / WALLPAPERS_PER_PAGE);
                if (currentPage.get() !== lastPage) {
                  currentPage.set(lastPage);
                }
              }
            }
            break;
          case Gdk.KEY_l:
            if (isCtrl) {
              // Ctrl+l - next page
              navigateRight();
            } else {
              // l - next wallpaper
              if (currentIdx < wallpapers.get().length - 1) {
                selectedIndex.set(currentIdx + 1);
                // Check if we need to go to next page
                if (currentIdx + 1 >= pageStartIdx + WALLPAPERS_PER_PAGE &&
                  currentPage.get() < Math.ceil(wallpapers.get().length / WALLPAPERS_PER_PAGE) - 1) {
                  navigateRight();
                }
              } else if (wallpapers.get().length > 0) {
                // Wrap to first wallpaper
                selectedIndex.set(0);
                if (currentPage.get() !== 0) {
                  currentPage.set(0);
                  setTimeout(() => {
                    // preloadCurrentPage();
                    // preloadNextPage();
                  }, 50);
                }
              }
            }
            break;
          case Gdk.KEY_j:
            // j - move down in grid (next row)
            // Since we display horizontally, this acts like moving to next item
            if (currentIdx < wallpapers.get().length - 1) {
              selectedIndex.set(currentIdx + 1);
              if (currentIdx + 1 >= pageStartIdx + WALLPAPERS_PER_PAGE &&
                currentPage.get() < Math.ceil(wallpapers.get().length / WALLPAPERS_PER_PAGE) - 1) {
                navigateRight();
              }
            } else if (wallpapers.get().length > 0) {
              // Wrap to first wallpaper
              selectedIndex.set(0);
              if (currentPage.get() !== 0) {
                currentPage.set(0);
                setTimeout(() => {
                  // preloadCurrentPage();
                  // preloadNextPage();
                }, 50);
              }
            }
            break;
          case Gdk.KEY_k:
            // k - move up in grid (previous row)
            // Since we display horizontally, this acts like moving to previous item
            if (currentIdx > 0) {
              selectedIndex.set(currentIdx - 1);
              if (currentIdx - 1 < pageStartIdx && currentPage.get() > 0) {
                navigateLeft();
              }
            } else if (wallpapers.get().length > 0) {
              // Wrap to last wallpaper
              selectedIndex.set(wallpapers.get().length - 1);
              const lastPage = Math.floor((wallpapers.get().length - 1) / WALLPAPERS_PER_PAGE);
              if (currentPage.get() !== lastPage) {
                currentPage.set(lastPage);
                setTimeout(() => {
                  // preloadCurrentPage();
                  // preloadNextPage();
                }, 50);
              }
            }
            break;
          case Gdk.KEY_g:
            // gg - go to first wallpaper (press g twice)
            // For simplicity, single g goes to first
            selectedIndex.set(0);
            if (currentPage.get() !== 0) {
              currentPage.set(0);
              setTimeout(() => {
                // preloadCurrentPage();
                // preloadNextPage();
              }, 50);
            }
            break;
          case Gdk.KEY_G:
            // G - go to last wallpaper
            if (wallpapers.get().length > 0) {
              selectedIndex.set(wallpapers.get().length - 1);
              const lastPage = Math.floor((wallpapers.get().length - 1) / WALLPAPERS_PER_PAGE);
              if (currentPage.get() !== lastPage) {
                currentPage.set(lastPage);
                setTimeout(() => {
                  // preloadCurrentPage();
                  // preloadNextPage();
                }, 50);
              }
            }
            break;
          case Gdk.KEY_space:
            // Space - apply current wallpaper
            const spaceSelectedWallpaper = wallpapers.get()[currentIdx];
            if (spaceSelectedWallpaper) {
              setWallpaper(spaceSelectedWallpaper.path);
            }
            break;
        }
      }}
      setup={(self) => {
        // Load wallpapers when window is first shown
        self.connect("show", async () => {
          // Save original opacity and apply wallpaper mode opacity
          await saveOriginalOpacity();
          await applyWallpaperModeOpacity();

          loadWallpapers();
        });

        // Restore opacity when window is hidden
        self.connect("hide", async () => {
          await restoreOriginalOpacity();
        });
      }}
    >
      <box
        cssName="desktop-wallpaper-container"
        orientation={Gtk.Orientation.VERTICAL}
        spacing={8}
      >
        <box cssName="wallpaper-header" overflow={Gtk.Overflow.HIDDEN} spacing={12}>
          {/* <label label="Desktop Wallpapers" cssName="wallpaper-title" /> */}
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

        <box cssName="wallpaper-carousel" spacing={8}>
          <button
            cssName="carousel-nav-btn"
            onClicked={navigateLeft}
            sensitive={bind(wallpapers).as(w => w.length > WALLPAPERS_PER_PAGE)}
          >
            <image iconName="go-previous-symbolic" pixelSize={24} />
          </button>

          <box
            cssName="wallpaper-items"
            spacing={8}
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

        <box cssName="wallpaper-footer" spacing={20}>
          <box hexpand halign={Gtk.Align.START}>
            <label
              label={bind(pageIndicator)}
              cssName="page-indicator"
            />
          </box>
          <box hexpand halign={Gtk.Align.END} spacing={16}>
            <box spacing={8}>
              <KeyboardShortcut keys={["h"]} compact={false} />
              <label label="/" cssClasses={["action-label"]} />
              <KeyboardShortcut keys={["l"]} compact={false} />
              <label label="Navigate" cssClasses={["action-label"]} />
            </box>
            <box spacing={8}>
              <KeyboardShortcut keys={["Ctrl", "h/l"]} compact={false} />
              <label label="Jump pages" cssClasses={["action-label"]} />
            </box>
            <box spacing={8}>
              <KeyboardShortcut keys={["↵"]} compact={false} />
              <label label="Select" cssClasses={["action-label"]} />
            </box>
          </box>
        </box>
      </box>
    </window>
  );
}
