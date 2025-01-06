import { createLogger } from "../utils/logger";
import { exec } from "astal/process";
import Battery from "gi://AstalBattery";

const log = createLogger('BatteryDetector');

class BatteryDetector {
  private hasBattery: boolean | null = null;

  constructor() {
    this.detectBattery();
  }

  private detectBattery(): void {
    try {
      // First, try using the AstalBattery module
      const battery = Battery.get_default();
      
      // Check if the battery percentage is valid and not 0
      // A system without a battery typically returns 0 or undefined
      if (battery && battery.percentage !== undefined && battery.percentage > 0) {
        this.hasBattery = true;
        log.info('Battery detected via AstalBattery', { percentage: battery.percentage });
        return;
      }

      // Fallback: Check /sys/class/power_supply for battery devices
      try {
        const result = exec('ls /sys/class/power_supply/ | grep -E "^BAT[0-9]+$" | head -1');
        if (result && result.trim()) {
          this.hasBattery = true;
          log.info('Battery detected via /sys/class/power_supply', { battery: result.trim() });
          return;
        }
      } catch (e) {
        // No battery found in /sys/class/power_supply
      }

      // Additional check: Look for AC adapter only systems (no battery)
      try {
        const acResult = exec('ls /sys/class/power_supply/ | grep -E "^A(C|D)[0-9]*$" | head -1');
        const allDevices = exec('ls /sys/class/power_supply/').trim();
        
        // If we only have AC adapter and no BAT devices, assume no battery
        if (acResult && !allDevices.includes('BAT')) {
          this.hasBattery = false;
          log.info('AC adapter found but no battery detected');
          return;
        }
      } catch (e) {
        // Error checking AC adapter
      }

      // If AstalBattery exists but shows 0%, it might be a desktop
      if (battery && battery.percentage === 0) {
        this.hasBattery = false;
        log.info('Battery module present but showing 0% - assuming desktop system');
        return;
      }

      // Default to no battery if we can't determine
      this.hasBattery = false;
      log.info('No battery detected - assuming desktop system');
      
    } catch (error) {
      log.error('Error detecting battery', { error });
      this.hasBattery = false;
    }
  }

  /**
   * Check if the system has a battery
   * @returns true if battery is detected, false otherwise
   */
  public systemHasBattery(): boolean {
    if (this.hasBattery === null) {
      this.detectBattery();
    }
    return this.hasBattery || false;
  }

  /**
   * Force re-detection of battery
   */
  public redetect(): void {
    this.hasBattery = null;
    this.detectBattery();
  }
}

// Export singleton instance
export default new BatteryDetector();