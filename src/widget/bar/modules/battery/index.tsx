import { Widget, Gtk } from "astal/gtk4";
import { Variable, bind } from "astal";
import { execAsync } from "astal/process";
import BarGroup from "../../utils/bar-group";
import { PhosphorIcon } from "../../../utils/icons/phosphor";
import { Fixed } from "../../../utils/containers/drawing-area";
import CircularProgress from "../../../utils/circular-progress";
import Battery from "gi://AstalBattery";
import { PhosphorIcons, PhosphorIconStyle } from "../../../utils/icons/types";
import { theme } from "../../../../utils/color";
import { createLogger } from "../../../../utils/logger";
import configManager from "../../../../services/config-manager";
import batteryDetector from "../../../../services/battery-detector";

const log = createLogger('BatteryModule');

export interface BatteryModuleProps extends Widget.BoxProps { }

// Helper function to get battery icon name based on level and charging state
function getBatteryIconName(level: number, charging: boolean): PhosphorIcons {
  if (charging) {
    return PhosphorIcons.BatteryCharging;
  }

  // Handle different battery levels
  if (level <= 10) {
    return PhosphorIcons.BatteryLow;
  } else if (level <= 30) {
    return PhosphorIcons.BatteryWarning;
  } else if (level <= 60) {
    return PhosphorIcons.BatteryMedium;
  } else if (level <= 90) {
    return PhosphorIcons.BatteryHigh;
  } else {
    return PhosphorIcons.BatteryFull;
  }
}

export default function BatteryModule(props: BatteryModuleProps) {
  // Check if system has a battery
  if (!batteryDetector.systemHasBattery()) {
    log.debug('No battery detected, hiding battery module');
    // Return an empty box instead of null to avoid rendering issues
    return <box visible={false} />;
  }

  const battery = Battery.get_default();

  // Variables to track battery state
  const percentage = new Variable(Math.round(battery.percentage * 100));
  const isCharging = new Variable(battery.charging);
  const timeRemaining = new Variable("");
  const batteryState = new Variable("");
  const batteryColor = new Variable(theme.foreground);
  const batteryIconName = new Variable(PhosphorIcons.BatteryEmpty);

  // Track which warnings have been sent to prevent spam
  const sentWarnings = new Set<number>();
  let lastChargingState = battery.charging;
  let lastNotificationLevel = Math.round(battery.percentage * 100);

  // Helper function to format time remaining
  const formatTimeRemaining = (seconds: number): string => {
    if (seconds <= 0) return "Unknown";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Helper function to get battery color based on level and charging state
  const getBatteryColor = (level: number, charging: boolean): string => {
    if (charging) return theme.success; // foam (success green-blue)
    if (level <= 15) return theme.error; // love (error red)
    if (level <= 30) return theme.warning; // gold (warning yellow)
    if (level <= 60) return theme.rose; // rose (medium pink)
    return theme.text; // text (normal white)
  };

  // Send battery warning notification
  const sendBatteryNotification = async (title: string, message: string, urgency: 'low' | 'normal' | 'critical' = 'normal') => {
    try {
      await execAsync([
        'notify-send',
        title,
        message,
        '-u', urgency,
        '-i', 'battery-low',
        '-a', 'AGS Battery Monitor'
      ]);
      log.info('Battery notification sent', { title, message, urgency });
    } catch (error) {
      log.error('Failed to send battery notification', { error });
    }
  };

  // Check and send battery warnings
  const checkBatteryWarnings = (level: number, charging: boolean) => {
    const config = configManager.getValue('battery');
    const warnLevels = config.warnLevels;
    const warnTitles = config.warnTitles;
    const warnMessages = config.warnMessages;

    // Don't send warnings if charging
    if (charging) {
      // Clear sent warnings when charging starts
      sentWarnings.clear();
      return;
    }

    // Check each warning level
    for (let i = 0; i < warnLevels.length; i++) {
      const warnLevel = warnLevels[i];
      
      // If battery level is at or below this warning level and we haven't sent this warning yet
      if (level <= warnLevel && !sentWarnings.has(warnLevel)) {
        // Mark levels above this as sent to prevent duplicate notifications
        for (let j = 0; j <= i; j++) {
          sentWarnings.add(warnLevels[j]);
        }
        
        // Determine urgency based on level
        let urgency: 'low' | 'normal' | 'critical' = 'normal';
        if (level <= config.critical) {
          urgency = 'critical';
        } else if (level <= config.low) {
          urgency = 'normal';
        }
        
        sendBatteryNotification(
          warnTitles[i] || `Battery at ${level}%`,
          warnMessages[i] || 'Please plug in the charger',
          urgency
        );
        break;
      }
    }

    // Check for critical suspend threshold
    if (level <= config.suspendThreshold && !sentWarnings.has(config.suspendThreshold)) {
      sentWarnings.add(config.suspendThreshold);
      sendBatteryNotification(
        'CRITICAL: System will suspend soon!',
        `Battery at ${level}%. System will suspend at ${config.suspendThreshold}%`,
        'critical'
      );
    }
  };

  // Update battery info
  const updateBatteryInfo = () => {
    const level = Math.round(battery.percentage * 100);
    const charging = battery.charging;

    percentage.set(level);
    isCharging.set(charging);
    batteryColor.set(getBatteryColor(level, charging));
    batteryIconName.set(getBatteryIconName(level, charging));

    // Check for battery warnings
    checkBatteryWarnings(level, charging);

    // Send notification on charging state change
    if (charging !== lastChargingState) {
      lastChargingState = charging;
      if (charging) {
        sendBatteryNotification(
          'Charger Connected',
          `Battery at ${level}% - Charging`,
          'low'
        );
      } else {
        sendBatteryNotification(
          'Charger Disconnected', 
          `Battery at ${level}% - ${formatTimeRemaining(battery.time_to_empty)} remaining`,
          level <= 20 ? 'normal' : 'low'
        );
      }
    }

    // Clear warnings when battery level increases significantly (e.g., unplugged at higher level)
    if (!charging && level > lastNotificationLevel + 5) {
      // Remove warnings for levels below current
      const config = configManager.getValue('battery');
      config.warnLevels.forEach(warnLevel => {
        if (warnLevel < level) {
          sentWarnings.delete(warnLevel);
        }
      });
    }
    lastNotificationLevel = level;

    // Calculate time remaining
    if (charging && battery.time_to_full > 0) {
      timeRemaining.set(`${formatTimeRemaining(battery.time_to_full)} until full`);
      batteryState.set("Charging");
    } else if (!charging && battery.time_to_empty > 0) {
      timeRemaining.set(`${formatTimeRemaining(battery.time_to_empty)} remaining`);
      batteryState.set("Discharging");
    } else {
      timeRemaining.set("Time unknown");
      batteryState.set(charging ? "Charging" : "Discharging");
    }
  };

  // Initial update
  updateBatteryInfo();

  // Connect to battery property changes
  battery.connect("notify::percentage", updateBatteryInfo);
  battery.connect("notify::charging", updateBatteryInfo);
  battery.connect("notify::time-to-full", updateBatteryInfo);
  battery.connect("notify::time-to-empty", updateBatteryInfo);

  // Convert percentage to 0-1 range for CircularProgress
  const percentValue = bind(percentage).as((v) => {
    return v / 100; // Convert percentage to 0-1 range
  });

  const BatteryProgress = () => {
    return (
      <Fixed widthRequest={24} heightRequest={24}>
        {/* Circular progress background */}
        <CircularProgress
          cssName="bar-battery-circprog"
          percentage={percentValue}
          size={24}
          lineWidth={2}
          backgroundColor={bind(batteryColor).as(color => `${color}40`)} // 25% opacity
          foregroundColor={bind(batteryColor)}
        />

        {/* Battery icon centered on top */}
        <box
          widthRequest={24}
          heightRequest={24}
          baselinePosition={Gtk.BaselinePosition.CENTER}
          baselineChild={11}
        >
          <box widthRequest={4}></box>
          <box
            setup={(iconBox) => {
              const updateIcon = () => {
                // Clear existing children
                const children = iconBox.get_children();
                children.forEach(child => iconBox.remove(child));

                // Add new PhosphorSvgIcon with current values
                const icon = (
                  <PhosphorIcon
                    iconName={batteryIconName.get()}
                    size={16}
                    style={PhosphorIconStyle.Duotone}
                    color={batteryColor.get()}
                  />
                );
                iconBox.append(icon);
              };

              batteryIconName.subscribe(updateIcon);
              batteryColor.subscribe(updateIcon);
              updateIcon(); // Initial icon
            }}
          />
        </box>
      </Fixed>
    );
  };

  return (
    <BarGroup>
      <button
        cssName="sys-resources-btn"
        heightRequest={24}
        widthRequest={24}
        valign={Gtk.Align.CENTER}
        halign={Gtk.Align.CENTER}
        marginStart={6}
        marginEnd={6}
        tooltipText={bind(timeRemaining)}
        setup={(button) => {
          const motionController = new Gtk.EventControllerMotion();

          motionController.connect("enter", () => {
            // Show detailed battery info on hover
            const state = batteryState.get();
            const time = timeRemaining.get();
            const level = percentage.get();
            button.set_tooltip_text(`${state}: ${level}% - ${time}`);
          });

          motionController.connect("leave", () => {
            // Revert to basic time remaining
            button.set_tooltip_text(timeRemaining.get());
          });

          button.add_controller(motionController);
        }}
      >
        <BatteryProgress />
      </button>
    </BarGroup>
  );
}
