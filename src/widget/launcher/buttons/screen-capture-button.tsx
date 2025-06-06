import { Widget, App, Gtk, Gdk } from "astal/gtk4";
import LauncherButton from "./index";
import { Binding } from "astal";
import { exec, execAsync } from "astal/process";
import { launcherLogger as log } from "../../../utils/logger";
import actions from "../../../utils/actions";

export interface ScreenCaptureOption {
  name: string;
  description: string;
  icon: string;
  command: string;
  args: string[];
}

export interface ScreenCaptureButtonProps extends Widget.ButtonProps {
  option: ScreenCaptureOption;
  index: number;
  selected?: Binding<boolean>;
  ref?: (button: Gtk.Button) => void;
}

// Get available monitors dynamically
export function getAvailableMonitors(): string[] {
  try {
    const output = exec("hyprctl monitors -j");
    const monitors = JSON.parse(output);
    return monitors.map((m: any) => m.name);
  } catch (error) {
    log.error("Failed to get monitors", error);
    return ["eDP-1", "HDMI-A-1"]; // Fallback to known monitors
  }
}

// Generate screen capture options based on available monitors
export function generateScreenCaptureOptions(): ScreenCaptureOption[] {
  const monitors = getAvailableMonitors();
  const options: ScreenCaptureOption[] = [];

  // Screenshot options
  options.push({
    name: "Screenshot Selection",
    description: "Capture a selected area of the screen",
    icon: "view-fullscreen-symbolic",
    command: "/home/faiyt/.config/ags/scripts/screen-capture.sh",
    args: ["screenshot", "selection"]
  });

  // Add monitor-specific screenshot options
  monitors.forEach(monitor => {
    options.push({
      name: `Screenshot ${monitor}`,
      description: `Capture the entire ${monitor} display`,
      icon: "computer-symbolic",
      command: "/home/faiyt/.config/ags/scripts/screen-capture.sh",
      args: ["screenshot", monitor]
    });
  });

  // Add both displays option if we have multiple monitors
  if (monitors.length > 1) {
    options.push({
      name: "Screenshot All Displays",
      description: "Capture all connected displays",
      icon: "view-continuous-symbolic",
      command: "/home/faiyt/.config/ags/scripts/screen-capture.sh",
      args: ["screenshot", "both"]
    });
  }

  // Recording options
  options.push({
    name: "Record Selection",
    description: "Record a selected area of the screen",
    icon: "media-record-symbolic",
    command: "/home/faiyt/.config/ags/scripts/screen-capture.sh",
    args: ["record", "selection"]
  });

  // Add monitor-specific recording options
  monitors.forEach(monitor => {
    options.push({
      name: `Record ${monitor}`,
      description: `Record the entire ${monitor} display with audio`,
      icon: "media-record-symbolic",
      command: "/home/faiyt/.config/ags/scripts/screen-capture.sh",
      args: ["record", monitor]
    });
  });

  // Check if recording is active
  let isRecording = false;
  try {
    exec(["/home/faiyt/.config/ags/scripts/screen-capture.sh", "status"]);
    isRecording = true;
  } catch {
    isRecording = false;
  }

  // Stop recording option (only show if recording)
  if (isRecording) {
    options.push({
      name: "Stop Recording",
      description: "Stop the current recording session",
      icon: "media-playback-stop-symbolic",
      command: "/home/faiyt/.config/ags/scripts/screen-capture.sh",
      args: ["record", "stop"]
    });
  }

  // Conversion options
  options.push({
    name: "Convert to WebM",
    description: "Convert recorded MKV files to WebM format",
    icon: "document-save-as-symbolic",
    command: "/home/faiyt/.config/ags/scripts/screen-capture.sh",
    args: ["convert", "webm"]
  });

  options.push({
    name: "Convert for iPhone",
    description: "Convert recorded MKV files to iPhone-compatible MP4",
    icon: "phone-symbolic",
    command: "/home/faiyt/.config/ags/scripts/screen-capture.sh",
    args: ["convert", "iphone"]
  });

  return options;
}

export default function ScreenCaptureButton(props: ScreenCaptureButtonProps) {
  const { option } = props;

  const handleKeyPress = (self: Gtk.Button, keyval: number) => {
    switch (keyval) {
      case Gdk.KEY_Return:
      case Gdk.KEY_KP_Enter:
        executeCapture();
        break;
      default:
        break;
    }
  };

  const executeCapture = async () => {
    try {
      log.debug("Executing screen capture", { command: option.command, args: option.args });
      actions.window.toggle("launcher");

      // Small delay to ensure launcher is hidden
      await new Promise(resolve => setTimeout(resolve, 200));

      // Execute the screen capture command
      await execAsync([option.command, ...option.args]);

    } catch (error) {
      log.error("Screen capture failed", error);
    }
  };

  return (
    <LauncherButton
      name={option.name}
      icon={<image iconName={option.icon} pixelSize={32} />}
      content={option.description}
      selected={props.selected}
      onKeyPressed={handleKeyPress}
      onClicked={executeCapture}
      setup={(self: Gtk.Button) => {
        if (props.ref) {
          props.ref(self);
        }
      }}
      {...props}

    />
  );
}
