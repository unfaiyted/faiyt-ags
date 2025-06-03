import { Widget, App, Gtk, Gdk } from "astal/gtk4";
import LauncherButton from "./index";
import { Variable, Binding, bind } from "astal";
import { execAsync } from "astal/process";
import GLib from "gi://GLib";
import actions from "../../../utils/actions";
import { HyprlandClient } from "../components/hyprland-results";
import { createLogger } from "../../../utils/logger";
import { PhosphorIcon } from "../../utils/icons/phosphor";
import { PhosphorIcons, PhosphorIconStyle } from "../../utils/icons/types";
import windowManager from "../../../services/window-manager";
import { RoundedImageReactive } from "../../utils/rounded-image";
import { c } from "../../../utils/style";

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
  const { client, selected = Variable(false), ref: buttonRef, ...rest } = props;
  
  // Get window screenshot path
  const normalizedAddress = client.address.startsWith("0x") ? client.address : `0x${client.address}`;
  const screenshotPath = Variable<string | null>(null);
  
  // Check for screenshot availability
  const checkScreenshot = () => {
    const path = windowManager.getWindowScreenshot(normalizedAddress);
    if (path && GLib.file_test(path, GLib.FileTest.EXISTS)) {
      screenshotPath.set(path);
    } else {
      screenshotPath.set(null);
    }
  };
  
  // Check initially and listen for updates
  checkScreenshot();
  windowManager.on('screenshot-updated', ({ address }) => {
    if (address === normalizedAddress) {
      checkScreenshot();
    }
  });

  const handleActivate = async () => {
    await focusWindow(client.address);
    // Close launcher after focusing
    actions.window.toggle("launcher");
  };

  const handleKeyPress = async (self: Gtk.Button, keyval: number) => {
    switch (keyval) {
      case Gdk.KEY_Return:
      case Gdk.KEY_KP_Enter:
        await handleActivate();
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
  
  const hasScreenshot = bind(screenshotPath).as(path => path !== null);

  return (
    <button
      cssName="overview-search-result-btn"
      cssClasses={bind(selected).as(s =>
        c`hyprland-window ${s ? 'selected' : ''} ${props.cssName || ''}`
      )}
      onClicked={handleActivate}
      onKeyPressed={handleKeyPress}
      focusable={false}
      widthRequest={250}
      hexpand={true}
      setup={(self: Gtk.Button) => {
        if (buttonRef) {
          buttonRef(self);
        }
      }}
      {...rest}
    >
      <box spacing={16} valign={Gtk.Align.CENTER} widthRequest={245}>
        {bind(screenshotPath).as(path => 
          path ? (
            <box vertical cssClasses={["window-screenshot-container"]} spacing={0}>
              <box cssClasses={["window-screenshot-frame"]}>
                <RoundedImageReactive
                  file={Variable(path)}
                  size={76}
                  radius={12}
                  cssClasses={["window-screenshot-preview"]}
                />
              </box>
              <box
                cssClasses={["window-class-badge-container"]}
                halign={Gtk.Align.CENTER}
                valign={Gtk.Align.END}
              >
                <label
                  label={client.class.slice(0, 3).toUpperCase()}
                  cssClasses={["window-class-badge"]}
                />
              </box>
            </box>
          ) : (
            <box cssClasses={["launcher-result-icon-container"]}>
              <PhosphorIcon
                iconName={getWindowIcon(client.class)}
                size={32}
                style={PhosphorIconStyle.Duotone}
                cssClasses={["launcher-result-icon"]}
              />
            </box>
          )
        )}
        <box vertical valign={Gtk.Align.CENTER} hexpand>
          <box spacing={8}>
            <label
              label={client.title || client.class}
              cssName="overview-search-results-txt"
              cssClasses={["window-title-text"]}
              halign={Gtk.Align.START}
              ellipsize={3} // PANGO_ELLIPSIZE_END
            />
          </box>
          <box spacing={8} cssClasses={["window-metadata"]}>
            <label
              label={content}
              cssClasses={["overview-search-results-txt", "txt-smallie", "txt-subtext"]}
              halign={Gtk.Align.START}
            />
          </box>
        </box>
      </box>
    </button>
  );
}
