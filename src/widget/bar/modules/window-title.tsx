import { Widget, Gtk } from "astal/gtk4";
import { Variable } from "astal";
import Hypr from "gi://AstalHyprland";
import { PhosphorIcon } from "../../utils/icons/phosphor";
import { PhosphorIconStyle } from "../../utils/icons/types";
import BarGroup from "../utils/bar-group";

import { ThemeColor } from "../../../styles/themes";

export interface WindowTitleProps extends Widget.BoxProps { }

// Helper function to truncate text
function truncateText(text: string, maxLength: number = 20): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + "...";
}

// Helper function to get application icon from class name
function getAppIcon(className: string): string {
  if (!className) return "app-window";

  const iconMap: Record<string, string> = {
    // Browsers
    "firefox": "browser",
    "chromium": "browser",
    "google-chrome": "browser",
    "brave": "browser",
    "opera": "browser",

    // Development
    "code": "code",
    "vscode": "code",
    "neovim": "terminal-window",
    "vim": "terminal-window",
    "emacs": "file-text",

    // Communication
    "discord": "chat-circle",
    "telegram": "chat-circle",
    "slack": "chat-circle",

    // Media
    "spotify": "music-note",
    "vlc": "play-circle",
    "mpv": "play-circle",

    // Files
    "nautilus": "folder",
    "thunar": "folder",
    "dolphin": "folder",

    // Terminal
    "kitty": "terminal-window",
    "alacritty": "terminal-window",
    "wezterm": "terminal-window",
    "gnome-terminal": "terminal-window",
    "term": "terminal",

    // Default fallback
    "default": "app-window"
  };

  const lowerClass = className.toLowerCase();
  return iconMap[lowerClass] || iconMap.default;
}

export default function WindowTitle() {
  const hypr = Hypr.get_default();
  const client = new Variable(hypr.get_focused_client());
  const workspace = new Variable(hypr.get_focused_workspace());

  hypr.connect("event", (_source, event, _args) => {
    if (event === "activewindow" || event === "activewindowv2") {
      client.set(hypr.get_focused_client());
    } else if (event === "workspace" || event === "workspacev2") {
      workspace.set(hypr.get_focused_workspace());
    }
  });

  return (
    <BarGroup>
      <box
        cssClasses={["bar-win-title"]}
        valign={Gtk.Align.CENTER}
        tooltipText=""
        setup={(box) => {
          const motionController = new Gtk.EventControllerMotion();

          motionController.connect("enter", () => {
            // Show full window title on hover
            const currentClient = client.get();
            if (currentClient && currentClient.title) {
              box.set_tooltip_text(`${currentClient.class}: ${currentClient.title}`);
            } else {
              box.set_tooltip_text(`Workspace ${workspace.get().id}`);
            }
          });
          motionController.connect("leave", () => {
            box.set_tooltip_text("");
          });

          box.add_controller(motionController);
        }}
      >
        {/* Application Icon */}
        <box
          marginTop={3}
          setup={(iconBox) => {
            const updateIcon = () => {
              // Clear existing children
              const children = iconBox.get_children();
              children.forEach(child => iconBox.remove(child));

              const currentClient = client.get();
              const iconName = currentClient && currentClient.class
                ? getAppIcon(currentClient.class)
                : "desktop";

              const icon = (
                <PhosphorIcon
                  // TODO: fix IconName class name issue
                  iconName={iconName}
                  style={PhosphorIconStyle.Duotone}
                  size={16}
                  color={ThemeColor.Foreground}
                />
              );

              iconBox.append(icon);
            };

            client.subscribe(updateIcon);
            workspace.subscribe(updateIcon);
            updateIcon(); // Initial icon
          }}
        />

        {/* Window Title */}
        <label
          xalign={0}
          marginStart={9}
          marginTop={2}
          cssName="bar-wintitle-txt"
          setup={(label) => {
            const updateLabel = () => {
              const currentClient = client.get();
              const currentWorkspace = workspace.get();

              let displayText: string;
              if (currentClient && currentClient.title && currentClient.title.length > 0) {
                displayText = truncateText(currentClient.title, 40);
              } else {
                displayText = `Workspace ${currentWorkspace.id}`;
              }

              label.set_text(displayText);
            };

            client.subscribe(updateLabel);
            workspace.subscribe(updateLabel);
            updateLabel(); // Initial update
          }}
        />
      </box>
    </BarGroup>
  );
}
