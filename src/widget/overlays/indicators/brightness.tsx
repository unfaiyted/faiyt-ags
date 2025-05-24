import { Widget, Gtk } from "astal/gtk4";
import { IndicatorCard } from "./index";
import { Variable, bind, exec, execAsync } from "astal";
import GLib from "gi://GLib";
import { PhosphorIcon } from "../../utils/icons/phosphor";
import { PhosphorIcons } from "../../utils/icons/types";

// Brightness service to handle screen brightness
class BrightnessService {
  private _brightness = Variable(0);
  private _max = 1;
  private _backlightPath: string | null = null;

  constructor() {
    this._init();
  }

  private async _init() {
    try {
      // Find the backlight device
      const backlightDir = "/sys/class/backlight/";
      const devices = exec(`ls ${backlightDir}`).split('\n').filter(d => d);

      if (devices.length > 0) {
        this._backlightPath = `${backlightDir}${devices[0]}`;

        // Get max brightness
        const maxBrightness = exec(`cat ${this._backlightPath}/max_brightness`);
        this._max = parseInt(maxBrightness) || 1;

        // Get current brightness
        this._updateBrightness();

        // Watch for brightness changes
        this._watchBrightness();
      }
    } catch (error) {
      print("Error initializing brightness:", error);
    }
  }

  private _updateBrightness() {
    if (!this._backlightPath) return;

    try {
      const current = exec(`cat ${this._backlightPath}/brightness`);
      const value = parseInt(current) || 0;
      const percent = Math.round((value / this._max) * 100);
      this._brightness.set(percent);
    } catch (error) {
      print("Error reading brightness:", error);
    }
  }

  private _watchBrightness() {
    if (!this._backlightPath) return;

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
    try {
      await execAsync(`brightnessctl set ${value}`).catch(() => {
        // Fallback to direct write if brightnessctl is not available
        execAsync(`pkexec sh -c 'echo ${value} > ${this._backlightPath}/brightness'`);
      });
    } catch (error) {
      print("Error setting brightness:", error);
    }
  }
}

// Create a singleton instance
const brightnessService = new BrightnessService();

export const BrightnessIndicator = (props: Widget.BoxProps) => {
  const iconName = Variable(PhosphorIcons.Sun);

  // Update icon based on brightness level
  brightnessService.brightness.subscribe((brightness) => {
    if (brightness < 20) {
      iconName.set(PhosphorIcons.Moon);
    } else if (brightness < 50) {
      iconName.set(PhosphorIcons.SunDim);
    } else {
      iconName.set(PhosphorIcons.Sun);
    }
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
