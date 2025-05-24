import { Widget, Gtk } from "astal/gtk4";
import { Variable, bind } from "astal";
import BarGroup from "../../utils/bar-group";
import { PhosphorIcon } from "../../../utils/icons/phosphor";
import { Fixed } from "../../../utils/containers/drawing-area";
import CircularProgress from "../../../utils/circular-progress";
import Battery from "gi://AstalBattery";
import { PhosphorIcons, PhosphorIconStyle } from "../../../utils/icons/types";
import { theme } from "../../../../utils/color";

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
  const battery = Battery.get_default();

  // Variables to track battery state
  const percentage = new Variable(Math.round(battery.percentage * 100));
  const isCharging = new Variable(battery.charging);
  const timeRemaining = new Variable("");
  const batteryState = new Variable("");
  const batteryColor = new Variable(theme.foreground);
  const batteryIconName = new Variable(PhosphorIcons.BatteryEmpty);

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

  // Update battery info
  const updateBatteryInfo = () => {
    const level = Math.round(battery.percentage * 100);
    const charging = battery.charging;

    percentage.set(level);
    isCharging.set(charging);
    batteryColor.set(getBatteryColor(level, charging));
    batteryIconName.set(getBatteryIconName(level, charging));

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
