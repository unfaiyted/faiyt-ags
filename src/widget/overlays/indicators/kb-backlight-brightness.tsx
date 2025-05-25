import { Widget, Gtk } from "astal/gtk4";
import { IndicatorCard, showIndicators } from "./index";
import { Variable, bind, exec, execAsync } from "astal";
import GLib from "gi://GLib";
import { PhosphorIcon } from "../../utils/icons/phosphor";
import { PhosphorIcons } from "../../utils/icons/types";
import { createLogger } from "../../../utils/logger";

const log = createLogger("KBBacklightIndicator");

// Keyboard backlight service
class KeyboardBacklightService {
  private _brightness = Variable(0);
  private _max = 1;
  private _kbdBacklightPath: string | null = null;
  private _hasBacklight = false;

  constructor() {
    log.debug("Initializing keyboard backlight service");
    this._init();
  }

  private async _init() {
    try {
      // Try to find keyboard backlight using brightnessctl first
      const devices = exec(`brightnessctl -l`).split('\n');
      const kbdDevice = devices.find(d => d.includes('kbd_backlight'));

      if (kbdDevice) {
        this._hasBacklight = true;
        // Extract device name
        const deviceMatch = kbdDevice.match(/Device '([^']+)'/);
        const deviceName = deviceMatch ? deviceMatch[1] : 'kbd_backlight';
        log.info("Found keyboard backlight device", { device: deviceName });

        // Get max brightness
        const maxOutput = exec(`brightnessctl -d ${deviceName} max`);
        this._max = parseInt(maxOutput) || 1;

        // Find the sysfs path
        const ledsDir = "/sys/class/leds/";
        const kbdBacklights = exec(`ls ${ledsDir}`).split('\n').filter(d =>
          d.includes('kbd_backlight') || d.includes('kbd-backlight') || d.includes('keyboard')
        );

        if (kbdBacklights.length > 0) {
          this._kbdBacklightPath = `${ledsDir}${kbdBacklights[0]}`;
          log.debug("Keyboard backlight path", { path: this._kbdBacklightPath });

          // Get current brightness
          this._updateBrightness();

          // Watch for brightness changes
          this._watchBrightness();
        }
      }
    } catch (error) {
      // Try alternative detection methods
      try {
        const ledsDir = "/sys/class/leds/";
        const kbdBacklights = exec(`ls ${ledsDir}`).split('\n').filter(d =>
          d.includes('kbd_backlight') || d.includes('kbd-backlight') || d.includes('keyboard')
        );

        if (kbdBacklights.length > 0) {
          this._hasBacklight = true;
          this._kbdBacklightPath = `${ledsDir}${kbdBacklights[0]}`;

          // Get max brightness from sysfs
          const maxBrightness = exec(`cat ${this._kbdBacklightPath}/max_brightness`);
          this._max = parseInt(maxBrightness) || 1;

          // Get current brightness
          this._updateBrightness();

          // Watch for brightness changes
          this._watchBrightness();
        } else {
          log.info("No keyboard backlight found");
        }
      } catch (e) {
        log.debug("Keyboard backlight detection failed", { error: e });
      }
    }
  }

  private _updateBrightness() {
    if (!this._kbdBacklightPath) return;

    try {
      const current = exec(`cat ${this._kbdBacklightPath}/brightness`);
      const value = parseInt(current) || 0;
      const percent = Math.round((value / this._max) * 100);
      const oldValue = this._brightness.get();
      
      // Only update and show indicator if value actually changed
      if (oldValue !== percent) {
        log.debug("Keyboard brightness changed", { oldValue, newValue: percent });
        this._brightness.set(percent);
        showIndicators();
      }
    } catch (error) {
      log.error("Error reading keyboard brightness", { error });
    }
  }

  private _watchBrightness() {
    if (!this._kbdBacklightPath) return;

    log.debug("Starting keyboard backlight polling");
    // Poll for changes since file monitoring might not work reliably for sysfs
    GLib.timeout_add(GLib.PRIORITY_DEFAULT, 100, () => {
      this._updateBrightness();
      return true; // Continue polling
    });
  }

  get brightness() {
    return this._brightness;
  }

  get hasBacklight() {
    return this._hasBacklight;
  }

  async setBrightness(percent: number) {
    if (!this._hasBacklight) return;

    log.debug("Setting keyboard brightness", { percent });
    try {
      // Use brightnessctl with kbd_backlight device
      await execAsync(`brightnessctl --device='kbd_backlight' set ${percent}%`);
      showIndicators();
    } catch (error) {
      // Fallback to direct sysfs write
      if (this._kbdBacklightPath) {
        const value = Math.round((percent / 100) * this._max);
        try {
          await execAsync(`pkexec sh -c 'echo ${value} > ${this._kbdBacklightPath}/brightness'`);
          showIndicators();
        } catch (e) {
          log.error("Error setting keyboard brightness", { error: e });
        }
      }
    }
  }

  async adjustBrightness(delta: number) {
    const current = this._brightness.get();
    const newValue = Math.max(0, Math.min(100, current + delta));
    await this.setBrightness(newValue);
  }
}

// Create a singleton instance
const kbBacklightService = new KeyboardBacklightService();

export const KBBacklightBrightnessIndicator = (props: Widget.BoxProps) => {
  const iconName = Variable(PhosphorIcons.Keyboard);

  // Only render if keyboard backlight is available
  if (!kbBacklightService.hasBacklight) {
    log.debug("No keyboard backlight available, skipping widget");
    return null;
  }
  
  log.debug("Creating keyboard backlight indicator widget");

  // Keep the keyboard icon constant since there's no variant for backlight
  // The progress bar will show the brightness level

  return (
    <IndicatorCard
      {...props}
      cssName={`osd-kbb-brightness`}
      icon={<PhosphorIcon iconName={bind(iconName)} size={16} />}
      value={bind(kbBacklightService.brightness)}
    />
  );
}
