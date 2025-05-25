import { Widget, Gtk } from "astal/gtk4";
import { IndicatorCard, showIndicators } from "./index";
import { Variable, bind, exec, execAsync } from "astal";
import GLib from "gi://GLib";
import { PhosphorIcon } from "../../utils/icons/phosphor";
import { PhosphorIcons } from "../../utils/icons/types";
import { createLogger } from "../../../utils/logger";

const log = createLogger("BrightnessIndicator");

// Brightness service to handle screen brightness
class BrightnessService {
  private _brightness = Variable(0);
  private _max = 1;
  private _backlightPath: string | null = null;

  constructor() {
    log.debug("Initializing brightness service");
    this._init();
  }

  private async _init() {
    try {
      // Find the backlight device
      const backlightDir = "/sys/class/backlight/";
      const devices = exec(`ls ${backlightDir}`).split('\n').filter(d => d);

      if (devices.length > 0) {
        this._backlightPath = `${backlightDir}${devices[0]}`;
        log.info("Found backlight device", { path: this._backlightPath });

        // Get max brightness
        const maxBrightness = exec(`cat ${this._backlightPath}/max_brightness`);
        this._max = parseInt(maxBrightness) || 1;
        log.debug("Max brightness", { max: this._max });

        // Get current brightness
        this._updateBrightness();

        // Watch for brightness changes
        this._watchBrightness();
      } else {
        log.warn("No backlight devices found");
      }
    } catch (error) {
      log.error("Error initializing brightness", { error });
    }
  }

  private _updateBrightness() {
    if (!this._backlightPath) return;

    try {
      const current = exec(`cat ${this._backlightPath}/brightness`);
      const value = parseInt(current) || 0;
      const percent = Math.round((value / this._max) * 100);
      const oldValue = this._brightness.get();
      
      // Only update and show indicator if value actually changed
      if (oldValue !== percent) {
        log.debug("Brightness changed", { oldValue, newValue: percent });
        this._brightness.set(percent);
        showIndicators();
      }
    } catch (error) {
      log.error("Error reading brightness", { error });
    }
  }

  private _watchBrightness() {
    if (!this._backlightPath) return;

    log.debug("Starting brightness polling");
    // Poll for changes since file monitoring might not work reliably for sysfs
    GLib.timeout_add(GLib.PRIORITY_DEFAULT, 100, () => {
      this._updateBrightness();
      return true; // Continue polling
    });
  }

  get brightness() {
    return this._brightness;
  }

  async setBrightness(percent: number) {
    if (!this._backlightPath) return;

    const value = Math.round((percent / 100) * this._max);
    log.debug("Setting brightness", { percent, value });
    try {
      await execAsync(`brightnessctl set ${value}`).catch(() => {
        // Fallback to direct write if brightnessctl is not available
        execAsync(`pkexec sh -c 'echo ${value} > ${this._backlightPath}/brightness'`);
      });
      showIndicators();
    } catch (error) {
      log.error("Error setting brightness", { error });
    }
  }
}

// Create a singleton instance
const brightnessService = new BrightnessService();

export const BrightnessIndicator = (props: Widget.BoxProps) => {
  log.debug("Creating brightness indicator widget");
  const iconName = Variable(PhosphorIcons.Sun);

  // Update icon based on brightness level
  brightnessService.brightness.subscribe((brightness) => {
    let newIcon: string;
    if (brightness < 20) {
      newIcon = PhosphorIcons.Moon;
    } else if (brightness < 50) {
      newIcon = PhosphorIcons.SunDim;
    } else {
      newIcon = PhosphorIcons.Sun;
    }
    log.debug("Updating brightness icon", { brightness, icon: newIcon });
    iconName.set(newIcon);
  });

  return (
    <IndicatorCard
      {...props}
      cssName={`osd-brightness`}
      icon={<PhosphorIcon iconName={bind(iconName)} size={16} />}
      value={bind(brightnessService.brightness)}
    />
  );
}
