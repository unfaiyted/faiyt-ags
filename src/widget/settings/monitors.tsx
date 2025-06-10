import { Widget, Astal, Gtk, Gdk, App } from "astal/gtk4";
import Gio from "gi://Gio";
import { Variable, bind, execAsync } from "astal";
import windowManager from "../../services/window-manager";
import configManager from "../../services/config-manager";
import { serviceLogger as log } from "../../utils/logger";

interface MonitorsWindowProps extends Widget.WindowProps {
  gdkmonitor: Gdk.Monitor;
  monitor: number;
}

interface MonitorData {
  id: number;
  name: string;
  description: string;
  width: number;
  height: number;
  refreshRate: number;
  x: number;
  y: number;
  scale: number;
  transform: number;
  availableModes: string[];
  focused: boolean;
}

interface DragState {
  isDragging: boolean;
  monitorId: number | null;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
}

const CANVAS_SCALE = 0.10; // Scale down monitors for display
const SNAP_THRESHOLD = 100; // Real-world pixels for snapping (increased for easier alignment)
const GRID_SIZE = 10; // Grid snap size in real-world pixels
const CANVAS_PADDING = 20; // Padding around the canvas edges
const MONITOR_OVERLAP = 5; // Pixels of overlap between monitors for better cursor movement

const MonitorsWindow = (props: MonitorsWindowProps) => {
  const { gdkmonitor, monitor } = props;
  const windowName = `monitors-${monitor}`;

  // State variables
  const monitors = Variable<MonitorData[]>([]);
  const selectedMonitor = Variable<string | null>(null);
  const hasChanges = Variable(false);
  const dragState = Variable<DragState>({
    isDragging: false,
    monitorId: null,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
  });

  // Temporary positions for preview
  const tempPositions = Variable<Map<string, { x: number; y: number }>>(new Map());

  // Temporary settings for preview (scale, mode, transform, etc.)
  const tempSettings = Variable<Map<string, {
    mode?: string;
    scale?: number;
    transform?: number;
    enabled?: boolean;
  }>>(new Map());

  // Store screenshot paths reactively
  const monitorScreenshots = Variable<Map<string, string>>(new Map());

  // Initialize screenshots on component creation
  const initializeScreenshots = async () => {
    log.debug("Initializing monitor screenshots");
    await windowManager.captureAllMonitorScreenshots();

    const monitorList = await windowManager.getMonitors();
    const screenshots = new Map<string, string>();
    monitorList.forEach(mon => {
      const path = windowManager.getMonitorScreenshot(mon.name);
      if (path) {
        screenshots.set(mon.name, path);
      }
    });
    log.info("Initial screenshots captured", { count: screenshots.size });
    monitorScreenshots.set(screenshots);
  };

  // Start initialization
  initializeScreenshots().catch(err => log.error("Failed to initialize screenshots", { error: err }));

  // Fetch monitor data
  const refreshMonitors = async (skipScreenshots = false) => {
    try {
      const monitorList = await windowManager.getMonitors();

      log.info("Monitors refreshed", {
        count: monitorList.length,
        monitors: monitorList.map(m => ({
          name: m.name,
          position: { x: m.x, y: m.y },
          size: { width: m.width, height: m.height }
        }))
      });

      monitors.set(monitorList);

      // Only capture screenshots if not skipped
      if (!skipScreenshots) {
        await windowManager.captureAllMonitorScreenshots();
        // Update screenshot paths after capture
        const screenshots = new Map<string, string>();
        monitorList.forEach(mon => {
          const path = windowManager.getMonitorScreenshot(mon.name);
          if (path) {
            screenshots.set(mon.name, path);
          }
        });
        monitorScreenshots.set(screenshots);
      }
    } catch (error) {
      log.error("Failed to refresh monitors", { error });
    }
  };

  // Convert real coordinates to canvas coordinates
  const toCanvasCoords = (x: number, y: number) => {
    const result = {
      x: x * CANVAS_SCALE + CANVAS_PADDING,
      y: y * CANVAS_SCALE + CANVAS_PADDING,
    };
    return result;
  };

  // Convert canvas coordinates to real coordinates
  const toRealCoords = (x: number, y: number) => {
    // First calculate the exact real coordinates
    const exactX = (x - CANVAS_PADDING) / CANVAS_SCALE;
    const exactY = (y - CANVAS_PADDING) / CANVAS_SCALE;

    // Round to nearest pixel (not 10 pixels) for more precise positioning
    const result = {
      x: Math.round(exactX),
      y: Math.round(exactY),
    };

    log.debug("Canvas to real conversion", {
      canvas: { x, y },
      exact: { x: exactX, y: exactY },
      rounded: result
    });

    return result;
  };

  // Snap to grid
  const snapToGrid = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE;

  // Check for edge snapping
  const getSnapPosition = (monitor: MonitorData, x: number, y: number): { x: number; y: number } => {
    const mons = monitors.get();
    let snapX = x;
    let snapY = y;
    let verticallyAligned = false;

    mons.forEach(m => {
      if (m.name === monitor.name) return;

      const pos = tempPositions.get().get(m.name) || { x: m.x, y: m.y };

      // Check vertical alignment first
      const isPlacingBelow = Math.abs(y - (pos.y + m.height)) < SNAP_THRESHOLD;
      const isPlacingAbove = Math.abs(y + monitor.height - pos.y) < SNAP_THRESHOLD;
      const isAlignedTop = Math.abs(y - pos.y) < SNAP_THRESHOLD;

      // Vertical snapping
      if (isPlacingBelow) {
        // Snap to bottom edge of other monitor - exactly touching
        snapY = pos.y + m.height;
        verticallyAligned = true;

        // When placing below, also align horizontally
        // Check which edge alignment makes most sense
        const leftEdgeDiff = Math.abs(x - pos.x);
        const rightEdgeDiff = Math.abs(x + monitor.width - (pos.x + m.width));
        const centerDiff = Math.abs((x + monitor.width / 2) - (pos.x + m.width / 2));

        // Prefer left edge alignment when stacking vertically
        if (leftEdgeDiff < SNAP_THRESHOLD || centerDiff < SNAP_THRESHOLD) {
          snapX = pos.x;
          log.info("Snapping to bottom edge with left alignment", {
            monitor: monitor.name,
            targetMonitor: m.name,
            targetPos: pos,
            targetSize: { width: m.width, height: m.height },
            alignedPos: { x: snapX, y: snapY },
            gap: 0
          });
        } else if (rightEdgeDiff < SNAP_THRESHOLD) {
          snapX = pos.x + m.width - monitor.width;
          log.info("Snapping to bottom edge with right alignment", {
            monitor: monitor.name,
            targetMonitor: m.name,
            targetPos: pos,
            targetSize: { width: m.width, height: m.height },
            alignedPos: { x: snapX, y: snapY },
            gap: 0
          });
        }
      } else if (isPlacingAbove) {
        // Snap to top edge of other monitor (placing this monitor above) - exactly touching
        snapY = pos.y - monitor.height;
        verticallyAligned = true;

        // Align horizontally when placing above
        const leftEdgeDiff = Math.abs(x - pos.x);
        const rightEdgeDiff = Math.abs(x + monitor.width - (pos.x + m.width));

        if (leftEdgeDiff < SNAP_THRESHOLD) {
          snapX = pos.x;
        } else if (rightEdgeDiff < SNAP_THRESHOLD) {
          snapX = pos.x + m.width - monitor.width;
        }
      } else if (isAlignedTop) {
        // Align tops
        snapY = pos.y;
      }

      // Only do horizontal edge snapping if not vertically aligned
      if (!verticallyAligned) {
        // Horizontal snapping - prioritize edge alignment
        const leftEdgeDiff = Math.abs(x - pos.x);
        const rightEdgeDiff = Math.abs(x + monitor.width - (pos.x + m.width));
        const leftToRightDiff = Math.abs(x - (pos.x + m.width));
        const rightToLeftDiff = Math.abs(x + monitor.width - pos.x);

        // Find the smallest difference
        const minDiff = Math.min(leftEdgeDiff, rightEdgeDiff, leftToRightDiff, rightToLeftDiff);

        if (minDiff < SNAP_THRESHOLD) {
          if (minDiff === leftEdgeDiff) {
            // Align left edges
            snapX = pos.x;
            log.debug("Snapping left edges", { monitor: monitor.name, target: m.name, snapX });
          } else if (minDiff === rightEdgeDiff) {
            // Align right edges
            snapX = pos.x + m.width - monitor.width;
            log.debug("Snapping right edges", { monitor: monitor.name, target: m.name, snapX });
          } else if (minDiff === leftToRightDiff) {
            // Snap to right edge of other monitor - exactly touching
            snapX = pos.x + m.width;
            log.debug("Snapping to right edge", { monitor: monitor.name, target: m.name, snapX });
          } else if (minDiff === rightToLeftDiff) {
            // Snap to left edge of other monitor - exactly touching
            snapX = pos.x - monitor.width;
            log.debug("Snapping to left edge", { monitor: monitor.name, target: m.name, snapX });
          }
        }
      }
    });

    // Only snap to grid if we didn't snap to another monitor
    const finalX = (snapX !== x) ? snapX : snapToGrid(snapX);
    const finalY = (snapY !== y) ? snapY : snapToGrid(snapY);

    log.debug("Final snap position", {
      monitor: monitor.name,
      original: { x, y },
      snapped: { x: finalX, y: finalY },
      verticallyAligned
    });

    return { x: finalX, y: finalY };
  };

  // Calculate valid scale factors for a given resolution
  const getValidScales = (width: number, height: number): number[] => {
    const scales: number[] = [];

    // Common scale factors to test
    const testScales = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0];

    for (const scale of testScales) {
      // Check if both width and height scale to whole pixels
      const scaledWidth = width / scale;
      const scaledHeight = height / scale;

      // Check if the scaled dimensions are whole numbers
      if (scaledWidth === Math.floor(scaledWidth) &&
        scaledHeight === Math.floor(scaledHeight)) {
        scales.push(scale);
      }
    }

    return scales;
  };

  // Monitor item component - using Fixed widget for absolute positioning
  const MonitorItem = ({ monitor: mon, canvasPos }: { monitor: MonitorData; canvasPos: { x: number; y: number } }) => {
    const isPrimary = mon.focused; // Use focused as primary indicator

    // Get screenshot path once (not reactive)
    const screenshotPath = monitorScreenshots.get().get(mon.name);
    const hasScreenshot = screenshotPath && Gio.File.new_for_path(screenshotPath).query_exists(null);

    if (hasScreenshot) {
      log.debug("Creating monitor item with screenshot", { monitor: mon.name, path: screenshotPath });
    }


    return (
      <button
        cssName="monitor-item"
        cssClasses={[
          selectedMonitor.get() === mon.name ? "selected" : "",
          isPrimary ? "primary" : "",
          dragState.get().isDragging && dragState.get().monitorId === mon.id ? "dragging" : "",
        ].filter(Boolean)}
        onClicked={() => {
          log.debug("Monitor clicked", { name: mon.name });
          selectedMonitor.set(mon.name);
        }}
        setup={(self) => {
          // Set size constraints
          self.set_size_request(
            mon.width * CANVAS_SCALE,
            mon.height * CANVAS_SCALE
          );

          // Handle click for selection only
          const clickController = new Gtk.GestureClick();
          clickController.set_button(1);
          clickController.connect("pressed", () => {
            selectedMonitor.set(mon.name);
          });

          self.add_controller(clickController);
        }}
      >
        {/* Base layer - screenshot background or placeholder */}
        {hasScreenshot ? (
          <box hexpand vexpand cssName="monitor-screenshot-wrapper"
            overflow={Gtk.Overflow.HIDDEN}
            widthRequest={mon.width * CANVAS_SCALE}
            heightRequest={mon.height * CANVAS_SCALE}
          >
            {/* hi */}
            {/* <image */}
            {/*   file={screenshotPath} */}
            {/*   cssName="monitor-screenshot" */}
            {/*   widthRequest={mon.width * CANVAS_SCALE} */}
            {/*   heightRequest={mon.height * CANVAS_SCALE} */}
            {/* /> */}
          </box>
        ) : (
          <box hexpand vexpand cssName="monitor-screenshot-placeholder" />
        )}

        {/* Overlay layer - monitor info */}
        <box vertical spacing={4} cssName="monitor-info" valign={Gtk.Align.START} halign={Gtk.Align.START}>
          <label cssName="monitor-name" xalign={0}>{mon.name}</label>
          <label cssName="monitor-resolution" xalign={0}>
            {mon.width}x{mon.height}@{mon.refreshRate.toFixed(0)}Hz
          </label>
          <label cssName="monitor-position" xalign={0}>
            {mon.x},{mon.y}
          </label>
        </box>
      </button>
    );
  };

  // Apply button handler
  const applyChanges = async () => {
    const positions = tempPositions.get();
    const settings = tempSettings.get();
    const allMonitors = monitors.get();

    // Log all changes before applying
    log.info("Applying monitor changes", {
      monitors: allMonitors.map(mon => {
        const pos = positions.get(mon.name) || { x: mon.x, y: mon.y };
        const setting = settings.get(mon.name) || {};
        return {
          name: mon.name,
          position: pos,
          settings: setting
        };
      })
    });

    // Prepare monitor configurations to save
    const monitorConfigs: Record<string, any> = {};

    // Check for gaps between monitors
    const checkForGaps = () => {
      for (let i = 0; i < allMonitors.length; i++) {
        for (let j = i + 1; j < allMonitors.length; j++) {
          const mon1 = allMonitors[i];
          const mon2 = allMonitors[j];
          const pos1 = positions.get(mon1.name) || { x: mon1.x, y: mon1.y };
          const pos2 = positions.get(mon2.name) || { x: mon2.x, y: mon2.y };

          // Check if monitors are adjacent horizontally
          if (pos1.y === pos2.y) {
            if (pos1.x + mon1.width === pos2.x) {
              log.info("Monitors are adjacent horizontally (no gap)", {
                left: mon1.name,
                right: mon2.name,
                boundary: pos1.x + mon1.width
              });
            } else if (pos2.x + mon2.width === pos1.x) {
              log.info("Monitors are adjacent horizontally (no gap)", {
                left: mon2.name,
                right: mon1.name,
                boundary: pos2.x + mon2.width
              });
            }
          }

          // Check if monitors are adjacent vertically
          if (pos1.x === pos2.x) {
            if (pos1.y + mon1.height === pos2.y) {
              log.info("Monitors are adjacent vertically (no gap)", {
                top: mon1.name,
                bottom: mon2.name,
                boundary: pos1.y + mon1.height
              });
            } else if (pos2.y + mon2.height === pos1.y) {
              log.info("Monitors are adjacent vertically (no gap)", {
                top: mon2.name,
                bottom: mon1.name,
                boundary: pos2.y + mon2.height
              });
            }
          }
        }
      }
    };

    checkForGaps();

    // Apply all changes for each monitor
    let hasAnyChanges = false;

    for (const mon of allMonitors) {
      const pos = positions.get(mon.name);
      const setting = settings.get(mon.name) || {};

      // Build the monitor config to save
      const finalPos = pos || { x: mon.x, y: mon.y };
      const finalMode = setting.mode ? windowManager.parseMonitorMode(setting.mode) : null;

      monitorConfigs[mon.name] = {
        name: mon.name,
        position: {
          x: finalPos.x,
          y: finalPos.y
        },
        resolution: {
          width: finalMode?.width || mon.width,
          height: finalMode?.height || mon.height
        },
        isPrimary: mon.focused,
        refreshRate: finalMode?.refreshRate || mon.refreshRate,
        scale: setting.scale !== undefined ? setting.scale : mon.scale
      };

      // Apply position changes
      if (pos && (pos.x !== mon.x || pos.y !== mon.y)) {
        const success = await windowManager.setMonitorPosition(mon.name, pos.x, pos.y);
        if (!success) {
          log.error(`Failed to apply position for ${mon.name}`);
        } else {
          hasAnyChanges = true;
        }
      }

      // Apply mode changes
      if (setting.mode && setting.mode !== `${mon.width}x${mon.height}@${mon.refreshRate.toFixed(2)}Hz`) {
        const success = await windowManager.setMonitorMode(mon.name, setting.mode);
        if (!success) {
          log.error(`Failed to apply mode for ${mon.name}`);
        } else {
          hasAnyChanges = true;
        }
      }

      // Apply scale changes
      if (setting.scale !== undefined && Math.abs(setting.scale - mon.scale) > 0.01) {
        const success = await windowManager.setMonitorScale(mon.name, setting.scale);
        if (!success) {
          log.error(`Failed to apply scale for ${mon.name}`);
        } else {
          hasAnyChanges = true;
        }
      }

      // Apply transform changes
      if (setting.transform !== undefined && setting.transform !== mon.transform) {
        const success = await windowManager.setMonitorTransform(mon.name, setting.transform);
        if (!success) {
          log.error(`Failed to apply transform for ${mon.name}`);
        } else {
          hasAnyChanges = true;
        }
      }

      // Apply enabled/disabled state
      if (setting.enabled !== undefined && setting.enabled === mon.disabled) {
        const success = await windowManager.toggleMonitor(mon.name, setting.enabled);
        if (!success) {
          log.error(`Failed to toggle monitor ${mon.name}`);
        } else {
          hasAnyChanges = true;
        }
      }
    }

    // Don't reload Hyprland - it would reset to config file values
    // The changes should already be applied via hyprctl keyword commands

    // Clear temporary settings
    tempPositions.set(new Map());
    tempSettings.set(new Map());
    hasChanges.set(false);

    // Wait a bit for Hyprland to apply the changes
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Refresh to get the actual applied state
    await refreshMonitors();

    // Check actual positions after refresh
    const actualMonitors = monitors.get();
    log.info("Monitor positions after apply", {
      monitors: actualMonitors.map(mon => ({
        name: mon.name,
        position: { x: mon.x, y: mon.y },
        size: { width: mon.width, height: mon.height }
      }))
    });

    // Check for any remaining gaps
    for (let i = 0; i < actualMonitors.length; i++) {
      for (let j = i + 1; j < actualMonitors.length; j++) {
        const mon1 = actualMonitors[i];
        const mon2 = actualMonitors[j];

        // Check vertical alignment
        if (mon1.x === mon2.x && mon1.width === mon2.width) {
          const gap = Math.min(
            Math.abs(mon1.y + mon1.height - mon2.y),
            Math.abs(mon2.y + mon2.height - mon1.y)
          );
          if (gap > 0 && gap < 10) {
            log.warn("Small gap detected between vertically aligned monitors", {
              monitor1: mon1.name,
              monitor2: mon2.name,
              gap,
              positions: {
                [mon1.name]: { x: mon1.x, y: mon1.y, bottom: mon1.y + mon1.height },
                [mon2.name]: { x: mon2.x, y: mon2.y, bottom: mon2.y + mon2.height }
              }
            });
          }
        }
      }
    }

    // Save the monitor configuration to user config
    if (hasAnyChanges) {
      try {
        // Update the config with actual applied values from actualMonitors
        const finalConfigs: Record<string, any> = {};
        for (const mon of actualMonitors) {
          finalConfigs[mon.name] = {
            name: mon.name,
            position: {
              x: mon.x,
              y: mon.y
            },
            resolution: {
              width: mon.width,
              height: mon.height
            },
            isPrimary: mon.focused,
            refreshRate: mon.refreshRate,
            scale: mon.scale
          };
        }

        configManager.setValue("monitors", finalConfigs);
        await configManager.saveConfig();
        log.info("Monitor configuration saved to user config", { monitors: finalConfigs });
      } catch (error) {
        log.error("Failed to save monitor configuration", { error });
      }
    }
  };

  // Reset positions
  const resetPositions = () => {
    log.info("Resetting all changes to original");

    // Clear all temporary changes
    tempPositions.set(new Map());
    tempSettings.set(new Map());
    hasChanges.set(false);
  };

  // Auto-align monitors to remove gaps
  const autoAlign = () => {
    const mons = monitors.get();
    if (mons.length < 2) return;

    const newPositions = new Map<string, { x: number; y: number }>();

    // Find the primary monitor (or first monitor)
    const primary = mons.find(m => m.focused) || mons[0];
    newPositions.set(primary.name, { x: 0, y: 0 });

    // Position other monitors relative to primary
    const positioned = new Set([primary.name]);
    const remaining = mons.filter(m => m.name !== primary.name);

    while (remaining.length > 0) {
      const toRemove: number[] = [];

      remaining.forEach((mon, index) => {
        // Try to position this monitor next to an already positioned one
        for (const posName of positioned) {
          const posMonitor = mons.find(m => m.name === posName);
          if (!posMonitor) continue;

          const pos = newPositions.get(posName) || { x: 0, y: 0 };

          // Try right of positioned monitor
          if (!newPositions.has(mon.name)) {
            newPositions.set(mon.name, {
              x: pos.x + posMonitor.width,
              y: pos.y
            });
            positioned.add(mon.name);
            toRemove.push(index);
            break;
          }
        }
      });

      // Remove positioned monitors
      toRemove.reverse().forEach(i => remaining.splice(i, 1));

      // If no monitors were positioned, position the first remaining below primary
      if (toRemove.length === 0 && remaining.length > 0) {
        const mon = remaining[0];
        const primaryPos = newPositions.get(primary.name) || { x: 0, y: 0 };
        newPositions.set(mon.name, {
          x: primaryPos.x,
          y: primaryPos.y + primary.height
        });
        positioned.add(mon.name);
        remaining.splice(0, 1);
      }
    }

    tempPositions.set(newPositions);
    hasChanges.set(true);
  };

  // Monitor settings panel that properly handles selected monitor changes
  const MonitorSettingsPanel = () => {
    // Revealer state - closed by default
    const revealSettings = Variable(false);

    // Don't auto-open when monitor is selected
    // User must manually click to expand

    return (
      <box cssName="monitors-settings-container" vertical>
        {/* Settings header with toggle */}
        <button
          cssName="monitors-settings-header"
          onClicked={() => {
            if (selectedMonitor.get()) {
              revealSettings.set(!revealSettings.get());
            }
          }}
          setup={(self) => {
            selectedMonitor.subscribe((selected) => {
              self.set_sensitive(!!selected);
            });
          }}
        >
          <box spacing={8}>
            <label cssName="monitors-settings-header-title">
              {bind(selectedMonitor).as(selected =>
                selected ? `${selected} Settings` : "Monitor Settings"
              )}
            </label>
            <box hexpand />
            {bind(selectedMonitor).as(selected =>
              selected ? (
                <label cssName="monitors-settings-header-arrow">
                  {bind(revealSettings).as(revealed => revealed ? "▼" : "▶")}
                </label>
              ) : (
                <label cssName="monitors-settings-header-hint">Select a monitor</label>
              )
            )}
          </box>
        </button>

        <box
          cssName="monitors-settings-wrapper"
          vertical
          setup={(self) => {
            let currentPanel: Gtk.Widget | null = null;

            const updatePanel = () => {
              // Remove old panel
              if (currentPanel) {
                self.remove(currentPanel);
                currentPanel = null;
              }

              const selected = selectedMonitor.get();
              if (!selected) {
                // No monitor selected, show placeholder
                const placeholder = <box cssName="monitors-settings-placeholder" vexpand hexpand>
                  <label cssName="monitors-settings-placeholder-text">
                    Select a monitor to configure its settings
                  </label>
                </box>;
                currentPanel = placeholder;
                self.append(placeholder);
                return;
              }

              const mon = monitors.get().find(m => m.name === selected);
              if (!mon) return;

              // Create the settings content
              const settingsContent = <box cssName="monitors-settings" vertical spacing={12}>
                <label cssName="monitor-settings-title" xalign={0}>
                  {mon.name} Settings
                </label>

                <box cssName="monitor-setting-row" spacing={12}>
                  <label cssName="monitor-setting-label">Resolution:</label>
                  <box setup={(self) => {
                    // Check if there's a pending mode change
                    const tempSetting = tempSettings.get().get(mon.name);
                    const currentMode = tempSetting?.mode || `${mon.width}x${mon.height}@${mon.refreshRate.toFixed(2)}Hz`;

                    const dropdown = new Gtk.DropDown({
                      model: Gtk.StringList.new(mon.availableModes),
                      selected: mon.availableModes.findIndex(mode =>
                        mode.startsWith(currentMode.replace(/Hz$/, ''))
                      ),
                    });
                    dropdown.set_css_classes(["resolution-dropdown"]);

                    dropdown.connect("notify::selected", () => {
                      const selectedIdx = dropdown.selected;
                      const mode = mon.availableModes[selectedIdx];
                      if (mode && selectedIdx !== -1) {
                        log.info("Mode selected", { monitor: mon.name, mode });

                        // Store in temporary settings
                        const newSettings = new Map(tempSettings.get());
                        const monSettings = newSettings.get(mon.name) || {};
                        monSettings.mode = mode;
                        newSettings.set(mon.name, monSettings);
                        tempSettings.set(newSettings);
                        hasChanges.set(true);
                      }
                    });

                    self.append(dropdown);
                  }} />
                </box>

                <box cssName="monitor-setting-row" spacing={12}>
                  <label cssName="monitor-setting-label">Scale:</label>
                  <box hexpand vertical spacing={8} setup={(self) => {
                    const validScales = getValidScales(mon.width, mon.height);

                    // Create scale buttons for valid scales
                    const scaleButtonsBox = <box spacing={4} />;

                    validScales.forEach(scaleValue => {
                      // Check if this scale is selected in temp settings
                      const tempSetting = tempSettings.get().get(mon.name);
                      const currentScale = tempSetting?.scale ?? mon.scale;

                      const button = <button
                        cssName="transform-button"
                        cssClasses={Math.abs(currentScale - scaleValue) < 0.01 ? ["active"] : []}
                        onClicked={() => {
                          log.info("Scale selected", { monitor: mon.name, scale: scaleValue });

                          // Store in temporary settings
                          const newSettings = new Map(tempSettings.get());
                          const monSettings = newSettings.get(mon.name) || {};
                          monSettings.scale = scaleValue;
                          newSettings.set(mon.name, monSettings);
                          tempSettings.set(newSettings);
                          hasChanges.set(true);
                        }}
                      >
                        <label>{scaleValue}x</label>
                      </button>;
                      scaleButtonsBox.append(button);
                    });

                    self.append(scaleButtonsBox);

                    // Show info about valid scales
                    const infoLabel = <label cssName="scale-info-label">
                      Valid scales for {mon.width}x{mon.height}: {validScales.map(s => s + "x").join(", ")}
                    </label>;
                    self.append(infoLabel);
                  }} />
                </box>

                <box cssName="transform-controls" vertical spacing={8}>
                  <label xalign={0}>Transform:</label>
                  <box spacing={4}>
                    {[
                      { label: "Normal", value: 0 },
                      { label: "90°", value: 1 },
                      { label: "180°", value: 2 },
                      { label: "270°", value: 3 },
                      { label: "Flipped", value: 4 },
                      { label: "Flipped 90°", value: 5 },
                      { label: "Flipped 180°", value: 6 },
                      { label: "Flipped 270°", value: 7 },
                    ].map(({ label, value }) => {
                      // Check if this transform is selected in temp settings
                      const tempSetting = tempSettings.get().get(mon.name);
                      const currentTransform = tempSetting?.transform ?? mon.transform;

                      return (
                        <button
                          cssName="transform-button"
                          cssClasses={currentTransform === value ? ["active"] : []}
                          onClicked={() => {
                            log.info("Transform selected", { monitor: mon.name, transform: value });

                            // Store in temporary settings
                            const newSettings = new Map(tempSettings.get());
                            const monSettings = newSettings.get(mon.name) || {};
                            monSettings.transform = value;
                            newSettings.set(mon.name, monSettings);
                            tempSettings.set(newSettings);
                            hasChanges.set(true);
                          }}
                        >
                          <label>{label}</label>
                        </button>
                      );
                    })}
                  </box>
                </box>

                <box cssName="monitor-setting-row" vertical spacing={8}>
                  <label cssName="monitor-setting-label">Status:</label>
                  <box spacing={12}>
                    {/* Check pending enabled state */}
                    {(() => {
                      const tempSetting = tempSettings.get().get(mon.name);
                      const willBeEnabled = tempSetting?.enabled ?? !mon.disabled;
                      const currentlyDisabled = mon.disabled;

                      return (
                        <button
                          cssName={currentlyDisabled ? "apply-button" : "reset-button"}
                          onClicked={() => {
                            log.info("Toggle monitor selected", { monitor: mon.name, enable: !mon.disabled });

                            // Store in temporary settings
                            const newSettings = new Map(tempSettings.get());
                            const monSettings = newSettings.get(mon.name) || {};
                            monSettings.enabled = !mon.disabled;
                            newSettings.set(mon.name, monSettings);
                            tempSettings.set(newSettings);
                            hasChanges.set(true);
                          }}
                        >
                          <label>{willBeEnabled ? "Disable Monitor" : "Enable Monitor"}</label>
                        </button>
                      );
                    })()}
                    {mon.focused && (
                      <label cssName="monitor-setting-label">(Primary)</label>
                    )}
                  </box>
                </box>
              </box>;

              // Wrap in a revealer
              const revealer = <revealer
                revealChild={bind(revealSettings)}
                transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
                transitionDuration={300}
              >
                {settingsContent}
              </revealer>;

              currentPanel = revealer;
              self.append(revealer);
            };

            // Subscribe to changes
            selectedMonitor.subscribe(updatePanel);
            monitors.subscribe(updatePanel);
            tempSettings.subscribe(updatePanel);

            // Initial update
            updatePanel();
          }}
        />
      </box>
    );
  };

  // Canvas with monitors using Fixed widget for absolute positioning
  const MonitorCanvas = () => {
    return (
      <box
        cssName="monitors-canvas"
        hexpand
        vexpand
        setup={(self) => {
          // Create a Fixed widget for absolute positioning
          const fixed = new Gtk.Fixed();

          // Set up drag handling on the fixed widget
          let draggedItem: Gtk.Widget | null = null;

          // Add drag gesture to handle monitor dragging
          const dragGesture = new Gtk.GestureDrag();

          dragGesture.connect("drag-begin", (_gesture: Gtk.GestureDrag, startX: number, startY: number) => {
            // Find which monitor was clicked
            const mons = monitors.get();
            for (const mon of mons) {
              const pos = tempPositions.get().get(mon.name) || { x: mon.x, y: mon.y };
              const canvasPos = toCanvasCoords(pos.x, pos.y);

              // Check if click is within monitor bounds
              if (startX >= canvasPos.x && startX <= canvasPos.x + mon.width * CANVAS_SCALE &&
                startY >= canvasPos.y && startY <= canvasPos.y + mon.height * CANVAS_SCALE) {
                selectedMonitor.set(mon.name);

                // Store the click offset within the monitor
                const clickOffsetX = startX - canvasPos.x;
                const clickOffsetY = startY - canvasPos.y;

                // Store the monitor's current position and click offset
                dragState.set({
                  isDragging: true,
                  monitorId: mon.id,
                  startX: startX,  // Where the mouse click happened
                  startY: startY,
                  offsetX: clickOffsetX,  // Offset within the monitor
                  offsetY: clickOffsetY,
                });

                log.info("Drag begin", {
                  monitor: mon.name,
                  clickPos: { x: startX, y: startY },
                  monitorCanvasPos: canvasPos,
                  monitorRealPos: pos,
                  clickOffset: { x: clickOffsetX, y: clickOffsetY },
                  monitorSize: { width: mon.width, height: mon.height }
                });

                break;
              }
            }
          });

          dragGesture.connect("drag-update", (_gesture: Gtk.GestureDrag, offsetX: number, offsetY: number) => {
            const state = dragState.get();
            if (state.isDragging && state.monitorId !== null) {
              const mon = monitors.get().find(m => m.id === state.monitorId);
              if (mon) {
                // Calculate new top-left position of the monitor
                // state.startX/Y is where the mouse was clicked
                // offsetX/Y is how far the mouse has moved since drag started
                // state.offsetX/Y is the offset from monitor's top-left to click point
                const newCanvasX = state.startX + offsetX - state.offsetX;
                const newCanvasY = state.startY + offsetY - state.offsetY;

                const realPos = toRealCoords(newCanvasX, newCanvasY);
                const snappedPos = getSnapPosition(mon, realPos.x, realPos.y);

                log.info("Drag update", {
                  monitor: mon.name,
                  dragOffset: { x: offsetX, y: offsetY },
                  stateOffset: { x: state.offsetX, y: state.offsetY },
                  startPos: { x: state.startX, y: state.startY },
                  newCanvasPos: { x: newCanvasX, y: newCanvasY },
                  realPos,
                  snappedPos,
                  monitorSize: { width: mon.width, height: mon.height }
                });

                const newPositions = new Map(tempPositions.get());
                newPositions.set(mon.name, snappedPos);
                tempPositions.set(newPositions);
                hasChanges.set(true);
              }
            }
          });

          dragGesture.connect("drag-end", () => {
            dragState.set({
              isDragging: false,
              monitorId: null,
              startX: 0,
              startY: 0,
              offsetX: 0,
              offsetY: 0,
            });
          });

          fixed.add_controller(dragGesture);

          self.append(fixed);

          // Set up reactive updates
          const updateMonitors = () => {
            log.debug("updateMonitors called");

            // Clear existing children
            let child = fixed.get_first_child();
            while (child) {
              const next = child.get_next_sibling();
              fixed.remove(child);
              child = next;
            }

            // Add monitor items
            const mons = monitors.get();

            // Calculate required canvas size
            let maxX = 0;
            let maxY = 0;

            mons.forEach(mon => {
              const pos = tempPositions.get().get(mon.name) || { x: mon.x, y: mon.y };
              const canvasPos = toCanvasCoords(pos.x + mon.width, pos.y + mon.height);
              maxX = Math.max(maxX, canvasPos.x);
              maxY = Math.max(maxY, canvasPos.y);
            });

            // Set minimum size for the Fixed widget with padding
            fixed.set_size_request(
              Math.max(600, maxX + CANVAS_PADDING),
              Math.max(300, maxY + CANVAS_PADDING)
            );

            // Add monitor items
            mons.forEach(mon => {
              const pos = tempPositions.get().get(mon.name) || { x: mon.x, y: mon.y };
              const canvasPos = toCanvasCoords(pos.x, pos.y);

              // Debug log positions
              if (log.level === "debug" || log.level === "info") {
                log.info("Rendering monitor", {
                  monitor: mon.name,
                  realPos: pos,
                  canvasPos,
                  originalPos: { x: mon.x, y: mon.y },
                  monitorSize: { width: mon.width, height: mon.height },
                  hasTempPosition: tempPositions.get().has(mon.name)
                });
              }

              const item = <MonitorItem monitor={mon} canvasPos={canvasPos} />;
              // Ensure we use integer positions for the Fixed widget
              const intX = Math.round(canvasPos.x);
              const intY = Math.round(canvasPos.y);
              fixed.put(item, intX, intY);
              item.show();
            });
          };

          // Subscribe to changes
          monitors.subscribe(updateMonitors);
          tempPositions.subscribe(updateMonitors);
          // Don't subscribe to dragState - it causes too many re-renders during dragging
          selectedMonitor.subscribe(updateMonitors);
          monitorScreenshots.subscribe(updateMonitors); // Update when screenshots change

          // Initial update
          updateMonitors();
        }}
      />
    );
  };

  // Main content
  const content = (
    <box cssName="monitors-container" vertical spacing={0}>
      <box cssName="monitors-header" spacing={12}>
        <label cssName="monitors-title">Display Configuration</label>
        <box hexpand />
        <button
          cssName="reset-button"
          onClicked={async () => {
            await windowManager.captureAllMonitorScreenshots();
            // Update screenshot paths
            const screenshots = new Map<string, string>();
            monitors.get().forEach(mon => {
              const path = windowManager.getMonitorScreenshot(mon.name);
              if (path) {
                screenshots.set(mon.name, path);
              }
            });
            monitorScreenshots.set(screenshots);
          }}
        >
          <label>📷 Refresh Screenshots</label>
        </button>
        <button
          cssName="monitors-close-button"
          onClicked={() => App.get_window(windowName)?.hide()}
        >
          <label>✕</label>
        </button>
      </box>

      <MonitorCanvas />

      <MonitorSettingsPanel />

      <box cssName="monitors-actions" spacing={12}>
        <box hexpand />
        <button
          cssName="reset-button"
          onClicked={autoAlign}
        >
          <label>Auto-Align</label>
        </button>
        <button
          cssName="reset-button"
          onClicked={resetPositions}
          sensitive={bind(hasChanges)}
        >
          <label>Reset</label>
        </button>
        <button
          cssName="apply-button"
          onClicked={applyChanges}
          sensitive={bind(hasChanges)}
        >
          <label>Apply</label>
        </button>
      </box>
    </box>
  );

  return (
    <window
      name={windowName}
      gdkmonitor={gdkmonitor}
      layer={Astal.Layer.OVERLAY}
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT}
      exclusivity={Astal.Exclusivity.IGNORE}
      keymode={Astal.Keymode.ON_DEMAND}
      application={App}
      cssName="monitors-window"
      cssClasses={props.cssClasses || []}
      visible={false}
      onKeyPressed={(self, keyval) => {
        if (keyval === Gdk.KEY_Escape) {
          self.hide();
          return true;
        }
        return false;
      }}
      setup={(self) => {
        self.connect("show", async () => {
          log.debug("Monitors window shown");

          // Refresh screenshots when window is shown
          await windowManager.captureAllMonitorScreenshots();

          // Update screenshot paths
          const monitorList = await windowManager.getMonitors();
          const screenshots = new Map<string, string>();
          monitorList.forEach(mon => {
            const path = windowManager.getMonitorScreenshot(mon.name);
            log.debug("Got screenshot path", { monitor: mon.name, path });
            if (path) {
              screenshots.set(mon.name, path);
            }
          });
          log.info("Setting monitor screenshots on show", { count: screenshots.size, monitors: Array.from(screenshots.keys()) });
          monitorScreenshots.set(screenshots);

          // Refresh monitor data
          await refreshMonitors(true); // Skip screenshots since we just captured them
          self.grab_focus();
        });
      }}
    >
      <box cssName="monitors-window-wrapper" hexpand vexpand halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER}>
        {content}
      </box>
    </window>
  );
};

export default MonitorsWindow;
