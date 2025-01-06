import { Widget, App, Gtk, Gdk } from "astal/gtk4";
import LauncherButton from "./index";
import actions from "../../../utils/actions";
import { Binding } from "astal";
import { execAsync } from "astal/process";
import { launcherLogger as log } from "../../../utils/logger";
// Helper function for sending notifications
const sendNotification = async (title: string, body: string, urgency: string = "normal") => {
  try {
    await execAsync([
      'notify-send',
      title,
      body,
      '-u', urgency,
      '-a', 'AGS Launcher'
    ]);
  } catch (error) {
    log.error('Failed to send notification', { error });
  }
};

export interface KillAction {
  type: 'process' | 'port' | 'window-click';
  name: string;
  description: string;
  icon: string;
  pid?: number;
  port?: number;
  command?: string;
  processName?: string;
}

export interface KillButtonProps extends Widget.ButtonProps {
  action: KillAction;
  index: number;
  selected?: Binding<boolean>;
  ref?: (button: Gtk.Button) => void;
}

export default function KillButton(props: KillButtonProps) {
  let lastExecutionTime = 0;
  const DEBOUNCE_DELAY = 200; // 200ms debounce

  if (!props.action) {
    log.error("KillButton: action is undefined");
    return <box />;
  }

  const handleKeyPress = (self: Gtk.Button, keyval: number) => {
    switch (keyval) {
      case Gdk.KEY_Return:
      case Gdk.KEY_KP_Enter:
        executeAction();
        break;
      default:
        break;
    }
  };

  const executeAction = async () => {
    const now = Date.now();
    if (now - lastExecutionTime < DEBOUNCE_DELAY) {
      log.debug("Ignoring duplicate execution within debounce period");
      return;
    }
    lastExecutionTime = now;

    log.debug("Executing kill action", {
      action: props.action.name,
      type: props.action.type
    });

    // Close launcher first
    actions.window.close("launcher");

    try {
      let command = "";
      
      switch (props.action.type) {
        case 'process':
          if (props.action.pid) {
            command = `kill -9 ${props.action.pid}`;
          } else if (props.action.processName) {
            command = `pkill -9 -f "${props.action.processName}"`;
          }
          break;
          
        case 'port':
          if (props.action.port) {
            // Try multiple methods to kill process on port
            // Use a single line command to avoid issues with multi-line strings
            command = `(lsof -ti:${props.action.port} 2>/dev/null | xargs -r kill -9) || (fuser -k ${props.action.port}/tcp 2>/dev/null) || echo "No process found on port ${props.action.port}"`;
          }
          break;
          
        case 'window-click':
          // Execute the window selection script
          command = `${App.configDir}/scripts/click-to-kill.sh`;
          break;
      }

      if (command) {
        // Execute the command and capture output
        const output = await execAsync(['bash', '-c', command]);
        
        // Check if the command actually succeeded
        if (props.action.type === 'port' && output && output.includes("No process found")) {
          await sendNotification(
            "Kill Failed",
            `No process found on port ${props.action.port}`,
            "critical"
          );
          return;
        }
        
        // Show notification based on action type
        if (props.action.type === 'window-click') {
          await sendNotification(
            "Kill Window",
            "Click on any window to kill it...",
            "normal"
          );
        } else {
          await sendNotification(
            "Process Killed",
            `Successfully killed: ${props.action.name}`,
            "normal"
          );
        }
      }
    } catch (err: any) {
      log.error("Failed to execute kill action", { error: err });
      
      // Provide more specific error messages
      let errorMessage = `Failed to kill: ${props.action.name}`;
      
      if (props.action.type === 'port') {
        errorMessage = `Failed to kill process on port ${props.action.port}. You may need elevated permissions.`;
      } else if (props.action.type === 'process' && err.message?.includes('Operation not permitted')) {
        errorMessage = `Cannot kill ${props.action.name}. Permission denied.`;
      }
      
      await sendNotification(
        "Kill Failed",
        errorMessage,
        "critical"
      );
    }
  };

  return (
    <LauncherButton
      name={props.action.name}
      icon={<image iconName={props.action.icon} pixelSize={32} />}
      content={props.action.description}
      selected={props.selected}
      onKeyPressed={handleKeyPress}
      onClicked={executeAction}
      setup={(self: Gtk.Button) => {
        if (props.ref) {
          props.ref(self);
        }
      }}
      {...props}
    />
  );
}