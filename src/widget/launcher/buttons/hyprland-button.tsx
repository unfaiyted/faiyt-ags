import { Widget, App, Gtk, Gdk } from "astal/gtk4";
import LauncherButton from "./index";
import { Variable, Binding } from "astal";
import { execAsync } from "astal/process";
import actions from "../../../utils/actions";
import { HyprlandClient } from "../components/hyprland-results";
import { createLogger } from "../../../utils/logger";
import { PhosphorIcon } from "../../utils/icons/phosphor";
import { PhosphorIcons, PhosphorIconStyle } from "../../utils/icons/types";

const log = createLogger("HyprlandButton");

export interface HyprlandButtonProps extends Widget.ButtonProps {
  client: HyprlandClient;
  index: number;
  selected?: Binding<boolean>;
  ref?: (button: Gtk.Button) => void;
}

// Map common application classes to icons
const APP_ICON_MAP: Record<string, PhosphorIcons> = {
  "firefox": PhosphorIcons.FirefoxLogo,
  "chromium": PhosphorIcons.ChromeLogo,
  "google-chrome": PhosphorIcons.ChromeLogo,
  "code": PhosphorIcons.Code,
  "vscode": PhosphorIcons.Code,
  "kitty": PhosphorIcons.Terminal,
  "alacritty": PhosphorIcons.Terminal,
  "terminal": PhosphorIcons.Terminal,
  "nautilus": PhosphorIcons.FolderOpen,
  "thunar": PhosphorIcons.FolderOpen,
  "discord": PhosphorIcons.DiscordLogo,
  "slack": PhosphorIcons.SlackLogo,
  "telegram": PhosphorIcons.TelegramLogo,
  "spotify": PhosphorIcons.SpotifyLogo,
  "vlc": PhosphorIcons.VideoCamera,
  "mpv": PhosphorIcons.Play,
  "steam": PhosphorIcons.GameController,
  "gimp": PhosphorIcons.Palette,
  "inkscape": PhosphorIcons.PenNib,
  "libreoffice": PhosphorIcons.FileDoc,
  "thunderbird": PhosphorIcons.EnvelopeOpen,
};

// Get icon for window class
function getWindowIcon(className: string): PhosphorIcons {
  const lowerClass = className.toLowerCase();

  // Check exact match first
  if (APP_ICON_MAP[lowerClass]) {
    return APP_ICON_MAP[lowerClass];
  }

  // Check if class contains any known app name
  for (const [appName, icon] of Object.entries(APP_ICON_MAP)) {
    if (lowerClass.includes(appName)) {
      return icon;
    }
  }

  // Default icon
  return PhosphorIcons.AppWindow;
}

// Focus a window by its address
async function focusWindow(address: string) {
  try {
    await execAsync(["hyprctl", "dispatch", "focuswindow", `address:${address}`]);
    log.info("Focused window", { address });
  } catch (error) {
    log.error("Failed to focus window", { address, error });
  }
}

export default function HyprlandButton(props: HyprlandButtonProps) {
  const { client } = props;

  const handleKeyPress = async (self: Gtk.Button, keyval: number) => {
    switch (keyval) {
      case Gdk.KEY_Return:
      case Gdk.KEY_KP_Enter:
        await focusWindow(client.address);
        // Close launcher after focusing
        actions.window.toggle("launcher");
        break;
      default:
        break;
    }
  };

  // Format workspace display
  const workspaceText = client.workspace.name || `${client.workspace.id}`;
  const floatingText = client.floating ? " (floating)" : "";
  const fullscreenText = client.fullscreen ? " (fullscreen)" : "";

  // Build content string
  const content = `Workspace ${workspaceText}${floatingText}${fullscreenText}`;

  return (
    <LauncherButton
      name={client.title || client.class}
      icon={
        <PhosphorIcon
          iconName={getWindowIcon(client.class)}
          size={32}
          style={PhosphorIconStyle.Duotone}
        />
      }
      content={content}
      selected={props.selected}
      onKeyPressed={handleKeyPress}
      onClicked={() => {
        focusWindow(client.address);
        // Close launcher after focusing
        actions.window.toggle("launcher");
      }}
      setup={(self: Gtk.Button) => {
        if (props.ref) {
          props.ref(self);
        }
      }}
      {...props}
    />
  );
}
